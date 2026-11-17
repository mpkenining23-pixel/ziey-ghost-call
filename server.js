
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Pengguna terhubung:", socket.id);

  socket.on("join-room", (room) => {
    if (typeof room !== "string" || !/^[A-Za-z0-9-]{4,30}$/.test(room)) {
      return;
    }

    const previousRoom = socket.data.room;

    if (previousRoom) socket.leave(previousRoom);

    socket.join(room);
    socket.data.room = room;

    socket.to(room).emit("peer-joined");
    console.log("Pengguna masuk ruang:", room);
  });

  socket.on("signal", (data) => {
    const room = socket.data.room;

    if (!room || !data || !["offer", "answer", "candidate"].includes(data.type)) {
      return;
    }

    socket.to(room).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("Pengguna terputus:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("--------------------------------");
  console.log("ZIEY GHOST CALL V2");
  console.log("SERVER ONLINE");
  console.log("PORT:", PORT);
  console.log("--------------------------------");
});
  
  
  
  

