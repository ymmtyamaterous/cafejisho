# 実装計画: add-spec01 対応

対象仕様書: `docs/user/add-spec01.md`

---

## タスク一覧

### バグ修正

#### 1. Markdown テーブルの表示修正

- **対象ファイル**: `better-t-app/apps/web/src/routes/courses/$courseId/lessons/$lessonId.tsx`
- **内容**: `ReactMarkdown` の `components` に `table` / `thead` / `tbody` / `tr` / `th` / `td` カスタムレンダラーを追加し、カフェジショのデザインに合わせたスタイルを適用する

---

### 追加仕様

#### 2. レッスン完了ボタンの表示変化

- **対象ファイル**: `better-t-app/apps/web/src/routes/courses/$courseId/lessons/$lessonId.tsx`
- **内容**:
  - 現状: `isDone === true` の場合、完了ボタンが非表示になる
  - 変更後: 完了済み状態を示す「✓ 完了済み」ボタン（押せない状態）を表示し、ユーザーが達成感を得られる UI に変更する
  - 完了後のレッスンヘッダーの「✓ 完了済み」バッジも引き続き表示する

#### 3. 完了済みレッスンを未完了に戻す機能

- **対象ファイル**:
  - `better-t-app/packages/api/src/routers/lessons.ts`（バックエンド）
  - `better-t-app/apps/web/src/routes/courses/$courseId/lessons/$lessonId.tsx`（フロントエンド）
- **内容**:
  - バックエンド: `lessonCompletion` テーブルのレコードを削除する `uncomplete` プロシージャを追加
    - `protectedProcedure` を使用
    - 入力: `{ lessonId: string }`
    - DB: `lessonCompletion` から `userId` + `lessonId` の条件でレコードを削除
  - フロントエンド: 完了済み状態のとき「未完了に戻す」ボタンを表示し、`uncomplete` Mutation を呼び出す

---

### 懸念事項対応

#### 4. ヘッダー・フッターの β バッジを削除

- **対象ファイル**:
  - `better-t-app/apps/web/src/components/header.tsx`
  - `better-t-app/apps/web/src/components/footer.tsx`
- **内容**: ヘッダーロゴ横・フッターロゴ横の `β` バッジ（`<span>` 要素）を削除する

#### 5. フッターの SNS リンクを削除

- **対象ファイル**: `better-t-app/apps/web/src/components/footer.tsx`
- **内容**: 𝕏 / 📸 / ▶ のアイコンボタン群を含む `<div className="flex gap-3">` ブロックを削除する

#### 6. プレミアム関連の整理（完全無料化対応）

- **対象ファイル**:
  - `better-t-app/apps/web/src/components/footer.tsx`
  - `better-t-app/apps/web/src/routes/premium.tsx`
- **内容**:
  - フッターの「学ぶ」「その他」セクションから「プレミアム ⭐」リンクを削除する
  - `/premium` ページ自体は「現在は全機能を無料で提供中」という内容に置き換える（課金機能が実装されるまでのプレースホルダー）
  - プレミアム限定コンテンツのロック機能（`isPremium` チェック）はバックエンドに残し、DB データ側で無料コースのみ運用する（コードは変更不要）

#### 7. プライバシーポリシー・利用規約ページの作成

- **対象ファイル**:
  - `better-t-app/apps/web/src/routes/privacy.tsx`（新規作成）
  - `better-t-app/apps/web/src/routes/terms.tsx`（新規作成）
  - `better-t-app/apps/web/src/components/footer.tsx`
- **内容**:
  - `/privacy` と `/terms` のルートページを新規作成（シンプルなコンテンツページ）
  - フッターの `<button>` 要素を `<Link to="/privacy">` / `<Link to="/terms">` に変更する

---

## 対応順序

| # | タスク | 種別 | 工数感 |
|---|--------|------|--------|
| 1 | Markdown テーブル表示修正 | バグ | 小 |
| 2 | 完了ボタンの表示変化 | 追加仕様 | 小 |
| 3 | 完了済みを未完了に戻す機能 | 追加仕様 | 中 |
| 4 | β バッジ削除 | 懸念事項 | 小 |
| 5 | SNS リンク削除 | 懸念事項 | 小 |
| 6 | プレミアム整理（完全無料化） | 懸念事項 | 小 |
| 7 | プライバシー・利用規約ページ作成 | 懸念事項 | 中 |
