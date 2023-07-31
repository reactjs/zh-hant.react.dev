---
title: 你可能不需要 Effect。
---

<Intro>

"Effect" 是 React 編程模式的緊急出口。它讓你可以“跳出” React，並將你的組件與像是非 React 小工具、網路，或是瀏覽器 DOM 之類的外部系統同步。如果沒有涉及外部系統（例如，你想在某些 props 或 state 改變時更新一個組件的 state），你可能不需要使用 Effect。移除不必要的 Effect 會讓你的程式碼更容易追蹤、執行更快，並且更不易出錯。

</Intro>

<YouWillLearn>

* 為何以及如何從你的元件中移除不需要的Effect。
* 如何在不使用Effect的情況下進行昂貴運算的快取。
* 如何在不使用Effect的情況下重置和調整元件的 state。
* 如何在事件處理器間分享邏輯。
* 哪些邏輯應該移至事件處理器。
* 如何讓父元件得知變動的 state。

</YouWillLearn>

## 如何移除不必要的 Effects {/*how-to-remove-unnecessary-effects*/}

這裡有兩個常見的情境，你其實不需要使用Effects :

* **你不需要用Effects來轉換渲染的資料**。舉例來說，如果你想要在顯示一個列表前先進行過濾，你可能會傾向寫一個Effect來在列表變更時更新一個 state 變數。但是，這其實效率並不高。當你更新 state 時，React會先呼叫你的元件函式來計算應該顯示在螢幕上的內容。然後React會將這些變更"提交"到DOM，以更新螢幕。然後React才會執行你的Effects。如果你的Effect也立即更新 state ，這就會重新開始整個過程！為了避免不必要的渲染次數，你應該在元件的頂層就轉換所有資料。這樣的程式碼會在你的props或 state 變更時自動重新運行。
* **你不需要用 Effects 來處理使用者事件**。例如，如果你想要在使用者購買產品時發送一個 /api/buy 的 POST 請求並顯示通知，在購買按鈕的點擊事件處理器中，你已經清楚知道發生了什麼事。但到 Effect 運行的時候，你已經不知道使用者做了什麼（例如，點擊了哪個按鈕）。這就是為什麼你通常會在相對應的事件處理器中處理使用者事件。

你*確實* 需要使用 Effects 來與外部系統[同步](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)。例如，你可以寫一個 Effect 來保持一個 jQuery 小工具與 React state 的同步。你也可以用Effects來抓取資料：例如，你可以把搜索結果與當前的搜索查詢同步。但要記得，現代的[框架](/learn/start-a-new-react-project#production-grade-react-frameworks)比起直接在你的元件中寫Effects，提供了更高效的內建數據抓取機制。

為了幫助你更熟悉這些概念，讓我們看看一些常見的具體例子！

### 根據 props 或 state 更新狀態 {/*updating-state-based-on-props-or-state*/}

假設你有一個組件，其中有兩個狀態變量：`firstName` 和 `lastName`。你想通過連接它們來計算出一個 `fullName`。此外，你希望當 `firstName` 或 `lastName` 更改時，`fullName` 也會更新。你的第一個直覺可能是增加一個 `fullName` 狀態變量，並在一個 Effect 中更新它：



```js {5-9}
function Form() {＝
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

這比需要的還更複雜。同時也非常的低效：它用 `fullName` 的舊值執行了一個完整的渲染流程，然後立即用更新的值重新渲染。移除狀態變量和 Effect：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**當某些事情可以從現有的 props 或 state 中計算出來時， [不要將其放入狀態中。](/learn/choosing-the-state-structure#avoid-redundant-state) 相反，應在渲染期間計算它即可。。** 會讓你的代碼更快（你避免了額外的 "級聯" 更新），更簡潔（你移除了一些代碼），並且也更不容易出錯（你避免了由於不同的 state 變量之間沒有正確同步而導致的錯誤）。如果這種方法對你來說感覺很新奇， [ 用 React 思考 ](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)解釋了什麼應該使用 state 保存。

### 緩存昂貴的計算 {/*caching-expensive-calculations*/}

此組件通過接收到的 `todos` 參數和根據 `filter` 參數來過濾它們來計算出 `visibleTodos`。而你可能會想要將結果存儲在 state 中並從一個 Effect 中更新它：

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

就像前面的例子一樣，這既不必要也低效。首先，移除 state 和 Effect：

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```
通常，這段代碼沒問題！但也許 `getFilteredTodos()` 很慢，或者你有很多 `todos`。在這種情況下，如果像 `newTodo` 這樣的無關狀22變量發生了變化，你不會想重新計算 `getFilteredTodos()`。

你可以使用 [`useMemo`](/reference/react/useMemo) Hook 緩存（或者說 ["記憶"](https://en.wikipedia.org/wiki/Memoization)））一個昂貴的計算。

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

或者，寫成一行：

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```


**這告訴 React，除非 `todos` 或 `filter` 有所改變，否則你不希望內部函數重新執行**。 React 會記住在初始渲染時 `getFilteredTodos()` 的返回值。在接下來的渲染過程中，它會檢查 `todos` 或 `filter` 是否有所不同。如果它們與上次相同，`useMemo` 會返回它最後存儲的結果。但如果它們有所不同，React 會再次調用內部函數（並存儲其結果）。

你在 [`useMemo`](/reference/react/useMemo) 中包裹的函數會在渲染過程中運行，所以這只適用於[純函數](/learn/keeping-components-pure)。

<DeepDive>

#### 如何判斷計算是昂貴的？ {/*how-to-tell-if-a-calculation-is-expensive*/}

一般來說，除非你正在創建或者遍歷數千個 object，否則它可能並不昂貴。如果你想要更加地確定，你可以添加一個控制台日誌來測量某一段程式碼的執行時間：

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

進行你正在測量的互動行為（例如，輸入輸入框）。然後你會在控制台看到像 `filter array: 0.15ms` 這樣的日誌。如果總的日誌時間累加到一個顯著的數量（比如說，1ms 或者更多），那麼對該計算進行記憶化可能是有意義的。作為一個實驗，你可以將計算包裹在 `useMemo` 中，以驗證該交互的總日誌時間是否有所降低：

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` 不會使*第一次*渲染更快。它只能幫助你在更新時跳過不必要的工作。


請記住，你的機器可能比你的用戶快，所以使用人工減速來測試性能是一個好主意。例如，Chrome 提供了一個 [CPU 限速](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)  選項可以做到這一點。


也請注意，在開發環境中測量性能可能無法得到最準確的結果。（例如，當[嚴格模式](/reference/react/StrictMode)開啟時，你會看到每個組件渲染兩次而不是一次。）為了獲得最準確的時間，你應該將你的應用程式建置為生產模式，並在與你的用戶相似的裝置上進行測試。


</DeepDive>

### 當 prop 改變時重設所有 state  {/*resetting-all-state-when-a-prop-changes*/}

這個 `ProfilePage` 組件接收一個 `userId` prop。頁面包含一個評論輸入框，並且你用一個 `comment`  state 變量來儲存它的值。有一天，你發現一個問題：當你從一個個人資訊頁面導航到另一個時，`comment`  state 並未重設。結果，你很容易不小心在錯誤的用戶個人資訊頁面上發布評論。為了解決這個問題，你會想要在 `userId` 改變時清空 `comment`  state 變量：

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

這種做法不僅效率低下，因為 `ProfilePage` 和它的子組件會首先使用過時的值進行渲染，然後再重新渲染。而且也相當複雜，因為你需要在 `ProfilePage` 內的*每一個*有 state 的組件中這麼做。例如，如果評論的使用者介面是巢狀的，你也會想清空巢狀的評論 state 。

相反的，你可以想像 React 每個用戶的個人資訊頁面在概念上是一個 _不同_ 的個人資訊頁面，通過給它一個明確的 key 。將你的組件拆分成兩部分，並從外部組件傳遞一個 `key` 屬性到內部組件：


```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```
通常，當在同一位置渲染同一個組件時，React 會保留其 state 。**將 `userId` 作為 `Profile` 組件的 `key` 傳遞，你是在請求 React 將具有不同 `userId` 的兩個 `Profile` 組件視為兩個不應共享任何 state 的不同組件**。每當鍵值（你已將其設定為 `userId`）發生變化時，React 將重新創建 DOM 並[重置](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) `Profile` 組件及其所有子組件的 state 。現在，當在個人檔案間導航時，`comment` 欄位將自動清空。

注意，在此示例中，只有外部的 `ProfilePage` 組件被導出並對項目中的其他文件可見。渲染 `ProfilePage` 的組件不需要將鍵傳遞給它：它們將 `userId` 作為常規 prop 傳遞。`ProfilePage` 將其作為 `key` 傳遞給內部 `Profile` 組件是一個實現細節。

### 當 prop 改變時調整部分 state {/*adjusting-some-state-when-a-prop-changes*/}

有時候，你可能想要在 prop 改變時重置或調整 state 的一部分，但不是全部。

這個 `List` 組件接收一個包含 `items` 的 prop，並在 `selection` state 變量中維護選定的項目。你希望每當 `items` prop 收到一個不同的陣列時，將 `selection` 重置為 `null`：

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

這也不是理想的。每次 `items` 變更時，`List` 及其子組件將首先使用過期的 `selection` 值進行渲染。然後 React 會更新 DOM 並執行 Effects。最後，`setSelection(null)` 的呼叫將導致 `List` 及其子組件的再次渲染，重新開始這整個過程。

首先，刪除 Effect。然後，直接在渲染過程中調整 state：
```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```
像這樣[儲存來自先前渲染的資訊](/reference/react/useState#storing-information-from-previous-renders)可能難以理解，但它比在 Effect 中更新同一 state 要好。在上述範例中，`setSelection` 是直接在渲染過程中被呼叫。React 會在組件透過 `return` 語句退出後*立即*重新渲染 `List`。React 還沒有渲染 `List` 的子組件或更新 DOM，所以這讓 `List` 的子組件可以跳過渲染過期的 `selection` 值。

當你在渲染過程中更新組件時，React 會丟棄返回的 JSX 並立即重新嘗試渲染。為了避免非常慢的級聯重試，React 只允許你在渲染過程中更新*同一*組件 state 。如果你在渲染過程中更新另一個組件 state ，你將看到一個錯誤。像 `items !== prevItems` 這樣的條件是必要的，以避免循環。你可以像這樣調 state ，但任何其他的副作用（如更改 DOM 或設定 timeouts）應該保留在事件處理器或 Effects 中，以[保持組件的純淨](/learn/keeping-components-pure)。

**雖然這種模式比使用 Effect 更有效率，但大多數的組件也不需要它**。無論你如何實施，基於 props 或其 state 來調整 state 都會使你的數據流更難理解和調試。總是先檢查是否可以[使用key重置所有 state ](#resetting-all-state-when-a-prop-changes)或[在渲染過程中計算所有內容](#updating-state-based-on-props-or-state)。例如，你可以儲存選定的*項目 ID*，而非儲存（和重置）選定的*項目*：

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```
現在，根本無需 "調整" state 。如果選定的 ID 項目在列表中，它將保持被選中。如果不在，因為沒有找到匹配的項目，所以在渲染過程中計算的 `selection` 將為 `null`。這種行為是不同的，但可以說是更好的，因為大多數對 `items` 的更改都會保留選擇。

### 在事件處理器之間共享邏輯 {/*sharing-logic-between-event-handlers*/}

假設你有一個產品頁面，有兩個按鈕（購買和結帳），兩者都可以讓你購買該產品。你希望每當用戶將產品放入購物車時，都能顯示通知。在兩個按鈕的點擊處理器中都呼叫 `showNotification()` 會感覺重複，所以你可能會想要將此邏輯放在一個 Effect 中：

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```
這個 Effect 是不必要的。它也很可能會導致錯誤。例如，假設你的應用程式在頁面重新載入之間 "記住" 購物車。如果你一次將一個產品加入購物車並刷新頁面，通知將再次出現。每次你刷新該產品的頁面時，它都會繼續出現。這是因為在頁面加載時，`product.isInCart` 已經是 `true`，所以上述的 Effect 將呼叫 `showNotification()`。

**當你不確定是否應將某些程式碼放在 Effect 或事件處理器中時，問問自己*為什麼*這段程式碼需要執行。僅對應該*因為*組件被顯示給用戶而運行的程式碼使用 Effects**。在這個例子中，通知應該是因為用戶*按下了按鈕*，而不是因為頁面被顯示出來！刪除 Effect，並將共享的邏輯放入一個由兩個事件處理器呼叫的函數：

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```
這同時移除了不必要的 Effect，並修復了錯誤。

### 發送一個 POST 請求 {/*sending-a-post-request*/}

這個 `Form` 組件會發送兩種類型的 POST 請求。它在掛載時會發送一個分析事件。當你填寫表單並點擊提交按鈕時，它將向 `/api/register` 端點發送一個 POST 請求：

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```
讓我們按照之前的例子應用同樣的標準。

分析 POST 請求應保留在 Effect 中。這是因為發送分析事件的 _原因_ 是表單被顯示出來。（在開發過程中，它會觸發兩次，但[在這裡](/learn/synchronizing-with-effects#sending-analytics)可以找到如何處理這個問題。）

然而，`/api/register` 的 POST 請求並非由表單被_顯示出來_所導致。你只想在一個特定的時刻發送請求：當用戶按下按鈕時。它只應該在_那個特定的互動_中發生。刪除第二個 Effect，並將該 POST 請求移至事件處理器中：

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

當你選擇是否將一些邏輯放入事件處理器或 Effect 中時，你需要回答的主要問題是從用戶的視角來看，這是_何種類型的邏輯_。如果這個邏輯是由某種特定的互動引起的，保留在事件處理器中。如果它是由用戶_看到_畫面上的組件引起的，保留在 Effect 中。

### 運算鏈 {/*chains-of-computations*/}

有時你可能會想要鏈接各種 Effect，每一個都基於其他 state 調整一部分 state：

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

這段程式碼有兩個問題。

一個問題是它非常低效：組件（及其子組件）在鏈中的每個 `set` 調用之間必須重新渲染。在上面的例子中，最糟糕的情況下（`setCard` → 渲染 → `setGoldCardCount` → 渲染 → `setRound` → 渲染 → `setIsGameOver` → 渲染）會有三次不必要的重新渲染樹。

即使它不慢，隨著你的程式碼進化，你將遇到 "鏈" 你寫的不符合新的需求的情況。想像你正在添加一種可以查看在遊戲內移動的歷史紀錄的功能。你會通過更新每個 state 變量到過去的值來實現。然而，將 `card`  state 設置為過去的值會再次觸發 Effect 鏈，並更改你正在顯示的數據。這樣的程式碼往往既僵硬又脆弱。

在這種情況下，最好在渲染過程中計算你可以計算的內容，並在事件處理器中調整 state ：


```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

這樣做效率更高。此外，如果你實現了一種查看遊戲歷史的方法，現在你將能夠將每個 state 變量設置為過去的動作，而不會觸發調整每個其他值的 Effect 鏈。如果你需要在幾個事件處理器之間重用邏輯，你可以[提取一個函數](#sharing-logic-between-event-handlers)並從那些處理器中調用它。

請記住，在事件處理器內部，[狀態表現得像一個快照。](/learn/state-as-a-snapshot)例如，即使在你調用 `setRound(round + 1)` 之後，`round` 變量將反映用戶點擊按鈕時的值。如果你需要使用下一個值進行計算，像 `const nextRound = round + 1` 這樣手動定義它。

在某些情況下，你*不能*在事件處理器中直接計算下一個 state。例如，想像一個帶有多個下拉列表的表單，其中下一個下拉列表的選項取決於前一個下拉列表的選定值。那麼，一個 Effect 鏈是適當的，因為你正在與網絡同步。


### 初始化應用程式 {/*initializing-the-application*/}

有些邏輯只應該在應用程式加載時運行一次。

你可能會想把它放在頂層組件的 Effect 中：

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```


然而，你很快就會發現它在開發中[運行了兩次。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 這可能會導致問題 -- 例如，可能因為這個函數不是設計來被調用兩次，所以它可能會使驗證令牌無效。一般來說，你的組件應該能夠抵禦重新掛載。這包括你的頂層 `App` 組件。

雖然在實際的生產中，它可能永遠不會被重新掛載，但在所有組件中遵循相同的限制，可以使代碼的移動和重用更容易。如果有些邏輯必須在*每次應用程式加載時*運行，而不是*每次組件掛載時*，添加一個頂層變量來追蹤它是否已經執行：

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

你也可以在模組初始化期間，以及在應用程式渲染之前運行它：

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

在你的組件被導入時，頂層的程式碼會運行一次 -- 即使它最終沒有被渲染。為了避免在導入任意組件時造成性能下降或出現意外的行為，不要過度使用這種模式。將應用程式範疇內的初始化邏輯保留在根組件模組（如 `App.js`）或你的應用程式入口點。

### 通知父組件關於 state 的變更 {/*notifying-parent-components-about-state-changes*/}

假設你正在撰寫一個 `Toggle` 組件，其內部有一個 `isOn`  state ，該 state 可以是 `true` 或 `false`。有幾種不同的方式可以切換它（如點擊或拖動）。你希望在 `Toggle` 的內部 state 改變時通知父組件，因此你暴露了一個 `onChange` 事件並在 Effect 中呼叫它：

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

像之前一樣，這並不理想。 `Toggle` 首先更新其 state ，然後 React 更新螢幕。然後 React 運行 Effect，該 Effect 調用來自父組件的 `onChange` 函數。現在父組件將更新自己的 state ，開始另一個渲染週期。更好的方式是在單個流程中完成所有操作。

刪除 Effect，並在同一事件處理程序中更新*兩個*組件的 state ：

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

採用此方法，`Toggle` 組件及其父組件都會在事件期間更新他們的 state。React [批量更新](/learn/queueing-a-series-of-state-updates) 來自不同組件的更新，因此只會有一個渲染週期。

你也可能能夠完全移除 state，而是直接從父組件接收 `isOn`：

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["狀態提升"](/learn/sharing-state-between-components)讓父組件通過切換自身的 state 來完全控制 `Toggle`。這意味著父組件將需要包含更多的邏輯，但總的來說會有更少的 state 需要擔憂。每當你嘗試保持兩個不同 state 變數同步時，請嘗試提升 state ！

### 傳遞數據給父組件 {/*passing-data-to-the-parent*/}

這個 `Child` 組件會獲取一些數據，然後在Effect中將它傳遞給 `Parent` 組件：

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

在 React 中，數據流動是從父組件到子組件。當你在螢幕上看到錯誤的地方時，你可以跟著組件鏈向上追蹤，直到找到哪個組件傳遞錯誤的 prop 或擁有錯誤的 state 。當子組件在效應中更新父組件的 state 時，數據流動變得非常難以追蹤。既然子組件和父組件都需要相同的數據，讓父組件獲取這些數據，並將其*傳遞下來*給子組件：

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

這更簡單，並使數據流動預測：數據由父組件流向子組件。

### 訂閱外部 store {/*subscribing-to-an-external-store*/}

有時，你的組件可能需要訂閱一些來自 React  state 之外的數據。這些數據可能來自第三方庫或內置的瀏覽器 API。由於這些數據可能在 React 不知情的情況下改變，你需要手動讓你的組件訂閱它。這通常使用Effect完成，例如：

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```
在這裡，組件訂閱了一個外部數據存儲（在此例中，為瀏覽器的 `navigator.onLine` API）。由於此 API 在服務器上不存在（所以不能用於初始 HTML），因此最初的 state 被設置為 `true`。當該數據存儲在瀏覽器中的值變化時，組件會更新其 state 。

雖然通常使用 Effect 進行此操作，但 React 提供了一個專門用於訂閱外部存儲的 Hook，優先使用它。刪除 Effect，並用對 [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 的調用來替換：

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

這種方法比使用 Effect 手動將可變數據同步到 React state 更不易出錯。通常，您將編寫像上面的 `useOnlineStatus()` 這樣的自定義 Hook，這樣您就不需要在個別組件中重複此代碼。[閱讀更多關於從 React 組件訂閱外部存儲的信息。](/reference/react/useSyncExternalStore)

### 獲取數據 {/*fetching-data*/}

許多應用程式使用 Effect 來啟動數據獲取。像這樣寫數據獲取 Effect 是很常見的：

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

你*不需要*將此獲取數據的動作移至一個事件處理器中。

這可能與先前的例子中你需要將邏輯放入事件處理器中的情況相矛盾！然而，請考慮到並非*鍵入事件*是觸發獲取數據的主要原因。搜尋輸入欄常常會從URL中預先填入，且使用者可能在不觸碰輸入欄的情況下進行「返回」和「前進」的導覽。

`page` 和 `query` 的來源並不重要。當這個元件可見時，你會希望保持 `results` 與目前 `page` 和 `query` 的網路數據[同步](/learn/synchronizing-with-effects)。這就是為何它是一個 Effect。

然而，上述的程式碼有一個錯誤。想像你快速打入 `"hello"`。那麼 `query` 會從 `"h"` 變成 `"he"`， `"hel"`， `"hell"`，並最終成為 `"hello"`。這將觸發分開的數據獲取，但是沒有保證哪個請求的回應會先到達。例如，`"hell"` 的回應可能在 `"hello"` 的回應*之後*才到達。由於它最後調用 `setResults()`，你會顯示錯誤的搜尋結果。這稱為[「競態條件」](https://zh.wikipedia.org/wiki/競態條件)：兩個不同的請求彼此「競賽」，並以你意料之外的順序到達。


```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

這確保了當你的 Effect 取得資料時，除了最後一個請求的所有回應都將被忽略。

處理競態條件並不是實現資料取得的唯一難題。你可能還想考慮快取回應（這樣用戶可以點擊返回並立即看到前一個畫面），如何在伺服器上取得資料（這樣初始伺服器渲染的 HTML 將包含已取得的內容，而不是轉圈圖標），以及如何避免網絡瀑布（這樣子組件可以在不等待每個父組件的情況下取得資料）。

**這些問題適用於任何 UI 函式庫，不僅僅是 React。解決它們並非易事，這就是為什麼現代的 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) 提供比在 Effects 中取得資料更有效的內建資料取得機制。**

如果你不使用框架（且不想自己建立一個）但希望從 Effects 中更方便地取得資料，可以考慮將你的取得邏輯提取到自定義 Hook 中，如下例：

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
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
  }, [url]);
  return data;
}
```
你可能也想要加入一些錯誤處理的邏輯，並追蹤內容是否正在載入。你可以自己建立像這樣的 Hook，或者使用 React 生態系統中已經可用的許多解決方案之一。**雖然這本身並不如使用框架的內建資料取得機制那麼有效，但將資料取得邏輯移動到自定義 Hook 中將使得稍後採用有效的資料取得策略變得更容易。**

一般來說，每當你必須使用 Effects 時，要留意你何時可以將一部分功能提取到自定義 Hook 中，這樣的 Hook 應具有更聲明式且專為特定目的製作的 API，就像上面的 `useData`。你的組件中有越少原生 `useEffect` 的調用，你就越容易維護你的應用程式。

<Recap>

- 如果你可以在渲染期間計算某些東西，則不需要 Effect。
- 若要快取昂貴的計算，請加入 `useMemo` 而非 `useEffect`。
- 若要重置整個組件樹的 state，請向其傳遞一個不同的 `key`。
- 若要響應 prop 變化重置某些特定的 state，則應在渲染期間處理它。
- 因為組件**顯示**而需要執行的程式碼應在 Effects 中，其餘的應在事件中。
- 如果你需要更新多個組件的 state，最好在單一事件中進行。
- 每當你嘗試同步不同組件中的 state 變量時，請考慮 state 提升。
- 你可以用 Effects 取得資料，但你需要實施清理以避免競態條件。

</Recap>

<Challenges>

#### 不使用 Effects 來轉換資料 {/*transform-data-without-effects*/}

下方的 `TodoList` 將展示一個待辦事項的列表。當 "只顯示活躍的待辦事項" 的選框被勾選時，已完成的待辦事項將不會在列表中顯示。不論哪些待辦事項是可見的，頁尾都會顯示尚未完成的待辦事項的數量。

請簡化此元件，移除所有不必要的 state 和 effect。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

如果你可以在渲染期間直接計算，你可能就不需要 state 或更新它的 Effect。


</Hint>

<Solution>

在此範例中，只有兩個核心的 state ：`todos` 的列表和 `showActive` 的 state 變數，代表著選框是否被勾選。所有其他的 state 變數都是[冗餘](/learn/choosing-the-state-structure#avoid-redundant-state)的，且可以在渲染時直接計算。這包含你可以直接移入周邊 JSX 的 `footer`。

你的結果應該會如下所示：

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### 不使用 Effect 來快取計算結果 {/*cache-a-calculation-without-effects*/}

在這個範例中，過濾待辦事項被抽出到一個名為 `getVisibleTodos()` 的獨立函數。這個函數內部包含一個 `console.log()` 的呼叫，用以幫助你注意到它何時被調用。切換 "只顯示活動待辦事項"，注意到這將導致 `getVisibleTodos()` 重新執行。這是預期的行為，因為可見的待辦事項在你切換要顯示的待辦事項時會改變。

你的任務是移除在 `TodoList` 組件中重新計算 `visibleTodos` 列表的 Effect。然而，你需要確保當你在輸入框內打字時，`getVisibleTodos()` *不會* 重新執行（因此也不會打印任何日誌）。

<Hint>

一種解決方案是加入一個 `useMemo` 的呼叫來快取可見的待辦事項。還有另一種較不明顯的解決方案。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

移除狀態變數和 Effect，然後加入一個 `useMemo` 的呼叫來快取調用 `getVisibleTodos()` 的結果：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

進行這個改變後，只有在 `todos` 或 `showActive` 改變時，才會調用 `getVisibleTodos()`。在輸入框裡打字只改變了 `text` state 變數，所以它不會觸發對 `getVisibleTodos()` 的呼叫。

這還有另一個不需要 `useMemo` 的解決方案。由於 `text` state 變數不可能影響待辦事項的列表，你可以將 `NewTodo` 表單提取到一個單獨的組件中，並將 `text` state 變數移至該組件內：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

這種方法也符合需求。當你在輸入框中打字時，只有 `text` state 變數會更新。由於 `text` state 變數位於子組件 `NewTodo` 中，所以父組件 `TodoList` 不會重新渲染。這就是為什麼在你打字時，`getVisibleTodos()` 不會被調用。（如果 `TodoList` 因其他原因重新渲染，則仍會調用 `getVisibleTodos()`。）

</Solution>

#### 無需 Effect 來重設 state {/*reset-state-without-effects*/}

這個 `EditContact` 組件接收一個像 `{ id, name, email }` 的聯絡人物件作為 `savedContact` prop。試著編輯名字和電郵輸入欄位。當你按下儲存，表單上方的聯絡人按鈕會更新為編輯過的名字。當你按下重設，任何在表單中等待的變更都會被丟棄。試著操作這個 UI，來了解它的功能。

當你用頂部的按鈕選擇一個聯絡人時，表單會重設為該聯絡人的詳細資訊。這是透過在 `EditContact.js` 內的一個 Effect 來完成的。移除這個 Effect，找到另一種方式在 `savedContact.id` 改變時重設表單。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

如果有辦法告訴 React，當 `savedContact.id` 不同時，`EditContact` 表單在概念上是一個_不同聯絡人的表單_，並且應該不保留 state ，那該有多好。你記得有這樣的方式嗎？

</Hint>

<Solution>

將 `EditContact` 組件拆分成兩個。將所有表單 state 移至內部的 `EditForm` 組件。導出外部的 `EditContact` 組件，並讓它將 `savedContact.id` 作為內部 `EditForm` 組件的 `key` 傳入。結果是，每當你選擇不同的聯絡人時，內部的 `EditForm` 組件會重設所有表單 state 並重建 DOM。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### 不用 Effects 提交表單 {/*submit-a-form-without-effects*/}

這個 `Form` 組件讓你可以發送訊息給朋友。當你提交表單，`showForm` state 變量設定為 `false`。這會觸發一個 Effect，呼叫 `sendMessage(message)`，然後發送訊息（你可以在控制台看到它）。在訊息發送後，你會看到一個 "謝謝你" 的對話框，裡面有一個 "開啟聊天" 的按鈕，讓你可以回到表單。

你的應用程式的使用者發送了太多的訊息。為了讓聊天稍微困難一點，你決定要*先*顯示 "謝謝你" 的對話框，而不是表單。將 `showForm` state 變量改為初始化為 `false`，而不是 `true`。一旦你做出那個改變，控制台將顯示一個空訊息被發送出去。這個邏輯有些地方出錯了！

這個問題的根本原因是什麼？你又該如何修正它？

<Hint>

訊息應該是_因為_使用者看到了 "謝謝你" 的對話框而被發送嗎？還是正好相反？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state 變量決定是否顯示表單或 "謝謝你" 的對話框。然而，你並不是因為 "謝謝你" 的對話框被_顯示_而發送訊息。你想要因為使用者已經_提交了表單_而發送訊息。刪除這個具有誤導性的 Effect，並將 `sendMessage` 的調用移動到 `handleSubmit` 事件處理程序中：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

注意在此版本中，只有_提交表單_（這是一個事件）會導致訊息被發送。無論 `showForm` 初始設定為 `true` 或 `false`，它都能一樣運作良好。（將其設定為 `false` 並注意沒有額外的控制台訊息。）
</Solution>

</Challenges>
