import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva("flex items-center gap1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden", {
  variants: {
    variant: {
      default: "text-[#f9edffcc]",
      active: "text-[#481349] bg-white/90 hover:bg-white/90",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type SidebarItemProps = {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
  newNotifications: number;
};

export const SidebarItem = ({ label, id, icon: Icon, variant, newNotifications }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button variant="transparent" size="sm" asChild className={cn(sidebarItemVariants({ variant }), "hover:bg-[#85582433]")}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon
          className={`size-3.5 mr-1 shrink-0   ${newNotifications > 0 && variant !== "active" ? " text-[#312316] font-bold" : "font-bold text-black"}`}
        />
        <span
          className={`text-sm truncate font-semibold ${variant === "active" && "text-black"} ${newNotifications > 0 && variant !== "active" ? " text-[#312316] font-bold" : "font-bold text-[#634029] "}`}
        >
          {label}
        </span>
        {newNotifications > 0 && <span className="ml-auto bg-white text-[#634029] px-2 rounded-full font-bold">{newNotifications}</span>}
      </Link>
    </Button>
  );
};
