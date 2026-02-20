export default function PlayAgain({ handlePlayAgain }: { handlePlayAgain: () => void }) {
    return (
        <button onClick={handlePlayAgain} className="text-white text-3xl">
            Play Again?!
        </button>
    );
}