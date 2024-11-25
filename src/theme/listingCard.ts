import { defineComponentTheme } from "@aws-amplify/ui-react/server";

export const listingCardTheme = defineComponentTheme({
  name: "listing-card",
  theme: (tokens) => {
    return {
      display: "flex",
      flexDirection: "row",
      // gap: tokens.space.large,
      borderRadius: tokens.radii.large,
      position: "relative",
      overflow: "hidden",
      padding: tokens.space.medium,
      _element: {
        image_container: {
          width: "30%",
          position: "relative",
          overflow: "hidden",
          borderRadius: tokens.radii.large,
        },
        image_small: {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        },
        content_small: {
          zIndex: 2,
          position: "relative",
          marginBlockStart: "25%",
          padding: tokens.space.medium,
          borderRadius: tokens.radii.large,
          overflow: "hidden",
          backdropFilter: "blur(5px)",
          width: "100%",
          "::before": {
            backgroundColor: tokens.colors.background.primary,
            position: "absolute",
            inset: "0",
            content: '""',
            opacity: 0.5,
            // backdropFilter: "blur(10px)",
            zIndex: -1,
          },
        },
        image: {
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        },
        content: {
          flex: "1",
          color: tokens.colors.font.secondary,
          paddingBlock: tokens.space.large,
          paddingInline: tokens.space.xl,
        },
      },
    };
  },
});
