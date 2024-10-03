import React, { useRef } from "react";
import dyanmic from "next/dynamic";
import Quill from "quill";

const Editor = dyanmic(() => import("@/components/editor"), { ssr: false });

type ChatInputProps = {
  placeholder: string;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = ({ body, image }: { body: string; image: File | null }) => {};

  return (
    <div className="mx-4">
      <Editor placeholder={placeholder} onSubmit={handleSubmit} disabled={false} innerRef={editorRef} />
    </div>
  );
};
