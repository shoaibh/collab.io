import { MessageList } from "@/components/message-list";
import { LogoLoader } from "@/components/ui/loader";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { usePanel } from "@/hooks/use-panel";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { MemberChatInput } from "./member-chat-input";
import { MemberHeader } from "./member-header";
import { useDragImage } from "@/hooks/use-drag-image";
import { Image as ImageIcon } from "lucide-react";

type Conversation = {
  data: Doc<"conversations">;
};

export const Conversation = ({ data }: Conversation) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { imageSrc, isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragImage();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });

  const { results, status, loadMore } = useGetMessages({
    conversationId: data._id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full shadow-md ml-10 rounded-lg"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className="bg-white z-10 absolute left-0 top-0 h-full w-full grid place-content-center opacity-70">
          <div>
            <ImageIcon className="size-20 m-auto" />
            <div>
              Share with <b>{member?.user.name}</b>
            </div>
          </div>
        </div>
      )}
      <MemberHeader memberName={member?.user.name} memberImage={member?.user.image} onClick={() => onOpenProfile(memberId)} />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberId={member?._id}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <MemberChatInput placeholder={`Message ${member?.user.name}`} conversationId={data._id} draggedImageSrc={imageSrc} />
    </div>
  );
};
