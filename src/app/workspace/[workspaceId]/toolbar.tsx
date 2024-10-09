import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useState(false);

  const { data } = useGetWorkspace({ id: workspaceId });

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const onSearchClick = (id: string, routeType: "channel" | "member") => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/${routeType}/${id}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button onClick={() => setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
          <Search className="size-4 text-white text-xs" />
          <span className="text-white text-xs">Search {data?.name} Workspace</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {channels?.map((channel) => <CommandItem onSelect={() => onSearchClick(channel._id, "channel")}>{channel.name}</CommandItem>)}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => <CommandItem onSelect={() => onSearchClick(member._id, "member")}>{member.user.name}</CommandItem>)}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="sm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
