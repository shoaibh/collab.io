import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected");
    });

    socket.on("offer", (offer, roomId) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (answer, roomId) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate, roomId) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("mouse-move", (data, roomId) => {
      socket.to(roomId).emit("mouse-move", data);
    });

    socket.on("mouse-click", (data, roomId) => {
      socket.to(roomId).emit("mouse-click", data);
    });

    socket.on("key-press", (data, roomId) => {
      socket.to(roomId).emit("key-press", data);
    });
  });

  res.end();
};

export default SocketHandler;
