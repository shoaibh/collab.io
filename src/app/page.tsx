"use client";

import { useDefaultJoin } from "@/features/workspaces/api/use-default-join";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { LogoLoader } from "@/components/ui/loader";

const DEFAULT_WORKSPACE = "k175ksv2c2kcm82bat2bc46y9n7363wt";

export default function Home() {
  const router = useRouter();
  const [createWorkspaceModal, setCreateWorkspaceModal] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const { mutate } = useDefaultJoin();

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
          onError: () => toast.error("Failed to join workspace"),
        },
      );
    }
  }, [workspaceId, isLoading, createWorkspaceModal, router, setCreateWorkspaceModal, mutate]);

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
