import { Image as UIImage, ImageProps } from "@aws-amplify/ui-react";
import config from "@/../amplify_outputs.json";

export const Image = ({ src, ...rest }: ImageProps) => {
  // @ts-expect-error no typeing for json
  return <UIImage {...rest} src={`https://${config.custom.cf}/${src}`} />;
};
