import React from "react";
import { Colors } from "../Numbers";
import { Solution } from "../Solution";
import { Board } from "../Board";
import { useState } from "react";

export const Game = () => {
  const colors = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const trueRow = [];
  for (let i = 0; i < 4; i++) {
    trueRow.push(colors[Math.floor(Math.random() * 4) + 1]);
  }

  //State
  const [state, setState] = useState({
    colors: colors,
    activeColor: "0",
    previousRows: [],
    previousHints: [],
    currentRow: ["", "", "", ""],
    hints: [0, 0, 0, 0],
    activeRow: 0,
    totalRows: 10,
    trueRow: trueRow,
    canCheck: false, //this checks if it's ok to eval currentRow
    victory: false,
    defeat: false,
  });

  const activateColor = (color) => {
    setState({
      ...state,
      activeColor: color,
    });
  };

  const setColor = (color, id) => {
    if (state.victory) {
      return false;
    }
    const rowId = +id.substr(1, id.indexOf("-") - 1);
    const pegId = +id.substr(id.indexOf("-") + 1);
    let currentRow = state.currentRow;
    let isArrayFull = 0;

    if (state.activeRow === rowId && color) {
      currentRow[pegId] = color;
      setState({
        ...state,
        currentRow: currentRow,
      });

      /* Checking if currentRow is Full */
      for (let i in currentRow) {
        if (currentRow[i].length > 0) {
          isArrayFull++;
        }
      }
      if (isArrayFull >= currentRow.length) {
        setState({ ...state, canCheck: true });
      } else {
        setState({ ...state, canCheck: false });
      }
    }
  };

  const checkRow = () => {
    const currentRow = JSON.parse(JSON.stringify(state.currentRow));
    const trueRow = JSON.parse(JSON.stringify(state.trueRow));
    const hints = state.hints;
    const previousHints = state.previousHints;
    const previousRows = state.previousRows;

    /* Checking extact matches */
    for (let i = 0; i < 4; i++) {
      if (currentRow[i] === trueRow[i]) {
        hints[i] = 2;
        delete currentRow[i];
        delete trueRow[i];
      }
    }

    /* Checking partial matches */
    for (let i in currentRow) {
      for (let j in trueRow) {
        if (currentRow[i] === trueRow[j]) {
          hints[i] = 1;
          delete currentRow[i];
          delete trueRow[j];
        }
      }
    }

    hints.sort((a, b) => b - a);

    /* checking if player won */
    let victory = true;
    for (let i in hints) {
      if (hints[i] < 2) {
        victory = false;
        break;
      }
    }

    /* checking if player lost */
    let defeat = state.defeat;
    if (state.activeRow >= state.totalRows - 1) {
      defeat = true;
    }

    /* updating board */
    previousHints.push(hints);
    previousRows.push(state.currentRow);

    setState({
      ...state,
      hints: [0, 0, 0, 0],
      activeRow: state.activeRow + 1,
      previousHints: previousHints,
      currentRow: ["", "", "", ""],
      previousRows: previousRows,
      canCheck: false,
      victory: victory,
      defeat: defeat,
    });
  };

  const newGame = () => {
    const trueRow = [];
    for (let i = 0; i < 4; i++) {
      trueRow.push(state.colors[Math.floor(Math.random() * 4) + 1]);
    }

    console.log("new Game");
    setState({
      ...state,
      activeRow: 0,
      previousRows: [],
      previousHints: [],
      currentRow: ["", "", "", ""],
      hints: [0, 0, 0, 0],
      trueRow: trueRow,
      canCheck: false,
      victory: false,
      defeat: false,
    });
  };

  let msg = state.victory ? "You Win!!" : state.defeat ? "You Lost :(" : "";
  return (
    <div className="game-container">
      <Colors
        list={state.colors}
        activeColor={state.activeColor}
        action={activateColor}
      />

      <Board state={state} pegAction={setColor} checkAction={checkRow} />

      <p className="msg"> {msg} </p>
      <Solution state={state} newGame={newGame} />
    </div>
  );
};
