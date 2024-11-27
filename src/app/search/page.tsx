"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { useAIConversation } from "@/client";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { UserContext } from "@/components/UserProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { ConnectedListingCard } from "@/components/ListingCard";
import { BookingCard } from "@/components/BookingCard";

export default function SearchPage() {
  const { user } = React.useContext(UserContext);
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
      handleSendMessage={handleSendMessage}
      avatars={{
        user: {
          username: user?.username ?? undefined,
          avatar: <UserAvatar />,
        },
      }}
      messageRenderer={{
        text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
      }}
      allowAttachments
      responseComponents={{
        ListingCard: {
          component: ConnectedListingCard,
          description: "UI component used to display a listing",
          props: {
            id: {
              type: "string",
              required: true,
              description: "ID of the listing",
            },
          },
        },
        BookingCard: {
          component: BookingCard,
          description: "UI component used to book a listing",
          props: {
            id: {
              type: "string",
              required: true,
              description: "ID of the listing",
            },
          },
        },
      }}
    />
  );
}
