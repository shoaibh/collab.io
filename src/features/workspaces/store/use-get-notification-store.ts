import { atom, useAtom } from "jotai";
import { Id } from "../../../../convex/_generated/dataModel";

const notificationState = atom<{ id: Id<"notifications">; channelId?: Id<"channels">; memberId?: Id<"members"> }[]>([]);

export const useGetNotificationStore = () => {
  return useAtom(notificationState);
};
