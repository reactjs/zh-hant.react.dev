---
title: 逃脫出口
---

<Intro>

在某些 component 中，可能需要對 React 外部的系統進行控制和同步。例如，你可能會使用瀏覽器 API 來聚焦 input、在不使用 React 的情況下實作影片播放器的播放和暫停，或者向遠端伺服器進行連接和收聽訊息。在這個章節，你將學習藉由逃脫出口「走出」React 與外部系統連接。在大部分的應用程式邏輯和資料流中，不應該仰賴這些功能。

</Intro>

<YouWillLearn isChapter={true}>

* [如何「記住」資訊而不觸發 re-rendering](/learn/referencing-values-with-refs)
* [如何存取由 React 管理的 DOM element](/learn/manipulating-the-dom-with-refs)
* [如何使 component 與外部系統同步](/learn/synchronizing-with-effects)
* [如何從 component 中移除不必要的 Effect](/learn/you-might-not-need-an-effect)
* [Effect 和 component 的生命週期有什麼區別](/learn/lifecycle-of-reactive-effects)
* [如何防止某些數值重新觸發 Effect](/learn/separating-events-from-effects)
* [如何降低 Effect 重新執行的頻率](/learn/removing-effect-dependencies)
* [如何在不同 component 中共享邏輯](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## 藉由 Ref 參照數值 {/*referencing-values-with-refs*/}

當你想要在一個 component「記住」一些資訊，但是不想要讓資訊[觸發新的 render](/learn/render-and-commit)，可以使用 *ref* ：

```js
const ref = useRef(0);
```

就像 state 一樣， ref 總是在 re-render 之間保留。然而設定 state 會 re-render component，但改變 ref 不會！你可以通過 `ref.current` 的屬性來存取目前 ref 的值。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Ref 就像 component 的秘密口袋，不會被 React 追蹤。例如，你可以使用 ref 來儲存[逾時的 ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value)、[DOM element](https://developer.mozilla.org/zh-TW/docs/Web/API/Element)，以及其他不影響 component rendering 輸出的 object。

<LearnMore path="/learn/referencing-values-with-refs">

閱讀 **[藉由 ref 參照數值](/learn/referencing-values-with-refs)** 來學習如何使用 ref 記憶資訊。

</LearnMore>

## 藉由 ref 操縱 DOM {/*manipulating-the-dom-with-refs*/}

Component 幾乎不需要操作 DOM，因為 React 會自動更新 DOM 來匹配 render 的輸出。然而有些時候，你可能會需要存取由 React 管理的 DOM element。例如，聚焦一個 node，滾動到它的位置，或者測量它的寬高和位置。React 中沒有內建做這些事情的方法，所以你會需要 ref 來參照 DOM node。例如，點擊按鈕來聚焦一個由 ref 參照的 input。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

閱讀 **[藉由 ref 操縱 DOM](/learn/manipulating-the-dom-with-refs)** 來學習如何存取由 React 管理的 DOM element。

</LearnMore>

## 藉由 Effect 同步 {/*synchronizing-with-effects*/}

有一些 component 需要與外部系統同步。例如，你可能想根據 React 的 state 控制一個非 React 的 component、建立與伺服器的連線，或者當 component 出現在螢幕時發送一個分析日誌。與處理特定事件的 event handler 不同， *Effect* 在 rendering 後執行。使用它讓你的 component 與 React 的外部系統同步。

按幾次 Play/Pause，看看影片播放器如何與 `isPlaying` prop 的值保持同步：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

許多 Effect 還需要「清除」自己。例如，一個與聊天伺服器建立連線的 Effect，應該回傳一個 *cleanup function * 來告訴 React 該 component 要如何與伺服器斷開：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 真正在實作時會實際連線到伺服器
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

在開發時，React 會立即執行並清除一次額外的 Effect，這就是為什麼會看到 `"✅ Connecting..."` 印了兩次。這是為了確保你不要忘記實作 cleanup function。

<LearnMore path="/learn/synchronizing-with-effects">

閱讀 **[藉由 Effect 同步](/learn/synchronizing-with-effects)** 來學習如何讓 component 與外部系統同步。

</LearnMore>

## 你可能不需要 Effect {/*you-might-not-need-an-effect*/}

Effect 是 React 逃脫出口的範例。他讓你「走出」React 並且讓 component 與外部系統同步。假如不涉及外部系統（例如，假設你要在某些 prop 或 state 改變時更新 component 的 state），不應該使用 Effect。移除不必要的 Effect 將會讓程式碼更易讀，執行速度更快，以及更不容易出錯。

有兩個常見的情境，不需要使用 Effect：
- **你不需要 Effect 來為了 rendering 去轉換資料。**
- **你不需要 Effect 來處理使用者事件。**

例如，你不需要使用 Effect 來根據其他的 state 去改變某些 state：

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避免：多餘地 state 和不必要地 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

取而代之，盡可能在 rendering 進行計算：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 好的：在 rendering 過程進行計算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

<<<<<<< HEAD
然而，你需要 Effect 來 *處理* 與外部系統的同步。
=======
However, you *do* need Effects to synchronize with external systems.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

<LearnMore path="/learn/you-might-not-need-an-effect">

閱讀 **[你可能不需要 Effect](/learn/you-might-not-need-an-effect)** 來學習如何移除不必要的 Effect。

</LearnMore>

## 反應性 Effect 的生命週期 {/*lifecycle-of-reactive-effects*/}

Effect 有一個與 component 不同的生命週期。Component 會 mount、update、unmount。Effect 只會做兩件事情：開始同步，以及在之後結束同步。如果 Effect 依賴於隨時間變化的 prop 或 state，那麼這個週期可以發生很多次。

這個 Effect 依賴於 `roomId` 的 prop 值。Prop 是 *反應性的值* ，這意味著可能會在 re-render 時改變。注意假設 `roomId` 改變時，這個 Effect 會 *重新同步* （並且重新連接到伺服器）。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正在實作時會實際連線到伺服器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React 提供一個 linter 規則，可以驗證你是否已經正確地指定 Effect 的依賴。假設你忘記在上面範例的依賴列表中指定 `roomId`，linter 會自動地發現這個 bug。

<LearnMore path="/learn/lifecycle-of-reactive-effects">

閱讀 **[回應性事件的生命週期](/learn/lifecycle-of-reactive-effects)** 來學習 Effect 的生命週期和 component 的有什麼不同。

</LearnMore>

## 從 Effect 分離事件 {/*separating-events-from-effects*/}

Event handler 只在你再次執行相同的互動時重新執行。與 event handler 不同，如果 Effect 讀取的任何值（例如 props 或 state）與上次渲染時的值不同，則 Effect 會重新同步。有時候，你需要混合使用這兩種行為：即 Effect 會回應某些值而重新執行，而其他值則不會重新執行。

所有在 Effect 中的程式碼都是 *反應性* 的。假如某些它讀取的反應性的值，在 re-render 時發生變化，它就會再執行一次。例如：假如 `roomId` 或 `theme` 之一已經改變，那麼這個 Effect 將會重新連接到聊天室。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正在實作會實際連線到伺服器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

然而這不理想。假設你只想要在 `roomId` 改變時才重新連接到聊天室。那麼切換 `theme` 時就不應該重新連接到聊天室！將 `theme` 的程式碼從 Effect 移到 *Effect 事件* 中：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正在實作時會實際連線到伺服器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

在 Effect 事件內的程式碼沒有反應性，所以改變 `theme` 不在會讓你的 Effect 重新連接。

<LearnMore path="/learn/separating-events-from-effects">

閱讀 **[從 Effect 分離事件](/learn/separating-events-from-effects)** 來學習如何防止某些值重新觸發 Effect。

</LearnMore>

## 移除 Effect 的依賴 {/*removing-effect-dependencies*/}

當你寫了一個 Effect，linter 將會驗證你是否已經將所有反應性的值（像是 prop 和 state）包含在 Effect 的依賴列表內。這確保了 Effect 會與 component 中最新的 prop 和 state 保持同步。不必要的依賴可能會導致你的 Effect 太過頻繁的執行，甚至會建立一個無窮迴圈。移除他們的方法取決於具體情況。

例如，這個 Effect 依賴於 `options` object，會導致在你每次編輯 input 時都被重新建立：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正在實作時會實際連線到伺服器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

你不會希望每次你開始打字聊天時，聊天室都要重新連接。為了修復這個問題，將 `options` object 的建立移到 Effect 內，這樣 Effect 就只依賴於 `roomId` string：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正在實作時會實際連線到伺服器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

注意一下你並沒有在一開始就修改依賴列表將 `options` 依賴移除。那樣是不對的。相反地，因為你改變了周圍的程式碼所以這個依賴關係才變得 *不必要* 。可以想像依賴列表就像是你的 Effect 程式碼中所有反應性的值的列表。你沒有刻意地選擇哪些要放入列表內。這個清單就描述了你的程式碼。要改變依賴列表，就先改程式碼。

<LearnMore path="/learn/removing-effect-dependencies">

閱讀 **[移除 Effect 的依賴](/learn/removing-effect-dependencies)** 來學習如何讓你的 Effect 重新執行的頻率降低。

</LearnMore>

## 藉由 custom Hook 複用邏輯 {/*reusing-logic-with-custom-hooks*/}

React 有內建的 Hook 像是 `useState`、`useContext`，和 `useEffect`。有些時候，你會想要有一個更具特定目的 Hook：例如，擷取資料、持續追蹤使用者是否在線上，或者連線到一個聊天室。要做到這點，可以視應用程式的需求建立屬於自己的 Hook。

在這個範例中，`usePointerPosition` custom Hook 追蹤了游標的位置，而 `useDelayedValue` custom Hook 回傳一個相對於你傳入的值有一定毫秒數延遲的值。移動游標到沙箱預覽區域，可以看到游標後有一連串在移動的點：

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

你可以建立 custom Hook，將它們組合在一起，在他們之間傳遞資料，並且在不同的 component 複用。隨著你的應用逐漸成長，你將會手寫更少的 Effect，因為你能夠複用你已經寫好的 custom Hook。而且還有很多優秀的 custom Hook 由 React 社群維護。

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

閱讀 **[藉由 custom Hook 複用邏輯](/learn/reusing-logic-with-custom-hooks)** 來學習如何在 component 之間共享邏輯。

</LearnMore>

## 接下來呢？ {/*whats-next*/}

前往[藉由 Ref 參照數值](/learn/referencing-values-with-refs)來開始一頁頁地閱讀這個篇章！
