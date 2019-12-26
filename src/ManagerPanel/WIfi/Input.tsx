import React, { useState } from 'react'
import "./Keyboard.less"
import { Key } from './Key'

interface IInputProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export const Input = (props: IInputProps) => {

  const [focused, setFocused] = useState(false)
  const [shift, setShift] = useState(false)

  return (
    <div className={focused ? 'input__fullscreen' : ''}>
      <input value={props.value} placeholder={props.placeholder}
        onChange={e => props.onChange(e.target.value)}
        onFocus={() => {
          setFocused(true)
        }} />
      {focused && <div className="keyboard">
        <div className="keyboard_row">
          <div className="key" onClick={() => setFocused(false)}>Close keyboard</div>
          <div className="key" onClick={() => setShift(!shift)}>SHIFT</div>
        </div>
        <div className="keyboard_row">
          <Key shift={shift} symb="1" shiftsymb="!" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="2" shiftsymb="@" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="3" shiftsymb="#" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="4" shiftsymb="$" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="5" shiftsymb="%" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="6" shiftsymb="^" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="7" shiftsymb="&" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="8" shiftsymb="*" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="9" shiftsymb="(" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="0" shiftsymb=")" onClick={value => props.onChange(props.value + value)} />
        </div>
        <div className="keyboard_row">
          <Key shift={shift} symb="q" shiftsymb="Q" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="w" shiftsymb="W" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="e" shiftsymb="E" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="r" shiftsymb="R" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="t" shiftsymb="T" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="y" shiftsymb="Y" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="u" shiftsymb="U" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="i" shiftsymb="I" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="o" shiftsymb="O" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="p" shiftsymb="P" onClick={value => props.onChange(props.value + value)} />
        </div>
        <div className="keyboard_row">
          <Key shift={shift} symb="a" shiftsymb="A" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="s" shiftsymb="S" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="d" shiftsymb="D" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="f" shiftsymb="F" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="g" shiftsymb="G" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="h" shiftsymb="H" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="j" shiftsymb="J" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="k" shiftsymb="K" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="l" shiftsymb="L" onClick={value => props.onChange(props.value + value)} />
        </div>
        <div className="keyboard_row">
          <Key shift={shift} symb="z" shiftsymb="Z" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="x" shiftsymb="X" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="c" shiftsymb="C" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="v" shiftsymb="V" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="b" shiftsymb="B" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="n" shiftsymb="N" onClick={value => props.onChange(props.value + value)} />
          <Key shift={shift} symb="m" shiftsymb="M" onClick={value => props.onChange(props.value + value)} />
        </div>
      </div>}
    </div>
  )
}