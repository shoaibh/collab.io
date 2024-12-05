import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

export const Header = ({ title }: { title: string }) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible");
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);
  const router = useRouter();

  const { mutate: updateChannel, isLoading: channelUpdating } = useUpdateChannel();
  const { mutate: deleteChannel, isLoading: channelDeleting } = useRemoveChannel();
  const { data: member } = useCurrentMember({ workspaceId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleEditOpen = () => {
    if (member?.role !== "admin") return;

    setEditOpen(true);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;
    deleteChannel(
      {
        id: channelId,
      },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Error deleting");
        },
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Channel updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="shadow h-[50px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-lg text-black font-semibold px-2 overflow-hidden w-auto">
              <span># {title}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border curosr-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold cursor-pointer">Edit</p>
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this Workspace</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      value={value}
                      onChange={handleChange}
                      disabled={channelUpdating}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={100}
                      placeholder="channel name"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={channelUpdating}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={channelUpdating}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  disabled={channelDeleting}
                  onClick={handleDelete}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
