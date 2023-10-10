---
title: 回應 Event
---

<Intro>

React 允許你在 JSX 中加入 *event handler*。Event handler 是由你撰寫的函式，會在互動（例如點擊、hover、表單輸入欄位聚焦等）時被觸發。

</Intro>

<YouWillLearn>

* 撰寫 event handler 的不同方式
* 如何從 parent component 傳遞處理事件的邏輯
* 事件如何傳遞，以及如何停止它們

</YouWillLearn>

## 新增 event handler {/*adding-event-handlers*/}

要新增 event handler，首先你必須先定義一個函式，然後將它[當作 prop 傳遞](/learn/passing-props-to-a-component)給適當的 JSX 標籤。例如，這是一個目前還沒有做任何事情的按鈕：

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

根據以下三個步驟，你可以讓它在使用者點擊時顯示訊息：

1. 在你的 `Button` component *中*宣告一個名為 `handleClick` 的函式。
2. 在該函式中實作邏輯（使用 `alert` 來顯示訊息）。
3. 將 `onClick={handleClick}` 加到 `<button>` JSX。


<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

你定義了 `handleClick` 函式，然後將它[當作 prop 傳遞](/learn/passing-props-to-a-component)給 `<button>`。`handleClick` 是一個**event handler**。Event handler 函式：

* 通常定義在你的 component *內部*。
* 名稱以 `handle` 開頭，後面接著事件名稱。

按照慣例，通常會將 event handler 命名為 `handle` 後面接著事件名稱。你會經常看到 `onClick={handleClick}`、`onMouseEnter={handleMouseEnter}` 等等。

或者，你可以在 JSX 中 inline 定義 event handler：

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

或者，更簡潔地使用箭頭函式：

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

這些風格都是相等的。Inline event handler 對於簡短的函式很方便。

<Pitfall>

傳遞給 event handler 的函式必須被傳遞，而不是呼叫。例如：

| 傳遞函式（正確）                  | 呼叫函式（錯誤）                     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

差異很微妙。在第一個範例中，`handleClick` 函式被傳遞給 `onClick` 作為 event handler。這告訴 React 記住它，並且只在使用者點擊按鈕時呼叫你的函式。

在第二個範例中，`handleClick()` 結尾的 `()` 在 [render](/learn/render-and-commit) 時*立即*觸發函式，而不需要任何點擊。這是因為 [JSX `{` 和 `}`](/learn/javascript-in-jsx-with-curly-braces) 內的 JavaScript 會立即執行。

當你撰寫 inline 程式碼時，相同的陷阱會以不同的方式呈現：

| 傳遞函式（正確）                          | 呼叫函式（錯誤）                   |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

像這樣傳遞 inline 程式碼不會在點擊時觸發，它會在每次 component render 時觸發：

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

如果你想要 inline 定義 event handler，請像這樣將它包裹在匿名函式中：

```jsx
<button onClick={() => alert('You clicked me!')}>
```

這會建立一個稍後被呼叫的函式，而不是在每次 render 時執行程式碼。

在這兩種情況下，你想要傳遞的是一個函式：

* `<button onClick={handleClick}>` 傳遞 `handleClick` 函式。
* `<button onClick={() => alert('...')}>` 傳遞 `() => alert('...')` 函式。

[閱讀更多關於箭頭函式的資訊。](https://javascript.info/arrow-functions-basics)

</Pitfall>

### 在 event handler 中讀取 prop {/*reading-props-in-event-handlers*/}

因為 event handler 是在 component 內宣告的，所以它們可以存取 component 的 prop。這是一個按鈕，當點擊它時，會顯示它的 `message` prop 的訊息：

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

這讓這兩個按鈕可以顯示不同的訊息。試著改變傳遞給它們的訊息。

### 將 event handler 作為 prop 傳遞 {/*passing-event-handlers-as-props*/}

通常你會想要 parent component 指定 child component 的 event handler。以按鈕為例：根據你在哪裡使用 `Button` component，你可能想要執行不同的函式，也許一個播放電影，另一個上傳圖片。

要做到這一點，像這樣將 component 從 parent 接收到的 prop 作為 event handler：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

在這裡，`Toolbar` component render 了一個 `PlayButton` 和一個 `UploadButton`：

- `PlayButton` 將 `handlePlayClick` 作為 `onClick` prop 傳遞給內部的 `Button`。
- `UploadButton` 將 `() => alert('Uploading!')` 作為 `onClick` prop 傳遞給內部的 `Button`。

最後，你的 `Button` component 接受一個名為 `onClick` 的 prop，它將該 prop 透過 `onClick={onClick}` 直接傳遞給瀏覽器內建的 `<button>`。這告訴 React 在點擊時呼叫被傳遞的函式。

如果你使用[設計系統 (design system)](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)，像按鈕這樣的 component 只包含樣式但不指定行為是很常見的。相反地，像 `PlayButton` 和 `UploadButton` 這樣的 component 會向下傳遞 event handler。

### 為 event handler prop 命名 {/*naming-event-handler-props*/}

內建的 component 例如 `<button>` 和 `<div>` 只支援 `onClick` 這樣的[瀏覽器事件名稱](/reference/react-dom/components/common#common-props)。然而，當你建立自己的 component 時，你可以用任何你喜歡的方式命名它們的 event handler prop。

按照慣例，event handler prop 應該以 `on` 開頭，後面跟著一個大寫字母。

例如，這個 `Button` component 的 `onClick` prop 可以被命名為 `onSmash`：

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

在這個例子中，`<button onClick={onSmash}>` 顯示了瀏覽器 `<button>` (小寫) 仍然需要一個名為 `onClick` 的 prop，但是你自訂的 `Button` component 收到的 prop 名稱由你決定！

當你的 component 支援多個互動時，你可能會為特定應用的概念命名 event handler prop。例如，這個 `Toolbar` component 收到 `onPlayMovie` 和 `onUploadImage` event handler：

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

注意 `App` component 不需要知道 `Toolbar` 將會如何處理 `onPlayMovie` 或 `onUploadImage`，這是 `Toolbar` 的實作細節。在這裡，`Toolbar` 將它們作為 `onClick` handler 傳遞給它的 `Button`，但是它也可以在之後透過鍵盤快捷鍵觸發它們。像 `onPlayMovie` 這樣依據特定應用互動命名的 prop 讓你有彈性在之後改變它們的使用方式。
  
<Note>

請確保你使用適當的 HTML tag 來處理你的 event handler。例如，要處理點擊時，請使用 [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) 而不是 `<div onClick={handleClick}>`。使用真正的瀏覽器 `<button>` 會啟用內建的瀏覽器行為，例如鍵盤導覽。如果你不喜歡預設的瀏覽器按鈕樣式，並且想要讓它看起來像連結或其他不同的 UI 元件，你可以透過 CSS 達成。[學習更多關於撰寫無障礙的標記。](https://developer.mozilla.org/zh-TW/docs/Learn/Accessibility/HTML)
  
</Note>

## 事件傳遞 {/*event-propagation*/}

Event handler 也會捕捉到來自你的 component 所有 child 的事件，我們稱這個事件「冒泡」或「傳播」到上層：它從事件發生的地方開始，然後往上層傳播。

這個 `<div>` 包含兩個按鈕。`<div>` *和*每個按鈕都有它們自己的 `onClick` handler。當你點擊按鈕時，你認為哪個 handler 會被觸發？

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

如果你點擊其中一個按鈕，它的 `onClick` 會先執行，接著是 parent `<div>` 的 `onClick`，所以會出現兩個訊息。如果你點擊 toolbar 本身，只有 parent `<div>` 的 `onClick` 會執行。

<Pitfall>

在 React 中所有事件都會傳遞，除了 `onScroll`，它只會在你附加它的 JSX tag 上有作用。

</Pitfall>

### 停止傳遞 {/*stopping-propagation*/}

Event handler 會接收一個 **event object** 作為它們唯一的參數。依照慣例，它通常被稱為 `e`，代表「event」。你可以使用這個 object 來讀取事件的資訊。

這個 event object 也可以讓你停止事件傳遞。如果你想要阻止事件傳遞到 parent component，你需要像這個 `Button` component 一樣呼叫 `e.stopPropagation()`：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

當你點擊按鈕時，

1. React 呼叫傳給 `<button>` 的 `onClick` handler。
2. 這個在 `Button` 裡面定義的 handler 做了以下事情：
   * 呼叫 `e.stopPropagation()`，阻止事件繼續冒泡。
   * 呼叫 `onClick` 函式，這是從 `Toolbar` component 傳遞過來的 prop。
3. 這個在 `Toolbar` component 裡面定義的函式會顯示按鈕自己的 alert。
4. 因為事件被阻止傳遞，parent `<div>` 的 `onClick` handler **不會**執行。

因為 `e.stopPropagation()`，點擊按鈕只會顯示單一個 alert（來自 `<button>`），而不是兩個（來自 `<button>` 和 parent toolbar `<div>`）。點擊按鈕和點擊包含它的 toolbar 本身不是同一件事，所以阻止傳遞對這個 UI 來說是有意義的。

<DeepDive>

#### 捕捉階段事件 {/*capture-phase-events*/}

在少數情況下，你可能需要捕捉所有 child element 的事件，*即使它們停止傳遞*。例如，也許你想要記錄每個點擊來做分析，不管傳遞的邏輯如何。你可以在事件名稱的最後面加上 `Capture` 來做到這件事：

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

每個事件會有三個傳遞的階段：

1. 往下傳遞，呼叫所有 `onClickCapture` handler。
2. 執行被點擊 element 的 `onClick` handler。
3. 往上傳遞，呼叫所有 `onClick` handler。

捕捉事件對於像是路由或是分析用的程式碼很有用，但你可能不會在應用程式的程式碼裡面使用它們。

</DeepDive>

### 傳遞 handler 作為事件傳遞的替代方案 {/*passing-handlers-as-alternative-to-propagation*/}

注意這個點擊 handler 先執行了一行程式碼，_然後_呼叫 parent 傳遞過來的 `onClick` prop：

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

你也可以在呼叫 parent `onClick` handler 之前在這個 handler 裡面加上更多的程式碼。這個模式提供了一個事件傳遞的*替代方案*，它讓 child component 處理事件，同時也讓 parent component 指定一些額外的行為。不像事件傳遞，這個模式不是自動的。，但它的好處是讓你可以清楚地追蹤整個由某個事件觸發的程式碼鏈。

如果你依賴事件傳遞，而且很難追蹤哪些 handler 會執行以及為什麼會執行，試試看這個方法。

### 阻止預設行為 {/*preventing-default-behavior*/}

有些瀏覽器事件有對應的預設行為。例如，當 `<form>` 裡面的按鈕被點擊時所造成的提交事件，預設會重新載入整個頁面：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

你可以在 event object 上呼叫 `e.preventDefault()` 來阻止這件事情發生：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

不要把 `e.stopPropagation()` 和 `e.preventDefault()` 搞混了。它們都很有用，但是沒有關係：

* [`e.stopPropagation()`](https://developer.mozilla.org/zh-TW/docs/Web/API/Event/stopPropagation) 會阻止上層 tag 的 event handler 被執行。
* [`e.preventDefault()` ](https://developer.mozilla.org/zh-TW/docs/Web/API/Event/preventDefault) 可以阻止某些具有預設行為的事件造成瀏覽器的預設行為。

## Event handler 可以有副作用嗎？ {/*can-event-handlers-have-side-effects*/}

當然可以！Event handler 是處理副作用的最佳地點。

不像 rendering 函式，event handler 不需要是 [pure](/learn/keeping-components-pure) 的，所以它是一個很好的地方來*改變*一些東西。例如，根據輸入的內容改變 input 的值，或是根據按鈕的點擊改變列表。然而，為了改變一些資訊，你首先需要一些方式來儲存它。在 React，這是透過使用 [state，component 的記憶](/learn/state-a-components-memory) 來完成的。你將會在下一頁學到所有關於它的知識。

<Recap>

* 你可以透過將函式當作 prop 傳遞給像 `<button>` 這樣的 element 來處理事件。
* Event handler 必須要被傳遞，**不是被呼叫！** `onClick={handleClick}`，而不是 `onClick={handleClick()}`。
* 你可以另外定義或是 inline 定義 event handler 函式。
* Event handler 是定義在 component 裡面的，所以它們可以存取 props。
* 你可以在 parent 裡面定義 event handler，然後將它當作 prop 傳遞給 child。
* 你可以定義自己的 event handler prop，並且給它一個針對特定應用的名稱。
* Event 會向上傳遞。在第一個參數上呼叫 `e.stopPropagation()` 可以阻止這件事情發生。
* Event 可能會有你不想要的預設瀏覽器行為。呼叫 `e.preventDefault()` 可以阻止這件事情發生。
* 從 child handler 明確地呼叫 event handler prop 是一個很好的事件傳遞的替代方案。

</Recap>



<Challenges>

#### 修正 event handler {/*fix-an-event-handler*/}

點擊這個按鈕應該會在白色和黑色之間切換頁面的背景。然而，當你點擊它時什麼事情都沒有發生。請修正這個問題。（不用擔心 `handleClick` 裡面的邏輯，那部分是沒問題的。）

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

問題在於 `<button onClick={handleClick()}>` 在 render 時_呼叫_了 `handleClick` 函式，而不是傳遞它。移除 `()` 呼叫，讓它變成 `<button onClick={handleClick}>` 就可以修正這個問題：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

或者，你可以將呼叫包裝到另一個函式裡面，像是 `<button onClick={() => handleClick()}>`：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### 連接事件 {/*wire-up-the-events*/}

這個 `ColorSwitch` component render 了一個按鈕，它應該要改變頁面的顏色。將它連接到從 parent 接收來的 `onChangeColor` event handler prop，讓點擊按鈕的時候可以改變顏色。

在你完成之後，注意到點擊按鈕也會增加頁面點擊計數器。你寫了 parent component 的同事堅持 `onChangeColor` 不會增加任何計數器，還有什麼可能發生了？請修正它，讓點擊按鈕*只會*改變顏色，而_不會_增加計數器。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

首先，你需要加上 event handler，像是 `<button onClick={onChangeColor}>`。

然而，這會導致計數器增加的問題。如果 `onChangeColor` 不會這麼做，就像你的同事堅持的那樣，那麼問題就是這個 event 會向上傳遞，然後上面的某個 handler 會這麼做。為了解決這個問題，你需要停止 event 的傳遞，但是不要忘記你還是需要呼叫 `onChangeColor`。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
