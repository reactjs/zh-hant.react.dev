---
id: hooks-custom
title: 打造你自己的 Hook
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

打造你自己的 Hook 可以將 component 邏輯提取到可重複使用的 function 中。

當我們在學習關於[使用 Effect Hook](/docs/hooks-effect.html#example-using-hooks-1) 時，我們從一個聊天應用程式看到這個 component ，顯示一條訊息說明朋友是否還在線上：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
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

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

現在，讓我們的聊天應用程式也有一個聯繫列表，而且想要透過綠色來 render 在線上的使用者名稱。我們可以從上方複製並貼上相似的邏輯到 `FriendListItem` component ，但它並不理想：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
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

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

相反的，我們想要在 `FriendStatus` 和 `FriendListItem` 共享這個邏輯。

習慣上，我們有兩種常用的方式在 component 來共享 stateful 邏輯：[render props](/docs/render-props.html) 和 [higher-order component](/docs/higher-order-components.html)。我們現在將看到 Hook 如何在不強迫 tree 加入更多 component 的情況下，解決許多相同的問題。

## 提取一個自定義的 Hook {#extracting-a-custom-hook}

當我們想要共享邏輯在兩個 JavaScript function 之間時，我們提取它成為第三個 function。Component 和 Hook 兩者都是 function，所以這也適用於它們！

**一個自定義的 Hook 是以「`use`」為開頭命名的 JavaScript function，而且它可能也呼叫其他的 Hook。**例如，以下是我們第一個字定義的 `useFriendStatus` Hook：

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

這裡沒有新加入的東西 -- 邏輯是複製於上方的 component。就像在 component 內一樣，確保只在自定義的 Hook 頂層無條件的呼叫其他 Hook。

不像 React component，一個自定義的 Hook 不需要一個特定的宣告。我們可以決定它需要接受什麼參數，以及它應該回傳什麼（如果有的話）。換句話說，它就像一個普通的 function。它的命名開頭應該總是為 `use`，所以你可以一眼就看出 [Hook 的規則](/docs/hooks-rules.html)適用於它。

我們的 `useFriendStatus` Hook 目的是訂閱我們朋友的狀態。這也是為什麼它接受 `friendID` 作為一個參數，並回傳朋友是否在線上：

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

現在，讓我們來看如何使用我們自定義的 Hook。

## 使用一個自定義的 Hook {#using-a-custom-hook}

在一開始的時候，我們的目標是從 `FriendStatus` 和 `FriendListItem` component 中移除重複的邏輯。這兩者都想要知道朋友是否在線上。

現在，我們提取了邏輯到 `useFriendStatus` hook，我們可以*使用它：*

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

**這個程式碼相等於原始的範例嗎？**是的，它們執行的方式是相同的。如果你仔細看的話，你會注意到我們沒有改變任何的行為。我們所做的只是在兩個 function 中提取共同的程式碼讓它成為一個獨立的 function。**自定義的 Hook 是自然遵循 Hook 設計的規範，而不是 React 的功能。**

**請問我必須以「`use`」開頭命名我自定義的 Hook 嗎？**請這麼做。這個規範非常的重要。沒有它的話，我們無法自動的檢查違反 [Hook 規則](/docs/hooks-rules.html)的行為，因為我們無法判斷某個 function 中是否包含對 Hook 的呼叫。

**請問兩個 component 使用相同的 Hook 是共享 state 的嗎？**不是的。自定義的 Hook 有一個機制重複使用 *stateful 邏輯*（例如設定訂閱並記住目前的值），但每次你使用自定義的 Hook 時，所有內部的 state 和 effect 都是完全獨立的

**自定義的 Hook 是如何隔離 state 的？** 每個*呼叫* Hook 的都會得到獨立的 state。因為我們直接呼叫 `useFriendStatus`，從 React 的角度來看，我們的 component 只呼叫 `useState` 和 `useEffect`。正如我們[之前](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)所[理解](/docs/hooks-state.html#tip-using-multiple-state-variables)的，我們可以在一個 componnet 呼叫 `useState` 和 `useEffect` 多次，而且它們都是完全獨立的。

### 提示：在 Hook 之間傳遞資訊 {#tip-pass-information-between-hooks}

由於 Hook 是 function，我們可以在它們之間傳遞資訊。

為了說明這點，我們將使用我們假設的聊天範例中的另一個 component。這是一個聊天訊息收件人的選擇器，顯示目前選擇的朋友是否在線上：

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

我們將目前選擇的朋友 ID 存在 `recipientID` state 變數中，如果使用者在 `<select>` 選擇器中選擇不同的使用者它將會更新。

因為呼叫了 `useState` Hook 為我們提供了 `recipientID` state 變數的最新值，我們可以將它作為變數傳遞到我們自定義的 `useFriendStatus`：

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

這讓我們知道*目前選擇的*朋友是否在線上。如果我們選擇不同的朋友並更新 `recipientID` state 變數，我們的 `useFriendStatus` Hook 將會從先前選擇的朋友中取消訂閱，並訂閱最新選擇的狀態。

## `useYourImagination()` {#useyourimagination}

自定義的 Hook 提供了共享邏輯的靈活性，這在以前的 React component 是不可能的。你可以撰寫自定義的 Hook 涵蓋廣泛的場景，想是表格處理、動畫、陳述式訂閱（Declarative Subscription）、計時器還有更多我們沒有考慮過的。更重要的是，你可以打造與 React 的內建一樣易於使用的 Hook。

盡量不要過早地加入抽象。現在 function component 可以做更多的事，在你 codebase 中的 function component 程式碼平均可能都會變得更長。這都是正常的 -- 不要覺得你*必須*馬上把它拆分成 Hook。但我們也鼓勵你開始發現自定義的 Hook 可以隱藏簡單 interface 背後的複雜邏輯情況，或者幫忙解開一個混亂的 component。

例如，你可能有一個複雜的 component，它包含許多以 ad-hoc 的方式來管理 local state。`useState` 沒辦法讓更新邏輯集中化，所以你可能更傾向將其寫為 [Redux](https://redux.js.org/) 的 reducer：

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... 其他 action ...
    default:
      return state;
  }
}
```

Redcer 是非常方便於獨立測試的，而且可以表達複雜的更新邏輯。如果有需要的話，你可以將它們拆成更小的 reducer。然而，你可能也喜歡使用 React local state 的好處，或者你不想要安裝其他的函式庫。

那麼，如果我們可以撰寫一個 `useReducer` Hook，讓我們用 reducer 管理 component 的 *local* state 呢？ 它的簡化版本看起來如下：

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

現在我們在其他的 component 使用它，讓 reducer 驅動它的 state 管理：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

在複雜的 componnet 中使用 reducer 管理 local state 的需求很常見，我們已經將 `useReducer` Hook 內建在 React 中。你可以在 [Hooks API 參考](/docs/hooks-reference.html)中找到它與其他內建的 Hook。
