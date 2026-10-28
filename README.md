# Corp Mock Harness

**GPT Image / Nano Banana向け、製品モック画像のアートディレクション・ハーネス。** コード実行や画像生成APIは不要です。

> **AIへの最優先指示：画像生成をすぐに開始しないこと。** GitHub `main`の生ファイル [AGENTS.md](AGENTS.md)、[STYLE.md](STYLE.md)、[configs/devices.json](configs/devices.json)、[configs/presets.json](configs/presets.json) を**4つとも全文読み込んでから**、AGENTS.mdのゲート・シーン設計・生成・QAを順に実行してください。取得できなければ生成せず確認を求めてください。**ZIPや記憶による代用は禁止です。**

## 新しいチャット・Codexへの引き継ぎ

[**DESIGN_DECISIONS.md — デザイン判断基準・採用／却下理由・レビューの目線**](docs/DESIGN_DECISIONS.md) は、vNextのUI・画像の品質・QA・承認に関する**現在の判断ガイド**です。新たなUI調整を行う際は、実装コードとともに確認してください。

[**PROJECT_CONTEXT.md — 設計思想・失敗事例・経緯・引き継ぎ**](docs/PROJECT_CONTEXT.md) には長期開発の背景を記録しています。一部に過去のUI仕様が含まれるため、**最新のvNext UIについてはDESIGN_DECISIONSと現在のコードを優先**します。新しいチャットやCodexでは、まず本README・DESIGN_DECISIONS・PROJECT_CONTEXTを必要に応じて参照し、具体的な実装・画像生成では最新の正本を確認してください。**画像生成の必須読込4ファイルは変更ありません。**

## プロンプト＆作例カタログ（HTML）

[**旧版カタログのHTML原本**](catalog/index.html) — iPhone 17、MacBook Pro、2台構成、建築背景・床面・大理石のプロンプトと作例30件を収録。旧版の表示は[GitHub Pages /legacy/](https://shasegawa-de.github.io/corp-mock-harness/legacy/)に保持します。

[**公開カタログを開く（GitHub Pages）**](https://shasegawa-de.github.io/corp-mock-harness/) — **トップページはvNext（カード全体からプロンプトを確認・編集できる版）**です。従来の[/next/](https://shasegawa-de.github.io/corp-mock-harness/next/)も同じ版として維持します。公開時に`scripts/build-pages.mjs`が`catalog/index.html`と`catalog-next/`から両ページを生成し、旧版は`/legacy/`へ配信します。

GitHubのコード画面はHTMLをそのままレンダリングしません。[**旧版HTMLのダウンロード**](https://raw.githubusercontent.com/shasegawa-de/corp-mock-harness/main/catalog/index.html)は可能ですが、**公開版のHTMLはビルドで生成**します。カード・画像の原本は`catalog/index.html`、新UIの実装は`catalog-next/`が正本です。

## 使い方

### 公開版：作例の条件を変更する

[**公開カタログ（vNext）**](https://shasegawa-de.github.io/corp-mock-harness/) — 旧版の30件を保持し、MacBook Pro ×2の生成画像2件を加えた全32件の作例・プロンプトと一覧表を表示。**カード全体のタップ／Enter／Space**で右サイドの「プロンプト確認」モーダルを開き、条件の変更・英文全文コピーができます。画像拡大用の別モーダルはありません。PCは左端の白い固定フィルター領域で9項目を選択し、スマホではフィルターモーダルを使います。条件が一致する既存作例のみを参照表示し、新たに生成した画像として扱いません。[採用UIの判断基準](docs/DESIGN_DECISIONS.md)。

旧版を`/legacy/`に保持し、`catalog/index.html`の原本を変更せず、公開版vNextをこの原本から構成します。追加機能のソースは`catalog-next/`。公開時に必須4ファイルを同梱しますが、画像生成時に最新mainを確認する契約は変えません。**画像は元の作例です。変更後の条件による実画像は未生成・未検証です。** [実装と検証範囲](docs/PROMPT_BUILDER.md)。

### 完成プロンプトをGPT Imageへ明示送信する（任意）

チャット内の画像生成で指示が書き換わる場合は、GitHub Actionsから単一プロンプトをそのままGPT Image APIへ渡す経路を使えます。デフォルトは課金のないドライラン。実生成には `OPENAI_API_KEY` のRepository secret設定と別途API料金が必要です。画像は自動登録されず、人間のQA後に採用します。[実行手順](docs/GPT_IMAGE_TRANSPORT.md)。

### MacBook Pro 14インチを2台使用する構成

正式な対象に **Mac + Mac（14インチ×2台）** を追加。公開カタログは32件で、MM1は**ユーザーが構図・角度差・光表現を採用方向と判断した新画像**へ差し替えました（[MM1画像](assets/macbook-pair/mm1-adopted-v5.jpg)）。MM2は背景を修正したv3画像をレビュー用としてカタログへ反映しました（[MM2-v3画像](assets/macbook-pair/candidates/mm2-float-natural-wall-v3.jpg)）。最終承認・筐体寸法・プロンプト一致は未検証で、旧画像も[保存](assets/macbook-pair/mm2-suspended.jpg)しています。MM1の旧版は[従来画像](assets/macbook-pair/mm1-grounded.jpg)として保存しています。2台の筐体形状・寸法の厳密なQAと生成時の実効プロンプト一致は未検証です。[画像の出自・品質記録](assets/macbook-pair/generation-manifest.json)。完成プロンプトは[左右配置](prompts/macbookpro14-macbookpro14/side-by-side.txt)／[床なし前後浮遊](prompts/macbookpro14-macbookpro14/suspended-depth.txt)を参照してください。2台とも開いた14インチMacで、余分な端末を加えない制約は[AGENTS.md](AGENTS.md)と[STYLE.md](STYLE.md)で定義しています。

## 画像生成を依頼する

通常はリポジトリURLと端末・枚数を伝えるだけです。

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、iPhone 17のモック画像を4枚、**独立して1枚ずつ**生成して。

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、MacBook Pro 14インチのモック画像を4枚生成して。

**重要：『4枚生成』はAIへのバッチ依頼であり、画像生成ツールに送る指示ではありません。** AIは各案について1つの最終プロンプトを確定し、送信前に検査します。ツールに渡った指示が4分割・複数視点へ変わっていたら、その場で停止します。ツール側のプロンプトを書き換え・非公開により検証できない場合は未検証と明記します。[詳細](AGENTS.md)／[単独画像プロンプト例](WORKFLOW.md)。

未指定なら標準iPhone 17・4枚・16:9。**一般的な俯瞰構図・真上90°からの撮影は廃止**。ただし、iPhoneを寝かせる場合に限り、白画面全体を見せるためカメラを斜め上40〜55°へ移動させます。標準4案のCは、目線に近いカメラで撮るブロック上の展示構図に置き換えました。**1画像は1構図、端末は依頼どおりの1台または2台。すべての画面を無地の純白にし、構図と建築的ハーフグレー背景を維持。デスク・木目・小道具は禁止。** 4枚なら4つの別シーンを計画し、4回の独立生成で実行。詳細なルールと不合格条件は [AGENTS.md](AGENTS.md) と [STYLE.md](STYLE.md) が正本です。

## 採用する撮影スタイル・端末構成

- **iPhone単体：** [正面A](prompts/iphone17/a.txt)と[左斜めB](prompts/iphone17/b.txt)を良好な構図の参照とする。[スモークガラスD](prompts/iphone17/d.txt)は改善中。
- **MacBook Pro単体：** [床の見えない空中浮遊](prompts/macbookpro14/suspended.txt)を独立プロンプトとして収録。
- **MacBook Pro＋iPhone：** [床の見えない空中浮遊（推奨）](prompts/macbookpro14-iphone17/suspended.txt) ／ [接地・左右配置](prompts/macbookpro14-iphone17/side-by-side.txt)。**画像1枚で端末2台、カメラ視点は1つ**。
- **浮遊モード：** `grounded`＝接地、`hover`＝床上の低い浮遊、`suspended`＝床・水平線・床への投影影のない空中浮遊。好評だったのは`suspended`。設定は[configs/presets.json](configs/presets.json)に統合。

これらは再利用できる**完成プロンプトの実例**であり、画像生成モデルが毎回同じ結果を返す保証ではありません。画面の形状・端末数・背景の逸脱を実画像で検証します。

## 環境のみの作例（端末なし）

背景構造体・建材・光を単独で比較する場合は、**`environment-only`（端末0台）**を使います。製品用の1台／2台構図とは別カテゴリです。[環境専用プロンプト6本](prompts/environment/)：シームレスなマイクロセメント、繊維セメントの角、広い展示ブロック、スモークガラス、ダークな低照度空間、床のない空中浮遊用背景。すべて建築的ハーフグレー、デスク・木目・小道具なし。[プロンプト索引](prompts/README.md)。

## 建築面・床面の作例（端末なし）
**大理石も対応素材に追加**：[白系大理石の壁・床](prompts/architectural-surfaces/carrara-marble-wall-floor.txt)、[チャコール系大理石の壁・床](prompts/architectural-surfaces/graphite-marble-wall-floor.txt)、[テーブル大の大理石展示ブロック](prompts/environment/carrara-marble-display-block.txt)。いずれも細い自然な石目と控えめな光沢で統一します。


マテリアルの接写やスウォッチではなく、**仕上げが実際の建築面・床面に適用された状態**を単独で比較します。[壁面・壁床の接合・床面主体の6プロンプト](prompts/architectural-surfaces/)：マイクロセメントの壁と床、繊維セメントの壁面、スモークガラスと石材の建築面、チャコールの壁・床、広いマイクロセメント床、サンドブラストコンクリート床。端末0台、1枚1構図。床面重視は面積の約85%を床として扱い、カメラを低い斜め方向へ向けます。

## 床置き・ブロック置き（新規）

- **床置き：** [MacBook Proを鉱物系の床へ直接設置](prompts/macbookpro14/on-floor.txt)／[iPhoneを床に寝かせる](prompts/iphone17/on-floor-flat.txt)／[壁に沿って傾ける](prompts/iphone17/on-floor-tilted.txt)。テーブルや机は使わない。
- **ブロック置き：** iPhoneの[立て置き](prompts/iphone17/on-block.txt)／[大きなブロックに寝かせる](prompts/iphone17/on-block-flat.txt)／[傾けて支える](prompts/iphone17/on-block-tilted.txt)、[MacBook Pro単体](prompts/macbookpro14/on-block.txt)、[Mac＋iPhoneの2台構成](prompts/macbookpro14-iphone17/on-blocks.txt)。
- ブロックは**端末を支える直方体の鉱物系展示台のみ**。iPhoneを寝かせるときは**天板がテーブル程度に広い一体のコンクリート塊**を使い、小さな台座は使わない。傾けるときは背面が支えられた自然な姿勢にする。Macは常に開いた状態とし、寝かせない。
- iPhone単体の[床なし空中浮遊](prompts/iphone17/suspended.txt)も追加。`grounded` / `on-block` / `hover` / `suspended` を切り替えて生成する。

新規のiPhone構図5本（床に寝かせる／床で傾ける／広いブロックに寝かせる／ブロックで傾ける／空中浮遊）はプロンプト収録済みですが、再現性・筐体精度は未検証。詳細は[プロンプト一覧](prompts/README.md)を参照。

## 生成指示が書き換わる場合のテスト

画像生成ツールが指定した1構図を勝手に複数構図へ変えてしまう場合は、[単独プロンプトテスト](prompts/README.md)を利用してください。標準iPhone 17の[A](prompts/iphone17/a.txt)・[B](prompts/iphone17/b.txt)・[C（ブロック置き）](prompts/iphone17/on-block.txt)・[D](prompts/iphone17/d.txt)をそれぞれ独立した完成テキストとして保存しています。

まず**AのRawテキストだけ**をコピーし、新しい画像生成チャットで**その1本だけ**入力します。GitHubのURLや「4枚生成」の依頼を同じメッセージに追加しません。これで会話文脈による混線を切り分けられますが、画像生成ツール内部のプロンプト書き換えを完全には防げません。詳細は[テスト手順](prompts/README.md)を参照してください。

## ファイル構成

- **必須4ファイル：** [AGENTS.md](AGENTS.md)（実行制御）、[STYLE.md](STYLE.md)（デザイン制約）、[devices.json](configs/devices.json)（筐体）、[presets.json](configs/presets.json)（構図・背景・照明、標準4案）。
- **必要時のみ：** [.agents/skills/](.agents/skills/)（6スキル）、[WORKFLOW.md](WORKFLOW.md)（詳細フロー）、[providers/](providers/)（モデル別補足）、[templates/](templates/)（依頼・レビュー）、[history/](history/)（制作履歴）。

**正本はGitHub `main`の個別Markdown/JSON。** [v0.2.0のZIP](dist/corp-mock-harness-v0.2.0.zip) は過去の配布スナップショットであり、AI実行時には読まないでください。特定コミットを指定された場合に限り、そのコミットの個別ファイルを使います。

**注意：** 外部のAIはGitHubの内容を自動的に取り込みません。参照手段・権限が必要です。画像の縦横比や筐体形状は生成後に確認し、未検証の精度を保証しません。
