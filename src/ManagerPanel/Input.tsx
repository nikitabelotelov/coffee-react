import React, { useState } from 'react'
import "./Input.less"
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
        }}/>
      {focused && <div className="keyboard">
          <div onClick={() => setFocused(false)}>Close keyboard</div>
          <Key shift={shift} symb="q" shiftsymb="Q" onClick={value => props.onChange(props.value + value)} />

          <div onClick={() => setShift(!shift)}>SHIFT</div>
        </div>}
    </div>
  )
}