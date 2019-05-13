---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**如何 Import**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概觀 {#overview}

`ReactTestUtils` 使你可以輕鬆在你選擇的測試框架中測試 React component。在 Facebook，我們使用 [Jest](https://facebook.github.io/jest/) 以方便地進行 JavaScript 測試。你可以從 Jest 網站的 [React 教學](https://jestjs.io/docs/tutorial-react)學習如何使用 Jest。

> 注意：
>
> 我們推薦使用 [`react-testing-library`](https://git.io/react-testing-library)，它促使你寫出的測試能像使用者一樣地使用 component。
>
> 此外，Airbnb 推出了名為 [Enzyme](https://airbnb.io/enzyme/) 的測試工具，讓你能輕易 assert、操作及遍歷 React component 的輸出。

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## 參考資料 {#reference}

### `act()` {#act}

為了準備讓 component 進行 assert，將 render component 及執行更新的程式碼放在 `act()` 中。這讓你的測試更貼近 React 在瀏覽器中的運作方式。

>注意
>
>如果你使用 `react-test-renderer`，它也提供行為相同的 `act` function。

舉例來說，假設我們有個 `Counter` component：

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

我們可以這樣測試：

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 測試第一個 render 和 componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 測試第二個 render 和 componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

不要忘記，只有在 DOM container 已加到 `document` 裡面時，才可以 dispatch DOM event。你可以使用如 [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) 的 helper 來減少 boilerplate code。

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

傳遞一個模擬的 component module 到這個方法後，它會增加有用的方法，讓它能做為虛擬的 React component。component 不會像平常一樣 render，它會變成一個簡單的 `<div>`（或其他標籤，如果有提供 `mockTagName`），包含任何提供的 children。

> 注意：
>
> `mockComponent()` 是老舊的 API。我們建議使用 [shallow render](/docs/shallow-renderer.html) 或 [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) 代替。

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

`element` 是 React element 的話就回傳 `true`。

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

如果 `element` 是類型為 `componentClass` 的 React element 就回傳 `true`。

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

如果 `instance` 是 DOM component（如 `<div>` 或 `<span>`）就回傳 `true`。

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

如果 `instance` 是使用者定義的 component，例如 class 或 function，就回傳 `true`。

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

如果 `instance` 是類型為 `componentClass` 的 component 就回傳 `true`。

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

遍歷 `tree` 中的所有 component，並收集 `test(component)` 為 `true` 的所有 component。這個方法本身不是那麼好用，但是它被其他測試工具做為基礎使用。

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

尋找已 render 的 tree 中 component 的所有 DOM element 裡，class 名稱符合 `className` 的 DOM component。

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

與 [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) 相似，不過預期只有一個結果。如果符合預期則回傳那個結果，否則拋出例外。

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

尋找已 render 的 tree 中 component 的所有 DOM element 裡，tag 名稱符合 `tagName` 的 DOM component。

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

與 [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) 相似，不過預期只有一個結果。如果符合預期則回傳那個結果，否則拋出例外。

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

尋找所有 component type 與 `componentClass` 相同的 instance。

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

與 [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) 相似，不過預期只有一個結果。如果符合預期則回傳那個結果，否則拋出例外。

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Render React element 到 document 中獨立的 DOM node 裡。**這個 function 需要 DOM。**它等效於：

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> 注意：
>
> 在 import `React` **前**，你需要讓 `window`、`window.document` 和 `window.document.createElement` 在全域可以使用。否則 React 會認為它無法存取 DOM，像 `setState` 之類的方法也將無法運作。

* * *

## 其他工具 {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

在 DOM node 上用可選的 `eventData` 事件資料模擬 event dispatch。

[每一個 React 支援的事件](/docs/events.html#supported-events)在 `Simulate` 都有對應的方法。

**點擊 element**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**更改 input field 的值，然後按 ENTER 鍵。**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 注意：
>
> 你需要提供所有在你的 component 中有使用的事件屬性（如 keyCode、which……），因為 React 不會為你建立這些東西。

* * *
