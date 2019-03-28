---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**如何引入**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概觀 {#overview}

當在為 React 寫單元測試時，shallow render 十分有用。Shallow render 可以只 render 「第一層」的 component，並且對 component 的 render 方法的回傳值進行 assert，不必擔心 child component 的行為，child component 並沒有被實例化或被 render。Shallow render 不依賴 DOM。

例如，假設你有下列 component：

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

你可以使用 assert：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// 測試程式:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Shallow testing 目前有些限制，並不支援 refs。

> 注意：
>
> 我們建議你可以查看 Enzyme 的 [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html)。它在相同功能的基礎上提供更棒更高階的 API。

## Reference {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

你可以把 shallowRenderer 想成一個用來 render 測試中 component 的「空間」，並且可以從中提取該 component 輸出的內容。

`shallowRenderer.render()` 類似於 [`ReactDOM.render()`](/docs/react-dom.html#render)，但它不依賴 DOM 且只 render 一層。這意味著你可以對測試的 component 及其 child component 進行隔離測試。

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

在 `shallowRenderer.render()` 被呼叫後，你可以使用 `shallowRenderer.getRenderOutput()` 來獲取該 component 第一層的輸出內容。

然後，就可以對輸出的內容進行斷言操作。
