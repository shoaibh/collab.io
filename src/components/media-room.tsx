"use client";

import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { ControlBar, LiveKitRoom, RoomAudioRenderer, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { LogoLoader } from "./ui/loader";

import "@livekit/components-styles";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

type MediaRoomProps = {
  channelId: string;
};

export const MediaRoom = ({ channelId }: MediaRoomProps) => {
  const [token, setToken] = useState("");
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!user?.name) return;
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${channelId}&username=${user.name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [channelId, user?.name]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <LogoLoader />
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      onDisconnected={() => router.push(`/workspace/${workspaceId}/`)}
      //   style={{ height: "100dvh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      {/* <MyVideoConference /> */}
      <VideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
};
