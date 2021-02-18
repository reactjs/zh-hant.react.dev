---
id: portals
title: Portal
permalink: docs/portals.html
---

Portal 提供一個優秀方法來讓 children 可以 render 到 parent component DOM 樹以外的 DOM 節點。

```js
ReactDOM.createPortal(child, container)
```

第一個參數（`child`）是任何[可 render 的 React child](/docs/react-component.html#render)，例如 element、string 或者 fragment。第二個參數（`container`）則是一個 DOM element。

## 使用方式 {#usage}

通常當 component 的 render 方法回傳一個 element 時，此 element 會作為 child 被 mount 進最接近的 parent 節點中：

```js{4,6}
render() {
  // React mount 一個新的 div 並將 children render 進去
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

然而在某些狀況下，將 child 插入不同位置的 DOM 內十分好用：

```js{6}
render() {
  // React *不會*建立新的 div。它會將 children render 進 `domNode` 中。
  // `domNode` 可以是任何在隨意位置的合法 DOM node。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

一個典型的 portal 使用案例是，當 parent component 有 `overflow: hidden` 或者 `z-index` 的樣式時，卻仍需要 child 在視覺上「跳出」其容器的狀況。例如 dialog、hovercard 與 tooltip 都屬於此案例。

> 注意：
>
> 當使用 portal 時，請留意[控管鍵盤 focus](/docs/accessibility.html#programmatically-managing-focus) 對於無障礙功能會變得非常重要。
>
> 使用跳窗 dialog 時，應確保每個人都可以依照 [WAI-ARIA Modal 開發規範](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) 定義的方式與其互動。

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/yzMaBd)

## 透過 Portal 進行 Event Bubbling {#event-bubbling-through-portals}

雖然 portal 可以被放置在 DOM tree 中的任何位置，但 portal 的其他行為與一般的 React child 別無二致。像是 context 等功能的運作方式並不會因為 child 是 portal 而有所不同，因為不論 portal 在 DOM tree 中的位置為何，它都存在於 *React tree* 中。

相同的行為也包括 event bubbling。一個在 portal 內觸發的 event 會傳遞到涵蓋它的 *React tree* 祖先中，就算涵蓋它的那些 element 並不是 DOM tree 上的祖先。假設存在以下 HTML 結構：

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

一個在 `#app-root` 中的 `Parent` component 可以捕捉從 sibling 節點 `#modal-root` bubble 上來且未被接收過的 event。

```js{28-31,42-49,53,61-63,70-71,74}
// 這兩個 container 是 DOM 上的 sibling
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Portal element 會在 Modal 的 children 被
    // mount 之後才插入 DOM tree 中，這代表 children
    // 會被 mount 在一個分離的 DOM 節點上。如果一個
    // child component 需要在 mount 結束時馬上連接到 DOM tree 中，
    // 例如測量一個 DOM node，或者在子節點中使用 'autoFocus' 等狀況，
    // 則應將 state 加入 Modal 中，並只在 Modal 插入 DOM tree 後
    // 才 render children。
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 這會在 Child 中的 button 被點擊時觸發並更新 Parent 的 state，
    // 就算 Child 的 button 並不是 DOM 中的直接後代。
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // 這個 button 中的 click event 會被 bubble 到 parent 中，
  // 因為這邊並沒有定義 'onClick' attribute
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/jGBWpE)

Parent component 可以捕捉從 portal bubble 上來的 event 能使開發具有不直接依賴於 portal 的更彈性化抽象性。舉例來說，如果你 render 了一個 `<Modal />` component，則不論 Modal 是否是使用 portal 實作，它的 parent 皆可以捕捉到其 event。
