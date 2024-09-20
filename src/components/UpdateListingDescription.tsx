import { getFormDataFromEvent } from "@/utils";
import { Button, Flex, TextAreaField } from "@aws-amplify/ui-react";

export const UpdateListingDescription = ({
  defaultValue,
  listingId,
}: {
  listingId: string;
  defaultValue?: string;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(getFormDataFromEvent(e));
    console.log({ listingId });
  };

  return (
    <Flex as="form" onSubmit={handleSubmit} direction="column">
      <TextAreaField
        autoResize
        label="Description"
        name="description"
        defaultValue={defaultValue}
      />
      <Button type="submit">Save</Button>
    </Flex>
  );
};
