"use client";

import { MessageList } from "@/components/message-list";
import { LogoLoader } from "@/components/ui/loader";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { Image, TriangleAlert } from "lucide-react";
import { ChatInput } from "./chat-input";
import { Header } from "./header";
import { MediaRoom } from "@/components/media-room";
import { useState, DragEvent, useEffect } from "react";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const [imageSrc, setImageSrc] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });
  const { results: messages, status, loadMore } = useGetMessages({ channelId });

  useEffect(() => {
    if (dragCounter === 0) {
      setIsDragging(false); // Only set to false when completely left
    }
  }, [dragCounter]);

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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Reset dragging state

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageSrc(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter((prevCount) => prevCount + 1); // Increment counter

    if (e.dataTransfer.items[0]?.type.startsWith("image/")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter((prevCount) => prevCount - 1); // Decrement counter
  };

  return (
    <div
      className="flex flex-col h-full relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {channel.type === "text" && (
        <>
          {isDragging && (
            <div className="bg-white z-10 absolute left-0 top-0 h-full w-full grid place-content-center opacity-70">
              <div>
                <Image className="size-20 m-auto" />
                <div>
                  Share in <b>#{channel.name}</b>
                </div>
              </div>
            </div>
          )}
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
          <ChatInput placeholder={`Message #${channel.name}`} draggedImageSrc={imageSrc} />
        </>
      )}
      {channel.type === "connect" && <MediaRoom channelId={channel._id} />}
    </div>
  );
};

export default ChannelIdPage;
