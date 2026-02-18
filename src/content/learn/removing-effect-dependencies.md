---
title: '移除 Effect 的依賴'
---

<Intro>

撰寫 Effect 時，linter 會驗證你是否將 Effect 程式碼中讀取到的所有響應式數值（reactive values）——例如 props 和 state——都納入依賴列表。這確保 Effect 能與元件裡最新的 props 和狀態保持同步。不必要的依賴可能導致 Effect 太常執行，甚至造成無窮迴圈。跟著本指引來檢查你的 Effect，並移除不必要的依賴。

</Intro>

<YouWillLearn>

- 如何修正 Effect 依賴導致的無窮迴圈
- 想移除依賴時該怎麼做
- 如何在不響應的情況下從 Effect 中讀取一個值
- 如何避免，及為什麼需要避免依賴物件和函式
- 為什麼抑制（suppress）依賴的 linter 是危險的做法，以及該怎麼修正

</YouWillLearn>

## 依賴應該與程式碼相符 {/*dependencies-should-match-the-code*/}

撰寫 Effect 時，不管你希望 Effect 做什麼，都會先指定如何[開始與結束](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)：

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

接下來，如果你把 Effect 的依賴留白(`[]`)，linter 會建議你正確的依賴內容：

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
  }, []); // <-- 修正這邊的錯誤！
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
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
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
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

根據 linter 的提示填上依賴：

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
}
```

[Effect 會對響應式數值「做出反應（react）」](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。因為 `roomId` 是響應式數值（可以隨著重新渲染（re-render）而改變），linter 會驗證你是否有指定為依賴。如果 `roomId` 接收到不同的值，React 就會重新同步 Effect。這確保聊天室會與目前選取的房間保持連線，並針對下拉式選單的變化「做出反應」：

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
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
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

### 想要移除依賴，就證明它不是依賴 {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

注意，你不能「隨意選擇」Effect 的依賴。Effect 程式碼所使用的每個<CodeStep step={2}>響應式數值</CodeStep>都必須宣告在依賴列表中。依賴列表是由周遭的程式碼決定的：

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // 這是響應式數值
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 讀取響應式數值
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 因此你必須將這個響應式數值指定為 Effect 的依賴
  // ...
}
```

[響應式數值](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)包含 props 和元件中直接宣告的所有變數和函式。因為 `roomId` 是響應式數值，不能把它從依賴列表中移除。Linter 不會允許這麼做：

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect 缺少一個依賴：'roomId'
  // ...
}
```

Linter 是正確的！因為 `roomId` 可能隨著時間改變，它會引發 bug。

**想要移除依賴，就向 linter「證明」它 *不必* 是依賴。** 舉例來說，可以將 `roomId` 搬到元件外面，來證明它不是響應式，且不會隨著重新渲染而改變：

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // 不再是響應式數值

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 所有依賴都已宣告
  // ...
}
```

現在 `roomId` 不是響應式數值（而且不會隨著重新渲染而改變），也就不必是依賴：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
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

這也是為什麼你可以指定一個[空的（`[]`）依賴列表](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)。Effect *真的不再* 依賴任何響應式數值，因此它也 *真的不需要* 在元件的 props 或狀態改變時重新執行。

### 想要改變依賴，就修改程式碼 {/*to-change-the-dependencies-change-the-code*/}

你可能已經注意到，你的工作流有一個規律：

1. 首先，針對 Effect 或響應式數值宣告的方式 **修改程式碼**。
2. 接下來，你跟從 linter 調整依賴，**來配合你已經改過的程式碼**。
3. 如果你對依賴列表還是不滿意，你會 **回到第一步**（然後再次修改程式碼）。

最後一個步驟很重要。 **如果你想要改變依賴，就先修改周遭的程式碼。** 你可以將依賴列表視為 [Effect 程式碼所用到所有響應式數值的列表](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。你不能 *隨意選擇* 要放什麼在列表裡。這個列表 *描述* 你的程式碼。要改變依賴列表，就要修改程式碼。

這可能感覺像在解決一個方程式。你可能從一個目標開始（例如，為了移除依賴），接著你需要「尋找」跟目標相關的程式碼。不是每個人都能找到解決方程式的樂趣，Effect 也是如此！幸運的是，這裡有一些可以嘗試的常見方法：

<Pitfall>

如果你有一些現成的程式碼，你可能會看到某些 Effect 像這樣抑制 linter 的警告：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 避免像這樣抑制 linter 的警告：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**當依賴跟程式碼不相符，會有很高的風險引發 bug。** 透過抑制 linter 的警告，你「欺騙」了 React 有關 Effect 依賴的數值。

作為代替，你應該用下面的技巧：

</Pitfall>

<DeepDive>

#### 抑制 linter 對依賴的警告，為什麼很危險？ {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

抑制 linter 的警告會導致很不直觀的 bug，因而很難發現及修復。這裡有一個範例：

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        計數器：{count}
        <button onClick={() => setCount(0)}>重設</button>
      </h1>
      <hr />
      <p>
        每秒增加：
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

假設你想要「只在掛載（mount）時」執行 Effect。你已經讀取[空的依賴（`[]`）](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)來達成，因此你決定忽略 linter，並強制指定 `[]` 作為依賴。

計數器應該要每秒增加兩個按鈕所設定的數量。但是，因為你「欺騙」React：Effect 不需要依賴任何東西，所以 React 永遠繼續用初次渲染時的 `onTick` 函式。[在渲染期間](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)，`count` 為 `0` 而 `increment` 為 `1`。這就是為什麼渲染時的 `onTick` 在每一秒總是呼叫 `setCount(0 + 1)`，而你總是看到 `1`。當這類的 bug 散落在多個元件時，就更難修復了。

比起忽略 linter，絕對有更好的解法！要修復程式碼，必須在依賴列表中加入 `onTick`。（為了確保 interval 只設定一次，[將 `onTick` 寫成一個 Effect Event](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。）

**我們建議把依賴的 lint 錯誤視爲編譯錯誤。如果你不抑制它，你就永遠不會遇到這類 bug。** 本頁其餘部分介紹針對這種情況和其他情形的替代方案。

</DeepDive>

## 移除不必要的依賴 {/*removing-unnecessary-dependencies*/}

每次調整 Effect 的依賴以對應程式碼，都會查看依賴列表。當任何依賴改變時，Effect 就重新執行，是合理的嗎？有些時候，答案是「不」：

* 你可能想要再次執行 Effect 在不同條件下，*不同的部分*。
* 你可能只想讀取一些依賴 *最新的值*，而不是「響應」這些依賴的改變。
* 依賴可能常常在 *無意間* 改變，因為它是一個物件或函式。

為了找到正確的解法，必須回答一些有關 Effect 的問題。讓我們一步步看看。

### 程式碼應該移入事件處理函式嗎？ {/*should-this-code-move-to-an-event-handler*/}

你應該思考的第一件事情是：這段程式碼到底該不該是 Effect。

想像一個表單。送出時，你將 `submitted` 狀態變數設為 `true`。你必須送出一個 POST 請求並顯示通知。你已經把邏輯放進 Effect，它會針對 `submitted` 變成 `true` 的這件事「做出反應」：

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 避免：在 Effect 中放入針對事件的邏輯
      post('/api/register');
      showNotification('註冊成功！');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

接著，你想要根據當前的主題撰寫通知訊息的樣式，因此你讀取當前的主題。因為 `theme` 是在元件主體（body）宣告，它是響應式數值，所以你把它加進依賴：

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 避免：在 Effect 中放入針對事件的邏輯
      post('/api/register');
      showNotification('註冊成功！', theme);
    }
  }, [submitted, theme]); // ✅ 所有依賴都已宣告

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

透過這麼做，你已經引發一個 bug。想像你先送出表單，接著切換 Dark 和 Light 主題。`theme` 會改變，Effect 會重新執行，因此也會再次顯示同樣的通知！

**首先，這裡的問題是，這不該是一個 Effect。** 你想要送出 POST 請求，並顯示通知，以回應 *送出表單* 這部分的互動。要執行一些回應特定部分互動的程式碼的話，將邏輯直接放進相關的事件處理函式（event handler）：

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ 很棒：由事件處理函式呼叫針對事件的邏輯
    post('/api/register');
    showNotification('註冊成功！', theme);
  }

  // ...
}
```

現在這段程式碼在事件處理函式中了，它不是響應式的——所以它只會在使用者送出表單時執行。閱讀更多有關[在事件處理函式和 Effect 之間作選擇](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)以及[如何刪除不必要的 Effect](/learn/you-might-not-need-an-effect)。

### 你的 Effect 是否在處理許多互不相關的事情？ {/*is-your-effect-doing-several-unrelated-things*/}

下一個你應該問自己的問題是，你的 Effect 是否在處理許多互不相關的事情。

想像你正在製作一個出貨單，使用者需要選擇城市和區域。你根據所選的 `country` 從伺服器取得 `cities` 列表，並顯示在下拉式選單：

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ 所有依賴都已宣告

  // ...
```

這是一個[在 Effect 中取得資料](/learn/you-might-not-need-an-effect#fetching-data)的好範例。你正在根據 `country` prop，透過網路同步 `cities` 狀態。你不能在事件處理函式中這麼做，因為你需要在 `ShippingForm` 顯示，而且 `country` 改變時，就取得資料（不管是什麼互動導致改變）。

現在假設你新增了第二個選單：城市區域，它應該以當前所選的 `city` 取得 `areas`。你可能會在同一個 Effect 裡，新增第二個針對區域列表的 `fetch` 呼叫：

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 避免：在單一個 Effect 中同步兩個相互獨立的程序
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ 所有依賴都已宣告

  // ...
```

但是，因為 Effect 現在用到 `city` 狀態變數，你新增 `city` 到依賴列表。這反而引發一個問題：當使用者選不同的城市，Effect 會重新執行並呼叫 `fetchCities(country)`。結果會取得城市列表很多次，這是不必要的。

**這段程式碼的問題是你在同步兩個不同、互不相關的事情：**

1. 你想要根據 `country` prop 透過網路同步 `cities` 狀態。
1. 你想要根據 `city` 狀態透過網路同步 `areas` 狀態。

將這些邏輯拆分成兩個 Effect，分別響應需要同步的 props：

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ 所有依賴都已宣告

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ 所有依賴都已宣告

  // ...
```

現在第一個 Effect 只在 `country` 改變時重新執行，而第二個 Effect 在 `city` 改變時重新執行。你已經刻意分開它們：兩件不同的事情藉由兩個分別的 Effect 來同步。兩個分別的 Effect 有兩個分別的依賴列表，所以不會無意間彼此觸發。

最後的程式碼比原本長，但將這些 Effect 分開仍然是正確的。[每個 Effect 應該代表獨立的同步程序](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)。在這個範例中，刪掉其中一個 Effect 不會破壞另一個 Effect 的邏輯。這表示它們 *同步的是不同的事情*，將它們分開是好的。如果你擔心重複，你可以[抽出重複的邏輯到客製化的 Hook](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)來改良這段程式碼。

### 你是否在讀取一些狀態，以計算新的狀態？ {/*are-you-reading-some-state-to-calculate-the-next-state*/}

這個 Effect 在每次收到新訊息時，都會用新建的陣列，更新 `messages` 狀態變數：

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

它用 `messages` 變數來[新增一個新陣列](/learn/updating-arrays-in-state)，這個陣列是由原本的陣列加上最後的新訊息。不過，因為 `messages` 是響應式數值，被 Effect 讀取，所以它必定是依賴：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ 所有依賴都已宣告
  // ...
```

把 `messages` 設為依賴會引發問題。

每次收到訊息時，`setMessages()` 以包含所收訊息的 `messages` 陣列使元件重新渲染。然而，因為 Effect 依賴 `messages`，這 *也會* 重新同步 Effect。所以每次新訊息都會讓聊天室重新連線。使用者不會喜歡這樣！

為了修正這個議題，不要在 Effect 裡讀取 `messages`。作為代替，傳入一個[更新函式（updater function）](/reference/react/useState#updating-state-based-on-the-previous-state) 給 `setMessages`：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
```

**注意 Effect 現在是如何完全不讀取 `messages` 的。** 你只需要傳入一個更新函式，像是 `msgs => [...msgs, receivedMessage]`。React [會把更新函式放入一個佇列（queue）](/learn/queueing-a-series-of-state-updates)，並會在下次渲染時，提供 `msgs` 引數（argument）給它。這就是為什麼 Effect 本身完全不需要依賴 `messages`。修正的結果是，接收聊天訊息不再使聊天室重新連線。

### 你想要讀取一個值，但不針對它的改變「做出反應」嗎？ {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

假設你想要在 `isMuted` 不爲 `true`，且使用者接到新訊息時，播放一個聲音：

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

因為 Effect 現在用到 `isMuted`，你必須將它加進依賴：

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ 所有依賴都已宣告
  // ...
```

問題是每次 `isMuted` 改變時（例如，當使用者切換「靜音」），Effect 會重新同步，然後重新連線到聊天室。這不是理想中的使用者體驗！（在這個範例中，即使禁用 linter 也沒用——如果你這麼做，`isMuted` 會「卡」在舊的值。）

為了解決這個問題，你需要將不該是響應式的邏輯抽出 Effect。你不希望 Effect「響應」`isMuted` 的變化。[將非響應式的邏輯片段移入 Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event)：

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
```

Effect Event 將 Effect 分成響應式的部分（應該「響應」像是 `roomId` 這樣的響應式數值與相關的改變）及非響應式的部分（只讀取最新的值，像是 `onMessage` 讀取 `isMuted`）。**現在你在 Effect Event 中讀取 `isMuted`，它不需要是 Effect 的依賴。** 因此，聊天室不會在每次切換「靜音」設定時重新連線，解決了原本的議題！

#### 為 props 包裹事件處理函式 {/*wrapping-an-event-handler-from-the-props*/}

當元件接受事件處理函式作為 props 時，你可能會遇到類似的問題：

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ 所有依賴都已宣告
  // ...
```

假設父元件在每次渲染時，傳入一個 *不同的* `onReceiveMessage` 函式：

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

因為 `onReceiveMessage` 是依賴，它會在每次父元件重新渲染後，使 Effect 重新同步。這會導致它重新連線到聊天室。為了解決這個問題，將呼叫包進 Effect Event 中：

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
```

Effect Event 並非響應式，所以不需要指定為依賴。因此，即使父元件在每次重新渲染時傳入不同的函式，聊天室也不再會重新連線。

#### 將響應式與非響應式的程式碼分開 {/*separating-reactive-and-non-reactive-code*/}

在這個範例中，你想要在每次 `roomId` 改變時，紀錄訪問的行為。你希望在所有的紀錄中包含當前的 `notificationCount`，但你 *不* 希望 `notificationCount` 的改變觸發紀錄事件（log event）。

解法依然是將非響應式的程式碼拆分到 Effect Event 中：

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
}
```

你希望邏輯是針對 `roomId` 響應的，所以在 Effect 中讀取 `roomId`。然而，你並不希望 `notificationCount` 的變化被記錄成額外的訪問，所以在 Effect Event 裡讀取 `notificationCount`。[學習更多有關使用 Effect Event 讀取 Effect 中最新的 props 和狀態](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。

### 是否有一些響應式數值無意間改變了？ {/*does-some-reactive-value-change-unintentionally*/}

有時候，你 *確實* 希望 Effect「響應」某個特定的值，但是那個值比你想要的改變了更多次——而且可能沒有反映出使用者視角的真實變化。舉例來說，假設你在元件主體創建一個 `options` 物件，接著在 Effect 裡讀取這個物件：

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

這個物件被宣告在元件主體中，所以它是[響應式數值](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。當你在 Effect 中讀取一個像這樣的響應式數值，你會將它宣告為依賴。這確保 Effect 針對它的變化「做出反應」：

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 所有依賴都已宣告
  // ...
```

將它宣告為依賴是很重要的！舉例來說，這確保如果 `roomId` 改變，Effect 就會以新的 `options` 重新連線到聊天室。不過，上面的程式碼也有一個問題。要看出這個問題，試著在下面沙盒的輸入框（input）打字，然後看看 console 裡發生什麼事：

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // 暫時禁用 linter 來示範問題
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <h1>歡迎來到 {roomId} 聊天室！</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
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

在上面的沙盒中，輸入框只更新 `message` 狀態變數。從使用者的角度，這不應該影響到聊天室的連線。但是，每次更新 `message`，元件會重新渲染。當元件重新渲染時，程式碼會再次從頭執行。

每次 `ChatRoom` 元件重新渲染時，會從頭創建一個新的 `options` 物件。React 將 `options` 物件和上一次渲染期間的 `options` 物件視為 *不同的物件*。這就是為什麼 React 會重新同步 Effect（依賴 `options`），並且在打字時重新連線到聊天室。

**這個問題只影響物件和函式。在 JavaScript 中，每個新建的物件和函式都被視為相互獨立的。裡面的內容是否相同並不重要！**

```js {7-8}
// 初次渲染期間
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 下一次的渲染期間
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 這是兩個不同的物件！
console.log(Object.is(options1, options2)); // false
```

**物件和函式作為依賴可能會讓 Effect 重新同步比你需要的更多次。**

這就是為什麼，任何時候，你都應該避免將物件和函式作為 Effect 的依賴。作為代替，試著將它們移出元件、移入 Effect，或將原始值（primitive value）抽出物件和函式。

#### 將靜態物件和函式移出元件 {/*move-static-objects-and-functions-outside-your-component*/}

如果物件不依賴任何 props 和狀態，你可以把物件移出元件：

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 所有依賴都已宣告
  // ...
```

用這個方式，你向 linter「證明」了物件不是響應式。它不會因重新渲染而改變，所以不需要是依賴。現在 `ChatRoom` 重新渲染不會使 Effect 重新同步了。

這個方式對函式也有用：

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 所有依賴都已宣告
  // ...
```

因為 `createOptions` 在元件外宣告，它不是響應式數值。這就是為什麼它不需要被指定為 Effect 的依賴，也是為什麼它不會使 Effect 重新同步。

#### 將動態物件和函式移入 Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

如果物件依賴一些可能隨著重新渲染而變化的響應式數值，像是 `roomId` prop，你不能把它放在元件 *外面*。但你可以把它移入 Effect 的程式碼：

```js {7-10,11,14}
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
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
```

現在 `options` 在 Effect 中被宣告，不再是 Effect 的依賴。Effect 中唯一使用到的響應式數值是 `roomId`。因為 `roomId` 不是物件或函式，你可以確保它不會 *無意間* 改變。在 JavaScript 中，數值和字串是以內容來比較：

```js {7-8}
// 初次渲染期間
const roomId1 = 'music';

// 下一次的渲染期間
const roomId2 = 'music';

// 這兩個字串是相同的！
console.log(Object.is(roomId1, roomId2)); // true
```

多虧有這個修正，當編輯輸入框時，聊天室不再重新連線：

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
      <h1>歡迎來到 {roomId} 聊天室！</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
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

不過，當你改變下拉式選單的 `roomId`，聊天室 *確實會* 重新連線，就如預期。

這個做法也可以用在函式：

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依賴都已宣告
  // ...
```

你可以撰寫自己的函式將邏輯的片段組合到 Effect 中。只要在 Effect *中* 宣告，就不會是響應式數值，因此不需要作為 Effect 的依賴。

#### 從物件讀取原始值 {/*read-primitive-values-from-objects*/}

有時候，你可能會從 props 接收一個物件：

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 所有依賴都已宣告
  // ...
```

這邊的風險是，父元件會在渲染時創建物件：

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```
這會導致 Effect 在每次父元件重新渲染時重新連線。為了修正這個問題，在 Effect *外面* 讀取物件的資訊，並避免使用物件和函式作為依賴：

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 所有依賴都已宣告
  // ...
```

這邊的邏輯有點重複（在 Effect 外讀取一些值，再在 Effect 裡使用相同的值創建物件）。但這個寫法明確（explicit）指出 Effect *實際* 依賴的資訊。如果一個物件被父元件無意間重新創建，聊天室就不會重新連線。但是，如果 `options.roomId` 或 `options.serverUrl` 真的不同，聊天室就會重新連線。

#### 從函式計算原始值 {/*calculate-primitive-values-from-functions*/}

同樣的方法在函式也可行。舉例來說，假設父元件傳入一個函式：

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

為了避免將它作為依賴（然後導致重新渲染時重新連線），在 Effect 外呼叫它。你會得到不是物件的 `roomId` 和 `serverUrl`，然後就可以在 Effect 裡讀取它們：

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 所有依賴都已宣告
  // ...
```

這對[純（pure）](/learn/keeping-components-pure)函式也是可行的，因為是在渲染期間被安全呼叫。如果你的函式是事件處理函式，但你不希望隨著函式的改變重新同步 Effect，那就[把它包進 Effect Event 中](#do-you-want-to-read-a-value-without-reacting-to-its-changes)。

<Recap>

- 依賴應該始終與程式碼相符。
- 當你對依賴不滿意時，你該做的就是編輯程式碼。
- 抑制 linter 的警告會導致很令人困惑的 bug，所以必須避免。
- 想要移除依賴，你需要向 linter「證明」它並非必要。
- 如果一些程式碼應該針對特定的互動執行，將這些程式碼移入事件處理函式。
- 如果 Effect 中的不同部分需要為了不同的理由重新執行，將它們拆分成多個 Effect。
- 如果想要根據之前的狀態更新一些狀態，你應該傳入更新函式。
- 如果想要讀取最新的值但不想「響應」這個值，你應該從 Effect 抽出 Effect Event。
- 在 JavaScript 中，如果物件和函式在不同的時間點被創建，就會被認為是不同的。
- 試著避免將物件和函式作為依賴。將它們移出元件或移入 Effect。

</Recap>

<Challenges>

#### 修正重設的 interval {/*fix-a-resetting-interval*/}

這個 Effect 設置間隔為一秒的 interval。你注意到一些奇怪的事情：interval 似乎壞掉了，而且每個週期都會重新創建。修正這些程式碼，讓 interval 不會一直重新創建。

<Hint>

Effect 的程式碼似乎依賴 `count`。有什麼方法不去依賴它嗎？應該有方法可以根據之前的值來更新 `count` 狀態，而且不用納入依賴。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ 新增一個 interval');
    const id = setInterval(() => {
      console.log('⏰ Interval 跳一下');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ 清除 interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>計數器：{count}</h1>
}
```

</Sandpack>

<Solution>

你想在 Effect 中，將 `count` 狀態更新為 `count + 1`。但是，這會讓 Effect 依賴 `count`，它每個週期都會改變，這也是為什麼 interval 在每個週期都會重新創建。

為了解決這個問題，使用[更新函式](/reference/react/useState#updating-state-based-on-the-previous-state)，並撰寫 `setCount(c => c + 1)` ，而不是 `setCount(count + 1)`：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ 新增一個 interval');
    const id = setInterval(() => {
      console.log('⏰ Interval 跳一下');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ 清除 interval');
      clearInterval(id);
    };
  }, []);

  return <h1>計數器：{count}</h1>
}
```

</Sandpack>

不在 Effect 裡讀取 `count`，而是傳入 `c => c + 1` 指令（「增加這個數值！」）給 React。React 會把它用在下次渲染。你不再需要在 Effect 裡讀取 `count` 的值，所以 Effect 的依賴可以保持爲空的（`[]`）。這可以避免 Effect 在每個週期都重新創建 interval。

</Solution>

#### 修正重新觸發的動畫 {/*fix-a-retriggering-animation*/}

在這個範例中，當按下「顯示」，會淡入一個歡迎訊息。這個動畫花費一秒。當按下「移除」，歡迎訊息會立刻消失。這個淡入動畫的邏輯是 `animation.js` 檔案中用純 JavaScript [動畫迴圈](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 實作的。你不需要修改這些邏輯，只要把它視為一個第三方函式庫。你的 Effect 創建一個針對 DOM 節點的 `FadeInAnimation` 實體（instance），接著呼叫 `start(duration)` 或 `stop()` 來控制動畫。`duration` 是以滑桿（slider）控制。調整滑桿並看看動畫是怎麼變化的。

這段程式碼已經可以運作，但你想要修改一些地方。現在，當移動滑桿來控制 `duration` 狀態變數時，會重新觸發動畫。修改這個行為，讓 Effect 不會「響應」`duration` 變數。當按下「顯示」，Effect 應該使用滑桿上的 `duration`。但是，移動滑桿不應該觸發動畫。

<Hint>

有沒有 Effect 中的哪行程式碼應該是響應式的呢？要怎麼將非響應式的程式碼移出 Effect？

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      歡迎
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        淡入時長：{duration} 毫秒
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '移除' : '顯示'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // 直接跳到結尾
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // 動畫開始
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // 我們還有很多影格需要繪製
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
```

</Sandpack>

<Solution>

Effect 需要讀取 `duration` 最新的值，但不想要「響應」`duration` 的變化。你用 `duration` 來開始動畫，但開始動畫不是響應式的。將非響應式的程式碼抽成 Effect Event，然後在 Effect 中呼叫函式。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      歡迎
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        淡入時長：{duration} 毫秒
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '移除' : '顯示'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
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
    if (progress < 1) {
      // 我們還有很多影格需要繪製
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
```

</Sandpack>

像 `onAppear` 這樣的 Effect Event 不是響應式，因此可以讀取 `duration` 但不會重新觸發動畫。

</Solution>

#### 修正重新連線的聊天室 {/*fix-a-reconnecting-chat*/}

在這個範例中，每次按下「切換主題」，聊天室就會重新連線。為什麼會發生這種事呢？修正這個錯誤，讓聊天室只在編輯伺服器位址（URL）或選取不同聊天室時，才會重新連線。

將 `chat.js` 視為外部的第三方函式庫：可以參考它的 API，但不要編輯它的內容。

<Hint>

有不只一種修正的方法，但基本上會避免用物件作為依賴。

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        切換主題
      </button>
      <label>
        伺服器位址：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>歡迎來到 {options.roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effect 因為依賴 `options` 物件而重新執行。物件會在無意間重新創建，無論何時都該盡可能避免將物件作為依賴。

侵入性最小的修正方法是在 Effect 外讀取 `roomId` 和 `serverUrl`，然後讓 Effect 依賴原始值（不會無意間改變）。在 Effect 中，創建一個物件，並將它傳入 `createConnection`：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        切換主題
      </button>
      <label>
        伺服器位址：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>歡迎來到 {options.roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

能將 `options` 物件 prop 換成更具體的 `roomId` 和 `serverUrl` props 的話，就更好了：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        切換主題
      </button>
      <label>
        伺服器位址：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  return {
    connect() {
      console.log('✅ 連線到 "' + roomId + '" 聊天室，位於 ' + serverUrl + ' ⋯⋯');
    },
    disconnect() {
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線，位於 ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

盡可能使用原始 props ，會讓後續最佳化元件變得更容易。

</Solution>

#### 再一次，修正重新連線的聊天室 {/*fix-a-reconnecting-chat-again*/}

這個範例以加密或未加密的方式連線到聊天室。切換核取方塊，並注意當加密機制開啟或關閉時，console 中不同的訊息。試著改變聊天室。接著，試著切換主題。當連線到聊天室時，每幾秒就會收到新的訊息。驗證訊息的顏色是否與你所選的主題相符。

在這個範例中，聊天室會在你每次嘗試改變主題時重新連線。修正這個問題。修正以後，改變主題就不會使聊天室重新連線，但切換加密設定或改變聊天室時，應該要重新連線。

不要修改 `chat.js` 中的任何程式碼。除此之外，只要能達到相同的行為，你可以修改任何程式碼。舉例來說，你可能會發現修改被往下傳遞的 props 很有幫助。

<Hint>

你正在往下傳遞兩個函式：`onMessage` 和 `createConnection`。在每次 `App` 重新渲染時，這兩個函式都會從頭被創建。它們每次都會被視為新的值，也是為什麼它們會重新觸發 Effect。

其中一個函式是事件處理函式。你知道有什麼方法，可以在不「響應」事件處理函式的新值的情況下，將事件處理函式作為 Effect 來呼叫嗎？這會派上用場！

另一個函式只用來傳遞一些狀態給一個引入（imported）的 API 方法。這個函式真的有必要嗎？哪些向下傳遞的資訊是不可或缺的？你可能需要將一些引入從 `App.js` 移到 `ChatRoom.js`。

</Hint>

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        使用 dark 主題
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        開啟加密機制
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('新訊息：' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 連線到 "' + roomId + '" 聊天室⋯⋯ （已加密）');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('嘿')
          } else {
            messageCallback('哈哈哈');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 從 "' + roomId + '" 聊天室中斷連線（已加密）');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('無法新增兩次處理函式。');
      }
      if (event !== 'message') {
        throw Error('僅支援「message」事件。');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 連線到"' + roomId + '" 聊天室（未加密）⋯⋯');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('嘿')
          } else {
            messageCallback('哈哈哈');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線（未加密）');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('無法新增兩次處理函式。');
      }
      if (event !== 'message') {
        throw Error('僅支援「message」事件。');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

有不只一個正確的方法可以解決這個問題，以下是其中一個可能的解法。

在原本的範例中，切換主題會導致不同的 `onMessage` 和 `createConnection` 函式被創建並向下傳遞。因為 Effect 依賴這些函式，每次切換主題時，聊天室就會重新連線。

為了修正 `onMessage` 的問題，你需要將它包進 Effect Event 中：

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

不像 `onMessage` prop，`onReceiveMessage` Effect Event 不是響應式。這就是為什麼它不需要是 Effect 的依賴。因此，改變 `onMessage` 不會導致聊天室重新連線。

你不能對 `createConnection` 做相同的處理，因為它 *應該要* 是響應式。當使用者切換加密和未加密連線時，或使用者切換聊天室時，你 *希望* Effect 重新觸發。不過，因為 `createConnection` 是函式，你無法確認它讀取的資訊是否 *確實* 有改變。為了解決這個問題，不傳 `createConnection` 給 `App` 元件，而是傳 `roomId` 和 `isEncrypted` 的原始值：

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('新訊息： ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

現在你可以將 `createConnection` 函式 *移入* Effect，而不是將它從 `App` 往下傳：

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

在這兩項修改之後，你的 Effect 不再依賴任何函式：

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // 響應式的值
  const onReceiveMessage = useEffectEvent(onMessage); // 不是響應式

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // 讀取一個響應式數值
      };
      if (isEncrypted) { // 讀取一個響應式數值
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ 所有依賴都已宣告
```

因此，聊天室只會在有意義的改變（`roomId` 或 `isEncrypted`）發生時，重新連線：

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        使用 dark 主題
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        開啟加密機制
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('新訊息： ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>歡迎來到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 連線到 "' + roomId + '" 聊天室⋯⋯ （已加密）');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('嘿')
          } else {
            messageCallback('哈哈哈');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 從 "' + roomId + '" 聊天室中斷連線（已加密）');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('無法新增兩次處理函式。');
      }
      if (event !== 'message') {
        throw Error('僅支援「message」事件。');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // 一個確實能連線到伺服器的真實實作
  if (typeof serverUrl !== 'string') {
    throw Error('預期 serverUrl 是一個字串。 實際收到： ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('預期 roomId 是一個字串。 實際收到： ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 連線到"' + roomId + '" 聊天室（未加密）⋯⋯');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('嘿')
          } else {
            messageCallback('哈哈哈');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 從 "' + roomId + '" 聊天室中斷連線（未加密）');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('無法新增兩次處理函式。');
      }
      if (event !== 'message') {
        throw Error('僅支援「message」事件。');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
