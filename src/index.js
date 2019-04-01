import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return(
    <button className={props.class} onClick={props.onClick} >
      {props.value}
    </button>
  );
}



class Board extends React.Component {
  
  renderSquare(i, win) {

    let key = "Square:" + i;
    return(
      <Square 
      key= {key}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      class = {win ? "square square-winning" : "square"}
      />
    );
  }

  renderBoard(lines) {
    let table = [];
    let square = [];

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        let number = column + (row * 3);
        console.log("Lines")
        console.log(lines[0]);
        console.log(lines[1]);
        console.log(lines[2]);
        if (number === lines[0] || number === lines[1] || number === lines[2]) {
          square.push(this.renderSquare(number, true));
        } else {
          square.push(this.renderSquare(number, false));
        }
      }
      let key = "Row:" + row;
      table.push(<div key={key} className="board-row">{square}</div>);
      square = [];
    }

    return table;
  }

  render() {
    const winner = calculateWinner(this.props.squares);
    let status;

    if(winner) {
      status = "Winner: " + winner.winner; 
    } else {
      status = 'Next player: ' + (this.props.xIsNext? "X" : "O");
    }

    let table = this.renderBoard(winner ? winner.lines : [undefined,undefined,undefined]);
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
      sortAscendant: true,
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
  
  sortHistory() {
    this.setState({
      sortAscendant: !this.state.sortAscendant,
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
      return (
        // react needs a key for dynamic lists, so it can remove, create or move elements in the list when rendering
        <li key={move}> 
          <button onClick = {() => this.jumpTo(move)} className={this.state.historyButtonClicked === move ? "bold" : ""}>{desc}</button>
        </li>
      );    
    });


    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
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
          <ol>{this.state.sortAscendant ? moves : moves.reverse()}</ol>
        </div>
        <div className="sort-moves">
          <input type="button" onClick={() => this.sortHistory()} value="Sort"></input>
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

  let response = {};
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      response = {
        lines: [a,b,c],
        winner: squares[a],
      };
      return response;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
