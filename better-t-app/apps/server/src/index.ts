import { createContext } from "@better-t-app/api/context";
import { appRouter } from "@better-t-app/api/routers/index";
import { auth } from "@better-t-app/auth";
import { db, migrate, seed } from "@better-t-app/db";
import { env } from "@better-t-app/env/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context: context,
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

// Vite ビルドのフロントエンド静的ファイルを配信
// WORKDIR /app に対して ./web = /app/web (Dockerfile で COPY した場所)
app.use("/*", serveStatic({ root: "./web" }));

// SPA フォールバック: クライアントサイドルーティング対応
app.get("/*", serveStatic({ path: "./web/index.html" }));

// サーバー起動時にマイグレーションを自動適用してからシードデータを投入
(async () => {
  try {
    // MIGRATIONS_FOLDER 環境変数が設定されていればそちらを使用（デプロイ時）
    // 未設定の場合は migrate.ts 内のデフォルトパスにフォールバック（開発時）
    await migrate(db);
    console.log("✅ マイグレーション完了");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("already exists")) {
      // テーブルが既に存在する場合（db:push 済み環境など）は無視して続行
      console.log("ℹ️ テーブルは既に存在します。マイグレーションをスキップします");
    } else {
      console.error("マイグレーション中にエラーが発生しました:", err);
    }
  }
  try {
    await seed(db);
  } catch (err) {
    console.error("シード自動投入中にエラーが発生しました:", err);
  }
})();

export default app;
