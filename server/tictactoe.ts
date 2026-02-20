export type GameState = {
    board: string[]
    turn: string
    winner: string
}

export function createGameState(): GameState {
    return {
        board: Array(9).fill(""),
        turn: "X",
        winner: ""
    }
}

export function handleClick(state: GameState, index: number): GameState {
    const board = [...state.board]
    board[index] = state.turn
    const winner = checkWin(board)
    return {
        board,
        winner,
        turn: winner ? state.turn : state.turn === "X" ? "O" : "X"
    }
}

export function handlePlayAgain(): GameState {
    return createGameState()
}

const checkWin = (board: string[]): string => {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (const [a, b, c] of winningLines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]
        }
    }
    return board.some(s => s === "") ? "" : "draw"
}