const readLine = require("node:readline/promises");

const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function ask(socket) {
	const message = await rl.question("Enter a menssage: ");
	await moveCursor(0, -1);
	await clearLine(0);
	socket.write(message);
	ask(socket);
}

function clearLine(dir) {
	return new Promise((resolve, reject) => {
		process.stdout.clearLine(dir, () => {
			resolve();
		});
	});
}

function moveCursor(dx, dy) {
	return new Promise((resolve, reject) => {
		process.stdout.moveCursor(dx, dy, () => {
			resolve();
		});
	});
}

module.exports = {
	ask,
	clearLine,
	moveCursor,
	rl,
};
