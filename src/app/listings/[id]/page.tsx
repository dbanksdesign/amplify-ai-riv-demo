"use client";
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Flex,
  Grid,
  Heading,
  Placeholder,
  ScrollView,
  Text,
} from "@aws-amplify/ui-react";
import { Image } from "@/components/Image";
import { client } from "@/client";
import { Schema } from "../../../../amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import Markdown from "react-markdown";
import { Review } from "@/components/Review";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewSummarization } from "./ReviewSummarization";

const selectionSet = [
  "id",
  "title",
  "images",
  "amenities",
  "bedrooms",
  "city",
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
      <Flex direction="column" flex="1" padding="xl">
        {listing ? (
          <>
            <Grid templateColumns="repeat(3, auto)">
              {listing?.images && listing.images.length
                ? listing.images.map((image) => (
                    <Image key={image} src={image ?? ""} alt="" />
                  ))
                : null}
            </Grid>
            <Text>
              {listing?.type} in {listing?.city}
            </Text>
            <Heading level={1}>{listing?.title}</Heading>
            <Link href={`/listing/${id}/book`}>Book</Link>
            <Heading level={2}>Amenities</Heading>
            <Markdown>{listing?.amenities}</Markdown>

            <Heading level={2}>About this property</Heading>
            <Markdown>{listing?.description}</Markdown>

            <Heading level={2}>Reviews</Heading>
            <ReviewSummarization reviews={listing.reviews ?? []} />

            {listing?.reviews.map((review) => (
              <Review key={review.id} review={review} />
            ))}

            <ReviewForm id={listing.id} />
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
