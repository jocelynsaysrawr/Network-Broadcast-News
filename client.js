const net = require("net");
const PORT = 6969;
process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    client.write(`${chunk}`);
  }
});

const client = net.createConnection(6969, "0.0.0.0", message => {
  client.on("data", data => {
    console.log(data.toString());
  });
});
