import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL || "",
});

const db = drizzle({ client, schema });

async function seed() {
  console.log("🌱 シードデータの投入を開始します...");

  // ── コース ──────────────────────────────────────────────
  const courses = [
    {
      id: "course-beginner",
      title: "はじめてのコーヒー学",
      description: "豆・焙煎・抽出の基本をやさしく学ぶ。コーヒーの「なぜ？」が全部わかる！",
      level: "beginner" as const,
      durationMinutes: 120,
      thumbnailEmoji: "🌱",
      isPremium: false,
      orderIndex: 1,
    },
    {
      id: "course-intermediate",
      title: "産地と焙煎の科学",
      description:
        "エチオピア、コロンビア、ブラジル…テロワールと味の秘密を探ろう！",
      level: "intermediate" as const,
      durationMinutes: 300,
      thumbnailEmoji: "🫘",
      isPremium: true,
      orderIndex: 2,
    },
    {
      id: "course-advanced",
      title: "カッピングとスペシャルティ",
      description:
        "SCAプロトコルのカッピングスキルでプロ級の味覚を身につけよう！",
      level: "advanced" as const,
      durationMinutes: 480,
      thumbnailEmoji: "🏆",
      isPremium: true,
      orderIndex: 3,
    },
  ];

  for (const c of courses) {
    await db
      .insert(schema.course)
      .values(c)
      .onConflictDoNothing();
  }
  console.log("✅ コース投入完了");

  // ── レッスン（入門コース 8件） ────────────────────────────
  const beginnerLessons = [
    {
      id: "lesson-b1",
      courseId: "course-beginner",
      title: "コーヒーの歴史と起源",
      content: `## コーヒーの歴史と起源

コーヒーはエチオピア高原が発祥の地と言われています。伝説によれば、9世紀頃に羊飼いのカルディが、特定の実を食べた羊が活発になることに気づき、コーヒーの存在を発見したとされています。

### コーヒーの伝播

- **15世紀**: イエメンでコーヒー栽培が始まる
- **16世紀**: イスタンブールにコーヒーハウスが登場
- **17世紀**: ヨーロッパ各地に普及
- **18世紀**: 南米・アジアへの栽培拡大

コーヒーは「アラビアのワイン」とも呼ばれ、知的交流の場として大きな役割を果たしました。`,
      orderIndex: 1,
      durationMinutes: 10,
      tags: JSON.stringify(["歴史", "起源"]),
    },
    {
      id: "lesson-b2",
      courseId: "course-beginner",
      title: "コーヒー豆の種類",
      content: `## コーヒー豆の種類

コーヒーには主に3つの品種があります。

### アラビカ種（Arabica）
世界のコーヒー生産量の約60〜70%を占める主要品種。標高の高い地域で育ち、繊細な香りと酸味が特徴です。

### ロブスタ種（Robusta）
カネフォラ種の一亜種。苦味が強く、カフェイン含有量も高め。エスプレッソブレンドや缶コーヒーによく使用されます。

### リベリカ種（Liberica）
生産量は非常に少なく、フィリピンなど一部の地域で栽培。独特の風味が特徴。`,
      orderIndex: 2,
      durationMinutes: 15,
      tags: JSON.stringify(["豆", "品種"]),
    },
    {
      id: "lesson-b3",
      courseId: "course-beginner",
      title: "エスプレッソの抽出圧力とは？",
      content: `## エスプレッソの抽出圧力とは？

エスプレッソの抽出には **9気圧（bar）** の圧力が必要です。この圧力こそが、エスプレッソ独特の濃厚な味わいを生み出す鍵です。

### 抽出の基本パラメータ

| パラメータ | 目安値 |
|-----------|-------|
| 圧力 | 9 bar |
| 抽出時間 | 25〜30秒 |
| 湯温 | 90〜96°C |
| 粉量 | 7〜9g（シングル） |

### クレマとは？
エスプレッソの表面に浮かぶ茶色い泡「クレマ」は、高圧抽出によってCO₂が乳化した状態です。クレマの存在が良質なエスプレッソの証とされています。`,
      orderIndex: 3,
      durationMinutes: 15,
      tags: JSON.stringify(["エスプレッソ", "抽出"]),
    },
    {
      id: "lesson-b4",
      courseId: "course-beginner",
      title: "コーヒーの焙煎とは？",
      content: `## コーヒーの焙煎とは？

生豆（グリーンビーンズ）に熱を加えてコーヒーらしい風味を引き出す工程が「焙煎（ロースティング）」です。

### 焙煎度の種類

| 焙煎度 | 特徴 |
|--------|------|
| 浅煎り（ライトロースト） | 酸味強め、果実感、フローラルな香り |
| 中煎り（ミディアムロースト） | バランスが良い、ナッツ・チョコ風味 |
| 深煎り（ダークロースト） | 苦味強め、カラメル・スモーキー風味 |

焙煎中には「ファーストクラック」と「セカンドクラック」という豆がパチパチと弾ける音が鳴り、焙煎度の目安になります。`,
      orderIndex: 4,
      durationMinutes: 15,
      tags: JSON.stringify(["焙煎"]),
    },
    {
      id: "lesson-b5",
      courseId: "course-beginner",
      title: "ハンドドリップの基本",
      content: `## ハンドドリップの基本

ハンドドリップはペーパーフィルターを使ってお湯を注ぎ、コーヒーを抽出する方法です。

### 必要な道具
- ドリッパー（V60、カリタ、メリタなど）
- ペーパーフィルター
- ドリップポット
- コーヒースケール
- ミル（グラインダー）

### 基本の手順

1. フィルターをドリッパーにセットし、お湯でリンスする
2. 中挽きのコーヒー粉（15g）をセット
3. 92°Cのお湯を30ml注ぎ、30秒蒸らす
4. 残りのお湯（225ml）を3回に分けて注ぐ
5. 3分以内に抽出完了（合計250ml）`,
      orderIndex: 5,
      durationMinutes: 20,
      tags: JSON.stringify(["抽出", "ハンドドリップ"]),
    },
    {
      id: "lesson-b6",
      courseId: "course-beginner",
      title: "コーヒーの味を決める要素",
      content: `## コーヒーの味を決める要素

コーヒーの味は多くの要素によって決まります。

### 主な要素

#### 1. 豆の産地・品種
産地によって風味が大きく異なります。エチオピアはフローラル・ベリー系、ブラジルはナッツ・チョコ系など。

#### 2. 焙煎度
浅煎りは酸味と果実感、深煎りは苦味とコクが強くなります。

#### 3. 挽き目（グラインド）
粗挽きは薄め・軽め、細挽きは濃め・苦めになります。抽出方法に合った挽き目を選ぶことが大切です。

#### 4. 水質
コーヒーは99%以上が水です。軟水が一般的に推奨されます（硬度50〜150ppm程度）。

#### 5. 温度と時間
お湯の温度と接触時間が抽出量と風味バランスに影響します。`,
      orderIndex: 6,
      durationMinutes: 15,
      tags: JSON.stringify(["味", "要素"]),
    },
    {
      id: "lesson-b7",
      courseId: "course-beginner",
      title: "カフェオレとラテの違い",
      content: `## カフェオレとラテの違い

よく混同されがちな「カフェオレ」と「カフェラテ」、実は使うコーヒーが違います。

### カフェオレ（Café au lait）
- ベース: **ドリップコーヒー**
- ミルクを同量程度混ぜる
- フランス発祥
- やや軽めの風味

### カフェラテ（Caffè latte）
- ベース: **エスプレッソ**
- スチームミルクを多めに使用
- イタリア発祥
- リッチでクリーミーな風味

### その他のエスプレッソドリンク

| 名前 | エスプレッソ | ミルク | その他 |
|------|------------|--------|--------|
| マキアート | 1ショット | 少量のフォーム | — |
| カプチーノ | 1ショット | 1:1:1 | — |
| アメリカーノ | 1〜2ショット | なし | お湯で割る |`,
      orderIndex: 7,
      durationMinutes: 10,
      tags: JSON.stringify(["ドリンク", "ミルク"]),
    },
    {
      id: "lesson-b8",
      courseId: "course-beginner",
      title: "コーヒーの保存方法",
      content: `## コーヒーの保存方法

コーヒー豆の風味は「酸化」と「湿気」によって劣化します。正しい保存方法を知りましょう。

### 保存の基本ルール

1. **密閉容器に入れる** — 空気（酸素）から守る
2. **直射日光を避ける** — 光による酸化を防ぐ
3. **湿気を避ける** — 吸湿で風味が劣化
4. **なるべく早く使い切る** — 焙煎後2〜4週間が飲み頃

### 冷蔵・冷凍保存について

**短期（2週間以内）**: 常温密閉保存が最適
**長期（1ヶ月以上）**: 冷凍保存が有効（取り出し時の結露に注意）

### 豆のまま保存するのがベスト
粉にすると表面積が増え酸化が早まります。飲む直前に挽くのがベストです。`,
      orderIndex: 8,
      durationMinutes: 10,
      tags: JSON.stringify(["保存", "鮮度"]),
    },
  ];

  // ── レッスン（中級コース 3件サンプル） ────────────────────
  const intermediateLessons = [
    {
      id: "lesson-i1",
      courseId: "course-intermediate",
      title: "エチオピア・イルガチェフェ",
      content: `## エチオピア・イルガチェフェ

エチオピアのイルガチェフェ地区は世界最高峰のコーヒー産地の一つです。

ブルーベリーやジャスミンを思わせる複雑なフレーバーが特徴で、コーヒー発祥の地ならではの独特の品種が多く栽培されています。

### 主な特徴
- **標高**: 1,700〜2,200m
- **フレーバー**: ブルーベリー、ジャスミン、レモン
- **精製方法**: ナチュラル / ウォッシュト
- **品種**: エチオピア在来種（ヘアルーム）`,
      orderIndex: 1,
      durationMinutes: 20,
      tags: JSON.stringify(["産地", "エチオピア"]),
    },
    {
      id: "lesson-i2",
      courseId: "course-intermediate",
      title: "浅煎り vs 深煎り：焙煎の化学",
      content: `## 浅煎り vs 深煎り：焙煎の化学

焙煎は単純に「焼く」作業ではなく、複雑な化学反応の連続です。

### メイラード反応
アミノ酸と糖が加熱されて生じる反応。コーヒーの香ばしさや茶色い色の多くはこの反応によるものです。

### カラメル化
高温で糖が分解・重合する反応。甘味やビターな風味を生みます。

### 浅煎りと深煎りの違い

| 項目 | 浅煎り | 深煎り |
|------|--------|--------|
| 酸味 | 高い | 低い |
| 苦味 | 低い | 高い |
| 香り | フローラル・フルーティ | スモーキー・チョコ |
| カフェイン | やや多い | やや少ない |`,
      orderIndex: 2,
      durationMinutes: 25,
      tags: JSON.stringify(["焙煎", "化学"]),
    },
    {
      id: "lesson-i3",
      courseId: "course-intermediate",
      title: "コロンビアコーヒーの世界",
      content: `## コロンビアコーヒーの世界

コロンビアは世界第3位のコーヒー生産国。アンデス山脈の複雑な地形が生む多様なマイクロクライメット（微気候）が、豊かな風味を育みます。

### 主要産地

- **ウイラ（Huila）**: チェリー・レッドアップル・スウィートキャラメル
- **ナリーニョ（Nariño）**: 明るい酸味・シトラス・フローラル
- **アンティオキア（Antioquia）**: バランスの取れたマイルド

### コロンビアのコーヒー文化
「Juan Valdez」ブランドでも知られるコロンビアは、マイルドで飲みやすいコーヒーとして世界的に人気があります。`,
      orderIndex: 3,
      durationMinutes: 20,
      tags: JSON.stringify(["産地", "コロンビア"]),
    },
  ];

  // ── レッスン（上級コース 2件サンプル） ────────────────────
  const advancedLessons = [
    {
      id: "lesson-a1",
      courseId: "course-advanced",
      title: "SCAカッピングプロトコル入門",
      content: `## SCAカッピングプロトコル入門

SCA（スペシャルティコーヒー協会）が定めるカッピングは、コーヒーの品質を客観的に評価するための標準的な手法です。

### カッピングの手順

1. **サンプル準備**: 8.25g/150ml の比率で粗挽きに
2. **ドライアロマ**: 挽いた粉の香りを評価
3. **注湯**: 93°Cのお湯を注ぐ（4分間待機）
4. **ブレイク**: クラストを崩し香りを評価
5. **テイスティング**: スプーンでコーヒーをすすって評価

### 評価項目（各10点満点）
フレグランス/アロマ・フレーバー・アフターテイスト・酸味・ボディ・バランス・ユニフォーミティ・クリーンカップ・スウィートネス・オーバーオール`,
      orderIndex: 1,
      durationMinutes: 30,
      tags: JSON.stringify(["カッピング", "SCA"]),
    },
    {
      id: "lesson-a2",
      courseId: "course-advanced",
      title: "スペシャルティコーヒーとは？",
      content: `## スペシャルティコーヒーとは？

スペシャルティコーヒーとは、SCAのカッピングプロトコルによる評価で **80点以上** を獲得したコーヒーのことです。

### スペシャルティの定義

世界生産量の約3〜5%しか存在しない希少なコーヒーです。

### 品質基準
- SCAカッピングスコア 80点以上
- 欠点豆が規定値以下
- 産地・農園まで追跡可能なトレーサビリティ

### コマーシャルコーヒーとの違い

| 項目 | スペシャルティ | コマーシャル |
|------|-------------|------------|
| 品質 | SCA 80点以上 | 基準なし |
| 生産量 | 少量 | 大量 |
| 価格 | 高め | 安め |
| トレーサビリティ | 農園まで追跡可能 | 不明瞭 |`,
      orderIndex: 2,
      durationMinutes: 25,
      tags: JSON.stringify(["スペシャルティ", "SCA", "品質"]),
    },
  ];

  const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons];
  for (const l of allLessons) {
    await db.insert(schema.lesson).values(l).onConflictDoNothing();
  }
  console.log("✅ レッスン投入完了");

  // ── クイズ ──────────────────────────────────────────────
  const quizzes = [
    {
      id: "quiz-b3",
      lessonId: "lesson-b3",
      title: "エスプレッソ抽出クイズ",
    },
    {
      id: "quiz-b4",
      lessonId: "lesson-b4",
      title: "焙煎クイズ",
    },
    {
      id: "quiz-a1",
      lessonId: "lesson-a1",
      title: "カッピングプロトコルクイズ",
    },
  ];

  for (const q of quizzes) {
    await db.insert(schema.quiz).values(q).onConflictDoNothing();
  }

  const questions = [
    {
      id: "q-b3-1",
      quizId: "quiz-b3",
      text: "エスプレッソの標準的な抽出圧力は何 bar ですか？",
      explanation: "エスプレッソは9 bar（気圧）の圧力で25〜30秒かけて抽出するのが標準です。",
      orderIndex: 1,
    },
    {
      id: "q-b3-2",
      quizId: "quiz-b3",
      text: "エスプレッソの表面に浮かぶ茶色い泡の名称は？",
      explanation: "「クレマ」はCO₂が高圧抽出によって乳化したもので、良質なエスプレッソの証とされます。",
      orderIndex: 2,
    },
    {
      id: "q-b4-1",
      quizId: "quiz-b4",
      text: "浅煎りコーヒーの特徴として正しいものはどれですか？",
      explanation: "浅煎りは酸味が強く、フルーティでフローラルな香りが特徴です。",
      orderIndex: 1,
    },
    {
      id: "q-a1-1",
      quizId: "quiz-a1",
      text: "SCAカッピングでスペシャルティコーヒーと認定されるスコアは？",
      explanation: "SCA（スペシャルティコーヒー協会）の基準では、100点満点中80点以上がスペシャルティコーヒーと定義されます。",
      orderIndex: 1,
    },
  ];

  for (const q of questions) {
    await db.insert(schema.quizQuestion).values(q).onConflictDoNothing();
  }

  const choices = [
    // q-b3-1
    { id: "c-b3-1-1", questionId: "q-b3-1", text: "3 bar", isCorrect: false, orderIndex: 1 },
    { id: "c-b3-1-2", questionId: "q-b3-1", text: "6 bar", isCorrect: false, orderIndex: 2 },
    { id: "c-b3-1-3", questionId: "q-b3-1", text: "9 bar", isCorrect: true, orderIndex: 3 },
    { id: "c-b3-1-4", questionId: "q-b3-1", text: "15 bar", isCorrect: false, orderIndex: 4 },
    // q-b3-2
    { id: "c-b3-2-1", questionId: "q-b3-2", text: "フォーム", isCorrect: false, orderIndex: 1 },
    { id: "c-b3-2-2", questionId: "q-b3-2", text: "クレマ", isCorrect: true, orderIndex: 2 },
    { id: "c-b3-2-3", questionId: "q-b3-2", text: "ブルーミング", isCorrect: false, orderIndex: 3 },
    { id: "c-b3-2-4", questionId: "q-b3-2", text: "コルタード", isCorrect: false, orderIndex: 4 },
    // q-b4-1
    { id: "c-b4-1-1", questionId: "q-b4-1", text: "苦味が強い", isCorrect: false, orderIndex: 1 },
    { id: "c-b4-1-2", questionId: "q-b4-1", text: "酸味が強く、フルーティな香り", isCorrect: true, orderIndex: 2 },
    { id: "c-b4-1-3", questionId: "q-b4-1", text: "スモーキーな風味", isCorrect: false, orderIndex: 3 },
    { id: "c-b4-1-4", questionId: "q-b4-1", text: "カラメルのような甘み", isCorrect: false, orderIndex: 4 },
    // q-a1-1
    { id: "c-a1-1-1", questionId: "q-a1-1", text: "70点以上", isCorrect: false, orderIndex: 1 },
    { id: "c-a1-1-2", questionId: "q-a1-1", text: "75点以上", isCorrect: false, orderIndex: 2 },
    { id: "c-a1-1-3", questionId: "q-a1-1", text: "80点以上", isCorrect: true, orderIndex: 3 },
    { id: "c-a1-1-4", questionId: "q-a1-1", text: "90点以上", isCorrect: false, orderIndex: 4 },
  ];

  for (const c of choices) {
    await db.insert(schema.quizChoice).values(c).onConflictDoNothing();
  }
  console.log("✅ クイズ投入完了");

  // ── 辞典用語 ────────────────────────────────────────────
  const glossaryTerms = [
    {
      id: "term-espresso",
      term: "エスプレッソ",
      reading: "えすぷれっそ",
      termEn: "Espresso",
      category: "brew" as const,
      shortDescription: "高圧抽出されたコーヒーの原液。多くのコーヒードリンクのベースになる。",
      description: `## エスプレッソ (Espresso)

エスプレッソはイタリア語で「素早く作る」という意味です。9 bar の圧力をかけて25〜30秒で抽出する濃縮コーヒーです。

### 特徴
- 少量（25〜30ml）で非常に濃い
- クレマと呼ばれる泡が表面に浮かぶ
- 多くのコーヒードリンクのベースとなる

### 主なエスプレッソベースドリンク
カフェラテ、カプチーノ、マキアート、アメリカーノなど`,
      relatedTermIds: JSON.stringify(["term-crema", "term-latte"]),
    },
    {
      id: "term-crema",
      term: "クレマ",
      reading: "くれま",
      termEn: "Crema",
      category: "brew" as const,
      shortDescription: "エスプレッソの表面に浮かぶ細かい泡の層。良質な抽出の証。",
      description: `## クレマ (Crema)

クレマはエスプレッソ抽出時に高圧によってCO₂が乳化し、脂質と混ざって生成される泡の層です。

### 良いクレマの条件
- 色: ヘーゼルナッツ〜赤褐色
- 厚さ: 2〜4mm
- 持続時間: 2分以上
- キメ細かい泡`,
      relatedTermIds: JSON.stringify(["term-espresso"]),
    },
    {
      id: "term-latte",
      term: "カフェラテ",
      reading: "かふぇらて",
      termEn: "Caffè Latte",
      category: "brew" as const,
      shortDescription: "エスプレッソにスチームミルクを加えたドリンク。ラテとも呼ばれる。",
      description: `## カフェラテ (Caffè Latte)

カフェラテはイタリア語で「コーヒーミルク」を意味します。エスプレッソ1〜2ショットにスチームミルクを加えて作ります。

### 作り方
1. エスプレッソを抽出（25〜30ml）
2. ミルクをスチームする（60〜65°C）
3. エスプレッソの上にミルクを注ぐ

ラテアートのベースとしても人気です。`,
      relatedTermIds: JSON.stringify(["term-espresso", "term-cappuccino"]),
    },
    {
      id: "term-cappuccino",
      term: "カプチーノ",
      reading: "かぷちーの",
      termEn: "Cappuccino",
      category: "brew" as const,
      shortDescription: "エスプレッソ・スチームミルク・フォームミルクを1:1:1で合わせたドリンク。",
      description: `## カプチーノ (Cappuccino)

カプチーノはエスプレッソ、スチームミルク、フォームミルクを同量（1:1:1）で合わせた伝統的なイタリアのコーヒードリンクです。

### 特徴
- 泡立ちが豊か
- カフェラテより少量（150〜180ml）
- フォームが厚め`,
      relatedTermIds: JSON.stringify(["term-latte", "term-espresso"]),
    },
    {
      id: "term-arabica",
      term: "アラビカ種",
      reading: "あらびかしゅ",
      termEn: "Arabica",
      category: "bean" as const,
      shortDescription: "世界のコーヒー生産量の60〜70%を占める主要品種。繊細な風味が特徴。",
      description: `## アラビカ種 (Arabica)

アラビカ種（Coffea arabica）は世界のコーヒー生産量の約60〜70%を占める最も主要なコーヒーの品種です。

### 特徴
- 標高1,000m以上の高地を好む
- 繊細で複雑な風味
- 酸味が豊か
- カフェイン含有量: 1.2〜1.5%

### 主なサブバリエティ
ゲイシャ、SL-28、ブルボン、ティピカなど`,
      relatedTermIds: JSON.stringify(["term-robusta"]),
    },
    {
      id: "term-robusta",
      term: "ロブスタ種",
      reading: "ろぶすたしゅ",
      termEn: "Robusta",
      category: "bean" as const,
      shortDescription: "カネフォラ種の亜種。苦味が強く、カフェイン含有量が高い。",
      description: `## ロブスタ種 (Robusta)

ロブスタ種（Coffea canephora var. robusta）は世界生産量の約30〜40%を占めます。

### 特徴
- 低地でも栽培可能で病害虫に強い
- 苦味が強く、アーシーな風味
- カフェイン含有量: 2.7%（アラビカの約2倍）
- 一般的に安価`,
      relatedTermIds: JSON.stringify(["term-arabica"]),
    },
    {
      id: "term-roasting",
      term: "焙煎",
      reading: "ばいせん",
      termEn: "Roasting",
      category: "roast" as const,
      shortDescription: "生豆に熱を加えてコーヒーの風味を引き出す工程。",
      description: `## 焙煎 (Roasting)

焙煎は生豆（グリーンビーンズ）に熱を加えることで、コーヒーの香りや風味を引き出す工程です。

### 焙煎の化学反応
- **メイラード反応**: アミノ酸と糖の反応。香ばしさを生む
- **カラメル化**: 糖が分解・重合する反応。甘みとビターさ
- **炭化反応**: 深煎り時に起こる。スモーキーな風味

### クラック（爆ぜ）
- **ファーストクラック**: 約196°C。セル壁が崩れてパチパチと音がする
- **セカンドクラック**: 約224°C。油が表面に出てきて光沢が増す`,
      relatedTermIds: JSON.stringify([]),
    },
    {
      id: "term-pour-over",
      term: "ハンドドリップ",
      reading: "はんどどりっぷ",
      termEn: "Pour Over / Hand Drip",
      category: "brew" as const,
      shortDescription: "ペーパーフィルターを使い、手でお湯を注いでコーヒーを抽出する方法。",
      description: `## ハンドドリップ (Pour Over)

ハンドドリップは日本で特に人気の高い抽出方法で、お湯を手で注いでコーヒーを抽出します。

### 主なドリッパーの種類
- **Hario V60**: 螺旋状のリブ、高い抽出コントロール性
- **カリタ**: 3つ穴、安定した抽出
- **メリタ**: 1つ穴、初心者向け
- **クレバードリッパー**: 浸漬+透過、管理しやすい`,
      relatedTermIds: JSON.stringify([]),
    },
    {
      id: "term-bloom",
      term: "蒸らし",
      reading: "むらし",
      termEn: "Blooming / Pre-infusion",
      category: "brew" as const,
      shortDescription: "抽出前に少量のお湯で粉を湿らせ、CO₂を逃がす工程。",
      description: `## 蒸らし (Blooming)

ドリップ抽出の最初のステップで、コーヒー粉の重量の約2倍のお湯（30〜45ml程度）を注いで30秒間待つ工程です。

### 蒸らしの目的
- CO₂ガスを排出させる
- 粉全体を均一に湿らせる
- その後の抽出を均一にする

新鮮な豆ほど大きく膨らみます（ブルーミング）。これが鮮度の目安になります。`,
      relatedTermIds: JSON.stringify(["term-pour-over"]),
    },
    {
      id: "term-specialty",
      term: "スペシャルティコーヒー",
      reading: "すぺしゃるてぃこーひー",
      termEn: "Specialty Coffee",
      category: "certification" as const,
      shortDescription: "SCAカッピングで80点以上を獲得した高品質コーヒー。世界生産量の約3〜5%。",
      description: `## スペシャルティコーヒー (Specialty Coffee)

SCA（スペシャルティコーヒー協会）のカッピングプロトコルにより100点満点中80点以上を獲得したコーヒーを指します。

### 特徴
- 農園レベルまでのトレーサビリティ
- 欠点豆が規定値以下
- 収穫から焙煎・提供まで品質管理が徹底
- 世界生産量の約3〜5%のみ

### Third Wave Coffee（第三の波）
スペシャルティコーヒーの品質・産地・生産者にフォーカスするムーブメントの中核をなします。`,
      relatedTermIds: JSON.stringify(["term-cupping"]),
    },
    {
      id: "term-cupping",
      term: "カッピング",
      reading: "かっぴんぐ",
      termEn: "Cupping",
      category: "taste" as const,
      shortDescription: "コーヒーの品質を評価するための標準的なテイスティング手法。",
      description: `## カッピング (Cupping)

カッピングはコーヒーの品質・風味を客観的に評価するための標準的な手法です。SCAのプロトコルに基づき、世界中の品質評価に使用されています。

### 評価項目
フレグランス/アロマ・フレーバー・アフターテイスト・酸味・ボディ・バランス・ユニフォーミティ・クリーンカップ・スウィートネス・オーバーオール（各10点）

### 手順
1. 粗挽き粉（8.25g）をカップに入れる
2. 93°Cのお湯を150ml注ぐ
3. 4分後にクラストを崩す
4. スプーンで音を立ててすする`,
      relatedTermIds: JSON.stringify(["term-specialty"]),
    },
    {
      id: "term-terroir",
      term: "テロワール",
      reading: "てろわーる",
      termEn: "Terroir",
      category: "origin" as const,
      shortDescription: "産地の土壌・気候・地形など、コーヒーの風味に影響する環境要因の総称。",
      description: `## テロワール (Terroir)

もともとワインの世界から来た言葉で、コーヒーの風味に影響を与える産地固有の環境条件の総称です。

### テロワールを構成する要素
- **土壌**: ミネラル組成、pH、排水性
- **気候**: 降雨量、乾季・雨季のパターン
- **標高**: 温度差、紫外線量
- **地形**: 日照角度、風の影響
- **在来種・微生物**: 土壌の微生物環境

同じ品種でも産地が違えば風味が大きく異なるのはテロワールの影響です。`,
      relatedTermIds: JSON.stringify([]),
    },
    {
      id: "term-natural-process",
      term: "ナチュラル精製",
      reading: "なちゅらるせいせい",
      termEn: "Natural Process",
      category: "origin" as const,
      shortDescription: "収穫したコーヒーチェリーをそのまま乾燥させる精製方法。甘みとフルーティさが特徴。",
      description: `## ナチュラル精製 (Natural Process)

収穫したコーヒーチェリーを果肉をつけたまま天日干しで乾燥させる伝統的な精製方法です。

### 特徴
- 発酵による甘みとフルーティな風味
- ベリー系のフレーバーが出やすい
- 水を大量に使わないため環境負荷が低い
- エチオピア、ブラジルで多く用いられる

### デメリット
- 乾燥管理が難しく品質のばらつきが出やすい
- 乾燥期間が長い（2〜6週間）`,
      relatedTermIds: JSON.stringify(["term-washed-process"]),
    },
    {
      id: "term-washed-process",
      term: "ウォッシュト精製",
      reading: "うぉっしゅとせいせい",
      termEn: "Washed / Wet Process",
      category: "origin" as const,
      shortDescription: "果肉を除去し水洗いしてから乾燥させる精製方法。クリーンな風味が特徴。",
      description: `## ウォッシュト精製 (Washed Process)

果肉除去機で果皮・果肉を取り除いた後、水の中で発酵させてミューシレージを除去し、洗浄・乾燥させる精製方法です。

### 特徴
- クリーンで透明感のある味わい
- 酸味と明確なフレーバーが出やすい
- ケニア、コロンビア、中米諸国で多く採用

### 工程
1. 果皮・果肉の除去（パルピング）
2. 発酵槽で12〜48時間発酵
3. 水洗い
4. 乾燥`,
      relatedTermIds: JSON.stringify(["term-natural-process"]),
    },
    {
      id: "term-grinder",
      term: "グラインダー",
      reading: "ぐらいんだー",
      termEn: "Grinder / Coffee Mill",
      category: "equipment" as const,
      shortDescription: "コーヒー豆を粉砕する器具。コーヒーの品質に大きく影響する。",
      description: `## グラインダー (Grinder)

コーヒー豆を粉砕（グラインド）するための器具です。均一に挽けるほど風味が安定します。

### 種類

#### バリグラインダー（コニカル/フラット）
- 均一な粒度が得られる
- 業務用〜高級家庭用
- 発熱が少なく風味を保ちやすい

#### プロペラグラインダー（ブレード式）
- 安価
- 粒度のばらつきが大きい
- 初心者向け

### 挽き目の種類
極細挽き（エスプレッソ）→ 細挽き（モカポット）→ 中挽き（ドリップ）→ 粗挽き（フレンチプレス）`,
      relatedTermIds: JSON.stringify([]),
    },
  ];

  for (const t of glossaryTerms) {
    await db.insert(schema.glossaryTerm).values(t).onConflictDoNothing();
  }
  console.log("✅ 辞典用語投入完了");

  // ── 産地 ────────────────────────────────────────────────
  const origins = [
    {
      id: "origin-ethiopia-yirgacheffe",
      name: "エチオピア・イルガチェフェ",
      nameEn: "Ethiopia Yirgacheffe",
      continent: "africa",
      countryCode: "ET",
      flavorTags: JSON.stringify(["ブルーベリー", "ジャスミン", "レモン", "フローラル"]),
      altitude: "1,700〜2,200m",
      annualProduction: "約50万袋",
      varieties: JSON.stringify(["エチオピア在来種（ヘアルーム）"]),
      processingMethods: JSON.stringify(["ナチュラル", "ウォッシュト"]),
      thumbnailEmoji: "🇪🇹",
      description: `## エチオピア・イルガチェフェ

エチオピアのイルガチェフェ地区はコーヒー発祥の地エチオピアの中でも特に高品質なコーヒーを産出する地域として世界的に知られています。

### 産地の特徴
イルガチェフェはシダマ州（現在の中央エチオピア州）に属し、標高1,700〜2,200mの高地に位置します。昼夜の寒暖差が大きく、コーヒーが時間をかけてゆっくりと成熟するため、複雑な風味が生まれます。

### フレーバー
ブルーベリーやストロベリーのような果実感、ジャスミンやラベンダーのようなフローラルな香り、明るいレモンのような酸味が特徴です。

### 在来種（ヘアルーム）
エチオピアのコーヒーは何世紀にもわたって進化してきた在来種（ヘアルーム）が多く、遺伝的多様性が豊かです。`,
    },
    {
      id: "origin-colombia-huila",
      name: "コロンビア・ウイラ",
      nameEn: "Colombia Huila",
      continent: "south-america",
      countryCode: "CO",
      flavorTags: JSON.stringify(["チェリー", "レッドアップル", "キャラメル", "スウィート"]),
      altitude: "1,500〜2,000m",
      annualProduction: "約200万袋",
      varieties: JSON.stringify(["カスティージョ", "コロンビア", "ティピカ"]),
      processingMethods: JSON.stringify(["ウォッシュト"]),
      thumbnailEmoji: "🇨🇴",
      description: `## コロンビア・ウイラ

ウイラ（Huila）はコロンビア南西部に位置するコーヒー産地で、近年スペシャルティコーヒーの産地として急速に注目を集めています。

### 産地の特徴
アンデス山脈の中央山脈と東部山脈に囲まれた地形で、複雑なマイクロクライメット（微気候）が生まれています。ネイバ渓谷周辺から標高の高い山間部まで多様な環境でコーヒーが栽培されています。

### フレーバー
チェリーやレッドアップルの甘酸っぱい風味と、キャラメルのようなスウィートネスが特徴。バランスが良く飲みやすいコーヒーです。`,
    },
    {
      id: "origin-brazil-sul-de-minas",
      name: "ブラジル・スルデミナス",
      nameEn: "Brazil Sul de Minas",
      continent: "south-america",
      countryCode: "BR",
      flavorTags: JSON.stringify(["チョコレート", "ナッツ", "キャラメル", "マイルド"]),
      altitude: "800〜1,300m",
      annualProduction: "約3,200万袋",
      varieties: JSON.stringify(["ブルボン", "ムンドノーボ", "カトゥアイ"]),
      processingMethods: JSON.stringify(["ナチュラル", "パルプトナチュラル"]),
      thumbnailEmoji: "🇧🇷",
      description: `## ブラジル・スルデミナス

ブラジルはコーヒー生産量世界第1位の国で、スルデミナス（Sul de Minas）はミナスジェライス州南部に位置する主要産地です。

### 産地の特徴
比較的低い標高（800〜1,300m）と温暖な気候が、安定した品質のコーヒー生産を可能にしています。大規模農場から小規模農家まで多様な生産者が存在します。

### フレーバー
チョコレートやナッツのような風味、キャラメルの甘み、マイルドでバランスの取れた味わいが特徴。ブレンドのベースとしても広く使用されます。`,
    },
    {
      id: "origin-kenya",
      name: "ケニア",
      nameEn: "Kenya",
      continent: "africa",
      countryCode: "KE",
      flavorTags: JSON.stringify(["ブラックカラント", "トマト", "明るい酸味", "ジューシー"]),
      altitude: "1,500〜2,100m",
      annualProduction: "約100万袋",
      varieties: JSON.stringify(["SL-28", "SL-34", "ルイル11"]),
      processingMethods: JSON.stringify(["ウォッシュト（ダブルウォッシュト）"]),
      thumbnailEmoji: "🇰🇪",
      description: `## ケニア

ケニアはアフリカ屈指の高品質コーヒー生産国で、独特のウォッシュトプロセスと優れた品種管理により世界のコーヒー愛好家から高い評価を受けています。

### 産地の特徴
ケニア山の裾野に広がる赤い火山性土壌（ニトソル）と豊富な降雨量が、独特の風味を生み出します。農家協同組合（ファクトリー）システムが品質管理に大きく貢献しています。

### フレーバー
ブラックカラントやトマトのような独特の風味、明るくジューシーな酸味が特徴。複雑でワインのような風味とも言われます。

### ダブルウォッシュト
ケニア独自の精製方法で、2回の発酵・水洗いを経ることで非常にクリーンな風味が生まれます。`,
    },
    {
      id: "origin-guatemala-antigua",
      name: "グアテマラ・アンティグア",
      nameEn: "Guatemala Antigua",
      continent: "central-america",
      countryCode: "GT",
      flavorTags: JSON.stringify(["チョコレート", "スパイス", "柑橘", "コク"]),
      altitude: "1,500〜1,700m",
      annualProduction: "約400万袋",
      varieties: JSON.stringify(["ブルボン", "カトゥアイ", "カトゥーラ"]),
      processingMethods: JSON.stringify(["ウォッシュト"]),
      thumbnailEmoji: "🇬🇹",
      description: `## グアテマラ・アンティグア

アンティグアはグアテマラ中部の高地に位置する歴史的な都市で、三つの火山（アグア、フエゴ、アカテナンゴ）に囲まれています。この独特の地形がコーヒーに豊かなミネラルとコクをもたらします。

### 産地の特徴
火山性の豊かな土壌、昼夜の寒暖差、適度な降雨量と乾季のバランスが、複雑な風味のコーヒーを育てます。

### フレーバー
チョコレートとスパイスの深みのある風味に、柑橘系の明るい酸味が合わさった複雑な味わいが特徴です。`,
    },
  ];

  for (const o of origins) {
    await db.insert(schema.origin).values(o).onConflictDoNothing();
  }
  console.log("✅ 産地投入完了");

  console.log("🎉 シードデータの投入が完了しました！");
}

seed().catch(console.error);
