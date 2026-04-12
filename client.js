const net = require("node:net");
const { ask, clearLine, moveCursor, rl } = require("./utils");

const socket = net.createConnection({ port: 8000 }, async () => {
	console.log("Connected to the server.");

	ask(socket);
});

socket.on("data", async (buffer) => {
	console.log("");
	await moveCursor(0, -1);
	await clearLine(0);
	console.log(buffer.toString("utf-8"));
	rl.prompt(true);
});

socket.on("end", () => {
	console.log("Disconencted!");
});

socket.on("error", (err) => {
	if (err.code === "ECONNRESET") {
		console.log("Disconnected!");
	} else {
		console.error("Client Error:", err);
	}
});
