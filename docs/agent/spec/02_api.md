# Cafe Jisho — API 設計書

> 作成日: 2026-03-28

---

## 1. 概要

- **通信方式**: oRPC (TypeScript 型安全 RPC over HTTP)
- **サーバー**: Hono (Bun ランタイム)
- **クライアント**: TanStack Query + oRPC クライアント
- **認証**: better-auth（セッションベース）
- **エンドポイントベース URL**: `/api/`

### Procedure 区分

| 区分 | 説明 |
|------|------|
| `publicProcedure` | 未認証でも呼び出し可能 |
| `protectedProcedure` | 認証済みユーザーのみ呼び出し可能 |
| `premiumProcedure` | プレミアム会員のみ呼び出し可能 |
| `adminProcedure` | 管理者のみ呼び出し可能 |

---

## 2. ルーター一覧

```
appRouter
├── health             # システム状態
├── auth               # 認証関連（better-auth ハンドラー）
├── courses            # コース管理
├── lessons            # レッスン管理
├── quizzes            # クイズ管理
├── glossary           # 辞典用語管理
├── origins            # 産地管理
├── progress           # 学習進捗管理
├── bookmarks          # ブックマーク管理
└── users              # ユーザー管理
```

---

## 3. API 詳細

### 3.1 ヘルスチェック

#### `health.check`
- **区分**: `publicProcedure`
- **説明**: サーバーの動作確認
- **入力**: なし
- **出力**: `{ status: "OK" }`

---

### 3.2 コース (`courses`)

#### `courses.list`
- **区分**: `publicProcedure`
- **説明**: コース一覧を取得する
- **入力**:
  ```ts
  {
    level?: "beginner" | "intermediate" | "advanced"
  }
  ```
- **出力**:
  ```ts
  Course[]
  // Course = {
  //   id: string
  //   title: string
  //   description: string
  //   level: "beginner" | "intermediate" | "advanced"
  //   lessonCount: number
  //   durationMinutes: number
  //   isPremium: boolean
  //   thumbnailEmoji: string
  //   createdAt: Date
  // }
  ```

#### `courses.getById`
- **区分**: `publicProcedure`
- **説明**: コース詳細（レッスン一覧付き）を取得する
- **入力**:
  ```ts
  { courseId: string }
  ```
- **出力**:
  ```ts
  Course & { lessons: LessonSummary[] }
  ```

---

### 3.3 レッスン (`lessons`)

#### `lessons.getById`
- **区分**: `publicProcedure`（入門コース）/ `premiumProcedure`（中級・上級）
- **説明**: レッスン詳細を取得する
- **入力**:
  ```ts
  { lessonId: string }
  ```
- **出力**:
  ```ts
  {
    id: string
    courseId: string
    title: string
    content: string        // Markdown
    orderIndex: number
    hasQuiz: boolean
    tags: string[]
    createdAt: Date
  }
  ```

#### `lessons.complete`
- **区分**: `protectedProcedure`
- **説明**: レッスンを完了済みとしてマークする
- **入力**:
  ```ts
  { lessonId: string }
  ```
- **出力**:
  ```ts
  { success: boolean; completedAt: Date }
  ```

---

### 3.4 クイズ (`quizzes`)

#### `quizzes.getByLessonId`
- **区分**: `publicProcedure`
- **説明**: レッスンに紐づくクイズを取得する
- **入力**:
  ```ts
  { lessonId: string }
  ```
- **出力**:
  ```ts
  {
    id: string
    lessonId: string
    questions: {
      id: string
      text: string
      choices: { id: string; text: string }[]
    }[]
  }
  ```

#### `quizzes.submit`
- **区分**: `protectedProcedure`
- **説明**: クイズの回答を送信し、結果を返す
- **入力**:
  ```ts
  {
    quizId: string
    answers: { questionId: string; choiceId: string }[]
  }
  ```
- **出力**:
  ```ts
  {
    score: number          // 正解数
    total: number          // 問題数
    percentage: number     // 正答率(%)
    results: {
      questionId: string
      isCorrect: boolean
      correctChoiceId: string
      explanation: string
    }[]
  }
  ```

---

### 3.5 辞典 (`glossary`)

#### `glossary.list`
- **区分**: `publicProcedure`
- **説明**: 用語一覧を取得する
- **入力**:
  ```ts
  {
    category?: string
    search?: string
    page?: number    // default: 1
    limit?: number   // default: 20
  }
  ```
- **出力**:
  ```ts
  {
    terms: GlossaryTerm[]
    total: number
    page: number
    limit: number
  }
  // GlossaryTerm = {
  //   id: string
  //   term: string
  //   reading: string       // 読み仮名
  //   termEn: string        // 英語名
  //   category: string
  //   shortDescription: string
  // }
  ```

#### `glossary.getById`
- **区分**: `publicProcedure`
- **説明**: 用語詳細を取得する
- **入力**:
  ```ts
  { termId: string }
  ```
- **出力**:
  ```ts
  {
    id: string
    term: string
    reading: string
    termEn: string
    category: string
    description: string    // 詳細説明 (Markdown)
    relatedTermIds: string[]
    createdAt: Date
  }
  ```

---

### 3.6 産地 (`origins`)

#### `origins.list`
- **区分**: `publicProcedure`
- **説明**: 産地一覧を取得する
- **入力**:
  ```ts
  {
    continent?: string
    search?: string
  }
  ```
- **出力**:
  ```ts
  Origin[]
  // Origin = {
  //   id: string
  //   name: string
  //   nameEn: string
  //   continent: string
  //   countryCode: string   // ISO 3166-1 alpha-2
  //   flavorTags: string[]
  //   altitude: string
  //   thumbnailEmoji: string
  // }
  ```

#### `origins.getById`
- **区分**: `publicProcedure`
- **説明**: 産地詳細を取得する
- **入力**:
  ```ts
  { originId: string }
  ```
- **出力**:
  ```ts
  {
    id: string
    name: string
    nameEn: string
    continent: string
    countryCode: string
    flavorTags: string[]
    altitude: string
    annualProduction: string
    varieties: string[]
    processingMethods: string[]
    description: string    // Markdown
  }
  ```

---

### 3.7 学習進捗 (`progress`)

#### `progress.getMine`
- **区分**: `protectedProcedure`
- **説明**: 自分の学習進捗を取得する
- **入力**: なし
- **出力**:
  ```ts
  {
    completedLessonIds: string[]
    courseProgress: {
      courseId: string
      completedCount: number
      totalCount: number
      percentage: number
      lastAccessedAt: Date | null
    }[]
    totalQuizScore: number
    quizResults: {
      quizId: string
      lessonId: string
      score: number
      total: number
      attemptedAt: Date
    }[]
  }
  ```

#### `progress.getStats`
- **区分**: `protectedProcedure`
- **説明**: ダッシュボード用の統計情報を取得する
- **入力**: なし
- **出力**:
  ```ts
  {
    totalCompletedLessons: number
    totalStudyMinutes: number
    currentStreak: number     // 継続学習日数
    totalQuizAttempts: number
    averageQuizScore: number
    recentLessons: { lessonId: string; title: string; completedAt: Date }[]
  }
  ```

---

### 3.8 ブックマーク (`bookmarks`)

#### `bookmarks.list`
- **区分**: `protectedProcedure`
- **説明**: 自分のブックマーク一覧を取得する
- **入力**:
  ```ts
  {
    type?: "lesson" | "glossary" | "origin"
  }
  ```
- **出力**:
  ```ts
  {
    id: string
    type: "lesson" | "glossary" | "origin"
    targetId: string
    title: string
    createdAt: Date
  }[]
  ```

#### `bookmarks.add`
- **区分**: `protectedProcedure`
- **説明**: ブックマークを追加する
- **入力**:
  ```ts
  {
    type: "lesson" | "glossary" | "origin"
    targetId: string
  }
  ```
- **出力**:
  ```ts
  { id: string; createdAt: Date }
  ```

#### `bookmarks.remove`
- **区分**: `protectedProcedure`
- **説明**: ブックマークを削除する
- **入力**:
  ```ts
  { bookmarkId: string }
  ```
- **出力**:
  ```ts
  { success: boolean }
  ```

---

### 3.9 ユーザー (`users`)

#### `users.getMe`
- **区分**: `protectedProcedure`
- **説明**: 自分のプロフィールを取得する
- **入力**: なし
- **出力**:
  ```ts
  {
    id: string
    name: string
    email: string
    image: string | null
    isPremium: boolean
    createdAt: Date
  }
  ```

#### `users.updateMe`
- **区分**: `protectedProcedure`
- **説明**: 自分のプロフィールを更新する
- **入力**:
  ```ts
  {
    name?: string
    image?: string
  }
  ```
- **出力**:
  ```ts
  { success: boolean }
  ```

---

## 4. エラーハンドリング

| エラーコード | 説明 |
|------------|------|
| `UNAUTHORIZED` | 未認証（ログインが必要） |
| `FORBIDDEN` | 権限不足（プレミアム会員限定等） |
| `NOT_FOUND` | リソースが見つからない |
| `VALIDATION_ERROR` | 入力値バリデーションエラー |
| `INTERNAL_ERROR` | サーバー内部エラー |

---

## 5. 認証フロー

```
1. POST /api/auth/sign-in      # メール/パスワードでログイン
2. POST /api/auth/sign-up      # 新規登録
3. POST /api/auth/sign-out     # ログアウト
4. GET  /api/auth/session      # セッション情報取得
```

認証は better-auth が提供するエンドポイントを使用し、セッションは HTTP-only Cookie で管理する。

---

## 6. ページング規約

- `page`: 1 始まり
- `limit`: 最大 100、デフォルト 20
- レスポンスに `total`（全件数）を含める
