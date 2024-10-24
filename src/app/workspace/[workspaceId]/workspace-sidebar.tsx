import { LogoLoader } from "@/components/ui/loader";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, HashIcon, MessageSquareText, SendHorizonal, VideoIcon, X } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { UserItem } from "./user-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

export const WorkspaceSidebar = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [, setOpen] = useCreateChannelModal();
  const { data: currentMember, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId: workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId: workspaceId });

  if (workspaceLoading || memberLoading || membersLoading)
    return (
      <div className="flex flex-col bg-[#634029]/90 h-full items-center justify-center">
        <LogoLoader />
      </div>
    );

  if (!workspace || !currentMember)
    return (
      <div className="flex flex-col gap-y-2 bg-[#634029]/90 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace or member not found</p>
      </div>
    );

  return (
    <div className="flex flex-col bg-[#634029]/90 relative h-full pt-10 lg:pt-0">
      <X className="absolute cursor-pointer top-2 right-2 lg:hidden text-white" onClick={toggleSidebar} />
      <WorkspaceHeader workspace={workspace} isAdmin={currentMember.role === "admin"} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sends" icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection label="Channels" hint="New Channel" onNew={currentMember.role === "admin" ? () => setOpen(true) : undefined}>
        {channels?.map((item) => (
          <SidebarItem
            variant={channelId === item._id ? "active" : "default"}
            key={item._id}
            label={item.name}
            icon={item.type === "text" ? HashIcon : VideoIcon}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New Direct Message">
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
