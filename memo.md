はい、ここまでのSupabase Functionsでの開発とトラブルシューティングの要点を、マークダウン形式でまとめます。

-----

## Supabase Functions開発のまとめ

### 1\. Supabase Functionsとは？

  * Node.jsではなく **Deno (ディノ)** という実行環境で動く、サーバーサイドのコードです。
  * AI APIの呼び出しや、データベースへの安全な書き込み（チャット履歴の保存など）に使います。

### 2\. ローカルでの実行・デプロイ

  * **ローカルへのデプロイは不要**です。
  * `supabase start` を実行すると、DBやAuthと一緒にFunctionsのローカルサーバーも起動します（`localhost:54321`）。
  * `curl` などで `localhost:54321/functions/v1/あなたのfunction名` にリクエストを送れば、すぐにテストできます。
  * `supabase functions deploy` コマンドは、ローカルではなく**本番（クラウド）環境へ**デプロイする時にのみ使います。

-----

### 3\. Denoのパッケージ管理 (`npm install` は不要)

Denoでは `npm install` や `node_modules` を使いません。
Functionの `.ts` ファイル内で、URLを使って直接パッケージを`import`します。

```typescript
// Gemini API を使う例
import { GoogleGenerativeAI } from "npm:@google/genai";

// Supabaseの型定義を読み込む例
import "@supabase/functions-js/edge-runtime.d.ts";
```

### 4\. VS Codeでの開発環境エラー（重要）

`import "jsr:..."` や `import "npm:..."` というDenoの構文は、通常のTypeScript/ESLintには理解できません。
エディタでエラー（赤い波線）を消し、自動補完を効かせるには以下の設定が必要です。

#### 1\. VS Code Deno 拡張機能

  * 「Deno」(`denoland.vscode-deno`) 拡張機能をインストールします。

#### 2\. ESLintとの衝突を避ける

  * プロジェクトのルートに `.eslintignore` ファイルを作成し、Denoが管理するフォルダをESLintに無視させます。

    **.eslintignore の中身:**

    ```
    supabase/functions
    ```

#### 3\. `deno.json` で `import` を管理する

  * Denoのエラー（`resolver-error` や `no-import-prefix`）を解消するため、`import`の「あだ名」を定義します。

  * **`supabase/functions/deno.json`** というファイルを1つ作成し、そこに共通の`import`定義をまとめます。

    **`supabase/functions/deno.json` の中身:**

    ```json
    {
      "imports": {
        // "あだ名": "実際のパッケージURL@バージョン"
        "@supabase/functions-js/edge-runtime.d.ts": "jsr:@supabase/functions-js@^2/edge-runtime.d.ts",
        "npm:@google/genai": "npm:@google/genai@^0.14.0"
      }
    }
    ```

  * この設定により、Functionのコード内ではスッキリした「あだ名」で`import`できます。

    **`supabase/functions/my-function/index.ts` の中身:**

    ```typescript
    // `deno.json`で定義した "あだ名" を使う
    import "@supabase/functions-js/edge-runtime.d.ts"; 
    import { GoogleGenerativeAI } from "npm:@google/genai"; 
    ```

-----

### 5\. `supabase start` vs `supabase functions serve`

`deno.json`の読み込み場所が異なります。

  * **`supabase start`** (全サービス起動)

      * `supabase/functions/deno.json` (共有ファイル) を自動で読み込みます。
      * VS Codeもこの共有ファイルを読み込むため、開発中は `supabase start` を使うのがスムーズです。

  * **`supabase functions serve <function名>`** (単体テスト)

      * **共有`deno.json`を読みません。** Function個別のフォルダ（例：`hello-world/deno.json`）を探しに行きます。
      * もし共有ファイルを使いたい場合は、`--import-map` フラグで場所を明示的に指定する必要があります。
        ```bash
        supabase functions serve hello-world --import-map ./supabase/functions/deno.json
        ```

-----

### 6\. `curl` でのローカルテストと認証エラー

ローカルFunctions（`localhost:54321`）のテストでエラーが出た場合、原因はほぼ「認証ヘッダー」です。

  * **`Missing authorization header` エラーの原因:**
    `supabase status` で表示されるキーが `Publishable key: sb_publishable_...` の場合、そのローカル環境は**古いスタック**です。

  * **古いスタックでの正しい`curl`:**
    `Authorization: Bearer ...` ヘッダーではなく、**`apikey` ヘッダー**を使います。

    ```bash
    curl -i --location --request POST 'http://localhost:54321/functions/v1/hello-world' \
      --header 'Content-Type: application/json' \
      --header 'apikey: sb_publishable_...（あなたのキー）' \
      --data '{"name":"Functions"}'
    ```

  * **`anon` (Publishable) キーの安全性:**
    このキーが漏れても、**Row Level Security (RLS)** がすべてのテーブルで正しく有効化されていれば安全です。RLSがオフだと、データベース全体が丸裸になります。


## supabaseにenvファイルを登録する
### supabaseの個別のfunctionにenvファイルを置く
/functions下に`.env`を配置する。
`npx supabase start`で自動的に読み込まれる。
もしくは`npx supabase functions serve`で追加した環境変数を読み込むことができる。