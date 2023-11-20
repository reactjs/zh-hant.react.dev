---
title: '透過客製化的 Hook 重用邏輯'
---

<Intro>

React 伴隨一些像 useState 、 useContext 和 useEffect 的內建 Hook 。有時候，你會希望有個 Hook 可以提供更多特定的目的：例如，抓取資料、保持追蹤使用者是否在線上、或是連線到聊天室；你可能無法在 React 中找到這些 Hook ，但你可以自行建立應用程式所需的 Hook 。

</Intro>

<YouWillLearn>

- 什麼是客製化 Hook ，與如何自行編寫
- 如何在 component 間重複使用邏輯
- 如何命名與建構客製化的 Hook
- 提取客製化 Hook 的時機與原因


</YouWillLearn>

## 客製化 Hooks ：在 Component 間共享邏輯 {/*custom-hooks-sharing-logic-between-components*/}

想像正在開發一個大量依賴網路的應用程式（像是大部分的應用程式），你想在使用者無法使用應用程式時，警告他們網路連線意外中斷，你會怎麼做呢？也許需要在 component 中做兩件事：

1. 部分的 state 追蹤網路是否連線
2. Effect 訂閱全域的 [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) 與 [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 事件，並更新 state

這會讓 component 保持[同步](/learn/synchronizing-with-effects)網路狀態，你也許會像這樣開始：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

嘗試打開與關閉網路，並注意該 `StatusBar` 如何根據你的動作而更新。

現在，想像你*也*想在不同的 component 中使用相同的邏輯。你想完成一個 Save 按鈕，它會在網路關閉時無法使用，並且顯示「 Reconnecting... 」，而非「 Save 」。

首先，你可以將 `isOnline` 、 Effect 複製及貼至 `SaveButton` 內部：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

驗證如果關閉網路時，按鈕是否會改變外觀。

這兩個 component 會正常運作，但不幸的是它們的邏輯重複；即使它們有不同的*視覺外觀*，但你會想重複使用它們的邏輯。

### 從 Component 中提取你的客製化 Hook {/*extracting-your-own-custom-hook-from-a-component*/}

想像一下，有個類似 [`useState`](/reference/react/useState) 及 [`useEffect`](/reference/react/useEffect) 的內建 `useOnlineStatus` Hook ，兩者都可以簡化這些 component 的程式，並可從中移除重複的部分：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```


雖然沒有這種內建的 Hook ，但你可以自行編寫。宣告一個函數命名為 `useOnlineStatus` ，將全部重複的程式從 component 內移動到其內部：

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

在函數的最後回傳 `isOnline` ，讓 component 可讀取到這個值：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

驗證切換網路開關時，是否更新兩個元件。

現在 component 內不再有重複的邏輯，**更重要的是，它們內部的程式描述*它們要做的事情*（使用線上的狀態！），而非*它們如何做*（透過訂閱瀏覽器事件）。**

當你提取邏輯到客製化的 Hook 時，可以隱藏如何處理一些外部系統或瀏覽器 API 的粗糙細節； component 內的程式表達你的意圖，而非實作方式。

### Hook 名稱總是起始於 `use` {/*hook-names-always-start-with-use*/}

React 應用程式由 component 所構成； component 由 Hook 構成，無論是內建或客製化。你可能會經常使用其他人建立的客製化 Hook ，但偶爾需要自己寫！

你必須遵循這些命名慣例：

1. **React component 名稱的開頭必須是大寫**，像是 `StatusBar` 和 `SavaButton` 。 React component 也需要回傳一些東西，讓 React 知道如何顯示，像是一段 JSX 。
2. **Hook 名稱的必須起始於 `use` ，接續是大寫**，像是 [useState](/reference/react/useState) （內建）或 `useOnlineStatus` （客製化，像這頁之前的）； Hook 可以回傳任意的值。

這些慣例確保你可以總是看到 component 就知道它的 state 、 Effect 和其他可能「隱藏」的 React 功能；例如，如果你看到 component 內部呼叫一個 `getColor()` ，可以知道它內部不可能包含 React state ，因為名稱開頭沒有 `use` ；然而，像是 `useOnlineStatus()` 的函數，內部很有可能包含呼叫其他 Hook ！

<Note>

如果你的 linter 是[為 React 配置的](/learn/editor-setup#linting)，它會強制執行該命名慣例。往上滑到上方的沙盒，將 `useOnlineStatus` 重新命名為 `getOnlineStatus` ，注意 linter 不會允許你在內部呼叫 `useState` 或 `useEffect` ，只有 Hook 與 component 可以呼叫其他 Hook ！

</Note>

<DeepDive>

#### 所有 Render 期間被呼叫的函數都應使用前綴 use 嗎？ {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

不需要，函數不會*呼叫*不需要*是* Hook 的 Hook。

如果函數沒有呼叫任何 Hook ，避免使用前綴 `use` ；反之，將它編寫成一般*沒有*前綴 `use` 的函數，例如，下方的 `useSorted` 沒有呼叫 Hook ，因此將它改成 `getSorted` ：

```js
// 🔴 避免：一個沒有使用 Hook 的 Hook 
function useSorted(items) {
  return items.slice().sort();
}

// ✅ 好的：一個不使用 Hook 的普通函數
function getSorted(items) {
  return items.slice().sort();
}
```

這確保程式可在任何地方呼叫普通函數，且包含條件：

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ 可以有條件地呼叫 getSorted() ，因為它不是 Hook 
    displayedItems = getSorted(items);
  }
  // ...
}
```

如果函數內部至少使用一個 Hook （因此讓它成為 Hook），你應該加上前綴 `use` ：

```js
// ✅ 好的：一個使用其他 Hook 的 Hook
function useAuth() {
  return useContext(Auth);
}
```

技術方面而言，這不是 React 所強調的；原則上，你可以建立一個不會呼叫其他 Hook 的 Hook ，但這經常會令人感到困擾與限制，因此最好避免這種模式。然而，這可能對某些罕見的情況有所幫助；例如，也許函數不會馬上使用到任何 Hook ，但你計畫在未來加入一些 Hook 的呼叫，加上前綴的 `use` 便是合理的：

```js {3-4}
// ✅ 好的：一個稍後很可能會使用其他 Hook 的 Hook
function useAuth() {
  // 該做的： 在實作驗證時更新這一行
  // 回傳 useContext(Auth);
  return TEST_USER;
}
```

如此一來， component 就不可能有條件地被呼叫，這在內部實際加入呼叫 Hooks 時變得重要；如果沒有預計在內部（現在或稍後）使用 Hook ，不要將它變成 Hook 。

</DeepDive>

### 客製化 Hook 讓你共享有狀態的邏輯，而非 State 本身 {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

稍早的案例中，切換網路的開關時會同時更新兩個 component ，但認為它們共享單一 `isOnline` state 變數是錯誤的。看這段程式： 

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

它使用與之前提取重複部分相同的方式：

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

這是兩個完全獨立的 state 變數和 Effect ！它們在發生時正好擁有相同的值，因為你使用相同的外部值將它們同步（無論網路是否開啟）。

為了更好地說明，我們會需要不同的案例。想像這個 `Form` component ：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

每個表格的欄位有一些重複的邏輯：

1. 有部分的 state （ `firsrName` 與 `lastName` ）
1. 有改變的處理器（ `handleFirstNameChange` 與 `handleLastNameChange` ）
1. 有部分的 JSX 為 input 指定 `value` 與 `onChange` 屬性

你可以將重複的邏輯提取到 `useFormInput` 的客製化 Hook 中：

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

留意它只宣告*一個*稱為 `value` 的 state 變數。

然而， `Form` component 呼叫*兩次* `useFormInput` ：

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

這是為什麼它的運作像是宣告兩個個別的 state 變數！

**客製化 Hook 讓你共享*有狀態的邏輯*，但不是 *state 本身*。每次的 Hook 呼叫是完全獨立於其他相同的 Hook 呼叫**，這是為什麼上方兩個沙盒是完全相等的。如果你願意，往上滑並比較它們，提取客製化 Hook 的前後行為是一致的。

當你需要在複數 component 間共享 state 本身時，請使用[狀態提升](/learn/sharing-state-between-components)替代。 

## 在 Hook 間傳遞回應的值 {/*passing-reactive-values-between-hooks*/}

在客製化 Hook 內部的程式會在每次 component re-render 期間重新執行，這是為什麼像是 component 或客製化的 Hook [需要保持單純](/learn/keeping-components-pure)，將客製化 Hook 的程式當成 component 的主要部分！

因為客製化 Hook 會與 component 共同 re-render ，它們會總是接收到最新的 props 與 state 。要知道其意涵，想像下方的聊天室範例，改變伺服器的網址或聊天室：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

當改變 `serverUrl` 或 `roomId` 時， Effect [「回應」你的改變](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)，並且重新同步。你可以透過 console 的訊息得知，每當 Effect 的 dependency 改變時，聊天室會重新連線。

現在將 Effect 的程式移到客製化 Hook 中：

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

這讓 `ChatRoom`  component 呼叫客製化 Hook 時不需擔心內部的運作：

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

這看起來會更簡潔！（但它做相同的事情。）

注意邏輯*仍回應* props 與 state 的變化；嘗試編輯伺服器的網址或選擇的房間：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真實實作會連線至實際的伺服器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

注意你如何從一個 Hook 中取得回傳值：

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

以及將它當成 input 向另一個 Hook 傳遞：

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

每次 `ChatRoom` component re-render 時，它傳遞最新的 `roomId` 與 `serverUrl` 到 Hook 內，這是為什麼在 re-render 後，無論它們的值是否改變， Effect 都會重現連線至聊天室。（如果你曾經使用聲音或影片處理軟體，連鎖 Hook 會讓你想起串連視覺與聲音效果，就像 `useState` 的輸出「輸入」 `useChatRoom` 的輸入。）

###  傳遞事件處理器至客製化 Hook {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

描述這部分的**實驗性 API 還未釋出**於 React 的穩定版本中。

</Wip>

當你在更多 component 內開始使用 `useChatRoom` 時，可能會想讓 component 客製化它的行為；例如，現在寫死在 Hook 內的邏輯是在收到訊息時要執行的：

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

你想要將該邏輯移回 component 中：

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

改變客製化 Hook 使它運作，以將取得的 `onReceiveMessage` 當成其中一個命名的選項：

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 宣告所有的 dependency
}
```

這會執行，但客製化 Hook 接收事件處理器時，還可更進一步改善。

在 `onReceiveMessage` 加入 dependency 並不理想，因為它會導致聊天室在每次 component re-render 時重新連線，[將該事件處理器包裝到 Effect 事件內，並從 dependency 中移除](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)：

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 宣告所有的 dependency
}
```

現在，聊天室不會在每次 `ChatRoom` component re-render 時重新連線。以下示範事件處理器傳入客製化 Hook 後，可以操作的完整動作：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真實實作中會實際連線至伺服器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

留意你不再需要為了使用 `useChatRoom` 而了解它*如何*執行，你可以將它加入到其他任何 component 、傳入任何選項，它會以相同的方式執行；這就是客製化 Hook 的力量。

## 使用客製化 Hook 的時機 {/*when-to-use-custom-hooks*/}

你不需要為每個稍為有重複的程式提取客製化 Hook ，有些重複是可以的；例如，像之前提取一個 `useFormInput` Hook ，用以包裝一個 `useState` 呼叫可能會不太必要。

但每當你在編寫 Effect 時，思考它如果也被包裝到自訂 Hook 內是否會更清楚。[你不應該經常需要 Effect](/learn/you-might-not-need-an-effect) ；如果你正在編寫一個 Effect ，這代表你需要「向 React 談判」一些外部系統同步、或執行一些非 React 內建 API 的事情。將它包裝到客製化 Hook 內，令你更簡潔地溝通你的意圖與如何使用資料流。

例如，假設有個顯示兩個下拉式選單的 `ShippingForm` component：一個顯示城市的列表、另一個顯示所選城市的區域列表。你可能會從一些像這樣的程式開始：

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 此 Effect 為國家抓取城市資料
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  //  此 Effect 為所選城市抓取區域資料
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

雖然這段程式幾乎是重複的，但[保持這些 Effect 互相分離是正確的](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。它們同步兩件不同的事情，因此不應該將它們合併成一個 Effect ；反之，你可以透過提取上方 `ShippingForm`  component 內的共同邏輯到 `useData` Hook 中：

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

現在，你可以透過呼叫 `useData` 更新 `ShippingForm` component 內的兩個 Effect ：

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

提取一個客製化 Hook 會使資料流明確，給予 `url` 會得到 `data` ；透過在 `useData` 內「隱藏」 Effect ，你也預防有些處理 `ShippingForm` component 的人加入[不必要的 dependency ](/learn/removing-effect-dependencies)。隨著時間推進，大部分應用程式內的 Effect 會在 Hook 中。

<DeepDive>

#### 保持客製化 Hook 聚焦於具體的高層級使用情境 {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

先從選擇客製化 Hook 的名稱開始，如果你選擇清楚的名稱時遇到困難，這可能表示 Effect 和 component 邏輯的剩餘部分過於耦合，它還沒準備好要被提取。

理想上，客製化 Hook 的名稱需要清楚到不常寫程式的人也可以猜到客製化 Hook 要做什麼、要取得什麼、它會回傳什麼：

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

當你和外部系統同步時，客製化 Hook 的名稱可能會更具技術性，且使用該系統的特定術語，只要對熟悉該系統的人是清楚的即可：

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**保持客製化 Hook 聚焦於具體的高層級使用情境**，避免建立與使用客製化的「生命週期」 Hook ，作為 `useEffect` API 本身的替代方案與便利的包裝器：

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

例如，該 `useMount` Hook 嘗試確保一些程式只在「 on mount 」時執行：

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 避免：使用客製化的「生命週期」 Hook
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 避免：建立客製化的「生命週期」 Hook
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect 失去一個 dependency ： 'fn'
}
```

**如同 `useMount` 的客製化「生命週期」 Hook 無法符合 React 的範例**；例如，此程式範例有一個錯誤（它沒有「回應」 `roomId` 或 `serverUrl` 的改變），但 linter 沒有警告，因為 linter 只會直接確認 `useEffect` 的呼叫，它不知道 Hook 。

如果你正在編寫 Effect ，先直接使用 React API ：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅  好的：兩個原本的 Effect 因為目的而分開

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

接著，你可以（但也可以不用）為不同的高層級使用情境提取客製化 Hook ：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 好的：客製化 Hook 依用途命名
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**一個好的客製化 Hook 透過限制它的運作，讓呼叫程式更加宣告式**；例如 `useChatRoom(option)` 只會連線到聊天室， `useImpressionLog(eventName, extraData)` 則只會為分析傳送曝光紀錄；如果客製化 Hook API 無法限制使用情境且非常抽象，長期下來，可能會帶來遠比解決的問題還多的問題。

</DeepDive>

### 客製化 Hook 協助你轉移到更好的模式 {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect 是一個[「逃脫出口」](/learn/escape-hatches)：在你的使用情境中，沒有更好的內建解決辦法而向「 React 談判」時使用。隨著時間經過， React 團隊的目標是為更多特定的問題提供更多的特定解決辦法，減少 Effect 在應用程式中的最少數量。將 Effect 包裝至客製化 Hook 中，讓它在這些解決辦法變得有效時，容易更新你的程式。

讓我們回到此案例：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

在上方的案例中， `useOnlineStatus` 由一對 [`useState`](/reference/react/useState) 和 [`useEffect`](/reference/react/useEffect) 實作，但這不是最好的解決辦法，沒有考慮到一些危險的情況；例如，它假設 component mount 時， `isOnline` 總會是 `true` ，但這在網路已經中斷時可能會出錯。你可以使用瀏覽器的 [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API 確認，但直接使用會讓伺服器無法產生初始的 HTML ；簡單來說，這段程式需要改善。

幸運地， React 18 包含一個稱為 [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 的專用 API ，它可以為你處理這類型的問題。以下是 `useOnlineStatus` Hook 如何重新改寫以使用此新 API ：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, //如何從使用者端取得值
    () => true // 如何在伺服器取得值
  );
}

```

</Sandpack>

注意你如何**不需要改變任何 component** 將它們轉移：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

這是另一個為什麼將 Effect 包裝到客製化 Hook 總是有利的理由：

1. 你讓出入 Effect 的資料流非常明確
2. 你讓 component 聚焦在意圖，而非準確的 Effect 執行步驟
3. 當 React 增加新功能時，你可以不需要改變任何 component 就移除這些 Effect

與[設計系統](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)相似，你可能會發現它有助於從應用程式的 component 提取共同片段到客製化 Hook 中，它會讓 component 的程式聚焦在意圖上，讓你避免頻繁編寫原本的 Effect ；許多優秀的客製化 Hook 由 React 社群維護。

<DeepDive>

#### React 會為資料抓取提供任何內建的解決辦法嗎？ {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

我們持續在處理細節，但預期未來會有，你會像這樣編寫資料抓取：

```js {1,4,6}
import { use } from 'react'; // 還不能使用！

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

如果你在應用程式中使用像是上方 `useData` 的客製化 Hook ，它會比在每個 component 中手動編寫原生的 Effect ，還需要更多的改變以轉移到最後推薦的方法。但舊方法仍可以持續運作，因此你就快樂地編寫原生的 Effect ，你可以繼續這麼做。

</DeepDive>

### 有多於一種的執行方法嗎？ {/*there-is-more-than-one-way-to-do-it*/}

想要使用瀏覽器 [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API *從頭*實作一個淡入動畫，首先你可能會使用 Effect 設定動畫的迴圈；在每個動畫的關鍵影格中，你會改變你[在 ref 中持有的](/learn/manipulating-the-dom-with-refs) DOM 節點透明度，直到它變成： `1` 。你的程式可能會先像這樣：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 我們仍需要繪製更多影格
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

為了讓 component 更容易閱讀，你可能會將邏輯提取到 `useFadeIn` 的客製化 Hook 中：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 仍需要繪製更多影格
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

你可以讓 `useFadeIn` 維持原狀，但你也會重構它更多；例如你會需要將動畫迴圈的設定邏輯從 `useFadeIn` 的外面，提取到客製化 `useAnimationLoop` 的 Hook 內：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

然而，你不*需要*這麼做。使用一般函數時，你最後會決定要在什麼地方畫上不同程式之間的界線；你也可以使用非常困難的方法，將多數命令式的邏輯移動到 Javascript 的 [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 內，而非將邏輯保留在 Effect 中：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // 我們仍需要繪製更多的影格
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect 讓你將 React 連接到外面的系統。 Effect 之間需要越多的協調（例如串連複數的動畫），像上方的沙盒將邏輯*完全*提取到 Effect 和 Hook 外面就越合理；接著，你提取的程式會*變成*「外部的系統」，這讓 Effect 保持簡潔，因為你只需要傳送訊息到你移動到 React 外面的系統。

上方的案例假設淡入邏輯需要被寫在 Javascript 中，但這種特定的淡入動畫使用簡單的 [CSS 動畫](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)會更簡潔且更有效率：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

有時候，你甚至不需要 Hook ！

<Recap>

- 客製化 Hook 讓你在 component 間共享邏輯
- 客製化 Hook 必須使用 `use` 命名，後面需接上大寫字母
- 客製化 Hook 只會共享有狀態的邏輯，而非 state 本身
- 你可以將回應的值從一個 Hook 傳給另一個，它們會保持最新
- 所有的 Hook 會在 component re-render 時重新執行
- 客製化 Hook 的程式需要保持單純，像是 component 的程式
- 將接收客製化 Hook 的事件處理器包裝到 Effect 事件內
- 不要建立像是 `useMount` 的客製化 Hook ，保持它們的特殊目的
- 你可以決定如何選擇程式的邊界與地方

</Recap>

<Challenges>

#### 提取 `useCounter` Hook {/*extract-a-usecounter-hook*/}

這 component 使用 state 變數與 Effect 顯示每秒增加的數字。將該邏輯提取至名為 `useCounter` 的客製化 Hook 中，你的目標是讓 `Counter` component 完成後像這樣：
 
```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

你會需要在 `useCounter.js` 中編寫客製化 Hook ，並匯入到 `Counter.js` 檔案內。
 
<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// 在這個檔案中編寫你的客製化 Hook ！

```

</Sandpack>

<Solution>

你的程式碼應該如此：

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

注意 `App.js` 不再需要匯入 `useState` 或 `useEffect` 。

</Solution>

#### 使計數器的延遲是可設定的 {/*make-the-counter-delay-configurable*/}

在此案例中，滑桿控制 `delay` state 變數，該值卻不被使用。將 `delay` 的值傳入客製化的 `useCounter` Hook 中，並改變 `useCounter` Hook 以使用傳入的 `deplay` ，而非寫死的 `1000` 毫秒。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

使用 `useCounter(delay)` 將 `delay` 傳至 Hook 中，接著在 Hook 內部使用 `delay` ，取代寫死的值 `1000` ；你會需要將 `delay` 加入到 Effect 的 dependency 中，這會確保 `delay` 改變時會重新設定時間間隔。 

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### 由 `useCounter` 中提取 `useInterval` {/*extract-useinterval-out-of-usecounter*/}

目前 `useCounter` Hook 執行兩件事情，它設定時間間隔，也會在每隔一段時間增加 state 變數。將設定時間間隔的邏輯拆開，並放入名為 `useInterval` 的單獨 Hook 內，它應該需要兩個引數： `onTick` 的 callback 與 `delay` 。改變後，你的 `useCounter` 應該會如同：

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

在 `useInterval.js` 檔案中編寫 `useInterval` ，並將其匯入到 `useCounter.js` 檔案內。 

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// 在這裡編寫你的 Hook ！
```

</Sandpack>

<Solution>

在 `useInterval` 內部的邏輯應該設定與清除時間間隔，它不需要再做任何事情。

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

注意該解決辦法還有一些問題，你會在後續的挑戰中解決它。

</Solution>

#### 修改重新設定的時間間隔 {/*fix-a-resetting-interval*/}

在此範例中，分別有*兩個*時間間隔。

`App` component 呼叫 `useCounter` ，它呼叫 `useInterval` 每秒更新計數器；但 `App` component *也*呼叫 `useInterval` 每兩秒隨機更新頁面的背景顏色。

基於一些理由，更新頁面背景的 callback 並為執行。在 `useInterval` 中加入一些邏輯：
 
```js {2,5}
  useEffect(() => {
    console.log('✅ 使用 delay 設定間隔 ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ 使用 delay 清除間隔 ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Log 符合你所期望發生的事情嗎？如果有些 Effect 似乎非必要地重新同步，你可以猜測是哪個 dependency 引起的嗎？有存在一些從 Effect 中[移除 dependency ](/learn/removing-effect-dependencies)的方式嗎？

在你處理這些問題後，你應該預期頁面的背景會每兩秒更新。

<Hint>

看起來你的 `useInterval` Hook 將事件監聽器作為引數接收。你可以思考包裝事件監聽器的方式，讓它不用成為 Effect 的 dependency 嗎？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

在 `useInterval` 中，將 tick callback 包裝到 Effect 事件中，就你[稍早在此頁](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)做的事情。

這會允許你從 Effect 的 dependency 中忽略 `onTick` ， Effect 不會在每次 component re-render 時同步更新，因此每次改變頁面的背景顏色前，不會有機會觸發每秒的重新設定。

透過這個改變，兩個時間間隔會如預期般執行，且不會互相干擾：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### 完成一個驚人的動作 {/*implement-a-staggering-movement*/}

在此範例中， `usePointerPosition` Hook 追蹤目前的游標位置。嘗試移動你的游標或你的手指到預覽區域，並觀察紅點跟隨你的動作；其位置被儲存為 `pos1` 變數。

事實上，有五個（！）不同的紅點會被 render 。你不會看見它們，因為現在它們全部都出現在相同的位置，這是你需要修改的，你需要完成「驚人的」動作取代它：每個點應該「跟隨」上一個點的路徑。例如，如果快速移動你的游標，第一個點應該馬上跟上；第二個點應該稍緩跟隨第一個點；第三個點應該跟著第二個點，以此類推。

你需要完成 `useDeleyedValue` 客製化 Hook ，目前的實作會回傳提供給它的 `value` ；而你想要將值回傳至 `delay` 的毫秒前。你可能需要使用一些 state 與 Effect 完成它。 

在你完成 `useDelayValue` 後，你應該看到點跟著另一個點移動。

<Hint>

你會需要將 `delayedValue` 儲存為客製化 Hook 內的 state 變數。當 `value` 改變時，你會想要執行 Effect ，該 Effect 應該在 `delay` 後更新 `delayedValue` 。你可能發現呼叫 `setTimeout` 是有用的。

這個 Effect 需要清除嗎？為什麼與為什麼不？

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

這裡有個運作的版本。你將 `delayedValue` 視為 state 變數，當 `value` 更新時， Effect 安排暫停以更新 `delayedValue` 。這是為什麼 `delayedValue` 總是「落後」實際的 `value` 。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

留意該 Effect *不*需要清除。如果在清除函數中呼叫 `clearTimeout` ，接著每次 `value` 改變時，它都會重新設定已經規劃好的暫停。為了保持持續的動作，你需要觸發每次的暫停。 

</Solution>

</Challenges>
