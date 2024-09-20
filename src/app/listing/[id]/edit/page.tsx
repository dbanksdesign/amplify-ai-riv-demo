"use client";
import * as React from "react";
import { SelectionSet } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { Flex, Button, Placeholder, View } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import { customToast } from "@/utils";
import { UserContext } from "@/components/UserProvider";
import { ListingForm } from "@/components/ListingForm";
import { useParams } from "next/navigation";
import { client } from "@/client";

const selectionSet = [
  "id",
  "title",
  "images",
  "amenities",
  "bedrooms",
  "city",
  "description",
  "type",
  "numBathrooms",
  "numBedrooms",
  "price",
] as const;

type Listing = SelectionSet<Schema["Listing"]["type"], typeof selectionSet>;

export default function UpdateListingPage() {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = React.useState<(string | null)[]>([]);
  const [listing, setListing] = React.useState<Listing>();
  const [loading, setLoading] = React.useState(false);
  const { user } = React.useContext(UserContext);

  const handleSave = async () => {
    if (listing) {
      setLoading(true);

      client.models.Listing.update({
        ...listing,
        images,
      }).then(() => {
        setLoading(false);
        customToast({
          variation: "outlined",
          colorTheme: "success",
          heading: "Listing saved!",
        });
      });
    } else {
      console.error("No listing!");
    }
  };

  React.useEffect(() => {
    if (id) {
      client.models.Listing.get(
        {
          id,
        },
        {
          selectionSet,
        }
      ).then(({ data, ...rest }) => {
        console.log({ data, rest });
        if (!data) return;
        setListing(data);
        setImages(data.images ?? []);
      });
    }
  }, [id]);

  return (
    <>
      {listing ? (
        <Flex direction="row" padding="large">
          <View flex="1">
            <ListingForm
              listing={listing}
              // @ts-expect-error boo
              setListing={setListing}
            />
          </View>
          <View flex="1">
            <StorageManager
              acceptedFileTypes={["*"]}
              accessLevel="protected"
              maxFileCount={50}
              // @ts-expect-error dunno
              defaultFiles={listing.images?.map((img) => ({ key: img }))}
              onFileRemove={({ key }) => {
                setImages((value) => value.filter((image) => image !== key));
              }}
              onUploadSuccess={({ key }) => {
                setImages((prevImages) => [
                  `protected/${user?.identityId}/${key}`,
                  ...prevImages,
                ]);
              }}
            />
          </View>
        </Flex>
      ) : (
        <Placeholder />
      )}

      <Button variation="primary" isLoading={loading} onClick={handleSave}>
        Save
      </Button>
    </>
  );
}
