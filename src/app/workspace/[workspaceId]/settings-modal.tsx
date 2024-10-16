import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteWorkspaces } from "@/features/workspaces/api/use-delete-workspace";
import { useUpdateWorkspaces } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type SettingsModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  initialValue: string;
};

export const SettingsModal = ({ open, setOpen, initialValue }: SettingsModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible");
  const [value, setValue] = useState(initialValue);

  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isLoading: workspaceUpdating } = useUpdateWorkspaces();
  const { mutate: deleteWorkspace, isLoading: workspaceDeleting } = useDeleteWorkspaces();

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Name updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Error updating");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;
    deleteWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace deleted successfully");
          setOpen(false);
          router.replace("/");
        },
        onError: () => {
          toast.error("Error deleting");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                  </div>
                  <p className="text-sm"> {value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={workspaceUpdating}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={100}
                    placeholder="Workspace name"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={workspaceUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={workspaceUpdating}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-500"
                disabled={workspaceDeleting}
                onClick={handleDelete}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete workspace</p>
              </button>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
