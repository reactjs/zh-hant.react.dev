---
id: hooks-overview
title: Hook 概觀
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

Hook [向後兼容](/docs/hooks-intro.html#no-breaking-changes)。這一頁提供 Hook 的簡介給有經驗的 React 使用者們。這是一個快節奏的簡介，如果你有疑惑，看一下黃色框框如下：

>詳細解釋
>
>閱讀 [Hook 介紹的動機部分](/docs/hooks-intro.html#motivation)來了解為什麼我們將 Hook 加入 React。

**↑↑↑ 每一個章節結束都有一個黃色框框像這樣。** 他們連到詳細解釋。

## 📌 State Hook {#state-hook}

這個範例 render 一個計數器。當你按下按鈕，他會增加數值：

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們叫他「count」
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

這裡，useState 是一個 *Hook* （我們馬上會聊到他是什麼意思）。我們在 function component 中呼叫他們用來加入一些 local state。React 會在重新 render 的頁面之間保留這些 state。`useState` 回傳一組數值：*目前* state 數值和一個可以讓你更新 state 的 function。你可以從 event handler 或其他地方呼叫這個 function 來更新他。很類似 `this.setState` 在 class 當中的用法，除了他不會將舊的與新的 state 合併在一起。（我們將會在[使用 State Hook](/docs/hooks-state.html) 中示範一個範例比較 `useState` 與 `this.state`。）

`useState` 唯一的 argument 是初始狀態。在上面的例子中，他是 `0` 因為我們的計數器從零開始。注意不像 `this.state`，state 在這裡不需要一定是 object，雖然你要也可以。初始狀態 argument 只有在第一次 render 的時候會被用到。

#### 宣告多個 state 變數 {#declaring-multiple-state-variables}

你可以在一個 component 中使用 State Hook 不只一次：

```js
function ExampleWithManyStates() {
  // 宣告多個 state 變數!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

[Array destructuring](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) 語法讓我們可以給用呼叫 `useState` 宣告的 state 變數不同的名字，這些名字不是 `useState` API 的一部份。相反地，React 假設如果你呼叫 `useState` 多次，你在每次 render 用同樣的順序。我們之後將會回來討論為什麼可以這樣做與什麼時候他很有用。

#### 但是什麼是 Hook? {#but-what-is-a-hook}

Hook 是 function，他讓你可以從 function component「hook into」React state 與生命週期功能。Hook 在 class 裡面沒有辦法用——他們讓你不用 class 就能使用 React。（我們[不建議](/docs/hooks-intro.html#gradual-adoption-strategy)你通宵重寫現存的 component 但是如果你想要的話，你可以開始在新的 component 當中使用。）

React 提供一些內建 Hook 像是 `useState`。你也可以打造你自己的 Hook 用來在不同的 component 之間重複使用 stateful 邏輯。我們先來看看內建 Hook。

>詳細解釋
>
>你可以在[使用 State Hook](/docs/hooks-state.html) 了解更多 State Hook。

## ⚡️ Effect Hook {#effect-hook}

你從前可能在 React component 做過 fetch 資料、訂閱、或手動改變 DOM。我們稱這些操作「side effect」（或簡稱 effect）因為他們可以影響其他 component 且在 render 期間無法完成。

Effect Hook `useEffect` 在 function component 中加入運作 side effect 的能力。他和 `componentDidMount`，`componentDidUpdate`，與 `componentWillUnmount` 有著同樣的宗旨，但整合進一個單一的 API。（我們將在[使用 Effect Hook](/docs/hooks-effect.html) 中用範例比較 `useEffect` 和這些方法。）

舉例來說，這個 component 在 React 更新 DOM 之後設定文件標題：

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 與 componentDidMount 和 componentDidUpdate 類似：
  useEffect(() => {
    // 使用瀏覽器 API 更新文件標題
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

當你呼叫 `useEffect` 時，你告訴 React 刷新 DOM 變動之後運行你的 「effect」。Effect 在 component 裡面被宣告所以他們有權限訪問他的 props 和 state。預設之下，React 在每一次 render 之後運行 effect —— *包括*第一次 render。（我們會在[使用 Effect Hook](/docs/hooks-effect.html) 做更多他和 class lifecycle 的比較。）

Effect 可以透過回傳一個 function 選擇性的定義如何「清理」。舉例來說，這個 component 使用 effect 來訂閱朋友的上線狀態，並在取消訂閱之後清理。

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

在這個例子中，當 component unmount 和重新運行 effect 的時候，React 會取消訂閱我們的 `ChatAPI` 因為一連串依序的 render。（如果你想的話，如果我們傳遞給 `ChatAPI` 的 `props.friend.id` 沒有改變，有辦法[告訴 React 跳過重新訂閱](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）

就像是 `useState` 一樣，你可以在一個 component 中使用超過一個 effect：

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Hook 讓你在 component 中透過彼此相關的部分組織 side effect（像是加入或移除訂閱），而不是強迫根據生命週期方法分散各處。

>詳細解釋
>
>你可以在[使用 Effect Hook](/docs/hooks-effect.html) 了解更多 Effect Hook。

## ✌️ Hook 的規則 {#rules-of-hooks}

Hook 是 JavaScript function，但是他們強加了兩條額外的規則：

* 只在 **最上層** 呼叫 Hook。不要在迴圈、判斷式、或是嵌套 function 中呼叫 Hook。
* 只在 **React function component** 呼叫 Hook。不要在一般 JavaScript function 中呼叫 Hook。（只有一個其他有效的地方可以呼叫 Hook——你自己的客製化 Hook。我們馬上會學到他們。）

我們提供了一個 [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) 自動強制套用這些規則。我們了解這些規則第一眼看起來很多限制或是很讓人疑惑，但是他們是讓 Hook 成功運作的必要條件。

>詳細解釋
>
>你可以在 [Hook 的規則](/docs/hooks-rules.html)了解更多 Hook 的規則。

## 💡 打造你自己的 Hook {#building-your-own-hooks}

有時候，我們想要在 component 之間重複使用某些 stateful 邏輯。傳統上，這個問題有兩種熱門的答案：[higher-order components](/docs/higher-order-components.html) 與 [render prop](/docs/render-props.html)。客製化 Hook 讓你不用在你的 tree 中加入更多 component 就能做到。

在這一頁前面，我們提到 `FriendStatus` component 呼叫 `useState` 與 `useEffect` Hook 來訂閱朋友的線上狀態。假如我們也想要在另一個 component 重複使用這個訂閱邏輯。

首先，我們抽離這個邏輯到客製化 Hook `useFriendState` 之中：

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

他接收 `friendID` 做為 argument 且回傳我們的朋友是否在線上。

現在我們在兩個 component 中都可以使用：


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

這兩個 component 的 state 是完全獨立的。Hook 是一種重複使用 *stateful 邏輯*的方式，不是 state 本身。實際上，每一次呼叫一個 Hook 都有一個完全獨立且隔離的 state —— 所以你甚至可以在一個 component 使用同一個客製化 Hook 兩次。

客製化 Hook 比較像慣例而不是功能，如果一個 function 的名字是「`use`」開頭且他呼叫其他 Hook，我們將他稱之為客製化 Hook。使用 Hook 時，`useSomething`的命名慣例是我們的 linter plugin 如何能夠在程式碼中找到 bug 的原因。

你可以寫客製化 Hook 涵蓋廣泛地使用案例像是表單處理、動畫、宣告式訂閱、計時器和許多我們可能沒有想到的。我們很興奮看到 React 社群會想到什麼樣的 Hook。

>詳細解釋
>
>你可以在[打造你自己的 Hook](/docs/hooks-custom.html) 了解更多客製化 Hook。

## 🔌 其他 Hook {#other-hooks}

還有一些比較少用的內建 Hook 你可能會覺得很有用。舉例來說，[`useContext`](/docs/hooks-reference.html#usecontext) 讓你不需要巢狀化就可以訂閱 React context：

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

[`useReducer`](/docs/hooks-reference.html#usereducer) 讓你在複雜的 component 中用 reducer 管理 local state：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>詳細解釋
>
>你可以在 [Hook API 參考](/docs/hooks-reference.html)了解更多所有的內建 Hook。

## 下一步 {#next-steps}

呼！講很快！如果有什麼讓你覺得沒道理或是你想了解更多細節，你可以閱讀下一頁，從 [State Hook](/docs/hooks-state.html) 文件開始。

你也可以看看 [Hook API reference](/docs/hooks-reference.html) 與 [Hook 常見問題](/docs/hooks-faq.html)。

最後，不要漏了 [Hook 介紹頁面](/docs/hooks-intro.html)，這裡解釋了*為什麼*我們加入了 Hook 與我們如何和 class 一起使用——不用重寫我們的應用程式。
