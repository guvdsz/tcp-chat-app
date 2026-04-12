const net = require("node:net");

const clients = [];

const server = net.createServer((socket) => {
	socket.on("error", (err) => {
		if (err.code === "ECONNRESET") {
			console.log("A client disconnected abruptly.");
		} else {
			console.error("Socket Error:", err.message);
		}
	});

	socket.on("close", () => {
		console.log("A client left the chat.");
		const index = clients.findIndex((c) => c.socket === socket);
		const clientId = clients[index].id;
		if (index !== -1) {
			clients.splice(index, 1);
		}
		clients.forEach((client) => {
			if (client.socket !== socket) {
				client.socket.write(`[${clientId}] left the chat.`);
			}
		});
	});

	socket.on("data", (buffer) => {
		const data = buffer.toString("utf-8");

		const sender = clients.find((c) => c.socket === socket);

		clients.forEach((client) => {
			client.socket.write(`[${sender.id}]: ${data}`);
		});
	});
});

server.on("connection", (socket) => {
	console.log("A new connection was made.");
	const clientId = clients.length + 1;
	clients.push({ id: clientId.toString(), socket: socket });

	clients.forEach((client) => {
		if (client.socket !== socket) {
			client.socket.write(`[${clientId}] joinend the chat.`);
		}
	});
});

server.listen(8000, () => console.log("Server is running..."));
