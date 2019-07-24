import ACTION_TYPES from "./actionTypes";

const socket = new WebSocket("ws://localhost:3002");

socket.onopen = () => {
    console.log("Соединение установлено.");
};
socket.onclose = (event) => {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
};
socket.onerror = (error:any) => {
    console.log("Ошибка " + error.message);
};
export const init = ( store: any ) => {
    socket.onmessage = (event:any) => {
        let parsed = JSON.parse(event.data);
        let dispatched = false;
        for(let key in ACTION_TYPES) {
            if(key === parsed.type) {
                dispatched = true;
                store.dispatch({
                    type: key,
                    payload: parsed.data
                });
            }
        }
        if(!dispatched) {
            console.error("Unknown websocket message type: " + parsed.type);
        }
    };
};
export const emit = ( type: string, payload: any ) => socket.send( JSON.stringify({type, data: payload}) );