"use client";
import { io } from "socket.io-client";
import Board from "./components/Board";
import { useEffect, useState } from "react";
import PlayAgain from "./components/PlayAgain"
import { useRef } from "react";
import { Socket } from "socket.io-client";
import LoadingDots from "./components/LoadingDots";

export default function Home() {
    const [disconnect, setDisconnect] = useState(false);
    const [waiting, setWaiting] = useState(true);
    const [symbol, setSymbol] = useState("");
    const [turn, setTurn] = useState("X");
    const [winner, setWinner] = useState("");
    const [board, setBoard] = useState(["", "", "",
                                        "", "", "", 
                                        "", "", ""]);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io({
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("connected", socket.id);
        });

        socket.on("init", (data) => {
            setSymbol(data.symbol);
            setBoard(data.board);
            setTurn(data.turn);
            setWinner(data.winner);
        });

        socket.on("playerClick", (data) => {
            setWinner(data.winner);
            setBoard(data.board);
            setTurn(data.turn);
        });

        socket.on("playAgain", () => {
            setTurn("X");
            setWinner("");
            setBoard(["", "", "", "", "", "", "", "", ""]);
        });

        socket.on("waiting", () => {
            setWaiting(true);
        });

        socket.on("gameReady", () => {
            setWaiting(false);
        });

        socket.on("enemyDc", () => {
            setDisconnect(true);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handlePlayAgainClick = () => {
        setDisconnect(false);
        socketRef.current?.emit("playAgain");
    }
    
    const handleClick = (index: number) => {
        console.log(index, turn, symbol);

        if (board[index]) { return };
        
        if (turn === symbol) {
            console.log("angry bird");
            socketRef.current?.emit("playerClick", { index: index });
        }
    }

    return (
        <main className="relative flex flex-col gap-4 justify-center items-center min-h-screen bg-white">

            {(waiting && !disconnect) ? ( 
                <div className="text-3xl text-black flex ">
                    <span className="mr-2">Waiting for player 2</span> <LoadingDots /> 
                </div> 
            ) :
            (
                <div className="text-3xl text-black flex ">
                    <span className="mr-2">{`Player ${turn}'s turn`}</span>
                </div> 
            )}
            
            <Board handleClick={(index) => handleClick(index)} board={board}/>

            {(winner || disconnect) &&
                <div className="fixed top-0 left-0 w-full h-full bg-[#000000b6] flex flex-col justify-center items-center gap-4">
                    <span className="text-5xl text-white z-50">{disconnect ? `${symbol === "X" ? "O" : "X"} dissconected ${symbol} won!` : winner === "draw" ? "Draw" :  `${winner} won!` }</span>
                    <PlayAgain handlePlayAgain={handlePlayAgainClick}/>
                </div>
            }
        </main>
    );
}
