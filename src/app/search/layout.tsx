"use client";

import { AIContextProvider } from "@/components/AIContext";
import { View } from "@aws-amplify/ui-react";

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AIContextProvider>
      <View
        flex="1"
        overflow="hidden"
        padding="xl"
        width="1200px"
        marginInline="auto"
      >
        {children}
      </View>
    </AIContextProvider>
  );
}
