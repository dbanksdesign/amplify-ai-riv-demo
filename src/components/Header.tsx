"use client";
import * as React from "react";
import { Flex, View } from "@aws-amplify/ui-react";

import Link from "next/link";
import { UserContext } from "./UserProvider";
import { LuBird, LuSearch } from "react-icons/lu";
import { LinkedUserChip } from "@/components/UserChip";
import { headerTheme } from "@/theme/header";

export const Header = ({ children }: React.PropsWithChildren) => {
  const { user } = React.useContext(UserContext);
  return (
    <View className={headerTheme.className()}>
      <Flex
        direction="row"
        alignItems="center"
        width="1200px"
        marginInline="auto"
      >
        <Flex direction="row" alignItems="center" flex="1" gap="large">
          <Link href="/listings">
            <LuBird />
          </Link>
          <Link href="/search">
            <LuSearch />
          </Link>
        </Flex>
        <Flex direction="row" alignItems="center">
          <LinkedUserChip user={user} />
          {children}
        </Flex>
      </Flex>
    </View>
  );
};
