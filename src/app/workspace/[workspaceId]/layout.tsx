"use client";

import { LogoLoader } from "@/components/ui/loader";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Profile } from "@/features/members/components/profile";
import { Thread } from "@/features/messages/components/thread";
import { usePanel } from "@/hooks/use-panel";
import { Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";

const RightSideBar = ({
  parentMessageId,
  profileMemberId,
  onClose,
}: {
  parentMessageId: string | null;
  profileMemberId: string | null;
  onClose: () => void;
}) => {
  return (
    <>
      {parentMessageId ? (
        <Thread messageId={parentMessageId as Id<"messages">} onClose={onClose} />
      ) : profileMemberId ? (
        <Profile memberId={profileMemberId as Id<"members">} onClose={onClose} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <LogoLoader />
        </div>
      )}
    </>
  );
};

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-56px)] relative">
        <button
          className="lg:hidden flex flex-col bg-[#634029]/90 h-full p-2 top-4 left-4 z-10"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="text-white" />
        </button>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#634029]/90 z-20 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden lg:translate-x-0`}
        >
          <WorkspaceSidebar toggleSidebar={toggleSidebar} />
        </div>

        {/* Backdrop when the sidebar is open on mobile */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" onClick={toggleSidebar} />}
        <ResizablePanelGroup direction="horizontal" autoSaveId={"collab-workspace-layout"}>
          <ResizablePanel defaultSize={20} minSize={11} className="bg-[#634029]/90 hidden lg:block">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29} className="hidden lg:block">
                <RightSideBar parentMessageId={parentMessageId} onClose={onClose} profileMemberId={profileMemberId} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        <div
          className={`fixed top-0 right-0 h-full w-[calc(100vw-50px)] bg-white z-20 transition-transform duration-300 transform ${
            showPanel ? "translate-x-0" : "translate-x-full"
          } lg:hidden `}
        >
          <RightSideBar parentMessageId={parentMessageId} onClose={onClose} profileMemberId={profileMemberId} />
        </div>

        {showPanel && <div className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" onClick={onClose} />}
      </div>
    </div>
  );
};

export default WorkspaceLayout;
