'use client';

import { Avatar, Button, Flex, Heading, useAuthenticator, useTheme } from '@aws-amplify/ui-react';

export const Header = () => {
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
        Sign out
      </Button>
    </Flex>
  );
};
