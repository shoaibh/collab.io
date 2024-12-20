import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

type EditorProps = {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  draggedImageSrc?: File | null;
};

const Editor = ({
  variant = "create",
  onCancel,
  onSubmit,
  placeholder = "start your thoughts here",
  defaultValue = [],
  disabled = false,
  innerRef,
  draggedImageSrc,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisibile, setIsToolbarVisibile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeHolderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draggedImageSrc) setImage(draggedImageSrc);
  }, [draggedImageSrc]);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeHolderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeHolderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || image || null;
                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);

    quillRef.current = quill;

    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [image, innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisibile(!isToolbarVisibile);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input type="file" accept="image/*" ref={imageElementRef} className="hidden" onChange={(e) => setImage(e.target.files![0])} />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50",
        )}
      >
        <div ref={containerRef} className="ql-custom h-full" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                  className=" hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image src={URL.createObjectURL(image)} alt="uploaded" fill className="rounded-xl overflow-hidden" />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisibile ? "Show formatting" : "Hide formatting"}>
            <Button disabled={disabled} size="sm" variant="ghost" onClick={toggleToolbar}>
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="emojis">
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button disabled={disabled} size="sm" variant="ghost" onClick={() => {}}>
                <Smile className="size-4" />
              </Button>
            </EmojiPopover>
          </Hint>
          {variant === "create" && (
            <Hint label="add image">
              <Button
                disabled={disabled}
                size="sm"
                variant="ghost"
                onClick={() => {
                  imageElementRef.current?.click();
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={disabled}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image });
                }}
                size="sm"
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size="sm"
              variant="ghost"
              className={cn(
                "ml-auto",
                !isEmpty ? "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white" : "bg-white hover:bg-white text-muted-foreground",
              )}
              onClick={() => {
                onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image });
              }}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition", !isEmpty && "opacity-100")}>
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
