"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [createWorkspaceModal, setCreateWorkspaceModal] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspace();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
    } else if (!createWorkspaceModal) {
      setCreateWorkspaceModal(true);
    }
  }, [workspaceId, isLoading]);
  return (
    <div>
      <UserButton />
    </div>
  );
}
