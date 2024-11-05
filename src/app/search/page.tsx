"use client";
import * as React from "react";
import { useAIConversation } from "@/client";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserAvatar } from "@/components/UserAvatar";
import { UserContext } from "@/components/UserProvider";
import { AIContext } from "@/components/AIContext";
import ReactMarkdown from "react-markdown";
import { BookingCard } from "@/components/BookingCard";
import { WelcomeMessage } from "./WelcomeMessaage";
import { BeachPrompt, GardenPrompt, HotelPrompt } from "./SuggestedPrompts";
import { error } from "console";

export default function SearchPage() {
  const { user } = React.useContext(UserContext);
  const aiContext = React.useContext(AIContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("convoSearch");

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      displayText={{
        getMessageTimestampText: (date) =>
          date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
      }}
      messageRenderer={{
        text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
      }}
      welcomeMessage={<WelcomeMessage />}
      suggestedPrompts={[
        {
          inputText: "hello",
          component: <HotelPrompt />,
        },
        {
          inputText: "hello",
          component: <BeachPrompt />,
        },
        {
          inputText: "hello",
          component: <GardenPrompt />,
        },
      ]}
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
}
