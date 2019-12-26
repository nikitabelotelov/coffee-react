import React from 'react'
import './Keyboard.less'

interface IKeyProps {
  symb: string
  shiftsymb: string
  shift: boolean
  onClick: (value: string) => void
}

export const Key = (props: IKeyProps) => {
  return (
    <div className="key" onClick={() => props.onClick(props.shift ? props.shiftsymb : props.symb)}>
      {props.shift ? props.shiftsymb : props.symb}
    </div>
  )
}