import * as React from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Flex,
  Grid,
  Placeholder,
  Text,
  View,
} from "@aws-amplify/ui-react";
import { Image } from "@/components/Image";
import { Schema } from "../../amplify/data/resource";
import { client } from "@/client";
import { Rating } from "@mantine/core";
import { LuBath, LuBed } from "react-icons/lu";
import { SelectionSet } from "aws-amplify/api";
import { listingCardTheme } from "@/theme/listingCard";
import { AIContext } from "./AIContext";

export const selectionSet = [
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
  "reviews.text",
] as const;

export type ListingWithSelection = SelectionSet<
  Schema["Listing"]["type"],
  typeof selectionSet
>;

interface ListingCardProps {
  listing?: SelectionSet<Schema["Listing"]["type"], typeof selectionSet>;
}

interface ConnectedListingCardProps {
  id?: string;
}

interface ListingCardsProps {
  listingIds?: string;
}

export const ListingCards = ({ listingIds }: ListingCardsProps) => {
  try {
    const ids: string[] = JSON.parse(listingIds ?? "");
    return (
      <Grid padding="xl" templateColumns="1fr 1fr" gap="large">
        {ids.map((id) => (
          <ConnectedSmallListingCard id={id} key={id} />
        ))}
      </Grid>
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const ConnectedSmallListingCard = ({
  id,
}: ConnectedListingCardProps) => {
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

  return listing ? (
    <Card className={className()} variation="outlined" padding="medium">
      <Image
        className={className({ _element: "image_small" })}
        src={listing.images?.[0] ?? ""}
        alt=""
      />
      <View className={className({ _element: "content_small" })}>
        <Flex
          direction="column"
          gap="xxs"
          className={className({ _element: "content" })}
        >
          <Text>
            {listing.type} in {listing.city}
          </Text>
          <Text fontSize="xl" fontWeight="bolder" color="font.primary">
            {listing.title}
          </Text>
          <Flex direction="row" alignItems="center" gap="xs">
            <Rating
              readOnly
              value={
                listing.reviews.reduce((acc, curr) => {
                  return acc + (curr.score ?? 0);
                }, 0) / 5
              }
            />
            <Text color="font.tertiary" fontSize="small">
              {listing.reviews.length} reviews
            </Text>
            <Text>&bull;</Text>
            <Flex direction="row" alignItems="center" gap="xs">
              <LuBed />
              <Text>{listing.numBedrooms} bedrooms</Text>
            </Flex>
            <Flex direction="row" alignItems="center" gap="xs">
              <LuBath />
              <Text>{listing.numBathrooms} bathrooms</Text>
            </Flex>
          </Flex>

          <Flex direction="row">
            <Text fontSize="xl" fontWeight="light">
              ${listing.price}
              <Text as="span" fontSize="medium">
                /night
              </Text>
            </Text>
            <Button variation="primary">Book now</Button>
            <Link className={"amplify-button"} href={`/listings/${listing.id}`}>
              Details
            </Link>
          </Flex>
        </Flex>
      </View>
    </Card>
  ) : (
    <Card>
      <Placeholder />
    </Card>
  );
};

export const ConnectedListingCard = ({ id }: ConnectedListingCardProps) => {
  const [listing, setListing] = React.useState<ListingWithSelection>();
  const { setData } = React.useContext(AIContext);

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
      setData({
        listing: results.data,
      });
    });
  }, [id, setData]);

  return listing ? (
    <ListingCard listing={listing} />
  ) : (
    <Card>
      <Placeholder />
    </Card>
  );
};

const { className } = listingCardTheme;

export const ListingCard = ({ listing }: ListingCardProps) => {
  if (!listing) {
    return null;
  }
  const score = listing.reviews.length
    ? listing.reviews.reduce((acc, curr) => {
        return acc + (curr.score ?? 0);
      }, 0) / listing.reviews.length
    : 0;

  return (
    <Card className={className()} variation="elevated">
      <View className={className({ _element: "image_container" })}>
        <Image
          className={className({ _element: "image" })}
          src={listing.images?.[0] ?? ""}
          alt=""
        />
      </View>
      <Flex
        direction="column"
        gap="small"
        className={className({ _element: "content" })}
      >
        <Text color="font.tertiary">
          {listing.type} in {listing.city}
        </Text>
        <Text fontSize="xl" fontWeight="bolder" color="font.primary">
          {listing.title}
        </Text>
        <Flex direction="row">
          <Flex direction="row" alignItems="center" gap="xs">
            <LuBed />
            <Text>{listing.numBedrooms} bedrooms</Text>
          </Flex>
          <Flex direction="row" alignItems="center" gap="xs">
            <LuBath />
            <Text>{listing.numBathrooms} bathrooms</Text>
          </Flex>
        </Flex>
        <Flex direction="row">
          <Rating readOnly value={score} />
          <Text color="font.tertiary" fontSize="small">
            {listing.reviews.length} reviews
          </Text>
        </Flex>
        <Text fontSize="xl" fontWeight="light">
          ${listing.price}
          <Text as="span" fontSize="medium">
            /night
          </Text>
        </Text>
        <Flex direction="row">
          <Button variation="primary">Book now</Button>
          <Link className={"amplify-button"} href={`/listings/${listing.id}`}>
            Details
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
};
