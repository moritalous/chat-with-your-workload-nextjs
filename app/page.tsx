'use client';
import {
  Authenticator,
  Avatar,
  Button,
  Card,
  Flex,
  Heading,
  ThemeProvider,
  View,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react';
import { AIConversation } from '@aws-amplify/ui-react-ai';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import 'highlight.js/styles/github.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import outputs from '../amplify_outputs.json';
import { useAIConversation } from './client';
import './styles/main.css';
import { theme } from './theme';

Amplify.configure(outputs);

const Header = () => {
  const { signOut } = useAuthenticator();
  const { tokens } = useTheme();

  return (
    <Flex
      as="header"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      padding={tokens.space.medium}
      backgroundColor="#232F3E"
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
    >
      <Flex alignItems="center" gap={tokens.space.small}>
        <Avatar variation="outlined" size="large">
          💬
        </Avatar>
        <Heading level={4} margin="0" color="white">
          Chat with your Workload
        </Heading>
      </Flex>
      <Button
        variation="link"
        onClick={signOut}
        color="white"
        style={{
          textDecoration: 'none',
          transition: 'color 0.2s ease',
        }}
        className="signout-button"
      >
        サインアウト
      </Button>
    </Flex>
  );
};

export default function Home() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');
  // 'chat' is based on the key for the conversation route in your schema.

  const welcomeMessage = `
  ## Chat with your Workloadの使い方
  - **AWS リソースの確認**:
    - S3バケットの一覧を取得して
    - 東京リージョンで起動中のEC2は？
    - バージニア北部リージョンの「???」というLambdaの直近一時間のログにERRORが出てないか確認して
    - 東京リージョンのRDSインスタンスの作成者はだれ？
    - バージニア北部のBedrockのログ出力設定は有効になってる？ → 直近10件のログを見て使用してるモデルIDを教えて。
  - **AWS ドキュメント参照**:
    - S3 バケットの命名ルールに関するドキュメントを調べてください。出典を明記してください。
    - https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html の関連コンテンツを推奨してください。
  

  ## 豆知識
  - Shift + Enter で改行可能です
  - ReadOnlyAccess権限で実行するため、リソースの変更や削除は行えません
  - 内部エラーが発生した際にチャットの応答がなくなることがあります。あまり複雑なタスクは要求しないほうが良さそうです
  `;

  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {() => (
          <Flex direction="column" width="100%" height="100vh" backgroundColor="#F2F8FD">
            <Header />

            <Flex
              direction="column"
              flex="1"
              padding={{ base: '0.75rem', medium: '1.5rem' }}
              alignItems="center"
              overflow="hidden"
            >
              <Card
                variation="elevated"
                borderRadius="large"
                width="100%"
                maxWidth="1200px"
                flex="1"
                overflow="hidden"
                boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              >
                <View
                  width="100%"
                  height="100%"
                  overflow="hidden"
                  display="flex"
                  className="chat-container"
                >
                  <AIConversation
                    messages={messages}
                    isLoading={isLoading}
                    handleSendMessage={handleSendMessage}
                    messageRenderer={{
                      text: ({ text }) => (
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>
                      ),
                    }}
                    avatars={{
                      user: {
                        username: 'あなた',
                        avatar: <Avatar size="large">😀</Avatar>,
                      },
                      ai: {
                        username: 'アシスタント',
                        avatar: <Avatar size="small">🤖</Avatar>,
                      },
                    }}
                    displayText={{ getMessageTimestampText: () => '' }}
                    welcomeMessage={
                      <Card variation="outlined" borderRadius="medium" flex="1" overflow="hidden">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {welcomeMessage}
                        </ReactMarkdown>
                      </Card>
                    }
                  />
                </View>
              </Card>
            </Flex>
          </Flex>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
