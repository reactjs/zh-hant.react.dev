---
title: createElement
---

<Intro>

`createElement` 允许你创建一個 React 元素。它可以作為 [JSX](/learn/writing-markup-with-jsx) 的替代方案。

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

調用 `createElement` 來創建一個 React 元素，它有 `type`, `props`, and `children` 三個參數。

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好'
  );
}
```

[查看更多例子](#usage)

#### 參數 {/*parameters*/}

* `type`: `type` 參數必須是一個有效的 React 組件類型，例如一個字串標籤名（如 `'div'` 或 `'span'`），或一個 React 組件（一個函數式組件、一個類式組件，或者是一個特殊的組件如 [`Fragment`](/reference/react/Fragment)）。

* `props`: `props` 參數必須是一個物件或 `null`。如果你傳入 `null`，它會被當作一個空物件。創建的 React 元素的 `props` 與這個參數相同。注意，`props` 物件中的 `ref` 和 `key` 比較特殊，它們 **不會** 作為 `element.props.ref` 和 `element.props.key` 出現在創建的元素 `element` 上，而是作為 `element.ref` 和 `element.key` 出現。

* **可選** `...children`：零個或多個子節點。它們可以是任何 React 節點，包括 React 元素、字串、數字、[portal](/reference/react-dom/createPortal)、空節點（`null`、`undefined`、`true` 和 `false`），以及 React 節點陣列。

#### 返回值 {/*returns*/}

`createElement` 返回一個 React 元素，它有這些屬性：

* `type`: 你傳入的 `type`。
* `props`: 你傳入的 `props`，不包括 `ref` 和 `key`。如果 `type` 是一個組件，且帶有過時的 `type.defaultProps` 屬性，那麼 `props` 中任何缺失或未定義的欄位都會採用 `type.defaultProps` 中的值。
* `ref`: 你傳入的 `ref`。如果缺失則為 `null`。
* `key`: 你傳入的 `key`，會被強制轉換為字串。如果缺失則為 `null`。

通常你會在你組件的最後返回這個元素，或者把它作為另一個元素的子元素。雖然你可以讀取元素的屬性，但你最好把創建的元素作為黑盒，只用於渲染。

#### 注意事項 {/*caveats*/}

* 你必須**將 React 元素和它們的 props 視為[不可變的](https://en.wikipedia.org/wiki/Immutable_object)**，在創建後永遠不要改變它們的內容。在開發環境中，React 會淺層[凍結](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)返回的元素及其 `props` 屬性，以確保如此。

* 當你使用 JSX 時，**你必須以大寫字母開頭來渲染你的自定義組件**。換句話說，`<Something />` 等價於 `createElement(Something)`，但 `<something />`（小寫）等價於 `createElement('something')`（注意它是一個字串，它會被當作內建的 HTML 標籤）。

* 你應該僅**在所有子元素都是靜態可知的情況下，才將它們依次傳遞給 `createElement` 的可選參數**，比如 `createElement('h1', {}, child1, child2, child3)`。如果你的子元素不固定，則把它們放到數組中作為第三個參數傳遞，例如 `createElement('ul', {}, listItems)`，以此確保 React 可以在動態列表的場景下[警告你缺少 `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key)。靜態列表的場景不需要這麼做，因為它們不會重新排序。

---

## 用法 {/*usage*/}

## 不使用 JSX 創建元素 {/*creating-an-element-without-jsx*/}

如果你不喜歡 [JSX](/learn/writing-markup-with-jsx) 或者無法在你的專案中使用它，你可以使用 `createElement` 作為替代方案。

要想不使用 JSX 創建一個元素，你可以調用 `createElement` 並傳入 <CodeStep step={1}>type</CodeStep>、<CodeStep step={2}>props</CodeStep> 和 <CodeStep step={3}>children</CodeStep>：

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'你好',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'。歡迎！'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好',
    createElement('i', null, name),
    '。歡迎！'
  );
}
```

<CodeStep step={3}>children</CodeStep> 是可選的，你可以傳入任意數量的子元素（上面的例子中有三個）。這段程式碼會顯示一個帶有問候語的 `<h1>` 標題。為了對比，這是使用 JSX 的版本：

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "你好<i>{name}</i>，歡迎！"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      你好<i>{name}</i>，歡迎！
    </h1>
  );
}
```

要想渲染你自己的 React 組件，則傳入一個函數（比如 `Greeting`）作為 <CodeStep step={1}>type</CodeStep> ，而不是一個字串（比如 `'h1'`）：

```js [[1, 2, "Greeting"], [2, 2, "{ name: '泰勒' }"]]
export default function App() {
  return createElement(Greeting, { name: '泰勒' });
}
```

如果使用 JSX，它看起來像這樣：

```js [[1, 2, "Greeting"], [2, 2, "name=\\"泰勒\\""]]
export default function App() {
  return <Greeting name="泰勒" />;
}
```

這裡是一個完整的使用 `createElement` 的示例：

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好',
    createElement('i', null, name),
    '，歡迎！'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: '泰勒' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

這裡是相同的示例，但使用的是 JSX：

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      你好<i>{name}</i>，歡迎！
    </h1>
  );
}

export default function App() {
  return <Greeting name="泰勒" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

兩種編碼風格都沒問題，你可以在專案中使用任何一個你喜歡的風格。相比於 `createElement`，使用 JSX 的主要好處是很容易看出哪個閉合標籤對應哪個開放標籤。

<DeepDive>

#### React 元素究竟是什麼？ {/*what-is-a-react-element-exactly*/}

元素是用來描述一部分使用者介面的輕量級結構。例如，`<Greeting name="泰勒" />` 和 `createElement(Greeting, { name: '泰勒' })` 都會生成一個這樣的物件：

```js
// 極度簡化的樣子
{
  type: Greeting,
  props: {
    name: '泰勒'
  },
  key: null,
  ref: null,
}
```

**請注意，創建這個物件並不會渲染 `Greeting` 組件或者創建任何 DOM 元素**。

React 元素更像是一個描述或指令，它告訴 React 之後該如何渲染 `Greeting` 組件。你從 `App` 組件中返回了這個物件，就是告訴了 React 接下來該做什麼。

創建元素非常高效，因此你不需要試圖優化或避免它。

</DeepDive>