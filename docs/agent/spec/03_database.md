# Cafe Jisho — データベース設計書

> 作成日: 2026-03-28

---

## 1. 概要

| 項目 | 内容 |
|------|------|
| DBMS | SQLite（libsql / Turso） |
| ORM | Drizzle ORM |
| スキーマ定義場所 | `packages/db/src/schema/` |
| マイグレーション | `drizzle-kit` |

---

## 2. テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| `user` | ユーザー情報（better-auth 管理） |
| `session` | セッション（better-auth 管理） |
| `account` | OAuth アカウント（better-auth 管理） |
| `verification` | メール確認トークン（better-auth 管理） |
| `course` | 学習コース |
| `lesson` | コース内レッスン |
| `quiz` | レッスンに紐づくクイズ |
| `quiz_question` | クイズの問題 |
| `quiz_choice` | 問題の選択肢 |
| `glossary_term` | コーヒー辞典の用語 |
| `origin` | コーヒー産地 |
| `lesson_completion` | レッスン完了記録 |
| `quiz_result` | クイズ回答結果 |
| `bookmark` | ブックマーク |
| `user_premium` | プレミアム会員情報 |

---

## 3. テーブル定義

### 3.1 better-auth 管理テーブル（既存）

> `packages/db/src/schema/auth.ts` に定義済み。変更不可。

#### `user`
| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | TEXT | PK | ユーザーID（UUID） |
| `name` | TEXT | NOT NULL | 表示名 |
| `email` | TEXT | NOT NULL, UNIQUE | メールアドレス |
| `email_verified` | INTEGER (boolean) | NOT NULL, DEFAULT false | メール認証済みフラグ |
| `image` | TEXT | NULL | プロフィール画像URL |
| `created_at` | INTEGER (timestamp_ms) | NOT NULL | 作成日時 |
| `updated_at` | INTEGER (timestamp_ms) | NOT NULL | 更新日時 |

#### `session`
| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | TEXT | PK | セッションID |
| `expires_at` | INTEGER (timestamp_ms) | NOT NULL | 有効期限 |
| `token` | TEXT | NOT NULL, UNIQUE | セッショントークン |
| `ip_address` | TEXT | NULL | IPアドレス |
| `user_agent` | TEXT | NULL | ユーザーエージェント |
| `user_id` | TEXT | NOT NULL, FK→user | ユーザーID |
| `created_at` | INTEGER (timestamp_ms) | NOT NULL | 作成日時 |
| `updated_at` | INTEGER (timestamp_ms) | NOT NULL | 更新日時 |

---

### 3.2 コース (`course`)

```sql
CREATE TABLE course (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  level           TEXT NOT NULL CHECK(level IN ('beginner','intermediate','advanced')),
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  thumbnail_emoji TEXT NOT NULL DEFAULT '☕',
  is_premium      INTEGER NOT NULL DEFAULT 0,  -- boolean
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);
```

| カラム | 型 | 説明 |
|--------|----|------|
| `id` | TEXT | コースID（UUID） |
| `title` | TEXT | コースタイトル |
| `description` | TEXT | コース説明 |
| `level` | TEXT | レベル: `beginner` / `intermediate` / `advanced` |
| `duration_minutes` | INTEGER | 合計所要時間（分） |
| `thumbnail_emoji` | TEXT | サムネイル絵文字 |
| `is_premium` | INTEGER | プレミアム限定フラグ（0=無料, 1=有料） |
| `order_index` | INTEGER | 表示順序 |
| `created_at` | INTEGER | 作成日時（timestamp_ms） |
| `updated_at` | INTEGER | 更新日時（timestamp_ms） |

---

### 3.3 レッスン (`lesson`)

```sql
CREATE TABLE lesson (
  id              TEXT PRIMARY KEY,
  course_id       TEXT NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,   -- Markdown
  order_index     INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  tags            TEXT NOT NULL DEFAULT '[]',  -- JSON array
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);
CREATE INDEX lesson_course_id_idx ON lesson(course_id);
```

| カラム | 型 | 説明 |
|--------|----|------|
| `id` | TEXT | レッスンID（UUID） |
| `course_id` | TEXT | FK → course.id |
| `title` | TEXT | レッスンタイトル |
| `content` | TEXT | 本文（Markdown） |
| `order_index` | INTEGER | コース内順序 |
| `duration_minutes` | INTEGER | 所要時間（分） |
| `tags` | TEXT | タグ（JSON 配列） |
| `created_at` | INTEGER | 作成日時 |
| `updated_at` | INTEGER | 更新日時 |

---

### 3.4 クイズ (`quiz`)

```sql
CREATE TABLE quiz (
  id         TEXT PRIMARY KEY,
  lesson_id  TEXT NOT NULL REFERENCES lesson(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX quiz_lesson_id_idx ON quiz(lesson_id);
```

---

### 3.5 クイズ問題 (`quiz_question`)

```sql
CREATE TABLE quiz_question (
  id          TEXT PRIMARY KEY,
  quiz_id     TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX quiz_question_quiz_id_idx ON quiz_question(quiz_id);
```

---

### 3.6 選択肢 (`quiz_choice`)

```sql
CREATE TABLE quiz_choice (
  id          TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES quiz_question(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  is_correct  INTEGER NOT NULL DEFAULT 0,  -- boolean
  order_index INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX quiz_choice_question_id_idx ON quiz_choice(question_id);
```

---

### 3.7 コーヒー辞典用語 (`glossary_term`)

```sql
CREATE TABLE glossary_term (
  id                TEXT PRIMARY KEY,
  term              TEXT NOT NULL,
  reading           TEXT NOT NULL DEFAULT '',  -- 読み仮名
  term_en           TEXT NOT NULL DEFAULT '',  -- 英語名
  category          TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description       TEXT NOT NULL,             -- Markdown
  related_term_ids  TEXT NOT NULL DEFAULT '[]',-- JSON array
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);
CREATE INDEX glossary_term_category_idx ON glossary_term(category);
```

| カラム | 型 | 説明 |
|--------|----|------|
| `id` | TEXT | 用語ID |
| `term` | TEXT | 用語名（日本語） |
| `reading` | TEXT | 読み仮名 |
| `term_en` | TEXT | 英語名 |
| `category` | TEXT | カテゴリ（例: `roast` / `brew` / `origin` / `taste`） |
| `short_description` | TEXT | 簡潔な説明（一覧表示用） |
| `description` | TEXT | 詳細説明（Markdown） |
| `related_term_ids` | TEXT | 関連用語のID配列（JSON） |

#### カテゴリ一覧

| 値 | 説明 |
|----|------|
| `bean` | 豆・品種 |
| `roast` | 焙煎 |
| `brew` | 抽出 |
| `origin` | 産地 |
| `taste` | テイスティング / フレーバー |
| `equipment` | 器具 |
| `certification` | 認証・資格 |

---

### 3.8 産地 (`origin`)

```sql
CREATE TABLE origin (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  name_en           TEXT NOT NULL,
  continent         TEXT NOT NULL,
  country_code      TEXT NOT NULL,  -- ISO 3166-1 alpha-2
  flavor_tags       TEXT NOT NULL DEFAULT '[]',   -- JSON array
  altitude          TEXT NOT NULL DEFAULT '',
  annual_production TEXT NOT NULL DEFAULT '',
  varieties         TEXT NOT NULL DEFAULT '[]',   -- JSON array
  processing_methods TEXT NOT NULL DEFAULT '[]',  -- JSON array
  description       TEXT NOT NULL,                -- Markdown
  thumbnail_emoji   TEXT NOT NULL DEFAULT '🌍',
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);
CREATE INDEX origin_continent_idx ON origin(continent);
```

---

### 3.9 レッスン完了記録 (`lesson_completion`)

```sql
CREATE TABLE lesson_completion (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL REFERENCES lesson(id) ON DELETE CASCADE,
  completed_at INTEGER NOT NULL,
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX lesson_completion_user_id_idx ON lesson_completion(user_id);
```

---

### 3.10 クイズ結果 (`quiz_result`)

```sql
CREATE TABLE quiz_result (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  quiz_id      TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  attempted_at INTEGER NOT NULL
);
CREATE INDEX quiz_result_user_id_idx ON quiz_result(user_id);
```

---

### 3.11 ブックマーク (`bookmark`)

```sql
CREATE TABLE bookmark (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK(type IN ('lesson','glossary','origin')),
  target_id  TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, type, target_id)
);
CREATE INDEX bookmark_user_id_idx ON bookmark(user_id);
```

---

### 3.12 プレミアム会員 (`user_premium`)

```sql
CREATE TABLE user_premium (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
  started_at INTEGER NOT NULL,
  expires_at INTEGER         -- NULL = 無期限
);
```

---

## 4. ER 図（概略）

```
user ─────────── session
  │
  ├── lesson_completion ── lesson ── course
  │                           │
  ├── quiz_result ──── quiz ──┘
  │                     └── quiz_question ── quiz_choice
  ├── bookmark
  └── user_premium

glossary_term (standalone)
origin        (standalone)
```

---

## 5. インデックス方針

- すべての外部キーにインデックスを付与する
- 検索対象カラム（`category`, `continent` 等）にインデックスを付与する
- UNIQUE 制約（`lesson_completion`, `bookmark`）は暗黙のインデックスを利用

---

## 6. データ初期値（シードデータ）

| テーブル | 件数 | 内容 |
|---------|------|------|
| `course` | 3 | 入門・中級・上級コース |
| `lesson` | 42 | 入門8件・中級14件・上級20件 |
| `quiz` / `quiz_question` / `quiz_choice` | 各コースに2〜3問 | — |
| `glossary_term` | 120+ | コーヒー用語 |
| `origin` | 30 | 主要産地・農園 |
