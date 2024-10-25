import { WebRTCConnectionConfig } from "@/types";
import { Socket } from "socket.io-client";

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private socket: Socket;
  private roomId: string;
  private config: WebRTCConnectionConfig;

  constructor(socket: Socket, roomId: string, config?: WebRTCConnectionConfig) {
    this.socket = socket;
    this.roomId = roomId;
    this.config = config || {};

    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    });

    this.setupPeerConnectionHandlers();
  }

  private setupPeerConnectionHandlers(): void {
    this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", event.candidate, this.roomId);
      }
    };

    this.peerConnection.ontrack = (event: RTCTrackEvent) => {
      if (this.config.onTrack) {
        this.config.onTrack(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.config.onConnectionStateChange) {
        this.config.onConnectionStateChange(this.peerConnection.connectionState);
      }
    };
  }

  public async createOffer(): Promise<void> {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", offer, this.roomId);
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  public async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error handling answer:", error);
      throw error;
    }
  }

  public async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit("answer", answer, this.roomId);
    } catch (error) {
      console.error("Error handling offer:", error);
      throw error;
    }
  }

  public async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
      throw error;
    }
  }

  public async addStream(stream: MediaStream): Promise<void> {
    try {
      stream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, stream);
      });
    } catch (error) {
      console.error("Error adding stream:", error);
      throw error;
    }
  }

  public close(): void {
    this.peerConnection.close();
  }
}
