"use client";

import { LogoLoader } from "@/components/ui/loader";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Profile } from "@/features/members/components/profile";
import { Thread } from "@/features/messages/components/thread";
import { useShowTour } from "@/features/workspaces/store/use-show-tour";
import { usePanel } from "@/hooks/use-panel";
import { Menu } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Toolbar } from "./toolbar";
import { TourGuide } from "./tour-guide";
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

const tourSteps = [
  {
    selector: "#workspace-header",
    title: "Welcome to Collab.io",
    content: "This is the Workspace Header showing the current workspace you're in",
  },
  {
    selector: "#workspace-switcher",
    title: "Workspace Switcher",
    content: "Click here to go to a different workspace or you can even create your own workspace",
  },
  {
    selector: "#workspace-settings",
    title: "Workspace Settings",
    content: "Rename your workspace, invite other people or delete your workspace from here.",
  },
  {
    selector: "#channels",
    title: "Channels",
    content: "All the channels you're in, you can go to different channels by clicking on the channel name",
  },
  {
    selector: "#direct-messages",
    title: "Direct Messages",
    content: "All the people you can talk directly to",
  },
  {
    selector: "#search-bar",
    title: "Search Bar",
    content: "You can look for the channels and other members",
  },
];

const WorkspaceLayout = ({ children }: PropsWithChildren) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const [showTour, setShowTour] = useShowTour();

  const showPanel = !!parentMessageId || !!profileMemberId;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#FDFCF0] to-[#F8E8D4]">
      <Toolbar />
      <div className="flex h-[calc(100vh-56px)] p-5 rounded-lg overflow-hidden relative">
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
          <WorkspaceSidebar toggleSidebar={toggleSidebar} isMobile />
        </div>

        {/* Backdrop when the sidebar is open on mobile */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" onClick={toggleSidebar} />}
        <ResizablePanelGroup direction="horizontal" autoSaveId={"collab-workspace-layout"}>
          <ResizablePanel defaultSize={20} minSize={11} className="shadow rounded-lg hidden lg:block">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className="my-1 mr-1 shadow-lg rounded-lg bg-gradient-to-b from-[#fae5d7] to-[#f6c4b4]"
            defaultSize={80}
            minSize={20}
          >
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
      <TourGuide steps={tourSteps} isOpen={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
};

export default WorkspaceLayout;
