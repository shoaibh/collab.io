"use client";

import { Loader, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React from "react";
import { useCurrentUser } from "../api/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePanel } from "@/hooks/use-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

export const UserButton = () => {
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    try {
      await signOut(); // Wait for signOut to complete
      window.location.href = "/"; // Redirect after successful logout
    } catch (error) {
      console.error("Logout failed:", error); // Handle potential errors
    }
  };

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { name, image } = data;

  // const { onOpenProfile } = usePanel();

  const workspaceId = useWorkspaceId();

  const { data: member } = useCurrentMember({ workspaceId });

  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger id="user" className="outline-none relative">
        <Avatar className="rounded-md size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-[#ABABAD]/80 text-[#4d311f]">{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="left" className="w-60">
        <DropdownMenuItem
          className="cursor-text block select-text"
          onClick={(e) => {
            e.preventDefault();
            // if (member) {
            //   onOpenProfile(member?._id);
            // }
          }}
        >
          <div className="text-sm font-semibold">{data.name}</div>
          <div className="text-xs text-muted-foreground">{data.email}</div>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="size-4 mr-2" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
