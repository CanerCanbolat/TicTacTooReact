import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: !isWinningSquare ? "white" : "green" }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo[0] : null;
  const winningLine = winnerInfo ? winnerInfo[1] : [];

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const rowCount = 3;
  return (
    <>
      <div className="status"> {status} </div>
      {[...Array(rowCount).keys()].map((colIndex) => {
        return (
          <div>
            <div className="board-row" key={colIndex}>
              {[...Array(rowCount).keys()].map((rowIndex) => {
                const i = rowIndex * rowCount + colIndex;
                const isWinningSquare = winningLine && winningLine.includes(i);
                return (
                  <Square
                    key={i}
                    value={squares[i]}
                    onSquareClick={() => handleClick(i)}
                    isWinningSquare={isWinningSquare}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const displayOrder = isAscending ? "Ascending" : "Descending";

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        {move === currentMove && move !== 0 ? (
          `You are at move #${move}`
        ) : (
          <button onClick={() => jumpTo(move)}> {description}</button>
        )}
      </li>
    );
  });

  function handleSortHistory() {
    setIsAscending(!isAscending);
  }
  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const sortedMoves = isAscending ? moves : moves.slice().reverse();
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => handleSortHistory()}>{displayOrder}</button>
        <button onClick={handleRestart}> Restart</button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
