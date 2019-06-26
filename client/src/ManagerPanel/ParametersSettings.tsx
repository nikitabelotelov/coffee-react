import {NavLink} from "react-router-dom";
import * as React from "react";
import {getBackLink} from "../types";

const Parameters = [
    {
        key: 0,
        title: 'Паровой бойлер',
        route: 'steam'
    },
    {
        key: 1,
        title: 'Температуры группы',
        route: 'steam'
    },
    {
        key: 2,
        title: 'Предсмачивания',
        route: 'steam'
    },
    {
        key: 3,
        title: 'Время варки',
        route: 'steam'
    },
    {
        key: 4,
        title: 'Преднагревательный бойлер',
        route: 'steam'
    }
]

export default class ParametersSettings extends React.Component {
    render() {
        return (
            <div className='setting__profile panel_root'>
                <ul className='setting__profile-list list-group list-group-flush'>
                    {Parameters.map((el) => {
                        return (<li className='list-group-item' key={el.key}>
                            <NavLink to={'hand/steam'}
                                     className='setting__hand-listItem'>
                                {el.title}
                            </NavLink>
                        </li>)
                    })}
                </ul>
                <NavLink to={getBackLink()} className='manager-panel__block btn-outline-success'>
                    Назад
                </NavLink>
            </div>
        );
    }
}