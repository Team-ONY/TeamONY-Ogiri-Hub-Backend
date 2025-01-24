# TeamONY Ogiri Hub Backend

大喜利Hub用のバックエンドAPIサーバーです。画像生成APIを提供し、フロントエンドアプリケーションをサポートします。

## 技術スタック

- Node.js
- TypeScript
- Hono (軽量なWebフレームワーク)
- OpenAI API (画像生成)
- Jest (テスト)

## 主な機能

- 画像生成API
- APIキー認証
- CORSサポート
- セキュリティヘッダー
- ヘルスチェックエンドポイント

## 開発環境のセットアップ

1. リポジトリのクローン:

```bash
git clone https://github.com/your-username/TeamONY-Ogiri-Hub-BackEnd.git
cd TeamONY-Ogiri-Hub-BackEnd
```

2. 依存関係のインストール:

```bash
npm install
```

3. 環境変数の設定:
   `.env`ファイルを作成し、必要な環境変数を設定してください:

```
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_api_key
RATE_LIMIT_WINDOWS_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

4. 開発サーバーの起動:

```bash
npm run dev
```

## 利用可能なスクリプト

- `npm run dev`: 開発サーバーの起動
- `npm run build`: TypeScriptのビルド
- `npm start`: プロダクションサーバーの起動
- `npm test`: テストの実行
- `npm run test:coverage`: カバレッジレポート付きでテストを実行
- `npm run lint`: ESLintによるコード検証
- `npm run lint:fix`: ESLintによるコード自動修正

## APIエンドポイント

### ヘルスチェック

- GET `/health`
  - サーバーの状態を確認

### 画像生成

- POST `/api/image`
  - ヘッダー: `x-api-key` (認証用)
  - リクエストボディ: 画像生成のパラメータ

## 環境変数

| 変数名                  | 説明                               | 必須 |
| ----------------------- | ---------------------------------- | ---- |
| PORT                    | サーバーのポート番号               | ✅   |
| NODE_ENV                | 実行環境（development/production） | ✅   |
| OPENAI_API_KEY          | OpenAI APIキー                     | ✅   |
| API_KEY                 | APIアクセス用の認証キー            | ✅   |
| RATE_LIMIT_WINDOWS_MS   | レートリミットの時間枠（ミリ秒）   | ✅   |
| RATE_LIMIT_MAX_REQUESTS | 時間枠内の最大リクエスト数         | ✅   |

## テスト

テストはJestを使用して実装されています。以下のコマンドでテストを実行できます：

```bash
npm test
```

カバレッジレポートを生成する場合：

```bash
npm run test:coverage
```
