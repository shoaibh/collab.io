"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <Input value="" disabled={false} required autoFocus minLength={3} placeholder="Your Workspace name" />
          <div className="flex justify-end">
            <Button disabled={false}>Create new workspace</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
