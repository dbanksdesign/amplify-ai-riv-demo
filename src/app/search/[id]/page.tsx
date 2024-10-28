"use client";
import * as React from "react";
import { View } from "@aws-amplify/ui-react";
import { Chat } from "./Chat";

export default function SearchPage({ params }: { params: { id: string } }) {
  return (
    <View flex="1" overflow="hidden">
      <Chat id={params.id} />
    </View>
  );
}
