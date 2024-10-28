"use client";
import * as React from "react";
import { View } from "@aws-amplify/ui-react";
import { useAIConversation } from "@/client";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserAvatar } from "@/components/UserAvatar";
import { UserContext } from "@/components/UserProvider";
import { AIContext, AIContextProvider } from "@/components/AIContext";
import ReactMarkdown from "react-markdown";
import { BookingCard } from "@/components/BookingCard";

const Chat = () => {
  const { user } = React.useContext(UserContext);
  const aiContext = React.useContext(AIContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      messageRenderer={{
        text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
      }}
      handleSendMessage={(message) => {
        handleSendMessage({
          ...message,
          aiContext: aiContext?.data,
        });
      }}
      avatars={{
        user: {
          avatar: <UserAvatar />,
          username: user?.username ?? "",
        },
      }}
      allowAttachments
      responseComponents={{
        ListingCard: {
          description: "Used to display a rental listing to the user",
          component: ConnectedListingCard,
          props: {
            id: {
              type: "string",
              description: "The id of the listing to display",
            },
          },
        },
        BookingCard: {
          component: BookingCard,
          description: "UI component that lets users book a rental listing",
          props: {
            id: {
              type: "string",
              description: "ID of the listing",
            },
          },
        },
      }}
    />
  );
};

export default function SearchPage() {
  return (
    <AIContextProvider>
      <View
        flex="1"
        overflow="hidden"
        padding="xl"
        width="1200px"
        marginInline="auto"
      >
        <Chat />
      </View>
    </AIContextProvider>
  );
}
