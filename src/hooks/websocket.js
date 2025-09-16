import { onBeforeMount, onBeforeUnmount } from 'vue';
import { WebSocketManager } from '@/tools/websocket';
import { storage } from '@/tools/storage';
import { CACHE_KEY_TOKEN } from '@/values/cache';
import { checkIndexArray, delayExec, getJSON } from '@/tools';

const websocket = { app: null, room: [] };

// 使用websocket
export function useWebsocket(room, handle) {
  const fn = (msg) => handle(getJSON(msg.data, {}));
  onBeforeMount(async () => {
    if (!websocket.app) {
      const token = storage.get(CACHE_KEY_TOKEN);
      websocket.app = new WebSocketManager(`ws://${location.host}/wsAgent`, {});
      websocket.app.send({ type: 'auth', token: token });
    }
    await delayExec(100);
    websocket.room.push(room);
    websocket.app.send({ type: 'join_room', room_id: room });
    websocket.app.addEventListener('message', fn);
  });

  onBeforeUnmount(() => {
    const key = websocket.room.indexOf(room);
    if (checkIndexArray(key)) websocket.room.splice(key, 1);
    websocket.app.send({ type: 'leave_room', room_id: room });
    websocket.app.removeEventListener('message', fn);
  });
}
