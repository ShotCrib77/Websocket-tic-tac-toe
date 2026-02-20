
"use client";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Socket } from "socket.io-client";
import Board from "./components/Board";

export default function Home() {
    const socketRef = useRef<Socket | null>(null);
    const [gameLink, setGameLink] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const socket = io({
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on("roomCreated", (data: { roomId: string }) => {
            console.log("ROOM ID: ", data.roomId);
            setGameLink(`http://192.168.0.202:3000/game/${data.roomId}`);
        });

        return () => {
            socket.off("roomCreated");
            socket.disconnect();
        };
        
    }, []);
    
    const handleStartGame = () => {
        console.log("start?")
        socketRef.current?.emit("createRoom");
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(gameLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="relative flex flex-col gap-4 justify-center items-center min-h-screen bg-white">
            <div className="flex flex-col justify-center items-center">
                    <h1 className="text-amber-600 text-5xl" style={{
                        textShadow: `
                            -1px -1px 0 rgba(255,255,255,0.3),
                            1px 1px 0 #78350f,
                            2px 2px 0 #78350f,
                            3px 3px 0 #451a03,
                            4px 4px 8px rgba(0,0,0,0.5)
                        `
                    }}>
                        TIC TAC TOE
                    </h1>
                <Board handleClick={(_) => {}} board={["", "", "", "", "", "", "", "", ""]} />
            </div>

            <button 
                onClick={handleStartGame} 
                className="bg-[#d27f1b] p-2 rounded-md text-white hover:bg-amber-700"
            >
                Start Game
            </button>

            {/* Popup */}
            {gameLink && (
                <div>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setGameLink("")}
                    />

                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 w-80 z-10">
                        <h2 className="text-lg font-semibold text-amber-700 text-center">Share this link</h2>
                        <p className="text-sm text-gray-500">Send this link to your friend to start the game.</p>

                        {/* Copy row */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                            <span className="text-sm text-gray-700 truncate flex-1">{gameLink}</span>
                            <button onClick={handleCopy} className="...">
                                {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ClipboardIcon className="w-4 h-4 text-amber-800" />}
                            </button>
                        </div>

                        {/* Redirect button */}
                        <Link
                            href={gameLink}
                            className="flex items-center justify-center gap-2 bg-[#d27f1b] text-white rounded-lg py-2 hover:bg-amber-700 transition-colors"
                        >
                            →
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}