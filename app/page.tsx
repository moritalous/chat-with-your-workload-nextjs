'use client';

import { Authenticator, Flex, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import 'highlight.js/styles/github.css';
import outputs from '@/amplify_outputs.json';
import { ChatContainer } from '@/app/components/ChatContainer';
import { Header } from '@/app/components/Header';
import './page.css';
import { theme } from './theme';
Amplify.configure(outputs);

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {() => (
          <Flex direction="column" width="100%" height="100vh" backgroundColor="#F2F8FD">
            <Header />
            <ChatContainer />
          </Flex>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
