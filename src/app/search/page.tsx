"use client";
import * as React from "react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import ReactMarkdown from "react-markdown";

import { useAIConversation } from "@/client";
import { AIContext } from "@/components/AIContext";
import { BookingCard } from "@/components/BookingCard";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserAvatar } from "@/components/UserAvatar";
import { UserContext } from "@/components/UserProvider";

export default function SearchPage() {
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
      aiContext={() => aiContext.data}
      handleSendMessage={handleSendMessage}
      allowAttachments
      avatars={{
        user: {
          avatar: <UserAvatar />,
          username: user?.username ?? "",
        },
      }}
      messageRenderer={{
        text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
      }}
      responseComponents={{
        ListingCard: {
          description: "used to display a rental listing to the user",
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
}
