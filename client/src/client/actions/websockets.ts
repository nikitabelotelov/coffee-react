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
        console.log("Получены данные " + event.data);
        store.dispatch({
            type: event.type,
            payload: event.data
        })
    };
};
export const emit = ( type: string, payload: string ) => socket.send( JSON.stringify({type, payload}) );