# Corp Mock Harness

**GPT Image / Nano Banana向け、製品モック画像のアートディレクション・ハーネス。** コード実行や画像生成APIは不要です。

> **AIへの最優先指示：画像生成をすぐに開始しないこと。** GitHub `main`の生ファイル [AGENTS.md](AGENTS.md)、[STYLE.md](STYLE.md)、[configs/devices.json](configs/devices.json)、[configs/presets.json](configs/presets.json) を**4つとも全文読み込んでから**、AGENTS.mdのゲート・シーン設計・生成・QAを順に実行してください。取得できなければ生成せず確認を求めてください。**ZIPや記憶による代用は禁止です。**

## 使い方

通常はリポジトリURLと端末・枚数を伝えるだけです。

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、iPhone 17のモック画像を4枚、**独立して1枚ずつ**生成して。

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、MacBook Pro 14インチのモック画像を4枚生成して。

未指定なら標準iPhone 17・4枚・16:9。**1枚につき端末1台、画面は無地の純白、構図と建築的ハーフグレー背景を維持し、デスク・木目・小道具は描かない。** 4枚なら4つの別シーンを計画し、4回の独立生成で実行。詳細なルールと不合格条件は [AGENTS.md](AGENTS.md) と [STYLE.md](STYLE.md) が正本です。

## ファイル構成

- **必須4ファイル：** [AGENTS.md](AGENTS.md)（実行制御）、[STYLE.md](STYLE.md)（デザイン制約）、[devices.json](configs/devices.json)（筐体）、[presets.json](configs/presets.json)（構図・背景・照明、標準4案）。
- **必要時のみ：** [.agents/skills/](.agents/skills/)（6スキル）、[WORKFLOW.md](WORKFLOW.md)（詳細フロー）、[providers/](providers/)（モデル別補足）、[templates/](templates/)（依頼・レビュー）、[history/](history/)（制作履歴）。

**正本はGitHub `main`の個別Markdown/JSON。** [v0.2.0のZIP](dist/corp-mock-harness-v0.2.0.zip) は過去の配布スナップショットであり、AI実行時には読まないでください。特定コミットを指定された場合に限り、そのコミットの個別ファイルを使います。

**注意：** 外部のAIはGitHubの内容を自動的に取り込みません。参照手段・権限が必要です。画像の縦横比や筐体形状は生成後に確認し、未検証の精度を保証しません。
