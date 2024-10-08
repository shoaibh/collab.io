import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

type ToolbarProps = {
  isAuthor: boolean;
  isLoading: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
};

export const Toolbar = ({
  isAuthor,
  isLoading,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow">
        <EmojiPopover hint="add reaction" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button variant="ghost" size="sm" disabled={isLoading} onClick={handleThread}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit">
              <Button onClick={handleEdit} variant="ghost" size="sm" disabled={isLoading}>
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="delete">
              <Button variant="ghost" onClick={handleDelete} size="sm" disabled={isLoading}>
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
