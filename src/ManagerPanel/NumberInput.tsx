import * as React from "react";

interface NumberInputProps {
    value: number;
    increment: Function;
    decrement: Function;
}

export default function NumberInput(props: NumberInputProps) {
    return  <div className='setting__input'>
                <button onClick={() => props.decrement(props.value)} className='btn-outline-dark setting__inputButton'>
                    -
                </button>
                <span className='setting__inputValue'>{props.value}</span>
                <button onClick={() => props.increment(props.value)} className='btn-outline-dark setting__inputButton'>
                    +
                </button>
            </div>
};