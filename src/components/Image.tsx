import { Image as UIImage, ImageProps } from "@aws-amplify/ui-react";
import config from "@/../amplify_outputs.json";

export const Image = ({ src, ...rest }: ImageProps) => {
  return <UIImage {...rest} src={`https://${config.custom.cf}/${src}`} />;
};
