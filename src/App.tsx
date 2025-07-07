import { useState } from "react";
import "./App.css";

type Player = "X" | "O" | null;
type BoardState = Player[];
type History = BoardState[];

const WINNING_PATTERNS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function App() {
  const [history, setHistory] = useState<History>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [winningRow, setWinningRow] = useState<number[] | null>(null);
  const xIsNext = currentMove % 2 === 0;

  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  function handleClick(idx: number) {
    if (winner || currentSquares[idx]) return;

    const newSquares: BoardState = [...currentSquares];
    newSquares[idx] = xIsNext ? "X" : "O";

    const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const newWinner = calculateWinner(newSquares);
    setWinningRow(newWinner?.winningRow ?? null);
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
    setWinningRow(null);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinningRow(null);
  }

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset</button>
      {winner && <div>{winner.winner} is the winner!</div>}
      {!winner && currentMove === 9 && <div>Draw!</div>}
      <div className="game-container">
        <GameBoard
          squares={currentSquares}
          onClick={handleClick}
          winningRow={winningRow}
        />
        <MoveHistory history={history} jumpTo={jumpTo} />
      </div>
    </div>
  );
}

type GameBoardProps = {
  squares: BoardState;
  winningRow: number[] | null;
  onClick: (idx: number) => void;
};

function GameBoard({ squares, onClick, winningRow }: GameBoardProps) {
  return (
    <div className="game-board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          val={val}
          onClick={() => onClick(idx)}
          winningRow={winningRow}
          idx={idx}
        />
      ))}
    </div>
  );
}

type SquareProps = {
  val: Player;
  winningRow: number[] | null;
  idx: number;
  onClick: () => void;
};

function Square({ val, onClick, winningRow, idx }: SquareProps) {
  return (
    <div
      onClick={onClick}
      className={winningRow?.includes(idx) ? "winning-row square" : "square"}
    >
      {val}
    </div>
  );
}

type MoveHistoryProps = {
  history: History;
  jumpTo: (move: number) => void;
};

function MoveHistory({ history, jumpTo }: MoveHistoryProps) {
  return (
    <div className="move-history">
      {history.map((_, move) => (
        <button key={move} onClick={() => jumpTo(move)}>
          {move === 0 ? "Go to game start" : `Revert to Turn ${move}`}
        </button>
      ))}
    </div>
  );
}

function calculateWinner(
  squares: BoardState
): { winner: Player; winningRow: number[] } | null {
  for (const [a, b, c] of WINNING_PATTERNS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningRow: [a, b, c] };
    }
  }
  return null;
}
