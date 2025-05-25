# Chat with your Workload

あなたのAWS環境とチャットができます😀

![](docs/image.png)

## 機能

- デプロイしたAWS環境にReadOnly権限でアクセスし、任意のAWSリソースについてチャット形式で確認ができます
    - 今月の利用料は？
    - 起動中のEC2インスタンスは？
    - 直近1時間以内に発生したLambdaのエラーは？
    - S3バケットの作成者は？


- [AWS Documentation MCP Server](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server/)を経由してAWSドキュメントを確認できます
    - Boto3でS3にアクセスするコードを教えて
    - Kendraが提供されているリージョンは？

    ※Amplifyにデプロイする都合上、プロトコルとしてのMCPは使用せず直接関数呼び出しをしています


## 構成概要

Ampify Gen2で構築しており、Amplifyホスティングにデプロイ可能です。生成AI機能はAmplifyのAI kitを使用しています。

生成AIモデルは最新のClaude Sonnet 4をクロスリージョン推論で呼び出します。生成AIが使用するツールはAI kitの仕組みを使ってLambdaで実装しています。

```mermaid
flowchart LR
    subgraph AmplifyGen2["Amplify Gen 2"]
        Next.js["Next.js"]
        AmplifyUI["Amplify UI"]
        AIKit["AI kit"]
    end

    subgraph AmazonBedrock["Amazon Bedrock"]
        Claude["Claude Sonnet 4<br>(Cross Region Inference)"]
    end

    subgraph AWSLambda1["Lambda (use_aws)"]
        StrandsAgents["Strands Agents Tools"]
    end

    subgraph AWSLambda2["Lambda (aws_document)"]
        AwsDocumentation["AWS Documentation MCP Server<br>** direct use (no MCP) **"]
    end

    AIKit -- Model --> AmazonBedrock
    AIKit -- Tool --> AWSLambda1
    AIKit -- Tool --> AWSLambda2
```


## デプロイ方法

バージニア北部リージョンを使用する実装となっています。

1. 本リポジトリを自身のGitHubリポジトリにForkします。
1. Amplify Gen2のドキュメントの[Quickstart](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)の「2. Deploy the starter app」以降の手順でデプロイします。


## ローカル環境での動作

1. GitHubからクローンします
1. 以下のコマンドを実行し、バックエンドのサンドボックスを作成します。

    ```shell
    npm install
    npx ampx sandbox
    ```

1. 別のターミナルを起動し、フロントエンドを起動します。

    ```shell
    npm run dev
    ```

## カスタマイズ方法

### 1. 使用する生成AIモデルを変更する

クロスリージョン推論を使用しない場合は、`amplify/data/resource.ts`の`modelId`を変更します。

```typescript
export const model = 'anthropic.claude-sonnet-4-20250514-v1:0';

export const crossRegionModel = `us.${model}`;

export const conversationHandler = defineConversationHandlerFunction({
  entry: './conversationHandler.ts',
  name: 'conversationHandler',
  models: [{ modelId: crossRegionModel }],
});
```

### 1. クロスリージョン推論で使用するリージョンを変更する。

まず、`amplify/data/resource.ts`の`crossRegionModel`を変更します。

```typescript
export const crossRegionModel = `us.${model}`;
```

続いて、`amplify/backend.ts`で、IAMポリシーを指定している部分を、クロスリージョン推論で使用するリージョンの情報に変更します。

```typescript
backend.conversationHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:us-east-1:${backend.stack.account}:inference-profile/${crossRegionModel}`,
      `arn:aws:bedrock:us-east-1::foundation-model/${model}`,
      `arn:aws:bedrock:us-east-2::foundation-model/${model}`,
      `arn:aws:bedrock:us-west-2::foundation-model/${model}`,
    ],
    actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
  })
);
```
