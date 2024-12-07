"use client";

import { useDefaultJoin } from "@/features/workspaces/api/use-default-join";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LogoLoader } from "@/components/ui/loader";

export default function Home() {
  const router = useRouter();
  const [createWorkspaceModal, setCreateWorkspaceModal] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const { mutate } = useDefaultJoin();

  const DEFAULT_WORKSPACE = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE;

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
      console.log("Workspace ID:", workspaceId);
    } else {
      mutate(
        { workspaceId: DEFAULT_WORKSPACE as Id<"workspaces"> },
        {
          onSuccess: (id) => {
            router.replace(`/workspace/${id}`);
            toast.success("Workspace joined");
          },
          onError: () => {
            toast.error("Failed to join workspace");
            setCreateWorkspaceModal(true);
          },
        },
      );
    }
  }, [workspaceId, isLoading, createWorkspaceModal, router, setCreateWorkspaceModal, mutate, DEFAULT_WORKSPACE]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <LogoLoader />
    </div>
  );
}
