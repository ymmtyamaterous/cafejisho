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

  // ── レッスン（中級コース 14件） ────────────────────
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
    {
      id: "lesson-i4",
      courseId: "course-intermediate",
      title: "ブラジルの農園システム",
      content: `## ブラジルの農園システム

ブラジルは世界最大のコーヒー生産国であり、生産量は世界全体の約30〜35%を占めます。

### 大規模農園（ファゼンダ）
ブラジルのコーヒー生産の特徴は、広大な平地での機械化された大規模農業です。

### 主要産地
- **ミナスジェライス州**: ブラジル最大の産地。ナッツ・チョコレート系の風味
- **サンパウロ州**: モジアナ地区が有名。バランスの取れた風味
- **エスピリトサント州**: コニロン（ロブスタ）の主要産地

### 精製方法
ナチュラル（乾燥式）が主流。甘くて低酸味のコーヒーが多い。`,
      orderIndex: 4,
      durationMinutes: 20,
      tags: JSON.stringify(["産地", "ブラジル"]),
    },
    {
      id: "lesson-i5",
      courseId: "course-intermediate",
      title: "ウォッシュト vs ナチュラル精製",
      content: `## ウォッシュト vs ナチュラル精製

精製方法はコーヒーの風味に大きく影響します。

### ウォッシュト（水洗式）
収穫したチェリーの果肉を除去し、水で発酵・洗浄してから乾燥。クリーンでフルーティな酸味が特徴。

### ナチュラル（乾燥式）
チェリーのまま天日干し。果肉の甘みがコーヒーに移り、フルーティで甘い風味になる。

### ハニープロセス
ウォッシュトとナチュラルの中間。果肉を一部残して乾燥させる。

| 特徴 | ウォッシュト | ナチュラル |
|------|------------|----------|
| クリーン度 | 高い | 低い |
| 甘み | 控えめ | 強い |
| 酸味 | 明るい | 丸みがある |`,
      orderIndex: 5,
      durationMinutes: 22,
      tags: JSON.stringify(["精製", "加工"]),
    },
    {
      id: "lesson-i6",
      courseId: "course-intermediate",
      title: "テロワールとマイクロクライメット",
      content: `## テロワールとマイクロクライメット

コーヒーの世界でも、ワインと同様に「テロワール」の概念が重要です。

### テロワールとは
土壌・気候・標高・日照など、その土地固有の環境条件の総称。同じ品種でも産地によって全く異なる風味が生まれます。

### 高地栽培のメリット
標高が高いほど気温差が大きく、豆がゆっくり成長し、糖分や有機酸が豊富に蓄積されます。

- **1,200m以上**: スペシャルティコーヒーに多い
- **2,000m超**: 極めて希少で複雑な風味

### マイクロクライメット
同じ農園内でも斜面の向きや風の流れによって微気候が異なり、それがコーヒーの個性を生みます。`,
      orderIndex: 6,
      durationMinutes: 25,
      tags: JSON.stringify(["テロワール", "産地"]),
    },
    {
      id: "lesson-i7",
      courseId: "course-intermediate",
      title: "焙煎プロファイルの読み方",
      content: `## 焙煎プロファイルの読み方

プロの焙煎士は「焙煎プロファイル」を使って、温度・時間・火力を細かく管理します。

### 主要なポイント

1. **投入温度（チャージ温度）**: 豆を投入する際の釜の温度（通常180〜220℃）
2. **ターニングポイント**: 投入後に温度が下がり、再び上昇し始める点
3. **ファーストクラック**: 豆内部の水分が蒸発し「パチパチ」と音がする（浅煎り〜中煎り）
4. **セカンドクラック**: 炭化が始まる「パパッ」という音（中深煎り〜深煎り）

### RoR（Rate of Rise）
温度上昇率のこと。RoRを安定させることで均一な焙煎が可能になります。`,
      orderIndex: 7,
      durationMinutes: 30,
      tags: JSON.stringify(["焙煎", "プロファイル"]),
    },
    {
      id: "lesson-i8",
      courseId: "course-intermediate",
      title: "ケニアAAとグレーディングシステム",
      content: `## ケニアAAとグレーディングシステム

ケニアのコーヒーは世界でも特に評価が高く、独自のグレーディングシステムで品質管理されています。

### グレード分類（豆のサイズ）
- **AA**: 最大サイズ（スクリーン17〜18）
- **AB**: 中サイズ（スクリーン15〜16）
- **C**: 小サイズ

### ケニアの特徴
- **フレーバー**: ブラックカラント、トマト、ジューシーな酸味
- **精製**: ダブルウォッシュト（二重発酵洗浄）
- **品種**: SL28・SL34・ルイル11

### 競売システム（ナイロビコーヒー取引所）
ケニアは週次競売でコーヒーを取引する珍しいシステムを持ち、高品質豆の価格形成に貢献しています。`,
      orderIndex: 8,
      durationMinutes: 20,
      tags: JSON.stringify(["産地", "ケニア", "グレード"]),
    },
    {
      id: "lesson-i9",
      courseId: "course-intermediate",
      title: "コーヒーの品種：ゲイシャとその他の希少品種",
      content: `## コーヒーの品種：ゲイシャとその他の希少品種

コーヒーの品種（バラエティ）は風味に直結します。特にゲイシャ種は世界で最も注目を集めています。

### ゲイシャ種（Geisha/Gesha）
エチオピア原産の品種。パナマのバルエタ農園で栽培が始まり、2004年のBOPコンクールで衝撃的なスコアを記録。

**特徴**: 紅茶・ジャスミン・ベルガモットのような繊細な香り

### その他の注目品種
- **パカマラ**: パカスとマラゴジッペの交配種。大粒で複雑な風味
- **SL28**: ケニア品種。ブラックカラント・シトラスの酸
- **ティピカ**: アラビカ種の原点。クリーンで古典的な風味
- **ブルボン**: ティピカから自然変異。丸みのある甘さ`,
      orderIndex: 9,
      durationMinutes: 22,
      tags: JSON.stringify(["品種", "ゲイシャ"]),
    },
    {
      id: "lesson-i10",
      courseId: "course-intermediate",
      title: "中米のコーヒー：グアテマラとコスタリカ",
      content: `## 中米のコーヒー：グアテマラとコスタリカ

中米は小国ながら個性豊かなコーヒーを産出する地域です。

### グアテマラ
- **アンティグア**: 火山灰土壌。チョコレート・スパイス系
- **ウエウエテナンゴ**: 高地産。フルーティでフローラル
- **標高**: 1,200〜2,000m

### コスタリカ
- 世界で初めてコーヒーの単一品種栽培を義務化
- **品種**: カトゥーラ・カトゥアイ
- **タラス地区**: バランスの取れたクリーンなカップ
- **マイクロミル**: 小規模精製所による高品質生産

### ホンジュラス
近年スペシャルティコーヒー産地として急成長。コパン・マルカラなどが有名。`,
      orderIndex: 10,
      durationMinutes: 20,
      tags: JSON.stringify(["産地", "中米"]),
    },
    {
      id: "lesson-i11",
      courseId: "course-intermediate",
      title: "アジアのコーヒー：インドネシアとインド",
      content: `## アジアのコーヒー：インドネシアとインド

アジアのコーヒーはアフリカ・中南米とは異なる独特の風味を持ちます。

### インドネシア
- **スマトラ島（マンデリン）**: ウエット・ハル（スマトラ式精製）による低酸・フルボディ・アーシーな風味
- **スラウェシ島（トラジャ）**: ハーブ・スパイス・ダークチョコレート
- **バリ島**: フルーティで丸みのある風味

### スマトラ式精製（ウエット・ハル）
パーチメント（内皮）を半乾きの状態で脱穀する独特の方法。これがマンデリン特有の深い風味の源です。

### インド
- **モンスーン・マラバール**: モンスーン（季節風）に当て豆を熟成。低酸・重厚な風味
- **ニルギリ地区**: フルーティで明るい酸味`,
      orderIndex: 11,
      durationMinutes: 22,
      tags: JSON.stringify(["産地", "アジア", "インドネシア"]),
    },
    {
      id: "lesson-i12",
      courseId: "course-intermediate",
      title: "コーヒーのサステナビリティ",
      content: `## コーヒーのサステナビリティ

気候変動や農家の生活問題など、コーヒー産業が抱える課題と取り組みを学びます。

### 気候変動の影響
2050年までにコーヒー栽培適地が50%減少するという研究もあります。高温化・害虫増加が主な脅威です。

### 認証プログラム
- **フェアトレード**: 農家に公正な価格を保証
- **有機（オーガニック）**: 農薬・化学肥料不使用
- **雨林同盟（Rainforest Alliance）**: 生態系保護と農家支援
- **バードフレンドリー**: 渡り鳥の生息地保護

### ダイレクトトレード
ロースターが農家と直接取引することで、中間マージンを減らし農家の収入を増やす仕組みです。`,
      orderIndex: 12,
      durationMinutes: 25,
      tags: JSON.stringify(["サステナビリティ", "認証"]),
    },
    {
      id: "lesson-i13",
      courseId: "course-intermediate",
      title: "コーヒーの収穫と選別",
      content: `## コーヒーの収穫と選別

収穫方法は品質に直結します。丁寧な選別が高品質コーヒーの第一歩です。

### 収穫方法

**ハンドピック（手摘み）**
完熟したチェリーだけを一粒ずつ選んで摘む。品質が高いが労働集約的。スペシャルティコーヒーはほぼこの方法。

**ストリッピング（一括摘み）**
木の枝ごと実を取り除く。効率的だが未熟豆も混入する。

**機械収穫**
ブラジルなど平坦な産地で使用。コスト削減に有効。

### 選別の重要性
収穫後、欠点豆・未熟豆・過熟豆を取り除く作業が品質を決定づけます。SCAの規定では100gあたりの欠点豆数で品質が判定されます。`,
      orderIndex: 13,
      durationMinutes: 20,
      tags: JSON.stringify(["収穫", "選別", "農業"]),
    },
    {
      id: "lesson-i14",
      courseId: "course-intermediate",
      title: "産地と焙煎度の組み合わせ",
      content: `## 産地と焙煎度の組み合わせ

産地特性を活かすには、適切な焙煎度が重要です。

### 産地別おすすめ焙煎度

| 産地 | 焙煎度 | 理由 |
|------|--------|------|
| エチオピア | 浅煎り〜中浅煎り | フローラル・フルーティな香りを活かす |
| コロンビア | 中煎り | バランスのよいフルーツ感と甘みが最大限に |
| ブラジル | 中深煎り〜深煎り | ナッツ・チョコレートのコクが引き立つ |
| スマトラ | 深煎り | アーシーな重厚感がより際立つ |
| ケニア | 浅煎り〜中煎り | 独特のジューシーな酸味を保持 |

### 自分好みを見つけるには
まず同じ産地・品種で異なる焙煎度を飲み比べてみましょう。風味の違いが明確に感じられます。`,
      orderIndex: 14,
      durationMinutes: 18,
      tags: JSON.stringify(["焙煎", "産地", "組み合わせ"]),
    },
  ];

  // ── レッスン（上級コース 20件） ────────────────────
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
    {
      id: "lesson-a3",
      courseId: "course-advanced",
      title: "カッピングフォームの記入方法",
      content: `## カッピングフォームの記入方法

SCA公式のカッピングフォームを正確に使いこなすことが、プロのカッパーへの第一歩です。

### フォームの構成
各評価項目は「クオリティスコア（6〜10点）」と「インテンシティ（強度）」の2軸で評価します。

### 主要評価項目の詳細

**フレグランス/アロマ（香り）**
挽いた粉（ドライ）とお湯を注いだ後（ウェット）の香りを別々に評価。

**フレーバー（風味）**
口に含んだときの香味の印象。酸・甘・苦のバランス。

**アフターテイスト（後味）**
飲み込んだ後に残る風味の質と長さ。

**ボディ（質感）**
口の中での重さ・濃度感。「重い」「軽い」で表現。

### スコアの合計
10項目のスコアを合計し、欠点豆による減点を行い最終スコアを算出。`,
      orderIndex: 3,
      durationMinutes: 35,
      tags: JSON.stringify(["カッピング", "評価"]),
    },
    {
      id: "lesson-a4",
      courseId: "course-advanced",
      title: "フレーバーホイールの使い方",
      content: `## フレーバーホイールの使い方

SCAフレーバーホイールは、コーヒーの風味を体系的に表現するためのツールです。

### 構造
中心から外側に向かってカテゴリが細分化されます。

**主要カテゴリ**
- フルーティ（ベリー系・シトラス系・ドライフルーツ）
- フローラル（ジャスミン・ローズ・ラベンダー）
- グリーン/ベジタブル（草・豆・野菜）
- ロースティ（ナッツ・チョコレート・スモーキー）
- スパイシー（クローブ・シナモン）
- スウィート（バニラ・キャラメル・蜂蜜）

### 活用方法
まず大カテゴリを特定し、次に中カテゴリ、最後に具体的なフレーバーを特定するプロセスで表現を豊かにします。`,
      orderIndex: 4,
      durationMinutes: 28,
      tags: JSON.stringify(["フレーバー", "評価", "カッピング"]),
    },
    {
      id: "lesson-a5",
      courseId: "course-advanced",
      title: "酸味の科学：有機酸とコーヒー",
      content: `## 酸味の科学：有機酸とコーヒー

コーヒーの酸味は「すっぱい」だけではありません。様々な有機酸が複雑な酸味を作り出しています。

### 主要な有機酸

| 有機酸 | 特徴 | 多い産地 |
|--------|------|---------|
| クロロゲン酸 | コーヒー特有の酸。焙煎で分解 | 浅煎り全般 |
| クエン酸 | 柑橘系の明るい酸味 | エチオピア・ケニア |
| リンゴ酸 | リンゴを思わせる甘酸っぱさ | コロンビア |
| 酒石酸 | ワインのような酸味 | コスタリカ |
| 乳酸 | 柔らかくマイルドな酸 | ナチュラル精製 |

### 焙煎と酸味の関係
浅煎りほど有機酸が残り、酸味が強くなります。深煎りになると酸が分解されます。

### pH
コーヒーのpHは約4.5〜5.5（弱酸性）。胃への影響を気にする方には深煎りがおすすめ。`,
      orderIndex: 5,
      durationMinutes: 30,
      tags: JSON.stringify(["酸味", "化学", "科学"]),
    },
    {
      id: "lesson-a6",
      courseId: "course-advanced",
      title: "ボディとマウスフィール",
      content: `## ボディとマウスフィール

コーヒーの「ボディ」は口の中での質感・重さを表す重要な評価指標です。

### ボディを構成する要素
- **脂質（コーヒーオイル）**: ペーパーフィルターが吸収。フレンチプレスやエスプレッソには多く残る
- **タンパク質**: コーヒーの複雑な食感に貢献
- **コロイド**: 細かい粒子が生み出すとろみ感

### ボディの表現
- ライト: 紅茶のような軽さ
- ミディアム: バランスの取れた質感
- フルボディ: クリーミーで重い質感（スマトラ、フレンチプレス等）

### 抽出方法とボディの関係

| 抽出方法 | ボディ感 |
|---------|---------|
| エスプレッソ | 非常に重い |
| フレンチプレス | 重い（オイル残存） |
| ドリップ（ペーパー） | 中〜軽い |
| 水出し（コールドブリュー） | 滑らかで軽い |`,
      orderIndex: 6,
      durationMinutes: 25,
      tags: JSON.stringify(["ボディ", "抽出", "評価"]),
    },
    {
      id: "lesson-a7",
      courseId: "course-advanced",
      title: "COE（カップオブエクセレンス）",
      content: `## COE（カップオブエクセレンス）

カップオブエクセレンス（COE）は世界最高水準のコーヒー品評会です。

### COEとは
Alliance for Coffee Excellence（ACE）が主催する国際的なコーヒー品評会。入賞豆はオンラインオークションで高値取引されます。

### 審査プロセス
1. 各国の農家がサンプルを提出
2. 国内審査（ナショナルジュリー）
3. 国際審査（インターナショナルジュリー）
4. 最終スコアが87点以上でCOE入賞
5. オンラインオークション開催

### 記録的な落札価格
過去には1ポンド（453g）あたり数百〜1,000ドルを超える落札価格も記録されており、コーヒー農家の収入向上に大きく貢献しています。`,
      orderIndex: 7,
      durationMinutes: 20,
      tags: JSON.stringify(["COE", "品評会", "スペシャルティ"]),
    },
    {
      id: "lesson-a8",
      courseId: "course-advanced",
      title: "ゲイシャ種の歴史と栽培",
      content: `## ゲイシャ種の歴史と栽培

ゲイシャ（Geisha/Gesha）種はコーヒー界で最も注目される品種の一つです。

### 起源
エチオピア南西部のゲシャ村（Gesha Village）が原産地。1931年にタンザニアを経由してコスタリカへ、さらにパナマに渡りました。

### パナマでの発見
2004年、バルエタ農園のハンス・ピーターソン氏がBOP（Best of Panama）コンクールに出品し、革命的なスコアを記録。コーヒー界に衝撃を与えました。

### 栽培の難しさ
- 収量が非常に少ない
- 病気に弱い
- 高標高（1,700m以上）が必要
- 生育に時間がかかる

これらの理由から非常に高価ですが、その複雑で繊細な風味は他の追随を許しません。`,
      orderIndex: 8,
      durationMinutes: 25,
      tags: JSON.stringify(["ゲイシャ", "品種", "歴史"]),
    },
    {
      id: "lesson-a9",
      courseId: "course-advanced",
      title: "嫌気性発酵（アナエロビック）",
      content: `## 嫌気性発酵（アナエロビック）

近年注目を集めるアナエロビック（嫌気性）精製は、コーヒーの風味を劇的に変化させる革新的な手法です。

### 通常発酵との違い
通常の発酵は酸素が存在する環境（好気性）で行われますが、アナエロビックは密閉タンクで酸素を遮断した環境で発酵させます。

### 発酵のプロセス
1. チェリーをステンレスタンクに密閉投入
2. 酸素を排出（CO₂ガスバルブで圧力調整）
3. 24〜72時間以上発酵
4. その後ウォッシュトまたはナチュラル処理

### 風味の特徴
- ワインのような発酵感
- トロピカルフルーツ・パッションフルーツ
- 複雑で強烈な甘みと個性

### 賛否両論
個性的すぎて好みが分かれますが、COEや各種コンクールで高評価を得る例も増えています。`,
      orderIndex: 9,
      durationMinutes: 30,
      tags: JSON.stringify(["精製", "発酵", "アナエロビック"]),
    },
    {
      id: "lesson-a10",
      courseId: "course-advanced",
      title: "カーボニックマセレーション",
      content: `## カーボニックマセレーション

ワイン醸造から着想を得た「カーボニックマセレーション（炭酸ガス浸漬）」は、独特の風味を生む精製手法です。

### ワインとの共通点
ボジョレーヌーボーなどに使われる手法をコーヒーに応用。ブドウ（チェリーごと）を炭酸ガス環境で発酵させます。

### コーヒーへの応用
1. CO₂で満たしたタンクにコーヒーチェリーを丸ごと投入
2. 細胞内での独自の発酵が起こる
3. 発酵後、通常のウォッシュト処理

### 生まれる風味
- シーダー・杉のような香り
- ジューシーな果実感
- 独特のスパイシーさ
- 非常にクリーンなカップ

世界各地のスペシャルティロースターがこの手法で作られたコーヒーを積極的に扱っています。`,
      orderIndex: 10,
      durationMinutes: 28,
      tags: JSON.stringify(["精製", "発酵", "革新的手法"]),
    },
    {
      id: "lesson-a11",
      courseId: "course-advanced",
      title: "コーヒーとテロワール：土壌の影響",
      content: `## コーヒーとテロワール：土壌の影響

ワインの世界で有名な「テロワール」概念は、コーヒーでも非常に重要です。

### 土壌がコーヒーに与える影響

**火山灰土壌**
グアテマラ、コスタリカなどに多い。ミネラル豊富で排水性が高く、コーヒー栽培に最適。

**赤土（ラテライト）**
ブラジル、インド、インドネシアなど。鉄・アルミ豊富で重厚な風味を生む。

**砂質土壌**
イエメンに多い。独特のワイン様の風味。

### pH の影響
コーヒー栽培に最適な土壌pH は6.0〜6.5（弱酸性）。酸性土壌はミネラル吸収を促進します。

### 有機物と微生物
豊かな有機物と多様な土壌微生物が、複雑な風味の原点となります。`,
      orderIndex: 11,
      durationMinutes: 25,
      tags: JSON.stringify(["テロワール", "土壌", "科学"]),
    },
    {
      id: "lesson-a12",
      courseId: "course-advanced",
      title: "ロースターとしてのブレンド技術",
      content: `## ロースターとしてのブレンド技術

単一農園豆（シングルオリジン）とは異なるブレンドコーヒーの哲学と技術を学びます。

### ブレンドの目的
- 年間を通じた安定した品質の提供
- コスト管理
- 特定の風味プロファイルの実現（例：エスプレッソ用）

### ブレンド手法
**焙煎前ブレンド**: 生豆を混ぜて同時に焙煎。均一に焙煎しやすい。
**焙煎後ブレンド**: 各豆を最適な焙煎度で焼いてからブレンド。複雑な風味を実現。

### エスプレッソブレンドの設計
クレマのためのロブスタ（20〜30%）+ 甘みのブラジル + 酸味のエチオピアなど、役割を決めて組み合わせます。

### ブレンド比率の表記
パッケージに「エチオピア60% + ブラジル40%」などの産地比率を記載することが一般的です。`,
      orderIndex: 12,
      durationMinutes: 30,
      tags: JSON.stringify(["ブレンド", "ロースター", "技術"]),
    },
    {
      id: "lesson-a13",
      courseId: "course-advanced",
      title: "エスプレッソの抽出科学",
      content: `## エスプレッソの抽出科学

エスプレッソは科学的に最も複雑な抽出方法の一つです。

### 抽出の基本パラメータ
- **用量（ドーズ）**: 18〜21g のコーヒー粉
- **収量（イールド）**: 36〜42g のエスプレッソ液
- **比率（レシオ）**: 1:2 が標準（1g の粉から 2g のエスプレッソ）
- **時間**: 25〜30秒
- **圧力**: 9 bar
- **温度**: 90〜96℃

### 「レシオ」の重要性
現代のスペシャルティエスプレッソでは、1:2.5〜3のレシオで甘みと酸味を強調した「ロングショット」も人気です。

### 抽出の問題

| 問題 | 原因 | 解決策 |
|------|------|--------|
| 過剰抽出（苦い）| 挽き目が細かい | 粗く調整 |
| 過少抽出（薄い）| 挽き目が粗い | 細く調整 |
| チャネリング | タンピングが偏っている | 均一にタンプ |`,
      orderIndex: 13,
      durationMinutes: 35,
      tags: JSON.stringify(["エスプレッソ", "抽出", "科学"]),
    },
    {
      id: "lesson-a14",
      courseId: "course-advanced",
      title: "ラテアートの基礎",
      content: `## ラテアートの基礎

ラテアートはスチームミルクとエスプレッソの組み合わせで作る視覚的な芸術です。

### 必要な技術

**スチーミング（ミルクの泡立て）**
65℃以下の温度でマイクロフォーム（きめ細かい泡）を作る。泡立てすぎると大きな気泡になり失敗の原因に。

**ポーリング（注ぎ方）**
1. カップを傾ける
2. ミルクをエスプレッソの中心に注ぐ
3. カップを水平に戻しながらミルクを揺らす

### 基本デザイン
- **ハート**: 最もシンプルな基本形
- **チューリップ**: 3〜5層のハートを積み重ねる
- **ローゼッタ（葉）**: 左右に揺らしながら注ぐ

### 競技会
World Latte Art Championship（WLAC）では世界レベルの技術が競われます。`,
      orderIndex: 14,
      durationMinutes: 25,
      tags: JSON.stringify(["ラテアート", "スチーミング", "技術"]),
    },
    {
      id: "lesson-a15",
      courseId: "course-advanced",
      title: "コーヒーとフードペアリング",
      content: `## コーヒーとフードペアリング

コーヒーと食べ物の組み合わせを科学的に理解することで、より深い味わいの体験が可能になります。

### ペアリングの基本原則

**風味の共鳴**
コーヒーと食べ物が共通の香気成分を持つ場合、互いの風味が引き立てあいます。

**コントラスト**
甘いスイーツ × 苦いエスプレッソのように対照的な組み合わせ。

### 産地別ペアリング

| コーヒー | おすすめフード |
|---------|-------------|
| エチオピア（フローラル）| ショートケーキ・紅茶スコーン |
| コロンビア（フルーティ）| チョコレートケーキ・ベリー系タルト |
| ブラジル（ナッツ・チョコ）| アーモンドクッキー・チョコブラウニー |
| スマトラ（アーシー）| チーズケーキ・ナッツパイ |

### 地域ペアリング
イタリアでは「バール文化」として、エスプレッソにカントゥッチ（アーモンドクッキー）を合わせる習慣があります。`,
      orderIndex: 15,
      durationMinutes: 22,
      tags: JSON.stringify(["ペアリング", "フード", "風味"]),
    },
    {
      id: "lesson-a16",
      courseId: "course-advanced",
      title: "コールドブリューとナイトロコーヒー",
      content: `## コールドブリューとナイトロコーヒー

低温抽出のコールドブリューと、窒素ガスを注入したナイトロコーヒーは現代の革新的な飲み方です。

### コールドブリュー
冷水で長時間（12〜24時間）かけてゆっくり抽出。

**特徴**
- 低酸味・低苦味
- なめらかでスムーズな飲み口
- 濃縮タイプは希釈して飲む
- 常温抽出よりも甘みが引き立つ

### 水出しとの違い
水出し（コールドウォータードリップ）は日本発祥の点滴抽出法。コールドブリューより繊細な風味。

### ナイトロコーヒー
窒素ガスを注入した冷たいコーヒー。ギネスビールのような滑らかなクリーミーな泡立ちが特徴。

- クリーミーな食感（砂糖・ミルク不要でも満足感）
- 窒素の小さな気泡が甘みを感じさせる
- カフェやコンビニのNITROシリーズで普及中`,
      orderIndex: 16,
      durationMinutes: 22,
      tags: JSON.stringify(["コールドブリュー", "ナイトロ", "抽出"]),
    },
    {
      id: "lesson-a17",
      courseId: "course-advanced",
      title: "サードウェーブコーヒーの哲学",
      content: `## サードウェーブコーヒーの哲学

コーヒー文化の「三つの波」を理解することで、現代のスペシャルティコーヒー文化の意味が見えてきます。

### コーヒーの三つの波

**第一の波（1960〜1970年代）**
インスタントコーヒーの普及。大量生産・大量消費の時代。フォルジャーズ・ネスカフェなど。

**第二の波（1980〜1990年代）**
スターバックスなどのコーヒーチェーンの台頭。コーヒーのプレミアム化・カフェ文化の普及。

**第三の波（2000年代〜現在）**
産地・農家・品種・精製方法へのこだわり。コーヒーをワインのように「食文化」として楽しむ視点。

### 第三の波の特徴
- シングルオリジン重視
- 浅煎りの台頭
- 農家との直接取引
- 抽出の科学化・精密化
- カッピングによる品質評価

**代表的なロースター**: Blue Bottle Coffee、Stumptown、Counter Culture、%Arabica など`,
      orderIndex: 17,
      durationMinutes: 25,
      tags: JSON.stringify(["サードウェーブ", "文化", "歴史"]),
    },
    {
      id: "lesson-a18",
      courseId: "course-advanced",
      title: "Q グレーダー資格について",
      content: `## Q グレーダー資格について

Qグレーダーは世界標準のコーヒー品質評価者資格です。

### Qグレーダーとは
Coffee Quality Institute（CQI）が認定する国際資格。SCAプロトコルに基づいてコーヒーを客観的に評価・スコアリングできる専門家。

### 試験内容
- **カッピング試験**: 盲目テイスティングで産地・品種・欠点を特定
- **アロマ識別**: 36種類の香気サンプルを識別
- **感覚テスト**: 甘み・塩味・酸味・苦味・うま味を識別
- **欠点豆識別**: 欠点豆の種類と原因を特定
- **筆記試験**: コーヒーの知識全般

### 世界での認知
世界100カ国以上に5,000名以上のQグレーダーが在籍（2024年現在）。日本でも100名以上が取得しています。

### 資格の有効期限
3年ごとに更新が必要（リキャリブレーション試験）。`,
      orderIndex: 18,
      durationMinutes: 28,
      tags: JSON.stringify(["Qグレーダー", "資格", "CQI"]),
    },
    {
      id: "lesson-a19",
      courseId: "course-advanced",
      title: "コーヒー農家の生活と課題",
      content: `## コーヒー農家の生活と課題

世界で約1億2,500万人がコーヒー生産に携わっていると言われています。

### コーヒーチェリーの収益
コーヒー一杯（約500円）のうち、農家に渡る金額はわずか数円〜数十円と言われています。

### 農家が直面する課題

**価格の不安定さ**
コモディティコーヒー市場はニューヨーク商品取引所（NYMEX）の先物価格に左右され、農家は長期的な収入見通しが立てにくい状況です。

**気候変動**
気温上昇による病害虫の増加、降水パターンの変化が収穫量に影響。

**コーヒーさび病（ラ・ロヤ）**
葉に黄色・橙色の斑点ができる真菌性病害。中米などで深刻な被害。

### 解決への取り組み
- フェアトレード・直接貿易による適正価格保証
- 気候変動適応型農業技術の研究
- 農家コミュニティへの教育・インフラ投資`,
      orderIndex: 19,
      durationMinutes: 25,
      tags: JSON.stringify(["農家", "サステナビリティ", "社会課題"]),
    },
    {
      id: "lesson-a20",
      courseId: "course-advanced",
      title: "コーヒーの未来",
      content: `## コーヒーの未来

テクノロジーと文化の交差点で、コーヒーの世界は急速に進化しています。

### テクノロジーの革新

**精密農業**
ドローン・センサー・AIを活用した農園管理。最適な収穫タイミングを予測。

**発酵制御**
マイクロバイオーム研究による精製発酵の精密コントロール。

**焙煎のデジタル化**
AIが学習したプロファイルによる再現性の高い焙煎。

### 新しいコーヒー体験

**コーヒーとカクテル（スピリッツ）**
コーヒーリキュール・エスプレッソマティーニなどコーヒーを使ったカクテル文化の拡大。

**代替コーヒー**
食料問題・環境問題への対応として、コーヒーの木以外の植物原料を使ったコーヒー代替品の研究が進んでいます。

### 日本のコーヒー文化
サードウェーブの影響を受け、日本でも産地・品種・精製方法にこだわるスペシャルティカフェが急増。京都・東京・大阪を中心に世界水準のコーヒーが楽しめる環境が整いつつあります。`,
      orderIndex: 20,
      durationMinutes: 20,
      tags: JSON.stringify(["未来", "テクノロジー", "文化"]),
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

  type GlossaryCategory =
    | "bean"
    | "roast"
    | "brew"
    | "origin"
    | "taste"
    | "equipment"
    | "certification";

  const glossaryCategoryLabels: Record<GlossaryCategory, string> = {
    bean: "豆・品種",
    roast: "焙煎",
    brew: "抽出・ドリンク",
    origin: "産地・精製",
    taste: "味覚評価",
    equipment: "器具",
    certification: "認証・資格",
  };

  const makeGlossaryDescription = (
    term: string,
    termEn: string,
    category: GlossaryCategory,
    shortDescription: string,
    relatedTermIds: string[],
  ) => `## ${term} (${termEn})

${shortDescription}

### 分類
- カテゴリ: ${glossaryCategoryLabels[category]}

### 学習ポイント
- コーヒー学習では「${term}」を他の用語と関連づけて理解すると、抽出・焙煎・評価の理解が深まります。
- 現場では文脈によって意味のニュアンスが変わるため、実際のレシピやカッピングノートと合わせて覚えるのが効果的です。

${relatedTermIds.length > 0 ? `### 関連用語\n${relatedTermIds.map((id) => `- ${id.replace("term-", "")}`).join("\n")}` : "### 関連用語\n- なし"}`;

  const additionalGlossarySeedData: Array<{
    id: string;
    term: string;
    reading: string;
    termEn: string;
    category: GlossaryCategory;
    shortDescription: string;
    relatedTermIds?: string[];
  }> = [
    { id: "liberica", term: "リベリカ種", reading: "りべりかしゅ", termEn: "Liberica", category: "bean", shortDescription: "生産量が少なく、独特のスモーキーさと個性的な香りを持つ品種。", relatedTermIds: ["arabica", "robusta"] },
    { id: "geisha", term: "ゲイシャ種", reading: "げいしゃしゅ", termEn: "Geisha", category: "bean", shortDescription: "フローラルで華やかな香味を持つ高級品種。パナマで特に有名。", relatedTermIds: ["arabica"] },
    { id: "bourbon", term: "ブルボン種", reading: "ぶるぼんしゅ", termEn: "Bourbon", category: "bean", shortDescription: "甘さとバランスに優れたアラビカ系統の代表的品種。", relatedTermIds: ["arabica", "typica"] },
    { id: "typica", term: "ティピカ種", reading: "てぃぴかしゅ", termEn: "Typica", category: "bean", shortDescription: "多くのアラビカ品種の祖先にあたる古典的な品種。", relatedTermIds: ["arabica", "bourbon"] },
    { id: "caturra", term: "カトゥーラ種", reading: "かとぅーらしゅ", termEn: "Caturra", category: "bean", shortDescription: "ブルボンの突然変異から生まれた、樹高が低く管理しやすい品種。", relatedTermIds: ["bourbon", "catuai"] },
    { id: "catuai", term: "カトゥアイ種", reading: "かとぅあいしゅ", termEn: "Catuai", category: "bean", shortDescription: "ブラジルで広く栽培される、収量性と耐風性に優れた品種。", relatedTermIds: ["caturra", "mundo-novo"] },
    { id: "mundo-novo", term: "ムンドノーボ種", reading: "むんどのーぼしゅ", termEn: "Mundo Novo", category: "bean", shortDescription: "ブラジルで多く見られる高収量のアラビカ品種。", relatedTermIds: ["catuai", "bourbon"] },
    { id: "pacamara", term: "パカマラ種", reading: "ぱかまらしゅ", termEn: "Pacamara", category: "bean", shortDescription: "パカス種とマラゴジッペ種の交配による、大粒で個性的な風味の品種。", relatedTermIds: ["geisha"] },
    { id: "sl28", term: "SL28", reading: "えすえるにじゅうはち", termEn: "SL28", category: "bean", shortDescription: "ケニアを代表する高品質品種で、明るい酸味と果実感が特徴。", relatedTermIds: ["sl34"] },
    { id: "sl34", term: "SL34", reading: "えすえるさんじゅうよん", termEn: "SL34", category: "bean", shortDescription: "SL28と並びケニア品質を支える主要品種。しっかりしたボディを持つ。", relatedTermIds: ["sl28"] },
    { id: "castillo", term: "カスティージョ種", reading: "かすてぃーじょしゅ", termEn: "Castillo", category: "bean", shortDescription: "コロンビアで普及する、病害抵抗性と収量性を重視した品種。", relatedTermIds: ["arabica"] },
    { id: "heirloom", term: "ヘアルーム", reading: "へあるーむ", termEn: "Heirloom", category: "bean", shortDescription: "エチオピア在来種群を総称する呼び方で、多様な遺伝的背景を持つ。", relatedTermIds: ["arabica"] },
    { id: "peaberry", term: "ピーベリー", reading: "ぴーべりー", termEn: "Peaberry", category: "bean", shortDescription: "通常2粒入る果実に1粒だけ育つ丸豆。希少性と均一性で人気。", relatedTermIds: ["cherry"] },
    { id: "green-bean", term: "生豆", reading: "なままめ", termEn: "Green Bean", category: "bean", shortDescription: "焙煎前のコーヒー豆。品質管理と保管状態が最終品質に直結する。", relatedTermIds: ["roasting"] },
    { id: "cherry", term: "コーヒーチェリー", reading: "こーひーちぇりー", termEn: "Coffee Cherry", category: "bean", shortDescription: "コーヒーの果実全体を指す名称。熟度が風味品質に大きく影響する。", relatedTermIds: ["mucilage", "green-bean"] },
    { id: "parchment", term: "パーチメント", reading: "ぱーちめんと", termEn: "Parchment", category: "bean", shortDescription: "精製後の豆を包む薄皮、またはその状態の豆。乾燥・保管の指標になる。", relatedTermIds: ["green-bean"] },
    { id: "mucilage", term: "ミューシレージ", reading: "みゅーしれーじ", termEn: "Mucilage", category: "bean", shortDescription: "果肉除去後に残る粘質層。精製方法によって残し方が異なる。", relatedTermIds: ["washed-process", "natural-process"] },
    { id: "light-roast", term: "浅煎り", reading: "あさいり", termEn: "Light Roast", category: "roast", shortDescription: "果実感や酸味を残しやすい焙煎度。スペシャルティでよく用いられる。", relatedTermIds: ["roasting"] },
    { id: "cinnamon-roast", term: "シナモンロースト", reading: "しなもんろーすと", termEn: "Cinnamon Roast", category: "roast", shortDescription: "ごく浅い焙煎度で、豆の個性と明るい酸味が際立つ。", relatedTermIds: ["light-roast"] },
    { id: "medium-roast", term: "中煎り", reading: "なかいり", termEn: "Medium Roast", category: "roast", shortDescription: "酸味・甘み・苦味のバランスが良く、多くの人に親しまれる焙煎度。", relatedTermIds: ["light-roast", "dark-roast"] },
    { id: "city-roast", term: "シティロースト", reading: "してぃろーすと", termEn: "City Roast", category: "roast", shortDescription: "中煎り寄りの焙煎度で、甘さと香ばしさの均衡が良い。", relatedTermIds: ["medium-roast"] },
    { id: "full-city-roast", term: "フルシティロースト", reading: "ふるしてぃろーすと", termEn: "Full City Roast", category: "roast", shortDescription: "中深煎りにあたり、コクと香ばしさが強まる焙煎度。", relatedTermIds: ["city-roast", "dark-roast"] },
    { id: "dark-roast", term: "深煎り", reading: "ふかいり", termEn: "Dark Roast", category: "roast", shortDescription: "苦味やロースト感が強く、重厚な味わいになりやすい焙煎度。", relatedTermIds: ["roasting"] },
    { id: "french-roast", term: "フレンチロースト", reading: "ふれんちろーすと", termEn: "French Roast", category: "roast", shortDescription: "かなり深い焙煎で、スモーキーさと強いビター感が特徴。", relatedTermIds: ["dark-roast"] },
    { id: "italian-roast", term: "イタリアンロースト", reading: "いたりあんろーすと", termEn: "Italian Roast", category: "roast", shortDescription: "最深煎りに近い焙煎度で、エスプレッソ文化と相性が良い。", relatedTermIds: ["dark-roast", "espresso"] },
    { id: "roast-profile", term: "焙煎プロファイル", reading: "ばいせんぷろふぁいる", termEn: "Roast Profile", category: "roast", shortDescription: "焙煎中の温度変化や時間配分を記録した設計図。", relatedTermIds: ["roasting"] },
    { id: "development-time", term: "デベロップメントタイム", reading: "でべろっぷめんとたいむ", termEn: "Development Time", category: "roast", shortDescription: "ファーストクラック後から排出までの時間。風味の完成度に関わる。", relatedTermIds: ["first-crack"] },
    { id: "charge-temperature", term: "投入温度", reading: "とうにゅうおんど", termEn: "Charge Temperature", category: "roast", shortDescription: "焙煎釜に生豆を投入する時点の温度。立ち上がりを左右する。", relatedTermIds: ["roast-profile"] },
    { id: "turning-point", term: "ターニングポイント", reading: "たーにんぐぽいんと", termEn: "Turning Point", category: "roast", shortDescription: "投入後に豆温度の下降が止まり、上昇へ転じる地点。", relatedTermIds: ["roast-profile"] },
    { id: "rate-of-rise", term: "RoR", reading: "あーおーあーる", termEn: "Rate of Rise", category: "roast", shortDescription: "焙煎中の温度上昇速度。焙煎コントロールの要となる指標。", relatedTermIds: ["roast-profile"] },
    { id: "first-crack", term: "ファーストクラック", reading: "ふぁーすとくらっく", termEn: "First Crack", category: "roast", shortDescription: "焙煎中に豆内部の圧力で最初に弾ける現象。浅煎りの目安になる。", relatedTermIds: ["second-crack", "roasting"] },
    { id: "second-crack", term: "セカンドクラック", reading: "せかんどくらっく", termEn: "Second Crack", category: "roast", shortDescription: "深煎り帯で起こる二度目の破裂音。油分が表面に出やすくなる。", relatedTermIds: ["first-crack"] },
    { id: "americano", term: "アメリカーノ", reading: "あめりかーの", termEn: "Americano", category: "brew", shortDescription: "エスプレッソをお湯で割った、軽やかに飲めるドリンク。", relatedTermIds: ["espresso"] },
    { id: "macchiato", term: "マキアート", reading: "まきあーと", termEn: "Macchiato", category: "brew", shortDescription: "エスプレッソに少量のフォームミルクをのせたドリンク。", relatedTermIds: ["espresso", "latte"] },
    { id: "cortado", term: "コルタード", reading: "こるたーど", termEn: "Cortado", category: "brew", shortDescription: "エスプレッソと温めたミルクをほぼ同量で合わせたスペイン系ドリンク。", relatedTermIds: ["latte", "espresso"] },
    { id: "flat-white", term: "フラットホワイト", reading: "ふらっとほわいと", termEn: "Flat White", category: "brew", shortDescription: "エスプレッソにきめ細かなミルクを合わせた、オセアニア発祥のドリンク。", relatedTermIds: ["latte", "cappuccino"] },
    { id: "mocha", term: "カフェモカ", reading: "かふぇもか", termEn: "Caffè Mocha", category: "brew", shortDescription: "エスプレッソとチョコレート、ミルクを合わせた甘いアレンジドリンク。", relatedTermIds: ["latte", "espresso"] },
    { id: "aeropress", term: "エアロプレス", reading: "えあろぷれす", termEn: "AeroPress", category: "brew", shortDescription: "空気圧を利用して短時間で抽出する携帯性の高い器具。", relatedTermIds: ["extraction"] },
    { id: "syphon", term: "サイフォン", reading: "さいふぉん", termEn: "Syphon", category: "brew", shortDescription: "蒸気圧と真空を利用して抽出する、見た目にも特徴的な器具。", relatedTermIds: ["extraction"] },
    { id: "french-press", term: "フレンチプレス", reading: "ふれんちぷれす", termEn: "French Press", category: "brew", shortDescription: "金属フィルターで浸漬抽出するため、ボディが豊かに出やすい器具。", relatedTermIds: ["body"] },
    { id: "cold-brew", term: "コールドブリュー", reading: "こーるどぶりゅー", termEn: "Cold Brew", category: "brew", shortDescription: "低温で長時間抽出し、まろやかな味わいを得る方法。", relatedTermIds: ["extraction"] },
    { id: "moka-pot", term: "モカポット", reading: "もかぽっと", termEn: "Moka Pot", category: "brew", shortDescription: "直火式で蒸気圧を用いて抽出する家庭用エスプレッソ器具。", relatedTermIds: ["espresso"] },
    { id: "chemex", term: "ケメックス", reading: "けめっくす", termEn: "Chemex", category: "brew", shortDescription: "厚手の専用フィルターでクリーンな味を出しやすいドリッパー。", relatedTermIds: ["pour-over"] },
    { id: "nel-drip", term: "ネルドリップ", reading: "ねるどりっぷ", termEn: "Nel Drip", category: "brew", shortDescription: "布フィルターを使い、滑らかな口当たりを引き出す抽出方法。", relatedTermIds: ["pour-over"] },
    { id: "batch-brew", term: "バッチブリュー", reading: "ばっちぶりゅー", termEn: "Batch Brew", category: "brew", shortDescription: "業務用ブリューワーで一定量をまとめて抽出する方法。", relatedTermIds: ["pour-over"] },
    { id: "bypass", term: "バイパス", reading: "ばいぱす", termEn: "Bypass", category: "brew", shortDescription: "濃く抽出した液に後から湯や水を足して濃度を調整する手法。", relatedTermIds: ["extraction"] },
    { id: "extraction", term: "抽出", reading: "ちゅうしゅつ", termEn: "Extraction", category: "brew", shortDescription: "コーヒー粉から可溶性成分を取り出す工程全体。", relatedTermIds: ["tds", "extraction-yield"] },
    { id: "tds", term: "TDS", reading: "てぃーでぃーえす", termEn: "Total Dissolved Solids", category: "brew", shortDescription: "液体中に溶けている成分量を示す濃度指標。", relatedTermIds: ["extraction-yield"] },
    { id: "extraction-yield", term: "抽出収率", reading: "ちゅうしゅつしゅうりつ", termEn: "Extraction Yield", category: "brew", shortDescription: "粉から何％の成分が液体に移ったかを示す抽出効率の指標。", relatedTermIds: ["tds", "extraction"] },
    { id: "brew-ratio", term: "レシオ", reading: "れしお", termEn: "Brew Ratio", category: "brew", shortDescription: "コーヒー粉量と湯量の比率。レシピ設計の基準になる。", relatedTermIds: ["extraction"] },
    { id: "agitation", term: "攪拌", reading: "かくはん", termEn: "Agitation", category: "brew", shortDescription: "抽出中に粉と湯の接触を均一化するための揺らしや混ぜの操作。", relatedTermIds: ["extraction"] },
    { id: "channeling", term: "チャネリング", reading: "ちゃねりんぐ", termEn: "Channeling", category: "brew", shortDescription: "お湯が一部だけを通り抜け、抽出が不均一になる現象。", relatedTermIds: ["espresso", "extraction"] },
    { id: "honey-process", term: "ハニープロセス", reading: "はにーぷろせす", termEn: "Honey Process", category: "origin", shortDescription: "ミューシレージを一部残したまま乾燥させ、甘さを引き出す精製方法。", relatedTermIds: ["washed-process", "natural-process"] },
    { id: "pulped-natural", term: "パルプドナチュラル", reading: "ぱるぷどなちゅらる", termEn: "Pulped Natural", category: "origin", shortDescription: "果皮を除去してから粘質層を残して乾燥させるブラジル系の精製方法。", relatedTermIds: ["natural-process", "honey-process"] },
    { id: "anaerobic", term: "アナエロビック発酵", reading: "あなえろびっくはっこう", termEn: "Anaerobic Fermentation", category: "origin", shortDescription: "酸素を遮断した環境で発酵させ、個性的な香味を狙う処理。", relatedTermIds: ["carbonic-maceration"] },
    { id: "carbonic-maceration", term: "カーボニックマセレーション", reading: "かーぼにっくませれーしょん", termEn: "Carbonic Maceration", category: "origin", shortDescription: "二酸化炭素環境で発酵させる、ワイン由来の発酵アプローチ。", relatedTermIds: ["anaerobic"] },
    { id: "micro-lot", term: "マイクロロット", reading: "まいくろろっと", termEn: "Microlot", category: "origin", shortDescription: "特定区画や特定収穫日に限定した少量高品質ロット。", relatedTermIds: ["nano-lot", "single-origin"] },
    { id: "nano-lot", term: "ナノロット", reading: "なのろっと", termEn: "Nanolot", category: "origin", shortDescription: "マイクロロットよりさらに小規模で希少性の高いロット。", relatedTermIds: ["micro-lot"] },
    { id: "direct-trade", term: "ダイレクトトレード", reading: "だいれくととれーど", termEn: "Direct Trade", category: "origin", shortDescription: "買い手と生産者が直接関係を築いて取引する調達形態。", relatedTermIds: ["fair-trade", "traceability"] },
    { id: "shade-grown", term: "シェードグロウン", reading: "しぇーどぐろうん", termEn: "Shade Grown", category: "origin", shortDescription: "木陰環境で育てる栽培方法。生態系保全や成熟の遅さによる品質向上が期待される。", relatedTermIds: ["bird-friendly"] },
    { id: "high-grown", term: "ハイグロウン", reading: "はいぐろうん", termEn: "High Grown", category: "origin", shortDescription: "高標高で栽培されたコーヒーを指し、密度の高い豆になりやすい。", relatedTermIds: ["altitude", "terroir"] },
    { id: "single-origin", term: "シングルオリジン", reading: "しんぐるおりじん", termEn: "Single Origin", category: "origin", shortDescription: "単一の国・地域・農園などに由来するコーヒー。産地個性を楽しみやすい。", relatedTermIds: ["estate"] },
    { id: "estate", term: "エステート", reading: "えすてーと", termEn: "Estate", category: "origin", shortDescription: "単一農園由来であることを示す表現。トレーサビリティの一形態。", relatedTermIds: ["single-origin", "traceability"] },
    { id: "farm-gate", term: "ファームゲート価格", reading: "ふぁーむげーとかかく", termEn: "Farm Gate Price", category: "origin", shortDescription: "農家の出荷地点で支払われる原料価格。生産者収益を考える重要指標。", relatedTermIds: ["direct-trade"] },
    { id: "harvest-season", term: "収穫期", reading: "しゅうかくき", termEn: "Harvest Season", category: "origin", shortDescription: "地域ごとの収穫時期。鮮度やニュークロップの入荷タイミングに影響する。", relatedTermIds: ["traceability"] },
    { id: "altitude", term: "標高", reading: "ひょうこう", termEn: "Altitude", category: "origin", shortDescription: "栽培地の高さ。成熟速度や酸味、豆の密度に影響する重要要素。", relatedTermIds: ["terroir", "high-grown"] },
    { id: "traceability", term: "トレーサビリティ", reading: "とれーさびりてぃ", termEn: "Traceability", category: "origin", shortDescription: "生産地や農園、流通経路を追跡できる状態。品質保証と信頼性に関わる。", relatedTermIds: ["single-origin", "specialty"] },
    { id: "acidity", term: "酸味", reading: "さんみ", termEn: "Acidity", category: "taste", shortDescription: "コーヒーに明るさや立体感を与える味覚要素。良い酸は果実感として感じられる。", relatedTermIds: ["balance"] },
    { id: "sweetness", term: "甘み", reading: "あまみ", termEn: "Sweetness", category: "taste", shortDescription: "熟度や抽出の適正さを示す重要な感覚。砂糖様・果実様の印象として現れる。", relatedTermIds: ["balance"] },
    { id: "bitterness", term: "苦味", reading: "にがみ", termEn: "Bitterness", category: "taste", shortDescription: "焙煎や抽出条件により増減する味覚要素。過多だと重さや渋さにつながる。", relatedTermIds: ["balance"] },
    { id: "body", term: "ボディ", reading: "ぼでぃ", termEn: "Body", category: "taste", shortDescription: "口当たりの重さや質感を表す評価項目。粘性や厚みに近い印象。", relatedTermIds: ["mouthfeel"] },
    { id: "aftertaste", term: "アフターテイスト", reading: "あふたーていすと", termEn: "Aftertaste", category: "taste", shortDescription: "飲み込んだ後に残る風味の質と長さを示す評価項目。", relatedTermIds: ["finish"] },
    { id: "balance", term: "バランス", reading: "ばらんす", termEn: "Balance", category: "taste", shortDescription: "酸味・甘み・苦味・ボディなどが調和している状態。", relatedTermIds: ["acidity", "sweetness", "bitterness"] },
    { id: "clarity", term: "クラリティ", reading: "くらりてぃ", termEn: "Clarity", category: "taste", shortDescription: "風味の輪郭がはっきりしていて濁りの少ない印象。", relatedTermIds: ["clean-cup"] },
    { id: "clean-cup", term: "クリーンカップ", reading: "くりーんかっぷ", termEn: "Clean Cup", category: "taste", shortDescription: "雑味や欠点風味がなく、透明感のある味わいを示す評価。", relatedTermIds: ["clarity", "cupping"] },
    { id: "complexity", term: "複雑性", reading: "ふくざつせい", termEn: "Complexity", category: "taste", shortDescription: "多層的な香味要素が折り重なる度合い。スペシャルティ評価で重視される。", relatedTermIds: ["flavor"] },
    { id: "uniformity", term: "ユニフォーミティ", reading: "ゆにふぉーみてぃ", termEn: "Uniformity", category: "taste", shortDescription: "複数カップ間で味が揃っているかを見るカッピング項目。", relatedTermIds: ["cupping"] },
    { id: "fragrance", term: "フレグランス", reading: "ふれぐらんす", termEn: "Fragrance", category: "taste", shortDescription: "粉の状態で感じる乾いた香り。ドライアロマとも呼ばれる。", relatedTermIds: ["aroma"] },
    { id: "aroma", term: "アロマ", reading: "あろま", termEn: "Aroma", category: "taste", shortDescription: "お湯を注いだ後や口中で感じる香りの総称。", relatedTermIds: ["fragrance"] },
    { id: "flavor", term: "フレーバー", reading: "ふれーばー", termEn: "Flavor", category: "taste", shortDescription: "味覚と嗅覚が統合された総合的な風味印象。", relatedTermIds: ["aroma", "aftertaste"] },
    { id: "mouthfeel", term: "マウスフィール", reading: "まうすふぃーる", termEn: "Mouthfeel", category: "taste", shortDescription: "液体の質感や触感を表す言葉。ボディより広い概念として使われる。", relatedTermIds: ["body"] },
    { id: "finish", term: "フィニッシュ", reading: "ふぃにっしゅ", termEn: "Finish", category: "taste", shortDescription: "後味が消えていくまでの印象や余韻のまとまり。", relatedTermIds: ["aftertaste"] },
    { id: "dripper", term: "ドリッパー", reading: "どりっぱー", termEn: "Dripper", category: "equipment", shortDescription: "ハンドドリップで粉とフィルターを支える抽出器具。", relatedTermIds: ["pour-over"] },
    { id: "kettle", term: "ケトル", reading: "けとる", termEn: "Kettle", category: "equipment", shortDescription: "抽出用の湯を沸かし、注湯のしやすさに関わる器具。", relatedTermIds: ["gooseneck-kettle"] },
    { id: "scale", term: "スケール", reading: "すけーる", termEn: "Scale", category: "equipment", shortDescription: "粉量・湯量・時間を正確に測るための計量器。", relatedTermIds: ["brew-ratio"] },
    { id: "tamper", term: "タンパー", reading: "たんぱー", termEn: "Tamper", category: "equipment", shortDescription: "エスプレッソ粉を均一に押し固めるための器具。", relatedTermIds: ["portafilter", "espresso"] },
    { id: "portafilter", term: "ポルタフィルター", reading: "ぽるたふぃるたー", termEn: "Portafilter", category: "equipment", shortDescription: "エスプレッソマシンに装着する抽出ハンドル。", relatedTermIds: ["tamper", "espresso-machine"] },
    { id: "espresso-machine", term: "エスプレッソマシン", reading: "えすぷれっそましん", termEn: "Espresso Machine", category: "equipment", shortDescription: "高圧でエスプレッソを抽出する専用機械。", relatedTermIds: ["espresso", "portafilter"] },
    { id: "gooseneck-kettle", term: "細口ケトル", reading: "ほそぐちけとる", termEn: "Gooseneck Kettle", category: "equipment", shortDescription: "注湯量や速度を細かくコントロールしやすいケトル。", relatedTermIds: ["kettle", "pour-over"] },
    { id: "server", term: "サーバー", reading: "さーばー", termEn: "Server", category: "equipment", shortDescription: "抽出したコーヒー液を受ける容器。提供量の確認にも役立つ。", relatedTermIds: ["dripper"] },
    { id: "filter-paper", term: "ペーパーフィルター", reading: "ぺーぱーふぃるたー", termEn: "Paper Filter", category: "equipment", shortDescription: "微粉や油分をある程度除去し、クリーンな味を得やすい濾紙。", relatedTermIds: ["dripper"] },
    { id: "burr-grinder", term: "バリグラインダー", reading: "ばりぐらいんだー", termEn: "Burr Grinder", category: "equipment", shortDescription: "均一な粒度で挽きやすいグラインダー方式。", relatedTermIds: ["grinder"] },
    { id: "refractometer", term: "屈折計", reading: "くっせつけい", termEn: "Refractometer", category: "equipment", shortDescription: "抽出液のTDSを測定するための器具。抽出の再現性向上に役立つ。", relatedTermIds: ["tds", "extraction-yield"] },
    { id: "cupping-spoon", term: "カッピングスプーン", reading: "かっぴんぐすぷーん", termEn: "Cupping Spoon", category: "equipment", shortDescription: "カッピング時にすするための丸みを持つ専用スプーン。", relatedTermIds: ["cupping"] },
    { id: "cupping-bowl", term: "カッピングボウル", reading: "かっぴんぐぼうる", termEn: "Cupping Bowl", category: "equipment", shortDescription: "カッピングでサンプルを評価するための規格化されたカップ。", relatedTermIds: ["cupping"] },
    { id: "knock-box", term: "ノックボックス", reading: "のっくぼっくす", termEn: "Knock Box", category: "equipment", shortDescription: "抽出後のエスプレッソかすを捨てるためのバリスタ用器具。", relatedTermIds: ["espresso-machine", "portafilter"] },
    { id: "fair-trade", term: "フェアトレード", reading: "ふぇあとれーど", termEn: "Fair Trade", category: "certification", shortDescription: "生産者に対する公正な価格や労働環境を重視する認証制度。", relatedTermIds: ["direct-trade"] },
    { id: "organic", term: "オーガニック認証", reading: "おーがにっくにんしょう", termEn: "Organic Certification", category: "certification", shortDescription: "有機栽培基準を満たした農産物に与えられる認証。", relatedTermIds: [] },
    { id: "rainforest-alliance", term: "レインフォレスト・アライアンス", reading: "れいんふぉれすとあらいあんす", termEn: "Rainforest Alliance", category: "certification", shortDescription: "森林保全や労働環境など持続可能性を重視する認証。", relatedTermIds: [] },
    { id: "q-grader", term: "Qグレーダー", reading: "きゅーぐれーだー", termEn: "Q Grader", category: "certification", shortDescription: "CQIが認定するコーヒー品質評価者資格。", relatedTermIds: ["cqi", "cupping"] },
    { id: "cup-of-excellence", term: "カップオブエクセレンス", reading: "かっぷおぶえくせれんす", termEn: "Cup of Excellence", category: "certification", shortDescription: "各国の優れたコーヒーを選出する国際的な品評会。", relatedTermIds: ["specialty"] },
    { id: "sca", term: "SCA", reading: "えすしーえー", termEn: "Specialty Coffee Association", category: "certification", shortDescription: "スペシャルティコーヒーの教育・競技・基準策定を担う国際団体。", relatedTermIds: ["specialty", "cupping"] },
    { id: "cqi", term: "CQI", reading: "しーきゅーあい", termEn: "Coffee Quality Institute", category: "certification", shortDescription: "Qグレーダー認定などを通じて品質教育を推進する団体。", relatedTermIds: ["q-grader"] },
    { id: "bird-friendly", term: "バードフレンドリー", reading: "ばーどふれんどりー", termEn: "Bird Friendly", category: "certification", shortDescription: "渡り鳥の生息環境に配慮したシェードグロウン認証。", relatedTermIds: ["shade-grown"] },
    { id: "barista-skills", term: "バリスタスキルズ", reading: "ばりすたすきるず", termEn: "Barista Skills", category: "certification", shortDescription: "SCA教育プログラムの一つで、抽出・ミルク・サービス技術を学ぶ。", relatedTermIds: ["sca"] },
    { id: "roasting-foundation", term: "ロースティング基礎", reading: "ろーすてぃんぐきそ", termEn: "Roasting Foundation", category: "certification", shortDescription: "焙煎理論と基本操作を学ぶ教育モジュール。", relatedTermIds: ["sca", "roasting"] },
    { id: "sensory-foundation", term: "センサリー基礎", reading: "せんさりーきそ", termEn: "Sensory Foundation", category: "certification", shortDescription: "味覚・嗅覚・評価表現の基礎を学ぶセンサリー教育モジュール。", relatedTermIds: ["cupping", "sca"] },
  ];

  const additionalGlossaryTerms = additionalGlossarySeedData.map(({ id, relatedTermIds = [], ...entry }) => ({
    ...entry,
    id: `term-${id}`,
    description: makeGlossaryDescription(
      entry.term,
      entry.termEn,
      entry.category,
      entry.shortDescription,
      relatedTermIds.map((relatedId) => `term-${relatedId}`),
    ),
    relatedTermIds: JSON.stringify(relatedTermIds.map((relatedId) => `term-${relatedId}`)),
  }));

  const makeOriginDescription = (
    name: string,
    summary: string,
    flavorTags: string[],
    altitude: string,
    varieties: string[],
    processingMethods: string[],
  ) => `## ${name}

${summary}

### 産地の特徴
- 標高: ${altitude}
- 主な品種: ${varieties.join("、")}
- 主な精製方法: ${processingMethods.join("、")}

### 代表的な風味
${flavorTags.map((tag) => `- ${tag}`).join("\n")}`;

  const additionalOriginSeedData = [
    { id: "origin-rwanda-huye", name: "ルワンダ・フエ", nameEn: "Rwanda Huye", continent: "Africa", countryCode: "RW", flavorTags: ["オレンジ", "ブラックティー", "ブラウンシュガー", "クリーン"], altitude: "1,700〜2,100m", annualProduction: "約30万袋", varieties: ["レッドブルボン"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇷🇼", summary: "ルワンダ南部のフエ地区は、透明感のある酸味と上品な甘さで知られる高地産地です。" },
    { id: "origin-burundi-kayanza", name: "ブルンジ・カヤンザ", nameEn: "Burundi Kayanza", continent: "Africa", countryCode: "BI", flavorTags: ["プラム", "シトラス", "黒糖", "スパイス"], altitude: "1,700〜2,000m", annualProduction: "約20万袋", varieties: ["ブルボン"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇧🇮", summary: "ブルンジ北部の高地で、凝縮感のある果実味と甘さを備えたコーヒーが多く生産されます。" },
    { id: "origin-tanzania-kilimanjaro", name: "タンザニア・キリマンジャロ", nameEn: "Tanzania Kilimanjaro", continent: "Africa", countryCode: "TZ", flavorTags: ["カシス", "グレープフルーツ", "チョコレート", "ジューシー"], altitude: "1,200〜1,900m", annualProduction: "約80万袋", varieties: ["ブルボン", "N39", "ケント"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇹🇿", summary: "キリマンジャロ山麓では火山性土壌と高地環境を活かした華やかなカップが生まれます。" },
    { id: "origin-uganda-bugisu", name: "ウガンダ・ブギス", nameEn: "Uganda Bugisu", continent: "Africa", countryCode: "UG", flavorTags: ["ダークチョコ", "ドライフルーツ", "スパイス", "重厚"], altitude: "1,300〜2,200m", annualProduction: "約400万袋", varieties: ["SL14", "SL28", "在来種"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇺🇬", summary: "エルゴン山周辺のブギスは、ウガンダの中でもアラビカ高地栽培で名高い地域です。" },
    { id: "origin-cameroon-bamenda", name: "カメルーン・バメンダ", nameEn: "Cameroon Bamenda", continent: "Africa", countryCode: "CM", flavorTags: ["カカオ", "赤い果実", "ハーブ", "マイルド"], altitude: "1,200〜1,800m", annualProduction: "約15万袋", varieties: ["ジャバ", "ブルボン"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇨🇲", summary: "カメルーン西部高原のバメンダは、近年スペシャルティ市場で注目が高まる産地です。" },
    { id: "origin-yemen-haraz", name: "イエメン・ハラーズ", nameEn: "Yemen Haraz", continent: "Asia", countryCode: "YE", flavorTags: ["ワイン", "ドライフルーツ", "シナモン", "カカオ"], altitude: "1,800〜2,400m", annualProduction: "約10万袋", varieties: ["イエメニア", "在来種"], processingMethods: ["ナチュラル"], thumbnailEmoji: "🇾🇪", summary: "断崖の段々畑で育つイエメンの伝統産地で、凝縮感と異国的なスパイス感が魅力です。" },
    { id: "origin-indonesia-sumatra", name: "インドネシア・スマトラ", nameEn: "Indonesia Sumatra", continent: "Asia", countryCode: "ID", flavorTags: ["アーシー", "ハーブ", "ダークチョコ", "重厚"], altitude: "1,000〜1,600m", annualProduction: "約600万袋", varieties: ["ティムティム", "アテン", "シガラルタン"], processingMethods: ["スマトラ式", "ナチュラル"], thumbnailEmoji: "🇮🇩", summary: "独特のスマトラ式精製により、厚みのあるボディと土っぽい個性を持つ産地です。" },
    { id: "origin-indonesia-toraja", name: "インドネシア・トラジャ", nameEn: "Indonesia Toraja", continent: "Asia", countryCode: "ID", flavorTags: ["スパイス", "ビターチョコ", "シダー", "シロップ感"], altitude: "1,100〜1,900m", annualProduction: "約25万袋", varieties: ["ティピカ", "S795"], processingMethods: ["スマトラ式", "ウォッシュト"], thumbnailEmoji: "🇮🇩", summary: "スラウェシ島のトラジャ高地は、深みと複雑性を備えた伝統的な産地として知られます。" },
    { id: "origin-india-bababudangiri", name: "インド・ババブダンギリ", nameEn: "India Baba Budangiri", continent: "Asia", countryCode: "IN", flavorTags: ["スパイス", "ナッツ", "カカオ", "穏やかな酸味"], altitude: "1,000〜1,600m", annualProduction: "約25万袋", varieties: ["S795", "ケント", "カヴェリ"], processingMethods: ["ウォッシュト", "モンスーン"], thumbnailEmoji: "🇮🇳", summary: "インド南部カルナータカ州の歴史ある産地で、スパイス感を持つ穏やかな風味が特徴です。" },
    { id: "origin-papua-new-guinea-eastern-highlands", name: "パプアニューギニア・イースタンハイランド", nameEn: "Papua New Guinea Eastern Highlands", continent: "Asia", countryCode: "PG", flavorTags: ["トロピカルフルーツ", "黒糖", "ハーブ", "ジューシー"], altitude: "1,400〜1,900m", annualProduction: "約100万袋", varieties: ["ティピカ", "アルーシャ", "ブルボン"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇵🇬", summary: "小規模農家が多く、クリーンでトロピカルな香味を持つ豆が産出されます。" },
    { id: "origin-laos-bolaven", name: "ラオス・ボラベン高原", nameEn: "Laos Bolaven Plateau", continent: "Asia", countryCode: "LA", flavorTags: ["チョコレート", "オレンジ", "ハーブ", "ソフト"], altitude: "1,000〜1,350m", annualProduction: "約50万袋", varieties: ["カトゥアイ", "ティピカ"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇱🇦", summary: "ラオス南部の火山性高原で、穏やかな甘さと飲みやすさを持つコーヒーが育ちます。" },
    { id: "origin-thailand-chiang-rai", name: "タイ・チェンライ", nameEn: "Thailand Chiang Rai", continent: "Asia", countryCode: "TH", flavorTags: ["黄桃", "蜂蜜", "フローラル", "クリーン"], altitude: "1,200〜1,600m", annualProduction: "約20万袋", varieties: ["カトゥアイ", "ブルボン", "ゲイシャ"], processingMethods: ["ウォッシュト", "ハニー", "アナエロビック"], thumbnailEmoji: "🇹🇭", summary: "北タイの山岳地帯で品質向上が進み、華やかなスペシャルティが増えている新興産地です。" },
    { id: "origin-honduras-marcala", name: "ホンジュラス・マルカラ", nameEn: "Honduras Marcala", continent: "Central America", countryCode: "HN", flavorTags: ["キャラメル", "オレンジ", "カカオ", "バランス"], altitude: "1,300〜1,700m", annualProduction: "約700万袋", varieties: ["カトゥアイ", "レンピラ", "パカス"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇭🇳", summary: "ホンジュラスを代表する高地産地で、安定した甘さと酸味のバランスを持つ豆が多いです。" },
    { id: "origin-el-salvador-santa-ana", name: "エルサルバドル・サンタアナ", nameEn: "El Salvador Santa Ana", continent: "Central America", countryCode: "SV", flavorTags: ["赤リンゴ", "ミルクチョコ", "ナッツ", "なめらか"], altitude: "1,200〜1,800m", annualProduction: "約60万袋", varieties: ["ブルボン", "パカス", "パカマラ"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇸🇻", summary: "サンタアナ火山周辺は、甘く滑らかな口当たりを持つ中米らしいコーヒーの名産地です。" },
    { id: "origin-mexico-chiapas", name: "メキシコ・チアパス", nameEn: "Mexico Chiapas", continent: "Central America", countryCode: "MX", flavorTags: ["ナッツ", "ココア", "柑橘", "クリーン"], altitude: "1,000〜1,700m", annualProduction: "約350万袋", varieties: ["ティピカ", "ブルボン", "カトゥアイ"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇲🇽", summary: "メキシコ南部チアパス州では、有機栽培や協同組合による生産が盛んです。" },
    { id: "origin-peru-cajamarca", name: "ペルー・カハマルカ", nameEn: "Peru Cajamarca", continent: "South America", countryCode: "PE", flavorTags: ["ブラウンシュガー", "プラム", "カカオ", "やわらかい酸味"], altitude: "1,200〜2,000m", annualProduction: "約400万袋", varieties: ["カトゥーラ", "ブルボン", "ティピカ"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇵🇪", summary: "ペルー北部の主要産地で、有機認証豆や高地マイクロロットが多く見られます。" },
    { id: "origin-panama-boquete", name: "パナマ・ボケテ", nameEn: "Panama Boquete", continent: "Central America", countryCode: "PA", flavorTags: ["ジャスミン", "ベルガモット", "シトラス", "エレガント"], altitude: "1,400〜2,000m", annualProduction: "約10万袋", varieties: ["ゲイシャ", "カトゥアイ", "ティピカ"], processingMethods: ["ウォッシュト", "ナチュラル", "アナエロビック"], thumbnailEmoji: "🇵🇦", summary: "ボルカン・バル火山周辺のボケテは、ゲイシャ種で世界的な名声を得た産地です。" },
    { id: "origin-nicaragua-jinotega", name: "ニカラグア・ヒノテガ", nameEn: "Nicaragua Jinotega", continent: "Central America", countryCode: "NI", flavorTags: ["キャラメル", "オレンジ", "ナッツ", "マイルド"], altitude: "1,000〜1,700m", annualProduction: "約250万袋", varieties: ["カトゥアイ", "カトゥーラ", "マラカツーラ"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇳🇮", summary: "中米らしい親しみやすさと甘さを持ち、近年は高品質ロットも増えている産地です。" },
    { id: "origin-bolivia-caranavi", name: "ボリビア・カラナビ", nameEn: "Bolivia Caranavi", continent: "South America", countryCode: "BO", flavorTags: ["オレンジ", "赤い果実", "蜂蜜", "シルキー"], altitude: "1,300〜1,800m", annualProduction: "約10万袋", varieties: ["カトゥアイ", "ティピカ", "ゲイシャ"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇧🇴", summary: "ラパス近郊の高地で、華やかな風味を持つ少量生産のスペシャルティが注目されています。" },
    { id: "origin-jamaica-blue-mountain", name: "ジャマイカ・ブルーマウンテン", nameEn: "Jamaica Blue Mountain", continent: "Other", countryCode: "JM", flavorTags: ["ミルクチョコ", "ハーブ", "ナッツ", "上品"], altitude: "900〜1,700m", annualProduction: "約2万袋", varieties: ["ティピカ"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇯🇲", summary: "世界的な高級ブランドとして知られ、滑らかで穏やかな味わいが評価されています。" },
    { id: "origin-haiti-thiomonde", name: "ハイチ・ティオモンド", nameEn: "Haiti Thiomonde", continent: "Other", countryCode: "HT", flavorTags: ["ココア", "スパイス", "柑橘", "やさしい甘さ"], altitude: "900〜1,400m", annualProduction: "約35万袋", varieties: ["ティピカ", "ブルボン"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇭🇹", summary: "カリブ海産地らしい柔らかな風味を持ち、復興支援文脈でも注目される地域です。" },
    { id: "origin-dominican-republic-barahona", name: "ドミニカ共和国・バラオナ", nameEn: "Dominican Republic Barahona", continent: "Other", countryCode: "DO", flavorTags: ["キャラメル", "柑橘", "アーモンド", "クリーン"], altitude: "900〜1,500m", annualProduction: "約50万袋", varieties: ["ティピカ", "カトゥーラ"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇩🇴", summary: "カリブ海を望む山岳地帯で、やさしい甘さとクリーンさを持つ豆が育ちます。" },
    { id: "origin-ecuador-loja", name: "エクアドル・ロハ", nameEn: "Ecuador Loja", continent: "South America", countryCode: "EC", flavorTags: ["フローラル", "みかん", "蜂蜜", "ティーライク"], altitude: "1,400〜2,100m", annualProduction: "約20万袋", varieties: ["ティピカ", "カトゥーラ", "ロハ在来"], processingMethods: ["ウォッシュト", "ナチュラル"], thumbnailEmoji: "🇪🇨", summary: "南エクアドルの高地で、華やかさとティーライクな質感を併せ持つ豆が増えています。" },
    { id: "origin-venezuela-merida", name: "ベネズエラ・メリダ", nameEn: "Venezuela Merida", continent: "South America", countryCode: "VE", flavorTags: ["チョコレート", "赤リンゴ", "ナッツ", "甘い余韻"], altitude: "1,200〜1,800m", annualProduction: "約50万袋", varieties: ["ティピカ", "ブルボン", "カトゥーラ"], processingMethods: ["ウォッシュト"], thumbnailEmoji: "🇻🇪", summary: "アンデス山脈沿いの高地で、落ち着いた甘さと穏やかな酸味の豆が生産されます。" },
    { id: "origin-costa-rica-tarrazu", name: "コスタリカ・タラス", nameEn: "Costa Rica Tarrazu", continent: "Central America", countryCode: "CR", flavorTags: ["オレンジ", "蜂蜜", "アプリコット", "クリア"], altitude: "1,200〜1,900m", annualProduction: "約140万袋", varieties: ["カトゥアイ", "カトゥーラ", "ビジャサルチ"], processingMethods: ["ウォッシュト", "ハニー"], thumbnailEmoji: "🇨🇷", summary: "中米屈指の品質産地で、明るい酸味と透明感のある甘さを持つコーヒーで有名です。" },
  ];

  const additionalOrigins = additionalOriginSeedData.map((entry) => ({
    id: entry.id,
    name: entry.name,
    nameEn: entry.nameEn,
    continent: entry.continent,
    countryCode: entry.countryCode,
    flavorTags: JSON.stringify(entry.flavorTags),
    altitude: entry.altitude,
    annualProduction: entry.annualProduction,
    varieties: JSON.stringify(entry.varieties),
    processingMethods: JSON.stringify(entry.processingMethods),
    thumbnailEmoji: entry.thumbnailEmoji,
    description: makeOriginDescription(
      entry.name,
      entry.summary,
      entry.flavorTags,
      entry.altitude,
      entry.varieties,
      entry.processingMethods,
    ),
  }));

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
    ...additionalGlossaryTerms,
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
      continent: "Africa",
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
      continent: "South America",
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
      continent: "South America",
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
      continent: "Africa",
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
      continent: "Central America",
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
  ...additionalOrigins,
  ];

  for (const o of origins) {
    await db.insert(schema.origin).values(o).onConflictDoNothing();
  }
  console.log("✅ 産地投入完了");

  console.log("🎉 シードデータの投入が完了しました！");
}

seed().catch(console.error);
