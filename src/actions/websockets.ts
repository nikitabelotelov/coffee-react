import ACTION_TYPES from "./actionTypes";
import Converter, { ISTMMessage } from "../../server/stm/Converter";

const socket = new WebSocket(location.origin.replace(/^http/, "ws"));

socket.onopen = () => {
  console.log("Соединение установлено.");
};

socket.onclose = event => {
  if (event.wasClean) {
    console.log("Соединение закрыто чисто");
  } else {
    console.log("Обрыв соединения"); // например, "убит" процесс сервера
  }
  console.log("Код: " + event.code + " причина: " + event.reason);
};

socket.onerror = (error: any) => {
  console.log("Ошибка " + error.message);
};

export const init = (store: any) => {
  socket.onmessage = (event: any) => {
    let parsed = JSON.parse(event.data);
    const msg = Converter.fromString(parsed.stm);
    store.dispatch({
      type: ACTION_TYPES.currentInfoUpdate,
      payload: msg
    });
  };
};
export const emit = (payload: ISTMMessage) => {
  socket.send(JSON.stringify({ stm: Converter.toString(payload) }));
}