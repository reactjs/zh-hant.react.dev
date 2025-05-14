---
title: Render 和 Commit
---

<Intro>

在你的 component 顯示在畫面上之前，必須被 React render。了解這個過程中的步驟將有助於你思考你的程式碼是如何執行的，並能解釋其行為。

</Intro>

<YouWillLearn>

* 在 React 中 rendering 所代表的意思
* React render component 的時機及原因
* 顯示 component 在畫面上所涉及的步驟
* 為什麼 rendering 不一定會導致 DOM 更新

</YouWillLearn>

想像一下，你的 component 就像廚房中的廚師，從食材中組合出美味的菜餚。在這種情況下，React 就像是服務生，接收來自顧客的訂單，並將菜餚送到他們的桌上。這個請求和提供 UI 的過程包含三個步驟：

1. **觸發** render (將客人的訂單發送到廚房)
2. **Rendering** component (在廚房裡準備菜餚)
3. **Commit** 到 DOM (將菜餚送上桌)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## 步驟 1：觸發 render {/*step-1-trigger-a-render*/}

有兩個原因會使 component 進行 render：

1. 這是 component 的初始 render。
2. component（或是他的祖父層之一）的**狀態發生改變。**

### 初始 render {/*initial-render*/}

當你的應用程式啟動時，會觸發初始 render。有些框架和開發環境可能會隱藏這部分的程式碼，但實際上它是透過使用 [`createRoot`](/reference/react-dom/client/createRoot) 的方法來指定目標 DOM 節點，然後再呼叫 `render` 函式 render component：

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

請試著將 `root.render()` 這行程式碼註解掉，然後就會發現 component 消失了！

### 當狀態更新時重新 render {/*re-renders-when-state-updates*/}

一但 component 被初始 render，你可以透過使用 [`set` 函式](/reference/react/useState#setstate) 更新其狀態來觸發之後的 render。更新 component 的狀態會自動加入重新 render 的 queue。(你可以將這個過程想像成一位餐廳顧客點完第一道菜後，根據他的口渴或飢餓程度，又繼續點了茶、點心或其他各種菜色的流程。)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## 步驟 2：React render 你的 component {/*step-2-react-renders-your-components*/}

在觸發 render 之後，React 將呼叫你的 component 以確定什麼該顯示在螢幕畫面上。**「Rendering」 指的是 React 正在呼叫你的 component.**

* **當初始 render 時，** React 會呼叫 root component.
* **對於後續的 render，** React 會呼叫因狀態更新而觸發 render 的 function component。

這段過程是遞迴的：如果更新的 component 回傳其他的 component，React 將會 render _那個_ component，如果 component 又回傳其他的 component，React 會接著 render _下一個_ component，以此類推。這個過程將一直持續到沒有回傳更多的 component，React 才知道應該在螢幕上顯示什麼。

<<<<<<< HEAD
在接下來的範例，React 將會呼叫 `Gallery()` 和 `Image()` 幾次
=======
In the following example, React will call `Gallery()` and `Image()` several times:
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **當初始 render 時，** React 會為 `<section>`、`<h1>` 和三個 `<img>` 標籤[建立 DOM 節點](https://developer.mozilla.org/docs/Web/API/Document/createElement)
* **當重新 render 時，** React 會計算他們的屬性（如果有的話），是否與上一次 render 時有所不同。在下一個步驟 - commit 階段之前，它不會進行任何動作。

<Pitfall>

Rendering 必須永遠是一個[純運算](/learn/keeping-components-pure)

* **相同的輸入，會得到相同的輸出。** 當輸入相同的值時，component 應該永遠回傳相同的 JSX。(當有人點了一份番茄沙拉時，他們不應該拿到一份洋蔥沙拉！)
* **它只做自己的事情。** 在 rendering 之前，不應該改變任何先前已存在的任何物件或變數。（一份訂單不應該改變其他任何人的訂單。）

否則，你的程式碼會變得越來越複雜，可能會遇到令人困惑的錯誤和不可預測的行為。在「嚴格模式」下開發時，React 將呼叫每個 component 函式兩次，這可以幫助你發現由不純函數引發的錯誤。

</Pitfall>

<DeepDive>

#### 效能最佳化 {/*optimizing-performance*/}

如果要更新的 component 在 tree 的非常頂部，預設情況下對擁有巢狀子元件的 component 更新元件時，每個子元件都將被重新 render，這不會獲得最佳的效能。如果遇到效能問題，可以在[效能](https://reactjs.org/docs/optimizing-performance.html)中找到幾個解決方法。**但不要太早進行最佳化！**

</DeepDive>

## 步驟 3：React 把更改 commit 到 DOM {/*step-3-react-commits-changes-to-the-dom*/}

<<<<<<< HEAD
在 rendering（呼叫）你的 component 後，React 將會更改你的 DOM。

* **對於初始 render，** React 會使用 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API 在螢幕上顯示所有你建立的 DOM 節點。
* **對於重新 render，** React 會採取最小必要的操作 (在 rendering 時計算！)，以使得 DOM 與 rendering 後的的輸出相符。
=======
After rendering (calling) your components, React will modify the DOM.

* **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen.
* **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

**React 只有在 render 時有差異才會更改 DOM 節點。** 例如，這裡有一個 component，每秒從其 parent 傳遞不同的 props 重新 render。請注意，你可以在 `<input>` 中輸入一些文字，更新它的 `value`，但是這些文字不會在 conponent 重新 render 時消失。

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

這個範例之所以能夠運作，是因為在最後一步中，React 只會依據新的 `time` 去更新 `<h1>` 的內容。React 發現這個 `<input>` 在 JSX 中出現的位置與上一次相同，因此不會修改 `<input>` 或其 `value` 值。
## 結語：瀏覽器繪製 {/*epilogue-browser-paint*/}

在 rendering 完成並且在 React 更新 DOM 後，瀏覽器將會重新繪製螢幕畫面。儘管這個過程被稱為「瀏覽器 rendering」，我們更傾向於將它稱為「繪製」，以避免混淆。

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* 在 React 應用程式中，任何螢幕畫面更新都會發生三個步驟：
  1. 觸發
  2. Render
  3. Commit
* 你可以使用嚴格模式去找到 component 中的錯誤
* 如果 rendering 後的結果與上次相同，React 將不會更改 DOM。

</Recap>

