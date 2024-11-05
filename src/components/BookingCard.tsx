import * as React from "react";
import { client } from "@/client";
import {
  Button,
  Card,
  Flex,
  StepperField,
  Text,
  TextField,
} from "@aws-amplify/ui-react";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

const selectionSet = ["price", "title"] as const;

type ListingWithSelection = SelectionSet<
  Schema["Listing"]["type"],
  typeof selectionSet
>;

export const BookingCard = ({ id }: { id: string }) => {
  const [listing, setListing] = React.useState<ListingWithSelection>();

  React.useEffect(() => {
    if (!id) return;
    client.models.Listing.get(
      {
        id,
      },
      {
        selectionSet,
      }
    ).then((results) => {
      if (!results.data) {
        return;
      }
      setListing(results.data);
    });
  }, [id]);
  return (
    <Card variation="elevated" width="80%">
      <Flex direction="column">
        <Text fontSize="xl" color="hotpink">
          {listing?.title}
        </Text>
        <Text fontWeight="bold" fontSize="large">
          ${listing?.price}{" "}
          <Text as="span" fontSize="small" color="font.tertiary">
            / per night
          </Text>
        </Text>
        <TextField label="Check-in" type="date" />
        <TextField label="Check-out" type="date" />
        <StepperField label="Guests" />
        <Button variation="primary">Book now</Button>
      </Flex>
    </Card>
  );
};
