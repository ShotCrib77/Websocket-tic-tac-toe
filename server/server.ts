import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { handleClick, handlePlayAgain, board, turn, winner } from "./tictactoe";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

await nextApp.prepare();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const players: Record<string, string> = {}; // socketId -> symbol

function getPlayerCount() {
  return Object.keys(players).length;
}

function getAvailableSymbol(): string | null {
  const taken = new Set(Object.values(players));
  if (!taken.has("X")) return "X";
  if (!taken.has("O")) return "O";
  return null;
}

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    const symbol = getAvailableSymbol();

    if (!symbol) {
        socket.emit("gameFull");
        socket.disconnect();
        return;
    }

    players[socket.id] = symbol;
    socket.join("game");

    console.log(`Player ${socket.id} joined as ${symbol}`);
    
    // Send current game state to the new player
    socket.emit("init", {
        symbol,
        board,
        turn,
        winner,
    });

    if (getPlayerCount() < 2) {
        socket.emit("waiting");
    } else {
        io.to("game").emit("gameReady");
    }

    // Handle move
    socket.on("playerClick", (data) => {
        console.log("Received click from:", socket.id);
        console.log("Players:", players);
        console.log("Player count:", getPlayerCount());

        if (getPlayerCount() < 2) {
            console.log("Not enough players.");
            return;
        }

        handleClick(data.index);

        console.log("Board after move:", board);

        io.to("game").emit("playerClick", {
            board,
            turn,
            winner,
        });

        console.log("Emitted update to room 'game'");
    });

    socket.on("playAgain", () => {
        if (getPlayerCount() < 2) return;

        handlePlayAgain();

        io.to("game").emit("playAgain");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);

        delete players[socket.id];

        handlePlayAgain();

        io.to("game").emit("enemyDc");

        if (getPlayerCount() === 1) {
            io.to("game").emit("waiting");
        }
    });
});

app.all("/socket.io/{*path}", (req, res, next) => {
  next();
});

app.all("/{*path}", (req, res) => handle(req, res));

httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});