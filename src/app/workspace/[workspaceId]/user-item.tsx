import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useGetNotification } from "@/features/messages/api/use-get-notification";
import { useGetNotificationStore } from "@/features/workspaces/store/use-get-notification-store";

const userItemVariants = cva("flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden", {
  variants: {
    variant: {
      default: "text-[#f9edffcc]",
      active: "text-white bg-white/90 hover:bg-white/90",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type UserItemProps = {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
};

export const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();

  const { data } = useGetNotification({ memberId: id });
  const [, setNotificationIds] = useGetNotificationStore();

  useEffect(() => {
    if (data?.length) {
      console.log("=", { id, data });
      setNotificationIds(
        data.map((d) => {
          return { id: d._id, memberId: d.senderId as Id<"members"> };
        }),
      );
    }
  }, [data, id, setNotificationIds]);
  const newNotifications = data?.length || 0;

  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button variant="transparent" className={cn(userItemVariants({ variant }), "hover:bg-[#f2c74433]/10")} size="sm" asChild>
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm">{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className={`text-sm truncate text-[#634029] ${newNotifications > 0 && "font-bold "}`}>{label}</span>
        {newNotifications > 0 && <span className="ml-auto bg-white text-[#634029] px-2 rounded-full font-bold">{newNotifications}</span>}
      </Link>
    </Button>
  );
};
