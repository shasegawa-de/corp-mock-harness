# GPT Image：完成プロンプトの明示送信

画像生成ツール内部のプロンプト再構成で、端末なしの建築面を指定しても同じ構図が繰り返された。GitHub `main` の単一完成プロンプトをそのまま GPT Image API の `prompt` に送る、任意の経路を追加した。Fireflyは使わない。

- モデルは `gpt-image-2.5-flare`、1リクエスト=1枚、`1536x864`（16:9）、`quality=high`、PNG。
- `AGENTS.md` / `STYLE.md` / `configs/devices.json` / `configs/presets.json` を毎回読み直し、JSON・端末0台・シーンIDを検証。
- `prompts/architectural-surfaces/*.txt` は改変せずAPIに送信。SHA-256を記録。
- 画像のPNGヘッダ・1536x864寸法を検証。生成結果は14日間GitHub Actions Artifactに保持し、自動採用も自動コミットもしない。
- メタデータは `prompt_transport=EXACT_REQUEST_SUBMITTED`、`effective_model_prompt=UNVERIFIED`、`image_qa=UNVERIFIED`、`approved=false`。APIはモデル内部の実効プロンプトを公開しないため、内部まで完全一致と主張しない。
- 費用が発生する実生成は明示的な `execute=true` の手動起動のみ。リトライは人間の判断で1シーンずつ。

## 実行前の設定

GitHubリポジトリ Settings → Secrets and variables → Actions → New repository secret に `OPENAI_API_KEY` を登録する。APIの利用料金はChatGPTのサブスクリプションとは別。鍵をチャットやコミットへ貼らない。

GitHub Actions → **GPT Image — prompt-locked manual generation** → Run workflow → `main`、シーンを選択。まず `execute=false` を実行し、PRECHECK・SHA-256・テストが通ることを確認する。`execute=true` で独立した画像を1枚生成し、Artifacts内のPNGとJSONを人間がQAする。

CLI（Node 22+）：

```sh
node --test tests/gpt-image-transport.test.mjs
node scripts/generate-gpt-image.mjs --scene=surface-microcement-wall-floor --dry-run
# 有償実行はOPENAI_API_KEYが設定されている環境に限る
node scripts/generate-gpt-image.mjs --scene=surface-microcement-wall-floor --execute
```

**注意**：この実装はチャット内のimage_genツール自体を修正しない。プロンプト送信経路を切り替えるものであり、生成画像の素材・構図は目視QAが必要。既存30カードのカタログは無変更。

OpenAI公式仕様：https://developers.openai.com/api/reference/resources/images/methods/generate
