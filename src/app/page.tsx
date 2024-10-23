"use client";

import { useDefaultJoin } from "@/features/workspaces/api/use-default-join";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

const DEFAULT_WORKSPACE = "k173q3bmgd547p3b9z97993hcs7341a2";

export default function Home() {
  const router = useRouter();
  const [createWorkspaceModal, setCreateWorkspaceModal] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const { mutate, isLoading: isJoiningWorkspace } = useDefaultJoin();

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
  }, [workspaceId, isLoading, createWorkspaceModal, router, setCreateWorkspaceModal]);
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
