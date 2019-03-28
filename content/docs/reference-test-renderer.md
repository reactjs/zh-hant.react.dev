---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**如何引入**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## 概覽 {#overview}

這個 package 提供了一個 React renderer，用於將 React component render 成單純的 JavaScript object，無需依賴 DOM 或原生的行動裝置環境。

基本上，這個 package 提供的主要功能是在不依賴瀏覽器或 [jsdom](https://github.com/tmpvar/jsdom) 的情況下，回傳某個時間點由 React DOM 或是 React Native component render 出的 view 結構（類似 DOM tree）snapshot。

範例：

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

你可以使用 Jest 的 snapshot 測試功能來自動保存目前 JSON tree 到一個文件中，並在測試中檢查它是否被修改：[瞭解更多](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)。

你也可以通過遍歷輸出來查找特定 node，並對它們進行斷言。

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Reference {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```
透過傳來的 React element 創建一個 `TestRenderer` 實例。 它不使用真實的 DOM，但是它依然將 component tree 完整地 render 到記憶體中，以便於你對它進行斷言。返回的實例擁有以下的方法和屬性。

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

返回一個已 render 的 tree object。該 tree 僅包含特定平台的 node，例如 <div> 或 <View> 和它們的 props，但並不包含任何人員編寫的 component。這對於 [snapshot 測試](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest)非常方便。

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```
返回一個已 render 的 tree object。和 `toJSON()` 不同，它表示的內容比 `toJSON()` 提供的內容更加詳細，並且包含人員編寫的組件。除非你要在 test renderer 之上編寫自己的斷言庫，否則你可能不需要這個方法。

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

透過新的 root element 去重新 render 記憶體中的 tree。 它模擬在 root 的 React 更新。 如果新的 element 和之前的 element 有相同的 type 和 key，該 tree 將會被更新；否則，它將重新 mount 一個新的 tree。

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Unmount 記憶體中的 tree，並觸發相對應的生命週期事件。

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

如果可以的話，返回與 root element 相對應的實例。如果 root element 是 function component，該方法無效，因為 function component 沒有實例。

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

返回 root 「測試實例」object，它對於斷言 tree 中的特定 node 十分有用。你可以利用它來查找其他更深層的「測試實例」。

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

找到一個 descendant 測試實例，其 `test(testInstance)` 返回 true。 如果找到不只一個測試實例，將會拋出錯誤。

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

找到一個與指定 `type` 匹配的 descendant 測試實例。 如果不只有一個測試實例匹配指定的 `type`，將會拋出錯誤。

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

找到一個與指定 `props` 匹配的 descendant 測試實例。 如果不只有一個測試實例匹配指定的 `props`，將會拋出錯誤。

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

找到所有的 descendant 測試實例，其 `test(testInstance)` 返回 true。 

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

找到所有與指定 `type` 匹配的 descendant 測試實例。

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

找到所有與指定 `props` 匹配的 descendant 測試實例。

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

該測試實例相對應的 component 實例。它只能用於 class component，因為 function component 沒有實例。它與 component 內部的 `this` 值匹配。

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

該測試實例相對應的 component 類型。例如，一個 `<Button />` component 的類型為 `Button`。
The component type corresponding to this test instance. For example, a `<Button />` component has a type of `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

該測試實例相對應的 component props。例如，一個 `<Button size="small" />` component 的 props 為 `{size: 'small'}`。

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

該測試實例的 parent 測試實例。

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

該測試實例的 children 測試實例。

## 概念 {#ideas}

你可以把 `createNodeMock` function 當作第二個參數傳給 `TestRenderer.create`，做為自訂模擬的 refs。`createNodeMock` 接受當前 element 作為參數，並且返回一個模擬的 ref object。這十分有利於依賴 refs component 的測試。

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // 模擬一個 focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
