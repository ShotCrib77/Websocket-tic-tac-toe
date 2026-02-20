export const board = ["", "", "", "", "", "",  "", "", ""];
export let turn = "X";
export let winner = "";

export const handleClick = (index: number) => {
    board[index] = turn;
    winner = checkWin(board); // Empty strign if no winner

    if (!winner) {
        turn = turn === "X" ? "O" : "X";
    }
}

export const handlePlayAgain = () => {
    board.fill("")
    turn = "X";
    winner = "";
}

const checkWin = (board: Array<string>) => {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of winningLines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; 
        }
    }
    
    return board.filter((square) => square === "").length !== 0 ? "" : "draw";
}