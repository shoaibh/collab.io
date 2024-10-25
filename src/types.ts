export interface MouseEvent {
  x: number;
  y: number;
  button?: number;
}

export interface KeyboardEvent {
  key: string;
  keyCode: number;
  type: "keydown" | "keyup";
}

export interface SocketEvents {
  "join-room": (roomId: string) => void;
  "user-connected": () => void;
  offer: (offer: RTCSessionDescriptionInit, roomId: string) => void;
  answer: (answer: RTCSessionDescriptionInit, roomId: string) => void;
  "ice-candidate": (candidate: RTCIceCandidate, roomId: string) => void;
  "mouse-move": (data: MouseEvent, roomId: string) => void;
  "mouse-click": (data: MouseEvent, roomId: string) => void;
  "key-press": (data: KeyboardEvent, roomId: string) => void;
}

export interface WebRTCConnectionConfig {
  onTrack?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}
