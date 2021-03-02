---
id: hooks-state
title: 使用 Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

*Effect Hook* 讓你可以使用 function component 中的 side effect：

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相似於 componentDidMount 和 componentDidUpdate:
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

這個範例基於[上一頁的計數器範例](/docs/hooks-state.html)，但是我們增加了一個新的功能：我們把網頁標題設定為包含點擊次數的自訂訊息。

資料 fetch、設定 subscription、或手動改變 React component 中的 DOM 都是 side effect 的範例。無論你是否習慣將這些操作稱為「side effect」（或簡稱「effect」），你之前可能已經在 component 中執行了這些操作。

>提示
>
>如果你熟悉 React class 的生命週期方法，你可以把 `useEffect` 視為 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 的組合。

React component 有兩種常見的 side effect：一種不需要執行清除，另一種則需要。讓我們仔細看看它們區別。

## 無需清除的 Effect {#effects-without-cleanup}

有時候，我們希望**在 React 更新 DOM 之後執行一些額外的程式碼。**網路請求、手動變更 DOM、和 logging，它們都是無需清除 effect 的常見範例。我們之所以這樣說，是因為我們可以執行它們，並立即忘記它們。讓我們比較一下 class 和 Hooks 如何讓我們表達這樣的 side effect。

### 使用 Class 的範例 {#example-using-classes}

在 React class component 中，`render` 方法本身不應該觸發 side effect。這太早了 — 我們通常希望在 React 更新 DOM *之後*執行我們的 effect。

這就是為什麼在 React class 中，我們將 side effect 放入 `componentDidMount` 和 `componentDidUpdate`。回到我們的範例，這是一個 React class component 的計數器，它在 React 對 DOM 進行變更後立即更新網頁標題：

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

注意**我們如何必須在 class 中複製這兩個生命週期方法之間的程式碼。**

這是因為在許多情況下，我們希望執行相同的 side effect，無論 component 是剛被 mount 還是已經被更新。概念上，我們希望它在每次 render 之後發生 — 但是 React class component 沒有這樣的方法。我們可以提取一個單獨的方法，但我們仍然需要在兩個地方呼叫它。

現在來看看我們可以如何使用 `useEffect` Hook 做同樣的事情。

### 使用 Hook 的範例 {#example-using-hooks}

我們已經在本頁頂部看到了這個範例，但讓我們來仔細看看它：

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

**`useEffect` 有什麼作用？** 透過使用這個 Hook，你告訴 React 你的 component 需要在 render 後做一些事情。React 將記住你傳遞的 function（我們將其稱為「effect」），並在執行 DOM 更新之後呼叫它。 在這個 effect 中，我們設定了網頁的標題，但我們也可以執行資料提取或呼叫其他命令式 API。

**為什麼在 component 內部呼叫 `useEffect`？** 在 component 中放置 `useEffect` 讓我們可以直接從 effect 中存取 `count` state 變數（或任何 props）。我們不需要特殊的 API 來讀取它 — 它已經在 function 範圍內了。 Hook 擁抱 JavaScript closure，並避免在 JavaScript 已經提供解決方案的情況下引入 React 特定的 API。

**每次 render 後都會執行 `useEffect` 嗎？** 是的！預設情況下，它在第一個 render _和_隨後每一個更新之後執行。（我們稍後會談到[如何自定義](#tip-optimizing-performance-by-skipping-effects)。）你可能會發現把 effect 想成發生在「render 之後」更為容易，而不是考慮「mount」和「更新」。 React 保證 DOM 在執行 effect 時已被更新。

### 詳細說明 {#detailed-explanation}

現在我們對 effect 有了更多的了解，應該可以理解這幾行程式碼：

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

我們宣告 `count` state 變數，然後告訴 React 我們需要使用一個 effect。我們將一個 function 傳入給 `useEffect` Hook。我們傳入的這個 function *就是*我們的 effect。在 effect 內部，我們使用瀏覽器 API `document.title` 設定了網頁標題。我們可以讀取 effect 中最新的 `count`，因為它在我們 function 的範圍內。當 React render 我們的 component 時，它會記住我們使用的 effect，然後在更新 DOM 後執行我們的 effect。每次 render 都是這樣，包括第一次。

有經驗的 JavaScript 開發人員可能會注意到，傳遞給 `useEffect` 的 function 在每次 render 時都會有所不同。這是刻意的。實際上，這是讓我們可以從 effect 內部讀取 `count` 數值，且不必擔心數值過時的原因。每次重新 render 時，我們都會安排一個 _different_ effect 來替代上一個。在某種程度上，這使 effect 的行為更像是 render 結果的一部分 — 每個 effect 都「屬於」特定的 render。我們將[在本頁稍後](#explanation-why-effects-run-on-each-update)更清楚地看到為什麼這很有用。

>提示
>
>與 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 安排的 effect 不會阻止瀏覽器更新螢幕。這使你的應用程式感覺起來響應更快。大多數 effect 不需要同步發生。在少見的需要同步發生的情況下（例如測量 layout），有另外一個 [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) Hook，它的 API 與 `useEffect` 相同。

## 需要清除的 Effect {#effects-with-cleanup}

先前，我們理解了怎樣表達不需要任何清除的 side effect。但是，有些 effect 需要。例如，**我們可能想要設定**對某些外部資料來源的 subscription。在這種情況下，請務必進行清除，以免造成 memory leak！讓我們比較一下我們可以如何用 class 和 Hook 做到這一點。

### 使用 Class 的範例 {#example-using-classes-1}

在 React class 中，你通常會在 `componentDidMount` 中設定一個 subscription，然後在 `componentWillUnmount` 中把它清除。例如，假設我們有一個 `ChatAPI` module 可讓我們訂閱朋友的線上狀態。我們可能會這樣用 class 來訂閱和顯示該狀態：

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

請注意 `componentDidMount` 和 `componentWillUnmount` 需要如何相互呼應。生命週期方法迫使我們拆開這個邏輯，即使概念上它們的程式碼都與同一個 effect 相關。

>注意
>
>敏銳的讀者可能會注意到，要做到完全正確，這個範例還需要 `componentDidUpdate`。我們現在將暫時忽略這一點，但在這頁的[稍後部分](#explanation-why-effects-run-on-each-update)我們會再次討論這點。

### 使用 Hook 的範例 {#example-using-hooks-1}

讓我們看看如何使用 Hook 撰寫這個 component。

你可能會認為我們需要一個單獨的 effect 來執行清除。但是新增和移除 subscription 的程式碼緊密相關，因此 `useEffect` 的設計在將其保持在一起。如果你的 effect 回傳了一個 function，React 將在需要清除時執行它：

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 指定如何在這個 effect 之後執行清除：
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**為什麼我們從 effect 中回傳一個 function？** 這是 effect 的可選清除機制。每個 effect 都可以回傳一個會在它之後執行清除的 function。這使我們可以把新增和移除 subscription 的邏輯彼此保持靠近。它們都屬於同一個 effect！

**React 到底什麼時候會清除 effect？** 在 component unmount 時，React 會執行清除。但是，正如我們之前看到的，effect 會在每個 render 中執行，而不僅僅是一次。這是為什麼 React *還*可以在下次執行 effect 之前清除前一個 render 的 effect 的原因。我們會在下面討論[為什麼這有助於避免 bug](#explanation-why-effects-run-on-each-update) 以及[如果出現效能問題，如何選擇退出此行為](#tip-optimizing-performance-by-skipping-effects)。

>注意
>
>我們不必從 effect 中回傳命名了的 function。我們在這裡將其稱為 `cleanup` 以明確它的目的，但是你可以回傳 arrow function 或者叫它別的名字。

## 總結 {#recap}

我們看到了 `useEffect` 可以讓我們在 component render 後表達不同類型的 side effect。某些 effect 可能需要進行清除，因此它們回傳一個 function：

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

其他 effect 可能沒有清除的階段，並且不回傳任何內容。

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Effect Hook 通過單個 API 統一了這兩種使用情境。

-------------

**如果你對 Effect Hook 的執行方式有不錯的理解，或者感到不知所措，你可以立即跳到[下一頁有關 Hook 的規則](/docs/hooks-rules.html)。**

-------------

## 使用 Effect 的提示 {#tips-for-using-effects}

我們將在這一頁繼續深入研究 `useEffect` 的某些方面，有經驗的 React 使用者可能會對這些感到好奇。不要覺得現在一定要去研究它們。你可以隨時回來此頁面來了解有關 Effect Hook 的更多詳細資訊。

### 提示: 使用多個 Effect 來分離關注點 {#tip-use-multiple-effects-to-separate-concerns}

對於 Hook，我們在[動機](/docs/hooks-intro.html#complex-components-become-hard-to-understand)中概述的問題之一是 class 生命週期方法通常包含不相關的邏輯，但是相關的邏輯卻被分成了幾個方法。這是一個結合了前面範例中的計數器和好友狀態指示器邏輯的 component：

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

注意設定 `document.title` 的邏輯是如何在 `componentDidMount` 和 `componentDidUpdate` 之間分配的。subscription 的邏輯也分佈在 `componentDidMount` 和 `componentWillUnmount` 之間。而且 `componentDidMount` 包含了兩個工作的程式碼。

那麼，Hook 可以怎麼解決這個問題？就像[你可以多次使用 *State* Hook](/docs/hooks-state.html#tip-using-multiple-state-variables)，你同樣可以用多個 effect。這使我們可以將無關的邏輯分為不同的 effect：

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**Hook 讓我們根據程式碼的作用來拆分程式碼**，而不是用生命週期方法的名字。React 將按照指定的順序執行 component 所使用的*每一個* effect。

### 解釋：為什麼 Effect 在每次更新時執行 {#explanation-why-effects-run-on-each-update}

如果你習慣了 class，那麼你可能想知道為什麼 effect 的清除階段會在每次重新 render 後發生，而不僅僅是在 unmounting 過程中發生一次。讓我們看一個實際的範例，看看為什麼這種設計可以幫我們寫出 bug 更少的 component。

在[本頁前面](#example-using-classes-1)，我們介紹了一個 `FriendStatus` component 的範例，這個 component 顯示朋友是否在線上。我們的 class 從 `this.props` 中抓取 `friend.id`，在 component mount 後訂閱好友狀態，並在 unmount 期間取消訂閱：

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**但是如果 component 顯示在螢幕上時，`friend` prop 發生變化**，會發生什麼呢？我們的 component 將繼續顯示其他好友的線上狀態。這是一個 bug。Unmount 時，由於取消訂閱的呼叫會使用錯誤的朋友 ID，因此也會導致 memory leak 或 crash。

在 class component 中，我們需要加入 `componentDidUpdate` 來處理這種情況：

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // 從先前的 friend.id 取消訂閱
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // 訂閱下一個 friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

忘記正確處理 `componentDidUpdate` 是 React 應用程式中常見的 bug 來源。

現在考慮這個使用 Hook 的 component 版本：

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

它沒有受這個 bug 的困擾。（但我們也沒有對它進行任何更改。）

因為 `useEffect` 會*預設*處理更新，所以沒有專門用於處理更新的程式碼。在應用下一個 effect 之前，它將清除之前的 effect。為了說明這一點，下面是這個 component 隨時間推移可能產生的一系列訂閱和取消訂閱的呼叫：

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 執行第一個 effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除前一個 effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 執行下一個 effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除前一個 effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 執行下一個 effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最後一個 effect
```

此行為預設確保程式碼一致性，並防止 class component 中常見的由於缺少更新邏輯而導致的 bug。

### 提示：通過忽略 Effect 來最佳化效能 {#tip-optimizing-performance-by-skipping-effects}

在某些情況下，每次 render 後清除或執行 effect 可能會導致效能問題。在 class component 中，我們可以通過在 `componentDidUpdate` 內部的 `prevProps` 或 `prevState` 撰寫一個額外的比對條件來解決此問題：

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

這個要求很常見，所以已內建在 `useEffect` 的 Hook API 中。如果在重新 render 之間某些值沒有改變，你可以讓 React 忽略 effect。為此，請將 array 作為可選的第二個參數傳遞給 `useEffect`：

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 僅在計數更改時才重新執行 effect
```

在上面的範例中，我們將 `[count]` 作為第二個參數傳遞。這是什麼意思？如果 `count` 是 `5`，然後我們的 component 重新 render，`count` 仍然等於 `5`，React 將比對前一個 render 的 `[5]` 和下一個 render 的 `[5]`。因為 array 中的每一項都相同（`5 === 5`），所以 React 將忽略這個 effect。那就是我們的最佳化。

當我們 render 時將 `count` 更新為 `6`，React 將比對前一個 render 的 array `[5]` 與下一個 render 的 array `[6]`。這次，React 將重新執行 effect，因為 `5 !== 6`。如果 array 中有多個項目，即使其中一項不同，React 也會重新執行 effect。

這也適用於有清除階段的 effect：

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 僅在 props.friend.id 改變時重新訂閱
```

未來，第二個參數可能會透過 build-time transformation 自動被加入。

>注意
>
>如果你使用此最佳化，請確保 array 包括了 **component 範圍內隨時間變化並被 effect 用到的所有值（例如 props 和 state）**。否則，你的程式碼將引用先前 render 中的舊值。了解更多[如何處理 function](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 和[如果 array 經常變化的話該怎麼辦](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)。
>
>如果你想執行一個 effect 並且僅（在 mount 和 unmount 時）將其清除一次，則可以傳遞一個空 array（`[]`）作為第二個參數。這告訴 React 你的 effect 不依賴於_任何_ props 或 state 的值，因此它不需要重新執行。這不屬於特殊情況 — 依賴項目 array 一直這樣工作。
>
>>如果你傳遞一個空 array（`[]`），effect 中的 props 和 state 始終具有其初始值。儘管將 `[]`作為第二個參數傳遞更接近於我們熟悉的 `componentDidMount` 和 `componentWillUnmount` 的模式，但通常有[更好的](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)[解決方案](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)可以避免過於頻繁地重新執行 effect。另外，別忘了 React 在瀏覽器繪製完成之後才延遲執行 `useEffect`，所以做額外的工作沒有很大的問題。
>
>我們建議使用 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則作為我們 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package 的一部分。當不正確地指定依賴時，它會發出警告，並提出修改建議。

## 下一步 {#next-steps}

恭喜！這一頁很長，但是希望讀到最後，你絕大多數的問題都有了答案。你已經學過 State Hook 和 Effect Hook，把兩者結合起來，你已經能做到*很多*東西。它們涵蓋了 class 的絕大多數的使用案例 — 如果沒有涵蓋到，[額外的 Hook](/docs/hooks-reference.html) 或許會幫到你。

我們也開始看到 Hook 如何解決[動機](/docs/hooks-intro.html#motivation)中概述的問題。我們已經看到了 effect 清除如何避免在 `componentDidUpdate` 和 `componentWillUnmount` 中重複，如何使相關程式碼更緊密地結合在一起，並幫助我們避免 bug。我們還看到了我們可以如何根據 effect 的目的來區分 effect，這是我們在 class 中根本無法做到的。

現在，你可能會質疑 Hook 的工作方式。 React 怎麼知道哪個 `useState` 呼叫對應於 re-render 之間的哪個 state 變數？React 如何在每次更新中「匹配」上一個和下一個 effect？**在下一頁，我們會學習 [Hook 的規則](/docs/hooks-rules.html) — 它們對於 Hook 的正常執行至關重要。**
