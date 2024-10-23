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
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [timer, setTimer] = useState(10);

  const { data: currentUser } = useCurrentUser();

  const { data } = useGetWorkspace({ id: workspaceId });

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const onSearchClick = (id: string, routeType: "channel" | "member") => {
    setOpen(false);

    router.push(`/workspace/${workspaceId}/${routeType}/${id}`);
  };

  useEffect(() => {
    if (timer <= 0) {
      setShowBanner(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setTimer, timer]);

  return (
    <>
      {currentUser?.isGuest && showBanner && (
        <div className="flex p-2 bg-[#e32e1e] relative">
          <span className="flex-1 text-center text-white font-semibold">
            Everything related to this guest user will be deleted after 24 hours. To not get your data deleted, log in with google or
            github.
          </span>

          <div className="absolute right-3 flex text-white gap-2">
            <span className="font-semibold">Banner disappearing in {timer} seconds</span>
            <X onClick={() => setShowBanner(false)} className="cursor-pointer  text-white" />
          </div>
        </div>
      )}
      <nav className="bg-[#a16c47]/40 flex items-center justify-between h-14 p-1">
        <div className="flex-1 ml-2">
          <Image src="/collab-logo.png" alt="logo" width={40} height={70} />
        </div>
        <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
          <Button onClick={() => setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-8 p-3">
            <Search className="size-4 text-[#4d311f] text-xs mr-3" />
            <span className="text-[#4d311f] text-xs">Search {data?.name} Workspace</span>
          </Button>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {channels?.map((channel) => (
                  <CommandItem key={channel._id} onSelect={() => onSearchClick(channel._id, "channel")}>
                    {channel.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Members">
                {members?.map((member) => (
                  <CommandItem key={member._id} onSelect={() => onSearchClick(member._id, "member")}>
                    {member.user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end mr-2">
          <UserButton />
        </div>
      </nav>
    </>
  );
};
