"use client";

import { Loader, Loader2, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";
import { useState } from "react";

export const UserButton = ({ onProfileClick }: { onProfileClick: () => void }) => {
  const { data, isLoading } = useCurrentUser();
  const [logginOut, setLoggingOut] = useState(false);
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error); // Handle potential errors
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { name, image } = data;

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
          className="cursor-pointer block select-text"
          onClick={(e) => {
            e.preventDefault();
            onProfileClick();
          }}
        >
          <div className="text-sm font-semibold">{data.name}</div>
          <div className="text-xs text-muted-foreground">{data.email}</div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          {logginOut ? <Loader2 className="size-4 mr-2 animate-spin" /> : <LogOut className="size-4 mr-2" />} Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
