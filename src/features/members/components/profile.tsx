import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useDeleteMember } from "../api/use-delete-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProfileProps = {
  memberId: Id<"members">;
  onClose: () => void;
};

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();

  const [LeaveDialog, confirmLeave] = useConfirm("Leave workspace", "Are you sure you want to leave this workspace?");

  const [UpdateDialog, confirmUpdate] = useConfirm("Change Role", "Are you sure you want to change the role of this member?");

  const [DeleteDialog, confirmDelete] = useConfirm("remove Member", "Are you sure you want to remove this member from this workspace?");

  const { data: currentMember, isLoading: currentMemberLoading } = useCurrentMember({
    workspaceId,
  });

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  console.log({ member });
  const { mutate: updateMember, isLoading: memberUpdating } = useUpdateMember();
  const { mutate: deleteMember, isLoading: memberDeleting } = useDeleteMember();

  const onRemove = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("member deleted");
          onClose();
        },
        onError: () => {
          toast.error("couldn't delete member");
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    deleteMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("You left the workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const onUpdateRole = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("role changed succesfully");
        },
        onError: () => {
          toast.error("failed to change role");
        },
      }
    );
  };

  if (memberLoading || currentMemberLoading || memberUpdating || memberDeleting) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[50px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="sm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground " />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[50px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="sm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground " />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.charAt(0).toUpperCase();
  return (
    <>
      <DeleteDialog />
      <UpdateDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[50px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="sm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl">{avatarFallback}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button onClick={() => onUpdateRole("admin")} variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdateRole(role as "admin" | "member")}>
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="w-full" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId && currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button onClick={onLeave} className="w-full" variant="outline">
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-muted-foreground">Email Address</p>
              <Link href={`mailto:${member.user.email}`} className="text-sm hover:underline text-[#1264a3]">
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
