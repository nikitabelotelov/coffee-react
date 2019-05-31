import {NavLink} from "react-router-dom";
import * as React from "react";

export default function Update(props: any) {
    return (
        <div className="asdasd">
            <div className='manager-panel__update panel_root'>
                <div className="manager-panel__block manager-panel__left btn-outline-dark manager-panel__info">
                    <b>В процессе обновления функционал кофемашины будет недоступен.
                        Обновление может занять несколько минут.
                        Во время обновления нельзя отключать кофемашину от сети.</b>
                </div>
                <div className='manager-panel__block manager-panel__topright btn-outline-dark'>
                    Начать процесс обновления
                </div>
                <NavLink to='/manage/settings'
                         className='manager-panel__block btn-outline-dark manager-panel__bottomright'>
                    Назад
                </NavLink>
            </div>
        </div>
    );
}