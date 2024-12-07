import React, { useEffect } from "react";
import { SidebarItem } from "./sidebar-item";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { HashIcon, VideoIcon } from "lucide-react";
import { useGetNotification } from "@/features/messages/api/use-get-notification";
import { useGetNotificationStore } from "@/features/workspaces/store/use-get-notification-store";

export const ChannelSidebar = ({ item, channelId }: { item: Doc<"channels">; channelId: Id<"channels"> }) => {
  const { data } = useGetNotification({ channelId: item._id });

  const [, setNotificationIds] = useGetNotificationStore();

  useEffect(() => {
    if (data?.length) {
      setNotificationIds(
        data.map((d) => {
          return { id: d._id, channelId: d.channelId as Id<"channels"> };
        }),
      );
    }
  }, [channelId, data, setNotificationIds]);

  return (
    <SidebarItem
      variant={channelId === item._id ? "active" : "default"}
      key={item._id}
      label={item.name}
      icon={item.type === "text" ? HashIcon : VideoIcon}
      id={item._id}
      newNotifications={data ? data.length : 0}
    />
  );
};
