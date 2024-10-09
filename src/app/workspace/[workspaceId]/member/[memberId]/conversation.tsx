import React from "react";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "../../channel/[channelId]/header";
import { MemberHeader } from "./member-header";
import { MemberChatInput } from "./member-chat-input";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";

type Conversation = {
  data: Doc<"conversations">;
};

export const Conversation = ({ data }: Conversation) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });

  const { results, status, loadMore } = useGetMessages({
    conversationId: data._id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MemberHeader memberName={member?.user.name} memberImage={member?.user.image} onClick={() => onOpenProfile(memberId)} />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <MemberChatInput placeholder={`Message ${member?.user.name}`} conversationId={data._id} />
    </div>
  );
};
