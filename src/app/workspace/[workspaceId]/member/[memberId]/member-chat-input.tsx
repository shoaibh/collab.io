import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dyanmic from "next/dynamic";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import imageCompression from "browser-image-compression";

const Editor = dyanmic(() => import("@/components/editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
  conversationId: Id<"conversations">;
  draggedImageSrc?: File | null;
};

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const MemberChatInput = ({ placeholder, conversationId, draggedImageSrc }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [draggedImage, setDraggedImage] = useState<File | null>(null);

  useEffect(() => {
    if (draggedImageSrc) setDraggedImage(draggedImageSrc);
  }, [draggedImageSrc]);
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({ throwError: true });
        const compressedFile = await imageCompression(image, {
          maxSizeMB: 1, // Maximum file size (in MB)
          maxWidthOrHeight: 1920, // Resize if dimensions exceed this value
          initialQuality: 0.85, // Reduce quality to 70%
        });
        if (!url) {
          throw new Error("url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": compressedFile.type,
          },
          body: compressedFile,
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
      setDraggedImage(null);
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
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        draggedImageSrc={draggedImage}
      />
    </div>
  );
};
