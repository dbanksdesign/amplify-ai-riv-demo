import { Flex, Text } from "@aws-amplify/ui-react";

export const WelcomeMessage = () => {
  return (
    <Flex direction="column" textAlign="center" color="font.tertiary">
      <Text fontSize="xl" fontWeight="bold" color="primary.80">
        Welcome to the rental search experience
      </Text>
      <Text color="font.tertiary">
        Tell me what kind of rental you would like to stay in
      </Text>
    </Flex>
  );
};
