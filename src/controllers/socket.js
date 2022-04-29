module.exports.socket = (socket) => {
  const userId = socket.user.sub;
  console.log("user connect with id :" + userId);

  socket.on("server_receive_message", (params) => {
    console.log("server_receive_message run", params);
  });
};
