"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaces } from "../api/use-create-workspaces";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();

  const [name, setName] = useState("");
  const { mutate, isLoading } = useCreateWorkspaces();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: (id) => {
          console.log("Workspace created successfully", id);
          toast.success("Workspace created successfully. Redirecting to workspace page...");
          router.push(`/workspace/${id}`);
          handleClose();
        },
        onError: () => {
          console.error("Failed to create workspace");
        },
        onSettled: () => {
          // No-op
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            autoFocus
            minLength={3}
            placeholder="Your Workspace name"
          />
          <div className="flex justify-end">
            <Button disabled={isLoading}>Create new workspace</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
