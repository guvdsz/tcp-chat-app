const net = require("node:net");

const clients = [];

const PORT = 5500;
const HOST = "172.31.6.71";

const server = net.createServer((socket) => {
	const clientId = (clients.length + 1).toString();
	const newClient = { id: clientId, socket: socket };
	clients.push(newClient);

	console.log(`[Sistema] Cliente ${clientId} conectado.`);

	clients.forEach((client) => {
		if (client.socket !== socket) {
			client.socket.write(
				`[Sistema] Usuário ${clientId} entrou no chat.\n`,
			);
		}
	});

	socket.on("data", (buffer) => {
		const data = buffer.toString("utf-8").trim();

		const sender = clients.find((c) => c.socket === socket);
		const senderId = sender ? sender.id : "Desconhecido";

		console.log(`[${senderId}]: ${data}`);

		clients.forEach((client) => {
			client.socket.write(`[${senderId}]: ${data}\n`);
		});
	});

	socket.on("error", (err) => {
		if (err.code === "ECONNRESET") {
			console.log(
				`[Sistema] Cliente ${clientId} desconectou abruptamente.`,
			);
		} else {
			console.error("Socket Error:", err.message);
		}
	});

	socket.on("close", () => {
		const index = clients.findIndex((c) => c.socket === socket);
		if (index !== -1) {
			const idRemovido = clients[index].id;
			clients.splice(index, 1);
			console.log(`[Sistema] Cliente ${idRemovido} saiu.`);

			clients.forEach((client) => {
				client.socket.write(
					`[Sistema] Usuário ${idRemovido} saiu do chat.\n`,
				);
			});
		}
	});
});

server.listen(PORT, HOST, () => {
	console.log(`Servidor rodando em ${HOST}:${PORT}`);
});
