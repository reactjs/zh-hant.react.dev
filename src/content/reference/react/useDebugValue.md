---
title: useDebugValue
---

<Intro>

`useDebugValue` 是一個 React Hook，讓你為客製化 Hook 在 [React 開發者工具](/learn/react-developer-tools) 中新增標籤（label）。

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

在 [客製化 Hook](/learn/reusing-logic-with-custom-hooks) 的頂層呼叫 `useDebugValue` 以顯示可讀的除錯值（debug value）：

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? '在線' : '離線');
  // ...
}
```

[查看更多下方的範例。](#usage)

#### 參數 {/*parameters*/}

* `value`：你希望顯示在 React 開發者工具的值。可以是任何型別。
* **可選的** `format`：一個格式化（formatting）函式。當元件被查看時，React 開發者工具會以 `value` 作為引數（argument）呼叫格式化函式，接著顯示回傳的格式化數值（可能是任何型別）。如果沒有指定格式化函式，會顯示原本的 `value` 本身。

#### 回傳值 {/*returns*/}

`useDebugValue` 不回傳任何東西。

## 使用 {/*usage*/}

### 新增標籤給客製化 Hook {/*adding-a-label-to-a-custom-hook*/}

在[客製化 Hook](/learn/reusing-logic-with-custom-hooks) 的頂層呼叫 `useDebugValue` ，讓 [React 開發者工具](/learn/react-developer-tools) 顯示可讀的 <CodeStep step={1}>除錯值</CodeStep>。

```js [[1, 5, "isOnline ? '在線' : '離線'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? '在線' : '離線');
  // ...
}
```

這樣當你查看呼叫 `useOnlineStatus` 的元件時，會顯示類似 `OnlineStatus: "在線"` 的標籤：

![展示除錯值的 React 開發者工具截圖](/images/docs/react-devtools-usedebugvalue.png)

沒有呼叫 `useDebugValue` 的話，只會顯示基本的資料（在這個範例中是 `true`）。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ 在線' : '❌ 連線中斷'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? '在線' : '離線');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

不要在每個客製化 Hook 都加上除錯值。它最適合用在共享函式庫中的客製化 Hook，特別是那些具有難以檢查的複雜內部資料結構的 Hook。

</Note>

---

### 延遲除錯值的格式化 {/*deferring-formatting-of-a-debug-value*/}

你可以將格式化函式作為 `useDebugValue` 的第二個引數傳入：

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

你的格式化函式會收到 <CodeStep step={1}>除錯值</CodeStep> 作為參數，並回傳 <CodeStep step={2}>格式化後的顯示值</CodeStep>。當元件被查看時，React 開發者工具會呼叫這個函式並顯示結果。

這樣可以避免執行可能耗費效能的格式化邏輯，除非元件真的被查看。舉例來說，如果 `date` 是 Date 值，可以避免每次渲染都對它呼叫 `toDateString()`。

