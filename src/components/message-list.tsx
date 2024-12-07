import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { ChannelHero } from "./channel-hero";
import { ConversationHero } from "./conversation-hero";
import { Message } from "./message";
import { LogoLoader } from "./ui/loader";
import { useDeleteNotification } from "@/features/messages/api/use-delete-notification";
import { useGetNotificationStore } from "@/features/workspaces/store/use-get-notification-store";
import { useChannelId } from "@/hooks/use-channel-id";

const TIME_THRESHOLD = 2;

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

type MessageListProps = {
  channelName?: string;
  memberName?: string;
  memberId?: Id<"members">;
  memberImage?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore?: () => void;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
};

export const MessageList = ({
  channelName,
  memberName,
  memberId,
  memberImage,
  channelCreationTime,
  variant,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const currentChannelId = useChannelId();

  const workspaceId = useWorkspaceId();
  const { mutate: deleteNotification } = useDeleteNotification();
  const [notificationIds] = useGetNotificationStore();

  useEffect(() => {
    if (!notificationIds.length) return;

    (async () => {
      const notificationsToBeDeleted = notificationIds.map(async ({ id, channelId, memberId: notificationMemberId }) => {
        if (
          (currentChannelId && currentChannelId === channelId) ||
          (memberId === notificationMemberId && !channelId && !currentChannelId)
        ) {
          return await deleteNotification({ id: id }, {});
        }
      });
      await Promise.all(notificationsToBeDeleted);
    })();
  }, [currentChannelId, deleteNotification, memberId, notificationIds]);

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || []).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user._id &&
              differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadName={message.threadName}
                threadTimestamp={message.threadTimestamp}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore?.();
                }
              },
              { threshold: 1.0 },
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 w-full border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <LogoLoader />
          </span>
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && <ChannelHero name={channelName} creationTime={channelCreationTime} />}
      {variant === "conversation" && <ConversationHero name={memberName} memberId={memberId} image={memberImage} />}
    </div>
  );
};
