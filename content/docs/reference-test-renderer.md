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

基本上，這個 package 提供的主要功能是在不依賴瀏覽器或 [jsdom](https://github.com/tmpvar/jsdom) 的情況下，返回某個時間點由 React DOM 或是 React Native 平臺 render 出的視圖結構（類似 DOM tree）snapshot。

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

返回 root 『測試實例』object，它對於斷言 tree 中的特定 node 十分有用。你可以利用它來查找其他更深層的『測試實例』。

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Find a single descendant test instance for which `test(testInstance)` returns `true`. If `test(testInstance)` does not return `true` for exactly one test instance, it will throw an error.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Find a single descendant test instance with the provided `type`. If there is not exactly one test instance with the provided `type`, it will throw an error.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Find a single descendant test instance with the provided `props`. If there is not exactly one test instance with the provided `props`, it will throw an error.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Find all descendant test instances for which `test(testInstance)` returns `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Find all descendant test instances with the provided `type`.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Find all descendant test instances with the provided `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

The component instance corresponding to this test instance. It is only available for class components, as function components don't have instances. It matches the `this` value inside the given component.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

The component type corresponding to this test instance. For example, a `<Button />` component has a type of `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

The props corresponding to this test instance. For example, a `<Button size="small" />` component has `{size: 'small'}` as props.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

The parent test instance of this test instance.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

The children test instances of this test instance.

## Ideas {#ideas}

You can pass `createNodeMock` function to `TestRenderer.create` as the option, which allows for custom mock refs.
`createNodeMock` accepts the current element and should return a mock ref object.
This is useful when you test a component that relies on refs.

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
        // mock a focus function
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
