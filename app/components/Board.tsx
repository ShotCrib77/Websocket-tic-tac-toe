export default function Board({ handleClick, board }: { handleClick: (index: number) => void, board: string[] }) {
    return (
        <div className="grid grid-cols-3 gap-2 bg-black rounded-xl p-2">
            {board.map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className="w-24 h-24 rounded-lg bg-amber-50 text-7xl text-black shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                >
                    {board[index]}
                </button>
            ))}
        </div>
    );
}