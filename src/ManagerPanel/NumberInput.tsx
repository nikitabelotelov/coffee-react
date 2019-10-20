import * as React from "react";

interface NumberInputProps {
    value: number;
    increment: Function;
    decrement: Function;
}

export default class NumberInput extends React.Component<NumberInputProps> {
    plusClickHandler() {
        this.props.increment(this.props.value);
    };
    minusClickHandler() {
        this.props.decrement(this.props.value);
    };
    render() {
        return (
            <div className='setting__input'>
                <button onClick={this.minusClickHandler.bind(this)} className='btn-outline-dark setting__inputButton'>
                    -
                </button>
                <span className='setting__inputValue'>{this.props.value}</span>
                <button onClick={this.plusClickHandler.bind(this)} className='btn-outline-dark setting__inputButton'>
                    +
                </button>
            </div>
        );
    };
}