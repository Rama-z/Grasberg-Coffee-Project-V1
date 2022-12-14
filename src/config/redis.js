const redis = require("redis");

const Client = redis.createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
});

Client.on("connect", () => console.log("redis connected"));

Client.on("ready", () => console.log("redis ready to use"));

Client.on("error", (err) => console.log(err.message));

Client.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  Client.quit();
});

Client.connect().then();
module.exports = Client;
