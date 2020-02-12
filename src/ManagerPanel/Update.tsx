import { NavLink } from "react-router-dom";
import * as React from "react";
import { getBackLink } from "../types";
import settingsStore from "../SettingsStore/index";
import ACTION_TYPES from "../actions/actionTypes";
import { update } from "../actions";

export default function Update(props: any) {
    const [isUpdate, setIsUpdate] = React.useState(false)
    return (
        <div className="" >
            {isUpdate ? "Ждем завершения обновления" :
                <div className='manager-panel__update panel_root'>
                    <div className="manager-panel__block manager-panel__left manager-panel__info">
                        <b>В процессе обновления функционал кофемашины будет недоступен.
                            Обновление может занять несколько минут.
                    Во время обновления нельзя отключать кофемашину от сети.</b>
                    </div>
                    <div onClick={() => {
                            setIsUpdate(true)
                            // @ts-ignore
                            window.needRefreshGlobal = true
                            settingsStore.dispatch(update())
                        }} className='manager-panel__block manager-panel__topright '>
                        <div>Начать процесс обновления</div>
                    </div>
                    <NavLink to={getBackLink()}
                        className='manager-panel__block manager-panel__bottomright'>
                        Назад
            </NavLink>
                </div>
            }
        </div>
    );
}