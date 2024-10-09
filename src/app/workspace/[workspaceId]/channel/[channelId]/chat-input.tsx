import React, { useRef, useState } from "react";
import dyanmic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dyanmic(() => import("@/components/editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({ throwError: true });

        if (!url) {
          throw new Error("url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {
        onSuccess: () => {
          editorRef.current?.focus();
        },
        onError: (error) => {
          console.error(error);
        },
        throwError: true,
      });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (e) {
      console.log(e);
      toast.error("Failed to send message");
    } finally {
      editorRef.current?.enable(false);
      setIsPending(false);
    }
  };

  return (
    <div className="mx-4">
      <Editor key={editorKey} placeholder={placeholder} onSubmit={handleSubmit} disabled={isPending} innerRef={editorRef} />
    </div>
  );
};
