import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[10px] pb-1">
      <WorkspaceSwitcher />
      <SidebarButton Icon={Home} label="home" isActive />
      <SidebarButton Icon={MessageSquare} label="DMs" />
      <SidebarButton Icon={Bell} label="Activity" />
      <SidebarButton Icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
