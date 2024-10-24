"use client";

import { MessageList } from "@/components/message-list";
import { LogoLoader } from "@/components/ui/loader";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { TriangleAlert } from "lucide-react";
import { ChatInput } from "./chat-input";
import { Header } from "./header";
import { MediaRoom } from "@/components/media-room";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });
  const { results: messages, status, loadMore } = useGetMessages({ channelId });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {channel.type === "text" && (
        <>
          <Header title={channel.name} />
          <MessageList
            channelName={channel.name}
            channelCreationTime={channel._creationTime}
            data={messages}
            loadMore={loadMore}
            isLoadingMore={status === "LoadingMore"}
            canLoadMore={status === "CanLoadMore"}
            variant="channel"
          />
          <ChatInput placeholder={`Message #${channel.name}`} />
        </>
      )}
      {channel.type === "connect" && <MediaRoom channelId={channel._id} />}
    </div>
  );
};

export default ChannelIdPage;
