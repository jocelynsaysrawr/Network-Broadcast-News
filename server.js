const net = require("net");
const PORT = 6969;
process.stdin.setEncoding("utf8");

const clients = [];

const server = net.createServer(client => {
  console.log("client connected");
  clients.push(client);
  client.name = `User${clients.indexOf(client) + 1}`;
  client.write(
    `Congratulations! You're connected!
Welcome ${client.name} to the Network Broadcast News Chatroom.
Please use the following commands for added chatroom functionality:

$ : change your username: '$sample'
~ : view user list
/ : private message to ADMIN: '/message'
@ : private message to user: '@user + message'
`
  );

  process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      broadcast(`ADMIN: ${chunk}`);
    }
  });
  client.on("data", data => {
    console.log(client.name + ": " + data.toString());
    switch (data.toString().charAt(0)) {
      case "$":
        let usernameAvailable = true;
        clients.forEach(client => {
          if (
            client.name ===
            data
              .toString()
              .slice(1)
              .trim()
          ) {
            usernameAvailable = false;
          }
        });
        if (usernameAvailable) {
          let oldUsername = client.name;
          client.name = data
            .toString()
            .slice(1)
            .trim();
          client.write(`Your new username is ${client.name}`);
          broadcast(
            `ADMIN: ${oldUsername} changed their username to ${client.name}`
          );
        } else {
          client.write("Error: username unavailable");
        }
        break;
      case "~":
        const usernames = clients.map(users => users.name);
        client.write(usernames.toString());
        break;
      case "/":
        console.log(`PM to ADMIN from ${client.name}: ${data.toString()}`);
        break;
      case "@":
        const username = data
          .toString()
          .split(" ")[0]
          .toString()
          .slice(1);
        clients.forEach(user => {
          if (username === user.name) {
            user.write(data.toString());
          }
        });
        break;
      default:
        broadcast(`${client.name}: ${data.toString()}`, client);
    }
  });
  client.on("end", () => {
    console.log(`${client.name} disconnected`);
    broadcast(client.name + " has left the room", client);
    clients.splice(clients.indexOf(client), 1);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

const broadcast = (message, sender) => {
  clients.forEach(client => {
    if (client === sender) {
      return;
    }
    client.write(message);
  });
};
