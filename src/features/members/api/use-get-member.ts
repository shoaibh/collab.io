import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMember = ({ id }: { id: Id<"members"> }) => {
  const data = useQuery(api.members.getById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};
