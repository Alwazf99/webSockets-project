import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  return res.send("Hello");
});

server.listen(port, () => console.log(`Server started at PORT ${port}`));
