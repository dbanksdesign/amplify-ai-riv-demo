"use client";
import * as React from "react";
import { client } from "@/client";
import { Flex, ScrollView } from "@aws-amplify/ui-react";
import { ListingCard, ListingWithSelection } from "@/components/ListingCard";

export default function ListingsPage() {
  const [listings, setListings] = React.useState<ListingWithSelection[]>([]);
  React.useEffect(() => {
    client.models.Listing.observeQuery({
      selectionSet: [
        "id",
        "description",
        "title",
        "price",
        "city",
        "type",
        "images",
        "numBathrooms",
        "numBedrooms",
        "reviews.score",
      ],
    }).subscribe({
      next({ items, isSynced }) {
        console.log({ items });
        if (isSynced) {
          setListings([...items]);
        }
      },
    });
  }, []);

  return (
    <ScrollView>
      <Flex direction="column" padding="xl">
        {listings.map((listing) => (
          <ListingCard listing={listing} key={listing.id} />
        ))}
      </Flex>
    </ScrollView>
  );
}
