---
title: '響應式 Effect 的生命週期'
---

<Intro>

Effect 和元件的生命週期並不相同。元件會掛載（mount）、更新或卸載(unmount)。Effect 只能做兩件事：開始同步某件事，並在稍後結束同步。如果你的 Effect 依賴隨著時間改變屬性（props）及狀態，這個循環可以發生很多次。React 有提供一個 linter 規範來檢查是否已經正確指定 Effect 的依賴項目。這能讓你的 Effect 與最新的屬性和狀態保持同步。

</Intro>

<YouWillLearn>

- 如何區分 Effect 的生命週期和元件的生命週期
- 如何思考每個獨立的 Effect
- 什麼時候、為什麼你的 Effect 會需要重新同步（re-synchronize）
- 如何決定 Effect 的依賴
- 響應式（reactive）的值所代表的意義
- 依賴是空陣列時所代表的意義
- React 如何以 linter 驗證依賴是否正確
- 當不同意 linter 時該怎麼做

</YouWillLearn>

## Effect 的生命週期 {/*the-lifecycle-of-an-effect*/}

每個 React 的元件都會經歷同樣的生命週期：

- _掛載_：元件被新增到畫面中。
- _更新_：元件接收新的屬性或狀態，通常是在回應一個互動。
- _卸載_：元件從畫面中被移除。

**這是一個思考元件的好方法，但不適用於 Effect。** 應該試著將每個 Effect 獨立於元件來思考。Effect 是用來描述如何以當前的屬性及狀態[同步一個外部系統](/learn/synchronizing-with-effects)。隨著程式碼改變，同步的頻率會增加或減少。

為了說明這一點，來看看一個將元件連線到聊天伺服器的 Effect：

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Effect 的主體（body）指定如何 **開始同步**：

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

以 Effect 回傳的清除函式（cleanup function）指定如何 **停止同步**：

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

直覺上，你可能覺得 React 會在元件掛載時 **開始同步**，並在元件卸載時 **結束同步**。然而這並不是故事的結局！有時候，當元件維持在掛載的狀態時，也可能需要 **開始和結束同步很多次**。

讓我們來看看 _為什麼_ 這是必要的，以及 _什麼時候_ 會發生這個情形，還有 _如何_ 控制這個行為。

<Note>

有些 Effect 並不會回傳清除函式。[更多時候](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)，你會想回傳一個清除函式——但如果你沒有回傳，React 會表現得像是你回傳了一個空的清除函式。

</Note>

### 為什麼可能需要同步不止一次 {/*why-synchronization-may-need-to-happen-more-than-once*/}

想像一下 `ChatRoom` 元件接收一個 `roomId` 屬性，是使用者在下拉式選單選取的值。一開始使用者選了 `"general"` 作為 `roomId`。你的應用程式會顯示 `"general"` 這個聊天室：

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

當 UI 顯示後，React 會執行你的 Effect 來 **開始同步**，它會連上 `"general"` 聊天室：

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 連線到 "general" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 從 "general" 聊天室中斷連線
    };
  }, [roomId]);
  // ...
```

到目前為止，一切都很好。

接著，使用者從下拉式選單選擇一個不同的房間（例如 `"travel"`）。一開始 React 會更新 UI：

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

想想看接下來應該會發生什麼事。使用者在 UI 中看到 `"travel"` 聊天室被選取，但上一次執行的 Effect 還是連線到 `"general"` 房間。**因為 `roomId` 屬性已經改變了，所以後續你的 Effect （與 `"general"` 聊天室連線）與 UI 並不相符**。

基於這點，你會希望 React 能做兩件事：

1. 停止以舊的 `roomId` 同步（從 `"general"` 聊天室中斷連線）
2. 開始以新的 `roomId` 同步（連線到 `"travel"` 聊天室）

**幸運的是，你已經告訴 React 要怎麼做這兩件事！**Effect 的主體指定如何開始同步，而清除函式則是指定如何停止同步。React 必須做的就只是以正確的順序，並使用正確的屬性和狀態來呼叫它們。讓我們來看看到底是怎麼發生的。

### React 如何重新同步你的 Effect {/*how-react-re-synchronizes-your-effect*/}

回想一下 `ChatRoom` 元件已經從 `roomId` 屬性接收了新的值。這個值原本是 `"general"`，現在則是 `"travel"`。React 需要重新同步 Effect，以重新連線到不同的房間。

為了 **停止同步**，React 會在連線到 `"general"` 聊天室後，呼叫 Effect 回傳的清除函式。因為 `roomId` 是 `"general"`，清除函式會從 `"general"` 聊天室中斷連線：

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 連線到 "general" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 從 "general" 聊天室中斷連線
    };
    // ...
```

接著 React 會執行你在渲染期間就已經提供的 Effect。這次，`roomId` 是 `"travel"`，所以會 **開始同步** 到 `"travel"` 聊天室（也是直到 Effect 的清除函式最後被呼叫）：

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 連線到 "travel" 聊天室
    connection.connect();
    // ...
```

多虧這樣，你現在連到和使用者在 UI 中所選相同的房間。災難解除！

每次元件以不同的 `roomId` 重渲染（re-render）之後，Effect 就會重新同步。舉例來說，使用者把 `roomId` 從 `"travel"` 改成 `"music"`。React 會再次以清除函式 **停止同步** Effect（從 `"travel"` 聊天室中斷連線）。接著 React 會執行 Effect 的主體，以新的 `roomId` 屬性再次 **開始同步**（讓你連線到 `"music"` 聊天室）。

最後，當使用者去到不同的畫面，`ChatRoom` 卸載。現在完全沒必要保持連線了。React 會最後一次 **停止同步** 你的 Effect，並中斷你和 `"music"` 聊天室的連線。

### 從 Effect 的觀點來思考 {/*thinking-from-the-effects-perspective*/}

讓我們從 `ChatRoom` 元件的視角回顧所有發生的事：

1. `roomId` 被設定為 `"general"`，`ChatRoom` 掛載
1. `roomId` 被設定為 `"travel"`，`ChatRoom` 更新
1. `roomId` 被設定為 `"music"`，`ChatRoom` 更新
1. `ChatRoom` 卸載

在元件的每個生命週期的點上，你的 Effect 做了不同的事情：

1. 你的 Effect 連線到 `"general"` 聊天室
1. 你的 Effect 從 `"general"` 聊天室中斷連線，並連線到 `"travel"` 聊天室
1. 你的 Effect 從 `"travel"` 聊天室中斷連線，並連線到 `"music"` 聊天室
1. 你的 Effect 從 `"music"` 聊天室中斷連線

現在讓我們從 Effect 本身的視角來思考發生什麼事：

```js
  useEffect(() => {
    // 你的 Effect 連線到以 roomId 指定的聊天室⋯⋯
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ⋯⋯直到它中斷連線
      connection.disconnect();
    };
  }, [roomId]);
```

這段程式碼的結構可能會啟發你將發生的事情視為一系列互不重疊的時間段：

1. 你的 Effect 連線到 `"general"` 房間（直到它中斷連線）
2. 你的 Effect 連線到 `"travel"` 房間（直到它中斷連線）
3. 你的 Effect 連線到 `"music"` 房間（直到它中斷連線）

之前，你是以元件的視角來思考。當你以元件的角度來看，會傾向將 Effect 視為「callback」或「生命週期事件（lifecycle event）」，在特定的時間觸發，像是「渲染之後」或「卸載之前」。這種思考方式會快速地變複雜，所以最好避免。

**取而代之的是，每次只關注一個單一的開始/結束循環。元件是否掛載、更新或卸載並不重要。你只需要去描述如何開始同步及如何結束它。如果處理得好，你的 Effect 就會經得起多次所需的開始和結束。**

這可能會讓你想到，當你在撰寫創建 JSX 的渲染邏輯時，如何不去考慮元件是否掛載或更新。只要描述畫面上應該有什麼，React [會解決其餘的部分](/learn/reacting-to-input-with-state)。

### React 如何驗證你的 Effect 能否重新同步 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

這邊有一個範例，你可以玩玩看。按下「開啟對話」來掛載 `ChatRoom` 元件：

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
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '關閉對話' : '開啟對話'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

注意元件第一次掛載時，你會看到三筆紀錄：

1. `✅ 連線到 "general" 聊天室，位於 https://localhost:1234...` *(development-only)*
2. `❌ 從 "general" 聊天室中斷連線，位於 https://localhost:1234.` *(development-only)*
3. `✅ 連線到 "general" 聊天室，位於 https://localhost:1234...`

前兩筆紀錄僅限開發模式。在開發模式中，React 會重複掛載每個元件一次。

**React 強迫 Effect 在開發模式立刻這麼做，來驗證你的 Effect 能否重新同步。** 這可能會讓你聯想到開門後，將門關上第二次，來確認門鎖是否管用。React 在開發模式額外開始並結束你的 Effect 一次，以檢查[你已經確實實作清除函式](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)了。

實務上，Effect 會重新同步的主要原因，是它使用到的某些資料改變了。在上面的沙盒中，是改變所選的聊天室。注意當 `roomId` 改變時，Effect 如何重新同步。

不過，也有一些少見的狀況，是必須要重新同步的。例如，當聊天開啟時，試著編輯上面沙盒中的 `serverUrl`。注意 Effect 如何隨著你編輯程式碼，來重新同步。未來 React 可能會增加一些依賴重新同步的功能。

### React 如何得知需要重新同步 Effect {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

你可能在想 React 是怎麼知道 Effect 在 `roomId` 改變後，需要重新同步。這是因為 *你告訴 React* 它的程式碼依賴 `roomId`，藉由[依賴的清單](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)：

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId 屬性可能隨著時間改變
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 讀取 roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 所以你告訴 React 這個 Effect「依賴」roomId
  // ...
```

運作方式如下：

1. 你知道 `roomId` 是一個屬性，這意味著它會隨著時間改變
2. 你知道你的 Effect 讀取 `roomId`（所以它的邏輯依賴稍後可能會改變的值）。
3. 這就是為什麼你指定 `roomId` 作為你的 Effect 的依賴（以至於 Effect 會在 `roomId` 改變時重新同步）。

每次元件重渲染之後，React 會查看你傳入的依賴陣列。如果有任一個陣列中的值和你在上一次渲染中傳入的值不同，React 就會重新同步你的 Effect。

舉例來說，如果你在初次渲染時傳入 `["general"]`，接著在下一次渲染傳入 `["travel"]`，React 會比較 `"general"` 和 `"travel"`。這兩個值不同（用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 來作比較），所以 React 會重新同步你的 Effect。另一方面，如果元件重新渲染，但 `roomId` 沒有改變，你的 Effect 就會維持同一個聊天室的連線。

### 每個 Effect 都代表一個獨立的同步程序 {/*each-effect-represents-a-separate-synchronization-process*/}

避免只因為一些邏輯需要和你已經寫好的 Effect 同時執行，就在 Effect 中加入無關的邏輯。例如，假設你想要在使用者訪問聊天室時，傳送一個分析事件（analytics event）。你已經有一個依賴 `roomId` 的 Effect，所以你可能會感覺可以把分析的呼叫加進去：

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

但想像一下你接著會將另一個依賴加到這個 Effect，而這個 Effect 需要重新建立連線。如果這個 Effect 重新同步，它就會在同一個聊天室呼叫 `logVisit(roomId)`，而這不是你想要的。紀錄訪問和連線 **是不同的程序**。應該將它們寫成分別的兩個 Effect：

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**在你的程式碼中，每個 Effect 應該代表分別且獨立的同步程序。**

在上面的範例中，刪除其中一個 Effect 並不會毀壞另一個 Effect 的邏輯。這很好地顯示了它們是同步不同的東西，所以將它們分開是合理的。另一方面，如果你將一段內聚（cohesive）的邏輯拆分成分別的 Effect，程式碼可能看起來「比較簡潔」，但可能會[更難維護](/learn/you-might-not-need-an-effect#chains-of-computations)。這也是為什麼你應該思考這些程序是相同還是分開的，而不是程式碼看起來是否簡潔。

## Effect 對響應式數值的「反應（react）」 {/*effects-react-to-reactive-values*/}

你的 Effect 讀取兩個變數（`serverUrl` 和 `roomId`），但你只指定 `roomId` 作為依賴：

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

為什麼 `serverUrl` 不需要被指定為依賴？

這是因為 `serverUrl` 完全不會因為重渲染而改變。不管元件重渲染多少次，`serverUrl` 都是一樣的。因為 `serverUrl` 不會改變，沒道理將它指定為依賴。畢竟，依賴只會在隨著時間改變時做一些事！

另一方面，`roomId` 在重渲染時可能不同。**屬性、狀態和元件中其它被宣告的值是 _響應式的_，因為它們是在渲染時被計算，而且參與了 React 的資料流。**

如果 `serverUrl` 是一個狀態變數（state variable），它就會是響應式的。響應式的值必須包含在依賴中：

```js {2,5,10}
function ChatRoom({ roomId }) { // 屬性隨著時間改變
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // 狀態可能隨著時間改變

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 讀取屬性和狀態
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 所以你告訴 React，Effect「依賴」屬性和狀態
  // ...
}
```

藉由將 `serverUrl` 納入依賴，可以確保當它改變時，Effect 會重新同步。

試著在沙盒中，改變所選的聊天室，或編輯伺服器位址：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        伺服器位址：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>歡迎來到 {roomId} 聊天室！</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
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
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

無論什麼時候改變像 `roomId` 或 `serverUrl` 這樣的響應式數值，Effect 都會重新連線到聊天伺服器。

### Effect 的依賴為空陣列時所代表的意義 {/*what-an-effect-with-empty-dependencies-means*/}

如果把 `serverUrl` 和 `roomId` 都移出元件，會發生什麼事？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 所有宣告的依賴
  // ...
}
```

現在 Effect 的程式碼沒有用到 *任何* 響應式的值，所以依賴可以是空的（`[]`）。

從元件的角度來想，空的依賴陣列 `[]` 表示 Effect 只有在元件掛載時會連線到聊天室，並且只有在元件卸載時中斷連線。（記住 React 在開發模式仍然會[額外重新同步一次](#how-react-verifies-that-your-effect-can-re-synchronize)，對你的邏輯進行壓力測試。）

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? '關閉對話' : '開啟對話'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

不過，如果[從 Effect 的角度來看](#thinking-from-the-effects-perspective)，你完全不需要考慮掛載和卸載。重要的是，你已經清楚定義 Effect 要如何開始和結束同步。現在，Effect 沒有響應式的依賴。但如果你之後想讓使用者改變 `roomId` 或 `serverUrl`（它們會變成響應式），Effect 的程式碼不會改變。你只需要把 `roomId` 或 `serverUrl` 加進依賴。

### 元件主體中所有宣告的變數都是響應式的 {/*all-variables-declared-in-the-component-body-are-reactive*/}

屬性和狀態不是唯一的響應式數值，以這兩者計算而來的值也是響應式的。當屬性和狀態改變，元件會重渲染，計算而來的值也會跟著改變。這也是為什麼元件主體中，被 Effect 用到的所有數值都應該包含在依賴的清單中。

使用者能從下拉式選單選擇一個聊天伺服器，但他們也可以在設置中設定一個預設伺服器。假設你已經將這些設定的狀態放進一個 [Context](/learn/scaling-up-with-reducer-and-context)，所以你能從 Context 讀取 `settings`。現在你需要根據屬性中所選的伺服器和預設伺服器，來計算 `serverUrl`：

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId 是響應式的
  const settings = useContext(SettingsContext); // settings 是響應式的
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl 是響應式的
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 讀取 roomId 和 serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 所以無論哪個值改變，Effect 都需要重新同步！
  // ...
}
```

在這個範例中，`serverUrl` 不是屬性，也不是狀態變數。它只是渲染期間計算而來的普通的值。但因為它是渲染期間所計算，所以可能因為重渲染而改變。這也就是為什麼它是響應式的。

**元件中的所有值（包含屬性、狀態和元件主體中的變數）都是響應式的。任何響應式的值在重渲染中都可以改變，所以必須將響應式的值包含在 Effect 的依賴中。**

換句話說，Effect 會對元件主體中所有的值做出「反應（react）」。

<DeepDive>

#### 依賴可以是全域或可變動的值嗎？ {/*can-global-or-mutable-values-be-dependencies*/}

可變動（mutable）的值（包含全域變數）不是響應式的。

**可變動的值，像是 [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) 不能作為依賴。** 它是可變動的，所以它完全可能在 React 渲染資料流以外的任何時間改變。改變這些值不會觸發元件的重渲染。因此，即使你指定這些值作為依賴，當這些值改變時，React *並不知道* 要重新同步 Effect。這也會破壞 React 的規則，因為在渲染期間（也就是計算這些依賴的時候）讀取可變動的資料會破壞[渲染的純度（purity）](/learn/keeping-components-pure)。你應該用 [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) 讀取和訂閱外部的可變動數值。

**一個可變動的值，像是 [`ref.current`](/reference/react/useRef#reference)，或你從其中讀取的東西也不能作為依賴。** `useRef` 所回傳的 ref 物件可以作為依賴，但它的 `current` 屬性（property）是可變動的。它讓你[追蹤一些東西而不觸發重渲染](/learn/referencing-values-with-refs)。但因為改變它不會觸發重渲染，所以它不是響應式的值，當它改變時，React 也不會知道要重新執行 Effect。

當你學習這一頁下方的內容，會有一個 linter 自動檢查上述的議題。

</DeepDive>

### React 會驗證所有你指定為依賴的響應式數值 {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

如果你的 linter 是[為 React 所設置](/learn/editor-setup#linting)，它會檢查 Effect 程式碼中作為依賴所用到的所有響應式數值。舉例來說，這是一個因為 `roomId` 和 `serverUrl` 都是響應式，所引發的 lint 錯誤：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId 是響應式的
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl 是響應式的

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- 這裡有一些問題！

  return (
    <>
      <label>
        伺服器位址：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>歡迎來到 {roomId} 聊天室！</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
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
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

這可能看起來像是一個 React 錯誤，但實際上是 React 指出了程式碼中的一個 bug。`roomId` 和 `serverUrl` 都可能隨著時間改變，但你忘了要在它們改變時，重新同步你的 Effect。這樣即使稍後使用者選擇 UI 中不同的值，還是會連線到一開始的 `roomId` 和 `serverUrl`。

為了修正這個 bug，跟從 linter 的建議，將 `roomId` 和 `serverUrl` 指定為 Effect 的依賴：

```js {9}
function ChatRoom({ roomId }) { // roomId 是響應式的
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl 是響應式的
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ 所有宣告的依賴
  // ...
}
```

試試看在上面的沙盒中修正這個 bug。驗證 linter 還有沒有錯誤，以及聊天室是否如所需地重新連線。

<Note>

在某些狀況下，React *知道* 某些值即使宣告在元件內，也從來不會改變。例如，`useState` 所回傳的 [`set` 函式](/reference/react/useState#setstate)，以及 [`useRef`](/reference/react/useRef) 所回傳的 ref 物件是 *穩定的（stable）*——它們保證不會在重渲染中改變。穩定的值不是響應式的，所以可以從依賴清單中省略。這些值被允許包含在依賴中：因為它們不會改變，所以沒有差別。

</Note>

### 不想重新同步時該怎麼做 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

在前面的範例中，你把 `roomId` 和 `serverUrl` 列為依賴，修正了 lint 錯誤。

**但是，你也可以向 linter「證明」這些值不是響應式數值** ，也就是說，它們 *無法* 改變重渲染的結果。舉例來說，如果 `roomId` 和 `serverUrl` 不依賴渲染，而且值不會改變，你可以把它們搬到元件外面。這樣它們就不需要是依賴了：

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl 不是響應式的
const roomId = 'general'; // roomId 不是響應式的

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 所有宣告的依賴
  // ...
}
```

你也可以把它們 *搬進 Effect*。它們不會在渲染期間計算，所以不是響應式的：

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl 不是響應式的
    const roomId = 'general'; // roomId 不是響應式的
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 所有宣告的依賴
  // ...
}
```

**Effect 是一段響應式的程式碼。** 當你從中讀取的值改變時，Effect 就會重新同步。不像事件處理函式（event handler）只會在每次互動時執行一次，Effect 在每次需要同步時都會執行。

**你不能「隨意選擇」依賴。** 依賴必須包含 Effect 中所讀取的所有[響應式數值](#all-variables-declared-in-the-component-body-are-reactive)。Linter 強迫必須這麼做。有時候這可能會導致一些問題，像是無窮迴圈，以及 Effect 太常重新同步。別用忽略（suppress）linter 的方式解決這些問題！你可以這麽做：

* **確認你的 Effect 在獨立的同步程序中所代表的意義。** 如果你的 Effect 沒有同步任何東西，[它可能就是不必要的](/learn/you-might-not-need-an-effect)。如果你的 Effect 同步許多獨立的東西，[應該把它們拆分](#each-effect-represents-a-separate-synchronization-process)。

* **如果你想要讀取屬性或狀態最新的值，但不「響應」這些值，也不重新同步 Effect，** 你可以將 Effect 拆分成響應式的部分（你保留在 Effect 中的部分）和非響應式的部分（你會抽出的部分，被稱為 _Effect 事件_）。[閱讀更多關於把事件從 Effect 中分離](/learn/separating-events-from-effects)。

* **避免將物件和函式作為依賴。** 如果你在渲染期間創建物件和函式，接著在 Effect 中讀取它們，它們在每次渲染時都會不同。這會導致 Effect 每次都會重新同步。[閱讀更多關於把不必要的依賴從 Effect 中移除](/learn/removing-effect-dependencies)。

<Pitfall>

Linter 是你的朋友，但它的能力有限。Linter 只知道依賴什麼時候是 *錯的*，它不知道解決每個狀況的 *最佳* 解法。如果 Linter 建議增加一個值作為依賴，卻造成迴圈，這並不表示 linter 應該被忽略。你應該改變 Effect 內部（或外部）的程式碼，讓這個值不為響應式，也 *不需要* 是依賴。

如果你有一些現成的程式碼，你可能會有一些 Effect 在忽略 linter 的規則，像這樣：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 避免像這樣忽略 linter 的規則：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

在[後續的](/learn/separating-events-from-effects)[頁面](/learn/removing-effect-dependencies)中，你將學習如何在不破壞規則的情況下修正這些程式碼。這總是值得修正！

</Pitfall>

<Recap>

- 元件可以掛載、更新和卸載。
- 每個 Effect 都有獨立於元件的生命週期。
- 每個 Effect 描述獨立的同步程序，這些程序可以 *開始* 和 *結束*。
- 撰寫和閱讀 Effect 的程式碼時，要從每個獨立的 Effect 的角度來思考（如何開始和結束同步），而不是從元件的角度（元件如何掛載、更新或卸載）。
- 元件主體中宣告的值是「響應式」的。
- 響應式的值應該重新同步 Effect，因為這些值會隨著時間改變。
- Linter 會驗證 Effect 中所有使用到的響應式數值是否被指定為依賴。
- Linter 標記的所有錯誤都是合法的。一定能找到方法去修正程式碼，而且不會破壞規則。

</Recap>

<Challenges>

#### 修正每次按鍵時的重新連線 {/*fix-reconnecting-on-every-keystroke*/}

在這個範例中，`ChatRoom` 元件在掛載時連線到聊天室、卸載時中斷連線，並在選擇不同聊天室時重新連線。這樣的行為是正確的，因此你必須維持這個運作。

不過，這邊有一個問題。每次你在下方的訊息輸入框打字，`ChatRoom` *也* 都會重新連線到聊天室（清空 console 然後在輸入框打字，就可以看到這個情形）。現在你來修正這個問題，讓它不再發生。

<Hint>

你可能會需要為 Effect 新增一個依賴陣列。裡面應該有哪些依賴呢？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>歡迎來到 {roomId} 聊天室！</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
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
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

這個 Effect 根本沒有依賴陣列，所以會在每次重渲染時重新同步。首先，新增一個依賴陣列。接下來，確保 Effect 所用到的每個響應式數值都被指定在陣列中。舉例來說，`roomId` 是響應式的（因為它是一個屬性），所以應該包含在陣列中。這確保使用者選取不同的房間時，都會重新連線到聊天室。另一方面，`serverUrl` 是在元件外定義的，這就是為什麼它不需要在陣列裡。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>歡迎來到 {roomId} 聊天室！</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
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
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### 開啟或關閉同步 {/*switch-synchronization-on-and-off*/}

在這個範例中，Effect 訂閱視窗的 [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) 事件，移動畫面中的粉紅色點點。試著在預覽區域上揮一揮（如果你是用手機裝置就觸碰畫面），然後看看粉紅色點點是怎麼跟著你的動作。

這裡還有一個核取方塊（checkbox）。點擊核取方塊可以切換 `canMove` 狀態變數，但這個狀態變數沒有在程式碼的任何地方被用到。你的任務是去改寫這段程式碼，當 `canMove` 是 `false` 時（核取方塊未勾選），點點應該停止移動。當你勾選核取方塊（並將 `canMove` 設為 `true`），點點應該再次跟著移動。換句話說，不管點點能不能移動，都應該跟核取方塊是否勾選保持同步。

<Hint>

不能在條件下（conditionally）宣告 Effect。不過 Effect 中的程式碼可以使用條件。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

其中一個解法是將 `setPosition` 呼叫包在一個 `if (canMove) { ... }` 條件式中：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

另一個方法是，將 *事件訂閱* 邏輯包在 `if (canMove) { ... }` 條件式中：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

在這兩個案例中，`canMove` 都是可以在 Effect 中讀取的響應式數值。這就是為什麼它必須在 Effect 的依賴清單中被指定。這確保 Effect 會在每次這個值改變時重新同步。

</Solution>

#### 檢查舊值的 bug {/*investigate-a-stale-value-bug*/}

在這個範例中，粉紅色點點應該在核取方塊勾選時移動，在核取方塊未勾選時停止。這個邏輯已經實作好了：`handleMove` 事件處理函式會檢查 `canMove` 狀態變數。

但是，因為一些緣故，`handleMove` 中的 `canMove` 狀態變數看起來是「陳舊的（stale）」：即使你點掉核取方塊，它的值都還是 `true`。這怎麼可能呢？找找看程式碼中的錯誤並修正它。

<Hint>

如果你看到一個 linter 規則被忽略，移除它！那通常就是發生錯誤的地方。

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

原本程式碼的問題是忽略了 linter 的檢查。移除忽略之後，就會看到 Effect 依賴 `handleMove` 函式。這是合理的：`handleMove` 是在元件主體中宣告，所以它是響應式數值。所有的響應式數值都應該被指定為依賴，否則就有可能一直保持舊的值。

這段程式碼的作者「欺騙」React 說這個 Effect 沒有依賴（`[]`）任何響應式數值。這也就是為什麼 React 沒有在 `canMove` （還有跟它一起的 `handleMove`）改變時重新同步 Effect。因為 React 沒有重新同步 Effect，作為監聽函式（listener）的 `handleMove` 是初次渲染時創建的 `handleMove`。在初次渲染期間，`canMove` 是 `true`，所以初次渲染時的 `handleMove` 也只會看到 `true`。

**如果你從未忽略 linter，就不會遇到舊值的問題。** 有一些不同的方式可以解決這個 bug，但你應該總是先移除 linter 的忽略。接著修改程式碼來解決 linter 的錯誤。

你可以將 Effect 的依賴改成 `[handleMove]`，但因為它會在每次渲染時變成新定義的函式，可能還是把依賴陣列整個刪掉比較好。那 Effect *就會* 在每次重渲染時重新同步：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  });

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

這個解決方法可行，但並不理想。如果你將 `console.log('Resubscribing')` 放進 Effect，就會注意到它在每次重渲染後，都會重新訂閱。重新訂閱的速度很快，但避免常常這麼做，還是會比較好。

一個比較好的修正方式是將 `handleMove` 函式移到 Effect *裡面*。這樣 `handleMove` 就不是響應式數值，Effect 也不會依賴一個函式。作爲代替，Effect 需要依賴 `canMove`，是你的程式碼現在在 Effect 中讀取的值。這跟你想要的行為一致，因為你的 Effect 現在會和 `canMove` 的值保持同步：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        點點可以移動
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

試著將 `console.log('Resubscribing')` 加入 Effect 主體，然後注意它現在只會在你切換核取方塊（`canMove` 改變）或編輯程式碼時重新訂閱。這樣比之前總是重新訂閱的方法好多了。

你將會在[把事件從 Effect 中分離](/learn/separating-events-from-effects)的章節，學到更普遍處理這種問題的方法。

</Solution>

#### 修正連線開關 {/*fix-a-connection-switch*/}

在這個範例中，`chat.js` 中的聊天服務提供兩個不同的 API：`createEncryptedConnection` 和 `createUnencryptedConnection`。`App` 根元件讓使用者選擇是否使用加密機制，接著向下傳遞（pass down）對應的 API 方法給 `ChatRoom` 子元件作為 `createConnection` 屬性。

注意一開始 console log 說連線沒有加密。試著勾選核取方塊：沒有任何事情發生。但是，如果你在那之後更改所選的房間，那聊天室會重新連線 *並且* 開啟加密機制（就跟你在 console 訊息裡看到的一樣）。這是一個 bug。修正這個 bug，讓切換核取方塊 *也* 能使聊天室重新連線。

<Hint>

忽略 linter 的做法始終很可疑。這會不會是 bug 呢？

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        開啟加密機制
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 🔐 連線到 "' + roomId + ' ⋯⋯（已加密）');
    },
    disconnect() {
      console.log('❌ 🔐 從"' + roomId + '" 聊天室中斷連線（已加密）');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + ' ⋯⋯（未加密）');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線（未加密）');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

如果移除掉 linter 的忽略，就會看到一個 lint 錯誤。問題出在 `createConnection` 是屬性，因此它是響應式數值。它會隨著時間改變！（確實，它應該改變——像是使用者點選核取方塊時，父元件傳入不同的值給 `createConnection` 屬性。）這就是為什麼它應該是依賴。將它納入依賴清單來修正這個 bug：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        開啟加密機制
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 🔐 連線到 "' + roomId + '⋯⋯（已加密）');
    },
    disconnect() {
      console.log('❌ 🔐 從"' + roomId + '" 聊天室中斷連線（已加密）');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + ' ⋯⋯（未加密）');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線（未加密）');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection` 是依賴，這是正確的。不過這段程式碼有點脆弱，因為有些人可能會將行內函式（inline function）作為屬性的值傳給 `App` 元件。在此情況下，每次 `App` 元件重渲染時，這個值就會不同，Effect 可能會因此太常重新同步。為了避免這個情況，你可以向下傳遞 `isEncrypted` 作為代替：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        選擇聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">一般</option>
          <option value="travel">旅行</option>
          <option value="music">音樂</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        開啟加密機制
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 🔐 連線到 "' + roomId + '⋯⋯（已加密）');
    },
    disconnect() {
      console.log('❌ 🔐 從"' + roomId + '" 聊天室中斷連線（已加密）');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + ' ⋯⋯（未加密）');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線（未加密）');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

在這個版本中，`App` 元件傳入布林屬性，而不是函式。在 Effect 中，你來決定用哪個函式。`createEncryptedConnection` 和 `createUnencryptedConnection` 都是在元件外宣告，因此不是響應式，也不需要是依賴。你將會在[移除 Effect 的依賴](/learn/removing-effect-dependencies)的章節學到更多相關資訊。

</Solution>

#### 填充一系列的選單 {/*populate-a-chain-of-select-boxes*/}

在這個範例中，有兩個選單（select box）：一個讓使用者選擇行星；另一個讓使用者選擇 *行星上的* 地點。第二個選單還無法作用。你的任務是讓它顯示所選行星的地點。

來看看第一個選單是怎麼運作的。它將 `"/planets"` API 呼叫結果填到 `planetList` 狀態中。現在所選的行星 ID 被保存在 `planetId` 狀態變數裡。你需要找到某個地方來新增額外的程式碼，將 `"/planets/" + planetId + "/places"` API 呼叫的結果填到 `placeList` 狀態變數中。

如果你的實作正確，選擇行星時應該會填滿地點清單。改變行星時，也應該會改變地點清單。

<Hint>

如果你有兩個獨立的同步程序，應該要寫成兩個分別的 Effect。

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('取得行星清單。');
        setPlanetList(result);
        setPlanetId(result[0].id); // 選擇第一個行星
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        選擇行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        選擇地點：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你正在前往 {placeId || '？？？'} ，位於 {planetId || '？？？'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('預期接收像是 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('預期接收像是 "/planets" 或 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 期望接收一個字串作為引數。 ' +
      '但實際收到： ' + planetId + ' 。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '寮國'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奧萊莉婭'
        }, {
          id: 'diana-chasma',
          name: '黛安娜峽谷'
        }, {
          id: 'kumsong-vallis',
          name: '金城谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '鋁城'
        }, {
          id: 'new-new-york',
          name: '新紐約'
        }, {
          id: 'vishniac',
          name: '維什尼亞茨'
        }]);
      } else throw Error('未知的行星 ID：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

這裡有兩個獨立的同步程序：

- 第一個選單跟遠端的行星清單同步。
- 第二個選單跟遠端的地點清單同步，而地點清單是根據當前的 `planetId`。

這也是為什麼將它們描述成兩個分別的 Effect 是合理的。你可以照下方的範例來做做看：

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('取得行星清單。');
        setPlanetList(result);
        setPlanetId(result[0].id); // 選擇第一個行星
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // 第一個清單尚未選取任何東西
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('取得 "' + planetId + '" 的地點清單。');
        setPlaceList(result);
        setPlaceId(result[0].id); // 選擇第一個地點
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        選擇行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        選擇地點：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你正在前往 {placeId || '？？？'} ，位於 {planetId || '？？？'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('預期接收像是 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('預期接收像是 "/planets" 或 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 期望接收一個字串作為引數。 ' +
      '但實際收到： ' + planetId + ' 。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '寮國'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奧萊莉婭'
        }, {
          id: 'diana-chasma',
          name: '黛安娜峽谷'
        }, {
          id: 'kumsong-vallis',
          name: '金城谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '鋁城'
        }, {
          id: 'new-new-york',
          name: '新紐約'
        }, {
          id: 'vishniac',
          name: '維什尼亞茨'
        }]);
      } else throw Error('未知的行星 ID：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

這些程式碼有一點重複。不過，這不是將它們合併成單一個 Effect 的好理由！如果你這麼做，你就必須合併兩個 Effect 的依賴，然後只要改變行星就會重新取得所有行星的清單。Effect 不是用來覆用程式碼的工具。

作為代替，要減少重複，你可以抽出一些邏輯到客製化的 Hook，像是下面的 `useSelectOptions`：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        選擇行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        選擇地點：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你正在前往 {placeId || '？？？'} ，位於 {planetId || '？？？'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('預期接收像是 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('預期接收像是 "/planets" 或 "/planets/earth/places" 這樣的位址。 實際收到： "' + url + '" 。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 期望接收一個字串作為引數。 ' +
      '但實際收到： ' + planetId + ' 。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '寮國'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奧萊莉婭'
        }, {
          id: 'diana-chasma',
          name: '黛安娜峽谷'
        }, {
          id: 'kumsong-vallis',
          name: '金城谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '鋁城'
        }, {
          id: 'new-new-york',
          name: '新紐約'
        }, {
          id: 'vishniac',
          name: '維什尼亞茨'
        }]);
      } else throw Error('未知的行星 ID：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

查看沙盒的 `useSelectOptions.js` 分頁，看看這是如何運作的。理想中，你的應用程式裡大部分的 Effect 最後都應該被客製化的 Hook 替代，無論這個 Hook 是由你還是別人所撰寫。客製化的 Hook 藏著同步的邏輯，因此呼叫它的元件不會知道關於 Effect 的事。當你持續投入你的應用程式，你會發展出自己的一套 Hook 來選擇，最後你就不需要那麼常在元件中撰寫 Effect。

</Solution>

</Challenges>
