"use client";
import * as React from "react";
import { Toaster } from "sonner";
import { Authenticator, Flex } from "@aws-amplify/ui-react";
import { UserProvider } from "./UserProvider";
import { Header } from "./Header";
import ConfigureAmplifyClientSide from "./ConfigureAmplify";


export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
      <>
        <ConfigureAmplifyClientSide />
        <Authenticator>
          <UserProvider>
            <Flex
              direction="column"
              width="100vw"
              height="100vh"
              gap="0"
              backgroundColor="background.primary"
            >
              <Header />
              {children}
            </Flex>
            <Toaster />
          </UserProvider>
        </Authenticator>
      </>
  );
};
