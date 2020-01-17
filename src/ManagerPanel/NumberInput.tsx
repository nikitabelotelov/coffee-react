import * as React from "react";

interface NumberInputProps {
  value: number;
  increment: Function;
  decrement: Function;
}

export default function NumberInput(props: NumberInputProps) {
  const [startInc, setStartInc] = React.useState(0)
  const [startDec, setStartDec] = React.useState(0)
  React.useEffect(() => {
    if (startInc) {
      setTimeout(() => {
        props.increment(props.value)
      }, 100)
    }
    if (startDec) {
      setTimeout(() => {
        props.decrement(props.value)
      }, 100)
    }
  })
  return (
    <div className="setting__input">
      <button
        onMouseDown={() => setStartDec(1)}
        onMouseUp={() => setStartDec(0)}
        onMouseLeave={() => setStartDec(0)}
        className=" setting__inputButton"
      >
        -
      </button>
      <span className="setting__inputValue">{props.value}</span>
      <button
        onMouseDown={() => {setStartInc(1); console.log("md")}}
        onMouseUp={() => {setStartInc(0); console.log("mu") }}
        onMouseLeave={() => setStartInc(0)}
        className=" setting__inputButton"
      >
        +
      </button>
    </div>
  );
}
