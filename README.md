# Corp Mock Harness

**GPT Image / Nano Banana向け、製品モック画像のアートディレクション・ハーネス。** コード実行や画像生成APIは不要です。

> **AIへの最優先指示：画像生成をすぐに開始しないこと。** GitHub `main`の生ファイル [AGENTS.md](AGENTS.md)、[STYLE.md](STYLE.md)、[configs/devices.json](configs/devices.json)、[configs/presets.json](configs/presets.json) を**4つとも全文読み込んでから**、AGENTS.mdのゲート・シーン設計・生成・QAを順に実行してください。取得できなければ生成せず確認を求めてください。**ZIPや記憶による代用は禁止です。**

## プロンプト＆作例カタログ（HTML）

[**Prompt & Visual Catalog**](catalog/index.html) — iPhone 17、MacBook Pro、2台構成、建築背景・床面・大理石のプロンプトと生成例を比較するHTMLカタログ。対象カテゴリ／配置／素材／評価で複合絞り込み、画像拡大、プロンプト全文表示・コピーに対応。

GitHubのコード画面はHTMLをそのままレンダリングしません。閲覧する際は[**HTMLファイルをダウンロード**](https://raw.githubusercontent.com/shasegawa-de/corp-mock-harness/main/catalog/index.html)してブラウザで開いてください。画像の多くは埋め込み済みですが、一部の高画質画像はオンライン参照です。正本は `main/catalog/index.html`。

## 使い方

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
