import type { Schema } from "../../data/resource";

export const handler: Schema["getSalesForListing"]["functionHandler"] = async (
  event
) => {
  return {
    sales: Math.random() * 10000,
  };
};
