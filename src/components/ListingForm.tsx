import { Schema } from "@/../amplify/data/resource";
import {
  Flex,
  StepperField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { SelectionSet } from "aws-amplify/api";

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

interface ListingFormProps {
  listing?: Listing;
  setListing?: React.Dispatch<React.SetStateAction<Listing>>;
}

export const ListingForm = ({ listing, setListing }: ListingFormProps) => {
  console.log(listing);
  return (
    <Flex direction="column">
      <TextField
        label="Title"
        name="title"
        value={listing?.title ?? ""}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, title: e.target.value };
          });
        }}
      />
      <TextField
        label="Type"
        name="type"
        value={listing?.type ?? ""}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, type: e.target.value };
          });
        }}
      />
      <TextAreaField
        label="description"
        name="description"
        value={listing?.description ?? ""}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, description: e.target.value };
          });
        }}
      />
      <TextAreaField
        label="Amenities"
        name="amenities"
        value={listing?.amenities ?? ""}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, amenities: e.target.value };
          });
        }}
      />
      <StepperField
        label="Number of bedrooms"
        name="numBedrooms"
        value={listing?.numBedrooms ?? 0}
        onStepChange={(value) => {
          setListing?.((l) => {
            return { ...l, numBedrooms: value };
          });
        }}
      />
      <StepperField
        label="Number of bathrooms"
        name="numBathrooms"
        value={listing?.numBathrooms ?? 0}
        onStepChange={(value) => {
          setListing?.((l) => {
            return { ...l, numBathrooms: value };
          });
        }}
      />
      <TextField
        type="number"
        label="Price"
        name="price"
        innerStartComponent={<>$</>}
        value={listing?.price ?? 0.0}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, price: parseFloat(e.target.value) };
          });
        }}
      />
      <TextField
        label="City"
        name="address.city"
        value={listing?.city ?? ""}
        onChange={(e) => {
          setListing?.((l) => {
            return { ...l, city: e.target.value };
          });
        }}
      />

      {/* <StorageManager
        acceptedFileTypes={["*"]}
        accessLevel="protected"
        maxFileCount={50}
        onFileRemove={({ key }) => {
          setImages((value) => value.filter((image) => image !== key));
        }}
        onUploadSuccess={({ key }) => {
          setImages((prevImages) => [`${key}`, ...prevImages]);
        }}
      /> */}
    </Flex>
  );
};
