# Corp Mock Harness

## ⛔️ CRITICAL GATEKEEPER FOR AI — 必読・生成開始前の停止ゲート

**画像生成ツールを先に呼び出さないこと。** ユーザーが「モックを4枚生成して」と指示しても、**生成前に** [STYLE.md](STYLE.md)、[configs/devices.json](configs/devices.json)、[configs/presets.json](configs/presets.json) を**全文読み込み・解釈**し、[AGENTS.md](AGENTS.md) の強制ゲートと6スキルを適用する。未読・一部取得・アクセス不可の場合は**画像生成を中止**し、必要なファイルの提供を求める。

生成前に各画像の「端末／構図／建築素材と0〜3面の空間／照明／禁止要素」を具体化し、すべての案について**白一色で無地の画面、独立した16:9、ハーフグレーの建築的背景、無関係な小道具ゼロ**を確認する。**木目デスク、テーブル、植物、コーヒーカップ、書籍、文具、手、家具、台座、独立ブロック、ロゴ、UI**は禁止。AIが安易に補完しがちな**デスク周り・生活感のある撮影シーンを生成しない**。

**必要な文書の読み込み → シーン計画 → 禁止条件の照合 → 画像生成 → 実画像のQA**の順を厳守する。詳細な実行規約は [AGENTS.md](AGENTS.md) が正本。

**最新版：v0.2.0** — [配布用ZIP](dist/corp-mock-harness-v0.2.0.zip) ／ [変更履歴](CHANGELOG.md) ／ [VERSION](VERSION)

**GPT Image / Nano Banana で利用する、商品モック画像のアートディレクション・ハーネス。**

目的は、機種の形状とトーンを維持しながら、素材・空間・構図・光を変えた、高品質な商品モック画像を反復生成・評価すること。特定の画像生成APIやPython実行環境には依存しない。

## AI実行入口（このREADMEだけを指定）

**チームメンバーが入力するのはリポジトリURLと「端末・枚数」だけでよい。** ファイル名やスキル名を列挙する必要はない。

初回の依頼例（ChatGPT / GPT Image）：

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、iPhone 17のモック画像を4枚生成して。

Nano Bananaの場合：

> https://github.com/shasegawa-de/corp-mock-harness のREADMEに従い、MacBook Pro 14インチのモック画像を4枚生成して。

同一チャットでの続き：

> 次は別の構図で4枚。

### AIへの実行規約

上記のURLやこのREADMEを起点に生成を依頼されたAIは、**READMEを目次、AGENTS.mdを実行規約の正本**として以下を実施すること。

1. [AGENTS.md](AGENTS.md) と [STYLE.md](STYLE.md)、[WORKFLOW.md](WORKFLOW.md) を読む。
2. [configs/devices.json](configs/devices.json) と [configs/presets.json](configs/presets.json) を参照し、対象端末・構図・背景・照明を確定する。
3. [Device](.agents/skills/device/SKILL.md)、[Composition](.agents/skills/composition/SKILL.md)、[Environment](.agents/skills/environment/SKILL.md)、[Lighting](.agents/skills/lighting/SKILL.md)、[Variation](.agents/skills/variation/SKILL.md)、[Quality Check](.agents/skills/quality-check/SKILL.md) の各指示を必要に応じて適用する。
4. 実際に使える生成エンジンを確認し、[GPT Image](providers/gpt-image.md) または [Nano Banana](providers/nano-banana.md) の指示を適用する。生成できる環境・権限がない場合は、その事実を明示して実行したと偽らない。
5. **画像は1枚ずつ独立した16:9構図で生成**する。4案を1枚のコラージュにしない。生成前に各案で背景・構図・光のうち少なくとも2軸を変え、不要なブロックを配置しない。
6. 生成後、実画像を [templates/review.md](templates/review.md) に沿って評価し、不合格なら理由を示してその画像を修正する。[history/](history/) に参照可能な履歴がある場合は重複を避け、記録できない場合は保存したと主張しない。

利用者が未指定の場合、**端末はiPhone 17（標準モデル）、枚数は4枚、画角は16:9、画像生成エンジンは現在利用できるもの（ChatGPT内ではGPT Imageを優先）**とする。それ以外のデザイン条件は [STYLE.md](STYLE.md) と [configs/](configs/) に従う。別エンジンの利用は、ユーザーの明示指定または利用環境の対応状況に合わせる。

**制約：** GitHub上のREADMEやSKILL.mdはChatGPT/Geminiに自動登録されない。各ユーザーはリポジトリの閲覧権限と対応するGitHub接続・ファイル参照手段が必要。AIがREADMEや参照ファイルを読めなければ、読めたと装わず、接続または必要ファイルの提供を求める。

## 設計

| レイヤー | ファイル | 役割 |
|---|---|---|
| オーケストレーター | [AGENTS.md](AGENTS.md) / [WORKFLOW.md](WORKFLOW.md) | 制約統合・探索・評価・再生成 |
| デザイン原則 | [STYLE.md](STYLE.md) | 変更しないアートディレクション |
| 6 Skills | [.agents/skills/](.agents/skills/) | Device / Composition / Environment / Lighting / Variation / Quality Check |
| 参照・プリセット | [configs/](configs/) | 端末仕様・背景・構図・ライティング |
| モデル別アダプター | [providers/](providers/) | [GPT Image](providers/gpt-image.md) / [Nano Banana](providers/nano-banana.md) |
| 制作依頼とQA | [templates/](templates/) | リクエストと画像評価の記録 |
| 履歴 | [history/](history/) | 探索結果、採用・却下理由 |

## 初期仕様

- 被写体：iPhone 17（標準モデル）または MacBook Pro 14インチ。**1画像につき1台**。
- 16:9の横長画像を**1枚につき1構図**で作る。複数案はそれぞれ独立した画像として生成し、コラージュにしない。
- 全面が見える白いディスプレイ、正確さを優先した筐体、自然な金属・ガラスの反射。
- モノトーン、ハーフグレー、0〜3面の建築要素。マットな左官・ファイバーセメント・コンクリート等を幅広く使う。
- 無関係な台座・ブロック・支え・人物・手・ロゴ・テキスト・透かしを置かない。
- 直前の採用・却下画像を参照し、**背景だけでなく構図も**実質的に変える。

## 運用と品質確認

AIは上記の実行規約を入口として、[WORKFLOW.md](WORKFLOW.md) の順序で制作する。利用者は通常、端末・枚数・変更したい条件だけを指定する。

初回アクセスでは権限とファイル読み取りを確認し、以降の同一チャットでは直前の生成画像・選択条件を引き継ぐ。別チャットでは、必要に応じてREADMEのURLを再提示する。

生成画像の評価は [templates/review.md](templates/review.md) に、採用・却下と生成条件の記録方法は [history/](history/) に定義する。ただし、画像・履歴の自動保存機能はない。

## プロバイダーと制約

- [GPT Image](providers/gpt-image.md)：ChatGPTの画像生成機能等で実行。
- [Nano Banana](providers/nano-banana.md)：対応するGemini等の画像生成UIで実行。
- **このリポジトリは画像生成サービスを実装・起動しない。** スキル／プロンプトを組み立てるための仕様と参照データを管理する。
- 利用環境で16:9等の比率を指定できる場合は設定する。正確なピクセル数や比率は生成後に確認し、未確認なら保証しない。
- AI画像生成では筐体の製造公差レベルの再現・画面の純白・不要物の完全排除は保証されない。最終用途では視覚検証と必要な合成を行う。

## 公式資料

- [Apple iPhone 17 技術仕様](https://www.apple.com/jp/iphone-17/specs/)
- [Apple MacBook Pro 技術仕様](https://www.apple.com/jp/macbook-pro/specs/)
- [OpenAI 画像生成ガイド](https://platform.openai.com/docs/guides/image-generation)
- [Google Gemini / Nano Banana 画像生成ガイド](https://ai.google.dev/gemini-api/docs/image-generation)
- [Agent Skills 仕様](https://agentskills.io/specification)
