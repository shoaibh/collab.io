import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { InviteModal } from "./invite-modal";
import { SettingsModal } from "./settings-modal";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { useShowTour } from "@/features/workspaces/store/use-show-tour";
import { checkIfMobile } from "@/lib/utils";

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
  isMobile,
}: {
  workspace: Omit<Doc<"workspaces">, "image"> & { imageStorageId: Id<"_storage"> | undefined | null; image?: string | null };
  isAdmin: boolean;
  isMobile: boolean;
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const [, setShowTour] = useShowTour();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.localStorage.getItem("show-tour") && !checkIfMobile()) {
      setShowTour(true);
      window.localStorage.setItem("show-tour", "false");
    }
  }, [setShowTour]);

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
      <div id={`${!isMobile ? "workspace-header" : ""}`} className="flex items-center justify-between p-4 gap-0.5">
        <WorkspaceSwitcher isMobile={isMobile} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id={`${!isMobile ? "workspace-settings" : ""}`}
              size="sm"
              variant="transparent"
              className="font-semibold  bg-gradient-to-r from-[#D4A373] to-[#E29578] text-lg w-auto p-1.5 overflow-hidden flex items-center"
            >
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
