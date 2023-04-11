import React from "react";

export const Board = (props) => {
  let rows = [];
  for (let i = 0; i < props.state.totalRows; i++) {
    rows.push(
      <Row
        key={"row_" + i}
        id={"row_" + i}
        state={props.state}
        pegAction={props.pegAction}
        checkAction={props.checkAction}
      />
    );
  }
  return <div className="board">{rows}</div>;
};

const Row = (props) => {
  let active = "";
  if (+props.id.substr(4) === props.state.activeRow) {
    active = "active";
  }

  return (
    <div className={"row " + active} id={props.id}>
      <Circles
        rowId={props.id}
        state={props.state}
        pegAction={props.pegAction}
      />
      <OkButton
        state={props.state}
        rowId={props.id}
        checkAction={props.checkAction}
      />
      <Hints state={props.state} rowId={props.id} />
    </div>
  );
};

const Circles = (props) => {
  const rowId = props.rowId.substr(4);
  let Pegs = [];
  for (let i = 0; i < 4; i++) {
    Pegs.push(
      <Peg
        state={props.state}
        pegAction={props.pegAction}
        key={"p" + rowId + "-" + i}
        pegId={"p" + rowId + "-" + i}
      />
    );
  }

  return <div className="circles"> {Pegs} </div>;
};

const Peg = (props) => {
    const pegId = +props.pegId.substr(props.pegId.indexOf("-") + 1);
    const rowId = +props.pegId.substr(
      1,
      props.pegId.indexOf("-") - 1
    );
    let clase = "";
    if (props.state.activeRow === rowId) {
      clase = props.state.currentRow[pegId];
    } else {
      for (let i in props.state.previousRows) {
        if (+i === +rowId) {
          clase = props.state.previousRows[rowId][pegId];
        }
      }
    }

    return (
      <span
        id={props.pegId}
        className={"peg " + clase}
        onClick={() =>
          props.pegAction(props.state.activeColor, props.pegId)
        }
      >{ clase }</span>
    );
  }

const Hints = (props) => {
  let allHints = [];
  let hintClass = "";
  const rowId = +props.rowId.substr(4);
  const hintArr = props.state.hints;
  const prevHints = props.state.previousHints;

  for (let i = 0; i < hintArr.length; i++) {
    if (rowId === props.state.activeRow) {
      hintClass =
        hintArr[i] === 2 ? "exact" : hintArr[i] === 1 ? "partial" : "";
    } else {
      for (let j = 0; j < prevHints.length; j++) {
        if (rowId === j) {
          hintClass =
            prevHints[j][i] === 2
              ? "exact"
              : prevHints[j][i] === 1
              ? "partial"
              : "";
        }
      }
    }

    allHints.push(
      <CheckBox
        hintClass={hintClass}
        key={"h_" + rowId + i}
        id={"h_" + rowId + i}
      />
    );
  }
  return <div className="hints">{allHints}</div>;
};

const CheckBox = (props) => (
  <span className={props.hintClass} id={props.id}></span>
);

const OkButton = (props) => {
  const row = +props.rowId.substr(4);
  let disabled = "disabled";
  const doNothing = () => false;

  if (props.state.activeRow === row) {
    disabled = props.state.canCheck ? "" : "disabled";
  }
  const checkAction = disabled === "disabled" ? doNothing : props.checkAction;

  return (
    <div className={"ok-button " + disabled} onClick={checkAction}>
      check
    </div>
  );
};
