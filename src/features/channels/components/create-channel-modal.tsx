import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Text, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateChannel } from "../api/use-create-channel";
import { useCreateChannelModal } from "../store/use-create-channel-modal";

type ChannelType = "text" | "connect";

export const CreateChannelModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const [type, setType] = useState<ChannelType>("text");
  const workspaceId = useWorkspaceId();
  const { mutate, isLoading } = useCreateChannel();
  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId, type },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
          toast.success("channel created successfully");
        },
        onError: () => {
          toast.error("Failed to create channel");
        },
      },
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isLoading}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Channel Name"
          />
          <Select required onValueChange={(value) => setType(value as ChannelType)}>
            <SelectTrigger>
              <SelectValue placeholder="Channel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="text">
                  <div className="flex items-center justify-between gap-4">
                    Text
                    <Text />
                  </div>
                </SelectItem>
                <SelectItem value="connect">
                  <div className="flex items-center justify-between gap-4">
                    Connect
                    <VideoIcon />
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
      {/* <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
            </DialogActions> */}
    </Dialog>
  );
};
