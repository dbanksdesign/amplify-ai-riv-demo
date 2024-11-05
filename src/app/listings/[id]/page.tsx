"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Placeholder,
  ScrollView,
  StepperField,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import { Image } from "@/components/Image";
import { client } from "@/client";
import { Schema } from "../../../../amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import Markdown from "react-markdown";
import { Review } from "@/components/Review";
import { ReviewSummarization } from "./ReviewSummarization";
import { LuBath, LuBed } from "react-icons/lu";

const selectionSet = [
  "id",
  "title",
  "images",
  "amenities",
  "bedrooms",
  "numBathrooms",
  "numBedrooms",
  "city",
  "price",
  "description",
  "type",
  "host.id",
  "host.username",
  "reviews.createdAt",
  "reviews.score",
  "reviews.text",
  "reviews.id",
  "reviews.reviewer.username",
  "reviews.reviewer.id",
] as const;

export type Listing = SelectionSet<
  Schema["Listing"]["type"],
  typeof selectionSet
>;

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = React.useState<Listing>();

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
    <ScrollView height="100%">
      <Flex
        direction="column"
        flex="1"
        padding="xxl"
        maxWidth="1200px"
        marginInline="auto"
      >
        {listing ? (
          <>
            <Heading level={1}>{listing?.title}</Heading>

            <Grid
              gap="large"
              templateColumns="repeat(3, 1fr)"
              templateRows="masonry"
            >
              {listing?.images && listing.images.length
                ? listing.images.map((image) => (
                    <Image key={image} src={image ?? ""} alt="" />
                  ))
                : null}
            </Grid>
            <Flex direction="row" alignItems="flex-start" gap="xl">
              <Flex direction="column" flex="1">
                <Heading level={2}>
                  {listing?.type} in {listing?.city}
                </Heading>
                <Flex direction="row">
                  <Flex direction="row" alignItems="center" gap="xs">
                    <LuBed />
                    <Text>{listing?.numBedrooms} bedrooms</Text>
                  </Flex>
                  <Flex direction="row" alignItems="center" gap="xs">
                    <LuBath />
                    <Text>{listing?.numBathrooms} bathrooms</Text>
                  </Flex>
                </Flex>

                <Heading level={2}>Amenities</Heading>
                <Markdown>{listing?.amenities}</Markdown>

                <Heading level={2}>About this property</Heading>
                <Markdown>{listing?.description}</Markdown>
              </Flex>
              <Card variation="elevated" width="40%">
                <Flex direction="column">
                  <Text fontWeight="bold" fontSize="large">
                    ${listing?.price}
                  </Text>
                  <TextField label="Check-in" type="date" />
                  <TextField label="Check-out" type="date" />
                  <StepperField label="Guests" />
                  <Button variation="primary">Book now</Button>
                </Flex>
              </Card>
            </Flex>
            <Heading level={2}>Reviews</Heading>
            <Flex direction="row" alignItems="center">
              <Flex direction="row" alignItems="baseline" shrink="0">
                <Text fontWeight="bold" fontSize="xl">
                  {(
                    listing.reviews.reduce((prev, curr) => {
                      return prev + (curr.score ?? 0);
                    }, 0) / listing.reviews.length
                  ).toFixed(2)}
                </Text>
                <Text>{listing.reviews.length} reviews</Text>
              </Flex>
              <View flex="1">
                <ReviewSummarization reviews={listing.reviews ?? []} />
              </View>
            </Flex>

            <Flex direction="column" gap="large">
              {listing?.reviews.map((review) => (
                <Review key={review.id} review={review} />
              ))}
            </Flex>

            {/* <ReviewForm id={listing.id} /> */}
          </>
        ) : (
          <>
            <Placeholder />
            <Placeholder />
            <Placeholder width="50%" />
          </>
        )}
      </Flex>
    </ScrollView>
  );
}
