"use client";
import * as React from "react";
import { Toaster } from "sonner";
import { Authenticator, Flex } from "@aws-amplify/ui-react";
import { UserProvider } from "./UserProvider";
import ConfigureAmplifyClientSide from "./ConfigureAmplify";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ConfigureAmplifyClientSide />
      <Authenticator>
        <UserProvider>
          <MantineProvider theme={theme}>
            <Flex
              direction="column"
              width="100vw"
              height="100vh"
              gap="0"
              backgroundColor="background.primary"
            >
              {children}
            </Flex>
            <Toaster />
          </MantineProvider>
        </UserProvider>
      </Authenticator>
    </>
  );
};
