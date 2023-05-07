---
title: 如同快照的 State
---

<Intro>

state 變數或許和可讀寫的普通 JavaScript 變數看起來很像。然而，state 的行為更像是一張快照（snapshot）。設定 state 並不會改變你已有的 state 變數，而是會觸發重新 render。

</Intro>

<YouWillLearn>

* 設定 state 是如何觸發重新 render
* state 更新的時機和方式
* state 在設定後並未立即更新的原因
* event handler 是如何取得 state 的「快照」
</YouWillLearn>

## 設定 state 會觸發 render {/*setting-state-triggers-renders*/}

你可能會認為使用者介面會直接對點擊等使用者事件做出改變以作為回應。在 React 裡，它的運作方式和這種思維模型有點不同。在前一章，你看過來自 React 的[設定 state 來請求重新 render](/learn/render-and-commit#step-1-trigger-a-render)。這意味著介面若要為特定的事件做出回應，則需要*更新 state*。

在此範例中，當你點擊「傳送」，`setIsSent(true)` 會通知 React 重新 render UI：
<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">傳送</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

以下是當你點擊按鈕時所發生的事情：

1. 執行`onSubmit` event handler。
2. `setIsSent(true)` 將 `isSent` 設定為 `true`，並安排新的一次 render。
3. React 根據 `isSent` 新的值，重新 render component。

接著就讓我們來仔細看看 state 和 rendering 之間的關係吧！

## Rendering 會即時生成一張快照 {/*rendering-takes-a-snapshot-in-time*/}

[「Rendering」](/learn/render-and-commit#step-2-react-renders-your-components)意味著 React 正在呼叫你的 component -- 它其實就是一個函式。函式回傳的 JSX 就像是一張 UI 的即時快照。它的 props、event handler 和區域變數都是**利用當下 render 的 state** 計算出來的。

與照片或電影畫面不同的是，你所回傳的 UI「快照」是具有互動性的。它包含了像是 event handler 的邏輯，明確說明要如何針對輸入做出回應。React 會更新畫面以符合這張快照，並連結 event handler。因此，按下按鈕將會觸發 JSX 裡的 click handler。

當 React 重新 render component 時：

1. React 再次呼叫函式。
2. 函式回傳一張全新的 JSX 快照。
3. 接著，React 更新畫面，使畫面與你回傳的快照相符。

<IllustrationBlock sequential>
    <Illustration caption="React 執行函式" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="計算快照" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="更新 DOM tree" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

state 是 component 的記憶，它和那種函式回傳後就消失的一般變數不同。state 其實「存在於」React 本身 - 如同放在架子上！- 在函式之外。當 React 呼叫 component，它會替那一次 render 拍一張 state 快照。component 回傳的 UI 快照內的 JSX 裡有最新的 props 和 event handler，全都是**使用那一次 render 的 state 值**所計算出來的。

<IllustrationBlock sequential>
  <Illustration caption="你通知 React 更新 state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React 更新 state 值" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React 將 state 值的快照傳入 component 裡" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

以下是一個簡單範例，用來展示其運作方式。在此範例中，你可能會預期點擊「＋3」按鈕將遞增計數器三次，因為它呼叫了三次 `setNumber(number + 1)`。
看看當你點擊「+3」按鈕會發生什麼事：

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

注意，`number` 在每次點擊只會遞增一次！

**設定 state 只會為*下一次* render 改變 state 。** 在第一次 render 中，`number` 為 `0`。這是為什麼在*該次 render 的* onClick handler 中，即便在呼叫了 `setnumber(number + 1)`後， `number` 的值仍然為 `0` 的原因：

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

以下是這個按鈕的 click handler 通知 React 要做的事：

1. `setNumber(number + 1)`: `number` 為 `0`，因此 `setNumber(0 + 1)`。
    - React 準備在下一次 render 將 `number` 更改為 `1`。
2. `setNumber(number + 1)`: `number` 為 `0`，因此 `setNumber(0 + 1)`。
    - React 準備在下一次 render 將 `number` 更改為 `1`。
3. `setNumber(number + 1)`: `number` 為 `0`，因此 `setNumber(0 + 1)`。
    - React 準備在下一次 render 將 `number` 更改為 `1`。


雖然呼叫了 `setNumber(number + 1)` 三次，在*這一次 render 的* event handler 內的 `number` 一直都是 `0`，所以等同於你把 state 設定為 `1` 三次。這就是為什麼在 event handler 執行結束後，React 用等於 `1` 而非 `3` 的 `number` 來重新 render component。

你也可以透過在心裡將程式碼中的 state 變數替換為它們的值來視覺化這一切。
由於在*這一次 render* 中，state 變數 `number` 的值為 `0`，它的 event handler 看起來就像是這樣：

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

對下一次的 render 來說，`number` 為 `1`，因此*該次 render 的* click handler 看起來就像是這樣：

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

這就是為什麼再次點擊按鈕會將計數器設置為 `2`，然後在下一次點擊時會設置為 `3`，依此類推。

## 隨著時間改變的 state {/*state-over-time*/}
嗯，那真是有趣。試著猜猜看點擊這個按鈕會彈出什麼提示框：

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

如果你使用之前提到的替換法，你可以猜到提示框會顯示「0」：


```js
setNumber(0 + 5);
alert(0);
```

但要是你在提示框上設置計時器，使其在 component 重新 render _之後_ 才觸發呢？那麼它會顯示「5」還是「0」？猜猜看！

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

驚不驚訝？如果你使用替換法，你就可以看到傳入提示框的 state「快照」。

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```
儲存在 React 裡的 state 在提示框執行時可能已改變，但它是用使用者與其互動當下的 state 快照來安排的！

**在同一次 render 裡，state 變數的值永遠不會改變**，就算它的 event handler 的程式碼是非同步的。在*該次 render 的* `onClick` 內，即使在呼叫 `setNumber(number + 5)`之後，`number` 的值仍然為 `0`。當 React 透過呼叫 component 來替 UI「拍攝快照」時，state 的值「固定不變」。

以下是一個範例，說明這如何使 event handler 不容易出現時序錯誤。下面是一個表單，延遲五秒後會發送一則訊息。想像一下以下的情況：

1. 你按下「傳送」按鈕，向 Alice 傳送「Hi」。
2. 在五秒的延遲結束之前，你將「To」欄位的值更改為「Bob」。

你預期 `alert` 顯示什麼？它會顯示「You said Hello to Alice」還是「You said Hello to Bob」？根據所學猜一猜並試試看：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">傳送</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React 會使 state 值在同一次 render 內的 event handler 保持「固定不變」。** 你不需要擔心 state 在程式碼執行時有所異動。
但要是你希望在重新 render 之前讀取最新的 state 呢？你將會需要使用 [state 的更新函數](/learn/queueing-a-series-of-state-updates)，這會下一章節中介紹！
<Recap>
* 設定 state 會請求一次新的 render。
* React 將 state 儲存在 component 外，好比在架子上一樣。
* 當你呼叫 `useState`，React 會*為該次 render* 拍一張 state 的快照。
* 變數和 event handler 不會在重新 render 時「存活」。每次 render 都有自己的 event handler。
* 每次 render（和其內部的函式）始終會「看到」React 為*該次* render 所提供的 state 快照。
* 你可以在內心替换 event handler 中的 state，類似於替換被 render 的 JSX。
* 過去創建的 event handler 保有它們被創建的那一次 render 中的 state 值。

</Recap>



<Challenges>

#### 實作紅綠燈 {/*implement-a-traffic-light*/}
以下是一個紅綠燈 component，按按鈕可以切換它的狀態：

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

請在 click handler 裡添加一個 `alert`。當燈是綠色的並顯示「Walk」時，點擊按鈕應顯示「Stop is next」。當燈是紅色的並顯示「Stop」時，點擊按鈕應顯示「Walk is next」。

無論你將 `alert` 放在呼叫 `setWalk` 之前還是之後，是否會有不同呢？

<Solution>

`alert` 看起來應該像這樣：
<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

無論你把它放在呼叫 `setWalk` 之前或之後都是一樣的。該次 render 的 `walk` 值是固定的。呼叫 `setWalk` 只會在*下一次* render 中改變它，但不會影響前一次 render 中的 event handler。

這一行程式碼乍看之下可能會令人感到困惑：

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

但如果你這樣解讀它就變得合理了：「如果紅綠燈顯示『Walk now』，那麼訊息應該顯示『Stop is next』」。在 event handler 中的 `walk` 變數與該次 render 的 `walk` 值相符，且不會改變。

你可以透過應用替換法來驗證這是正確的。當 `walk` 為 `true` 時，你可以得到：

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

因此，點擊「Change to Stop」時，會安排一次把 `walk` 設定為 `false` 的 render，並跳出「Stop is next」的提示框。
</Solution>

</Challenges>
