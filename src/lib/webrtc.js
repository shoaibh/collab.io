export class WebRTCConnection {
  constructor(socket, roomId) {
    this.socket = socket;
    this.roomId = roomId;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    });

    this.setupPeerConnectionHandlers();
  }

  setupPeerConnectionHandlers() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", event.candidate, this.roomId);
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (this.onTrack) {
        this.onTrack(event.streams[0]);
      }
    };
  }

  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit("offer", offer, this.roomId);
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  async handleOffer(offer) {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit("answer", answer, this.roomId);
  }

  async addIceCandidate(candidate) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  async addStream(stream) {
    stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, stream);
    });
  }
}
