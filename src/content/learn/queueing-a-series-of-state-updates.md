---
title: 將一系列的 State 更新加入隊列
---

<Intro>

設置 state 變數將使另一個 render 加入隊列。但有時後你可能希望在加入隊列之前對該變數進行多個操作。為此，了解 React 如何批次更新 state 會有所幫助。

</Intro>

<YouWillLearn>

* 什麼是「批次處理」以及 React 如何使用它來處理多個 state 更新
* 如何連續對同一個 state 變數進行多次更新

</YouWillLearn>

## React 批次更新 state {/*react-batches-state-updates*/}

你可能預期點擊「+3」按鈕將增加計數三次，因為它調用了 `setNumber(number + 1)` 三次：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

但是，正如你可能還記得上一節中所提到， [每個 render 的 state 值都是固定的](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)，因此在第一個 render 事件處理程序的 `number` 值始終皆為`0`，無論呼叫多少次`setNumber(1)`：

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

但這裡還有另一個原因。**React 會等到*所有*在事件處理程序中的程式碼都運行完畢後才更新 state。** 這就是為什麼重新 render 只有在呼叫所有`setNumber()`*之後*發生。

這可能會讓你想起餐廳的服務生點菜。服務生不會在你點第一道菜時就跑到廚房！相反，他們會讓你一次點完餐，可以讓你進行更改，甚至接受餐桌上其他人的點餐。

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

這使你可以更新多個 state 變數——甚至可以從多個 component 進行更新——而不會觸發太多[重新 render。](/learn/render-and-commit#re-renders-when-state-updates) 這也意味著在事件處理程序及其中的任何程式碼執行完成*之前*， UI 不會進行更新。這種行為也稱為*批次處理*，使你的 React 應用程式執行得更快。它還避免了處理令人困惑的「半完成」render，也就是只更新了一些變數。

**React 不會批次處理*多個*主動事件（例如點擊）**——每次點擊都是單獨處理的。請放心，React 通常只在安全的情況下才進行批次處理。例如，如果第一次點擊按鈕禁用了表單，則第二次點擊將不會再次提交該表單。

## 在下一次 Render 之前多次更新相同的 state {/*updating-the-same-state-multiple-times-before-the-next-render*/}

這是一個不常見的範例，但如果你想在下一次 render 之前多次更新相同的 state 變數，像是`setNumber(n => n + 1)`，可以傳遞一個*函數*，該函數根據前一個在隊列中的 state 來計算下一個 state，而不是像`setNumber(number + 1)`傳遞*下一個 state 的值*。這是一種告訴 React「用 state 值做某事」而不只是替換它的方法。

現在嘗試增加計數：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

這裡的 `n => n + 1` 稱為**更新函數**。當你將其傳遞給 state 設置器時：

1. React 將此函數加入隊列，以便在事件處理器程序的所有其他代碼運行後進行處理。
2. 在下一次 Render 期間，React 會遍歷隊列並為你提供最終的更新 state。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

以下是 React 在執行事件處理程序時如何處理這些程式碼：

1. `setNumber(n => n + 1)`: `n => n + 1` 是一個函數。React 將其添加到隊列中。
1. `setNumber(n => n + 1)`: `n => n + 1` 是一個函數。React 將其添加到隊列中。
1. `setNumber(n => n + 1)`: `n => n + 1` 是一個函數。React 將其添加到隊列中。

當你在下一次 render 期間呼叫 `useState` ，React 會遍歷隊列。前一個 `number` 的 state 是 `0`，所以這就是 React 傳遞給第一個更新函數作為 `n` 參數的內容。然後 React 會獲取前一個更新函數的回傳值並將其作為參數 `n` 傳遞給下一個更新函式，以此類推：

|  更新隊列 | `n` | 回傳 |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React 從 `useState` 存儲 `3` 最為最終的結果。

這就是為什麼在前面的案例中點擊「+3」會正確地將值增加 3。
### 如果在替換後更新 state 會發生什麼 {/*what-happens-if-you-update-state-after-replacing-it*/}

這個事件處理程序如何？你認為下一個 render 時 `number` 會是什麼？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

以下是這個事件處理程序告訴 React 要做的事情：

1. `setNumber(number + 5)`：`number` 是 `0`，所以 `setNumber(0 + 5)`。React 將 _「替換為`5`」_ 添加到其隊列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一個更新函數。React 將該函數添加到其隊列中。

在下一次 render 期間，React 會遍歷隊列的 state：

|   更新隊列       | `n` | 回傳 |
|--------------|---------|-----|
| 「替換為 `5`」 | `0` (未使用) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React 從 `useState` 存儲 `6` 作為最終結果。

<Note>

你可能已經註意到，`setState(5)`  的運作原理實際上與 `setState(n => 5)` 類似，但未使用 `n`！

</Note>

### 如果在替換後更新 state 會發生什麼 {/*what-happens-if-you-replace-state-after-updating-it*/}

讓我們再嘗試一個例子。你認為在下一個 render 時 `number` 會是什麼？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

以下是 React 在執行此事件處理程序時會如何處理這些程式碼：

1. `setNumber(number + 5)`：`number` 是 `0`，所以 `setNumber(0 + 5)`。React 將 _「替換為 `5`」_ 添加到其隊列中。
2. `setNumber(n => n + 1)`：`n => n + 1`是一個更新函數。React 將該函數添加到其隊列中。
3. `setNumber(42)`：React 將 _「替換為 `42`」_ 添加到其隊列中。

在下一次 render 期間，React 會遍歷隊列的 state：

|   更新對列      | `n` | 回傳 |
|--------------|---------|-----|
| 「替換為 `5`」 | `0` (未使用) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| 「替換為 `42`」 | `6` (未使用) | `42` |

然後 React 從 `useState` 將其存儲的 `42` 作為最終結果。

總而言之，以下是你如何考慮要傳遞給 `setNumber` 的 state 設置器的內容：

* **更新函數** (例如 `n => n + 1`）被添加到隊列中。
* **任何其他值** (例如 number `5`）都會將「替換為 `5`」添加到隊列中，忽略已經在排隊的內容。

事件處理程序完成後，React 將觸發重新 render。在重新 render 期間，React 將處理隊列。更新函數在 render 期間運行，因此更新函數必須是[純函數](/learn/keeping-components-pure)並且僅*返回*結果。不要嘗試從它們內部設置 state 或運行其他的副作用。在嚴格模式下，React 將運行每個更新函式兩次（但丟棄第二次的結果）以幫助你發現錯誤。

### 命名慣例 {/*naming-conventions*/}

通常透過相應 state 變數的第一個字母來命名更新函式的參數：

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

如果你比較喜歡更詳細的命名，另一個常見慣例是重複完整的 state 變數名稱，例如 `setEnabled(enabled => !enabled)`，或是使用前綴例如 `setEnabled(prevEnabled => !prevEnabled)`。

<Recap>

* 設置 state 不會更改現有 render 中的變數，但它會請求新的 render。
* React 在執行完事件處理後所執行的 state 更新。稱為批次處理。
* 要在一個事件中多次更新某個 state，可以使用 `setNumber(n => n + 1)` 更新函數。

</Recap>



<Challenges>

#### 修復請求計數器 {/*fix-a-request-counter*/}

你正在開發一個藝術品商店應用程式，該應用程式允許用戶同時提交一件藝術品的多個訂單。每次用戶按下「購買」按鈕，「待處理」計數器就會增加一。三秒後，「待處理」數量應減少，「已完成」數量應增加。

然而，「待處理」計數的行為並不如預期。當你按下「購買」時，它會減少到 `-1`（這應該是不可能的！）。如果你快速點擊兩次，兩個計數器的行為似乎都不可預測。

為什麼會出現這種情況？修復這兩個計數器。

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

在 `handlerClick` 事件處理程序內部，`padding` 跟 `completed` 的值對應於點擊事件發生時的值。對於第一個 render，`padding` 是 `0`，所以 `setPending(pending - 1)` 變為 `setPending(-1)`，這是錯誤的。由於你想要*遞增*或*遞減*計數器，而不是將它們設置為點擊期間確定的具體值，你可以藉由傳遞更新函式來解決錯誤：

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

這確保了當你遞增或遞減計數器時，是根據其*最新*的 state 而不是點擊時的 state 來執行此操作。

</Solution>

#### 自己實現隊列的 state {/*implement-the-state-queue-yourself*/}

在本次挑戰中，你將從頭開始重新實現 React 的一小部分！這並不像聽起來那麼難。

滾動瀏覽 sandbox 的預覽。請注意，它顯示了**四個測試案例**。它們與你之前在此頁面上看到的範例相對應。你的任務是實做 `getFinalState` 函式，以便為每種情況回傳正確的結果。如果你實作正確，所有四個測試都應該會通過。

你將收到兩個參數：`baseState` 是初始的 state（例如 `0`），`queue` 是一個陣列，其中包含混合的數字（例如 `5`）和更新函式（例如 `n => n + 1`），按添加順序排列。

你的任務是回傳最終 state，就像本頁上的表格所示！

<Hint>

如果你感到困惑，可以從以下程式碼結構開始：

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

填寫缺失的程式碼！

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

這一頁是 React 用來計算最終 state 的精確算法：

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

現在你知道這一部分 React 是如何運作的了！

</Solution>

</Challenges>