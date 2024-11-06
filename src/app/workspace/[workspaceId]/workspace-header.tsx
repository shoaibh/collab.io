import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { InviteModal } from "./invite-modal";
import { SettingsModal } from "./settings-modal";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: {
  workspace: Omit<Doc<"workspaces">, "image"> & { imageStorageId: Id<"_storage"> | undefined | null; image?: string | null };
  isAdmin: boolean;
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <>
      <InviteModal open={inviteOpen} setOpen={setInviteOpen} name={workspace.name} joinCode={workspace.joinCode} />
      <SettingsModal
        open={settingsOpen}
        setOpen={setSettingsOpen}
        initialValue={workspace.name}
        image={workspace.image}
        imageStorageId={workspace.imageStorageId || undefined}
      />
      <div id="workspace-header" className="flex items-center justify-between px-4 pt-4 h-[49px] gap-0.5">
        <WorkspaceSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="transparent" className="font-semibold text-lg w-auto p-1.5 overflow-hidden flex items-center">
              <span className="truncate ">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <Avatar className="size-9 mr-2">
                <AvatarImage src={workspace.image || undefined} />
                <AvatarFallback>{workspace.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">Active workspace</p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setInviteOpen(true)}>
                  Invite People to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer py-2">
                  Settings
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
