import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogoLoader } from "@/components/ui/loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [, setCreateModalState] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  const filteredModeWorkspaces = workspaces?.filter((w) => w?._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-9 rounded-lg flex items-center justify-center relative  bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
        {workspaceLoading ? <LogoLoader /> : workspace?.name.charAt(0).toUpperCase()}{" "}
        <Plus className="size-4 bg-white/80 rounded-full absolute right-[-5px] bottom-[-5px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          disabled={workspacesLoading}
          className="cursor-pointer flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
        {filteredModeWorkspaces?.map((w) => (
          <DropdownMenuItem
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${w._id}`)}
            key={w._id}
          >
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {w.name.charAt(0)}
            </div>
            <p className="truncate">{w.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => setCreateModalState(true)}>
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
