import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

export const useGetNotification = ({ channelId, memberId }: { channelId?: Id<"channels">; memberId?: Id<"members"> }) => {
  const data = useQuery(api.notifications.getUnreadNotifications, { channelId, memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
