const users = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
      users.set(userId, socket.id);
      console.log(users);
      socket.broadcast.emit("online", userId);
      socket.emit("connected");
    });

    socket.on("send-message", (data) => {
      const { message, senderId, receiverId, conversationId, timestamp } = data;

      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", {
          message,
          senderId,
          conversationId,
          timestamp,
        });
      }
    });


    socket.on("typing", ({ userId, otherUserId }) => {
      const otherSocketId = users.get(otherUserId);
      if (otherSocketId) {
        socket.to(otherSocketId).emit("typing");
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, s_id] of users) {
        if (s_id === socket.id) {
          socket.broadcast.emit("offline", userId);
          users.delete(userId);
          break;
        }
      }
    });
  });
};

export { users };
