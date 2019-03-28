import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}



class Board extends React.Component {
  
  renderSquare(i) {
    return(
      <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.props.squares);
    let status;

    if(winner) {
      status = "Winner: " + winner; 
    } else {
      status = 'Next player: ' + (this.props.xIsNext? "X" : "O");
    }

    let table = [];
    let square = [];

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        square.push(this.renderSquare(column + (row * 3)));
      }
      table.push(<div className="board-row">{square}</div>);
      square = [];
    }
    return (
      <div>
        {table}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selectedSquare: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      historyButtonClicked: null,
    };
  }

  handleClick(i) {
  
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); //Uses slice to return a copy of the array, instead of the reference
    const position = i;
   
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        selectedSquare: position,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,  
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      historyButtonClicked: step,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let col = parseInt(step.selectedSquare / 3) + 1;
      let row = step.selectedSquare % 3 + 1;
      const desc = move ?
        "Col: " + col + " Row: " + row:
        "Go to game start";
        if(this.state.historyButtonClicked == move){
          return (
            // react needs a key for dynamic lists, so it can remove, create or move elements in the list when rendering
            <li key={move}> 
              <button onClick = {() => this.jumpTo(move)} class="bold">{desc}</button>
            </li>
          );
        } else {
          return (
            // react needs a key for dynamic lists, so it can remove, create or move elements in the list when rendering
            <li key={move}> 
              <button onClick = {() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
        
    });


    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
