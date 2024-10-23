"use client";

import { LogoLoader } from "@/components/ui/loader";
import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data, mutate, isLoading } = useCreateOrGetConversations();

  useEffect(() => {
    mutate({ workspaceId, memberId }, { onError: () => toast.error("failed to load messages") });
  }, [memberId, workspaceId, mutate]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex -col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    );
  }

  return <Conversation data={data} />;
};

export default MemberIdPage;
