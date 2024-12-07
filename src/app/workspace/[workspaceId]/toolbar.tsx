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
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useShowTour } from "@/features/workspaces/store/use-show-tour";
import { usePanel } from "@/hooks/use-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [showTour] = useShowTour();

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
    if (showTour) return;

    if (window.localStorage.getItem("show-banner")) {
      setShowBanner(false);
      return;
    }

    if (timer <= 0) {
      setShowBanner(false);
      window.localStorage.setItem("show-banner", "no");
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setTimer, showTour, timer]);

  const { onOpenProfile } = usePanel();

  const { data: member } = useCurrentMember({ workspaceId });

  const onProfileClick = () => {
    onOpenProfile(member!._id);
  };

  return (
    <>
      {currentUser?.isGuest && showBanner && (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center p-2 bg-[#e32e1e] relative">
          <span className="col-start-2 justify-self-center text-white font-semibold">
            Everything related to this guest user will be deleted after 24 hours. To not get your data deleted, log in with google or
            github.
          </span>

          <div className="flex col-start-3 justify-self-end text-white gap-2">
            <span className="font-semibold">Banner disappearing in {timer} seconds</span>
            <X
              onClick={() => {
                setShowBanner(false);
                window.localStorage.setItem("show-banner", "true");
              }}
              className="cursor-pointer  text-white"
            />
          </div>
        </div>
      )}
      <nav className="shadow-md flex gap-4 items-center justify-between h-14 p-4">
        <Image src="/collab-logo.png" alt="logo" width={40} height={70} className="flex-shrink-0" />
        <div id="search-bar" className="hidden lg:block flex-1 max-w-[542px]">
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="shadow-none border border-solid border-slate-200/50 bg-accent/25 hover:bg-accent/25 w-full justify-start h-8 p-3"
          >
            <Search className="size-4 text-[#4d311f] text-xs mr-3" />
            <span className="text-[#4d311f] truncate text-xs">Search {data?.name} Workspace</span>
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
        <div className=" ">
          <UserButton onProfileClick={onProfileClick} />
        </div>
      </nav>
    </>
  );
};
