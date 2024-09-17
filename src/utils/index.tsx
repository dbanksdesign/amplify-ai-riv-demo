import { Message, MessageProps } from "@aws-amplify/ui-react";
import { toast as SonnerToast } from "sonner";
import config from "@/../amplify_outputs.json";

export const getFormDataFromEvent = (
  event: React.FormEvent<HTMLFormElement>,
): { [k: string]: FormDataEntryValue } => {
  const formData = new FormData(event.target as HTMLFormElement);
  return Object.fromEntries(formData);
};

export const customToast = (props: MessageProps) => {
  SonnerToast.custom(() => <Message {...props} />);
};

export const imgUrl = (src: string) => `https://${config.custom.cf}/${src}`;
