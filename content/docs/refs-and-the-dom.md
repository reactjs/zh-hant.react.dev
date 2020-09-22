---
id: refs-and-the-dom
title: Refs 和 DOM
permalink: docs/refs-and-the-dom.html
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
---

Ref 提供了一種可以取得 DOM 節點或在 render 方法內建立 React element 的方式。

在典型的 React 資料流裡，[props](/docs/components-and-props.html) 是 parent component 和 child component 唯一的互動方式。你會藉由使用新的 prop 重新 render 來改變你的 child。然而，有些情況下你需要在典型的資料流以外更改你的 child。這個被更改的 child 可能是 React component 的其中一個 instance，或他可能是個 DOM element。在這兩種情況下，React 提供了「逃生口」。

### 什麼時候該使用 Ref {#when-to-use-refs}

有幾種適合使用 ref 的情況：

* 管理 focus、選擇文字、或影音播放。
* 觸發即時的動畫。
* 與第三方 DOM 函式庫整合。

避免在任何可以宣告性完成事情的地方使用 ref。

例如，不要把 `Dialog` component 上的 `open()` 和 `close()` 對外公開，應該將 `isOpen` 的 prop 傳進去。

### 不要過度使用 Ref {#dont-overuse-refs}

你一開始可能會傾向於在應用程式裡使用 ref「讓事情發生」。如果這是你的情形，花點時間認真思考一下 state 應該在哪個 component 的層級被持有。通常你會清楚發現，在高層級的地方持有是比較合適的位置。請參閱[提升 State](/docs/lifting-state-up.html)這篇指南裡面的範例。

> 注意
>
> 以下的範例已經被更新為使用 React 16.3 所引入的 `React.createRef()` API。如果你是利用比較舊版本的 React，我們推薦使用 [callback refs](#callback-refs)。

### 建立 Ref {#creating-refs}

Ref 是藉由使用 `React.createRef()` 所產生的，它藉由 `ref` 參數被依附在 React element。Ref 常常會在一個 component 被建立出來的時候，被賦值在某個 instance 屬性，這樣一來他們就可以在整個 component 裡面被參考。

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### 存取 Ref {#accessing-refs}

當 ref 在 `render` 裡被傳到一個 element 的時候，一個指向節點對 ref 的 `current` 參數的參考會變得可以取得。

```javascript
const node = this.myRef.current;
```

Ref 的值會根據節點的類型而有所不同：

- 當在 HTML element 上使用 `ref` 參數時，使用 `React.createRef()` 建立 `ref` 會取得它底下的 DOM element 來做為它的 `current` 屬性。
- 當在客製化的 class component 使用 `ref` 參數時，`ref` 取得被 mount 的 component 上的 instance 來當作他的 `current`。
- **你不能在 function component 上使用 `ref`**，因為他們沒有 instance。

下面的範例示範了差異。

#### 在 DOM Element 加上 Ref {#adding-a-ref-to-a-dom-element}

這段程式碼利用 `ref` 來儲存對於 DOM 節點的參考：

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 產生一個可以儲存 textInput DOM element 的 ref
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // 特別利用原生的 DOM API 來關注文字的輸入
    // 注意：我們正利用「current」來取得 DOM 節點
    this.textInput.current.focus();
  }

  render() {
    // 告訴 React 我們想要將 <input> ref
    // 和我們在 constructor 產生的 `textInput` 連結
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React 會在 component mount 的時候將 DOM element 賦值到 `current` 屬性，並在 unmount 時將它清空回 `null`。`ref` 的更新發生在生命週期 `componentDidMount` 或 `componentDidUpdate` 之前。

#### 在 Class Component 加上 Ref {#adding-a-ref-to-a-class-component}

如果我們想要把上面的 `CustomTextInput` 包起來然後模擬它在被 mount 之後馬上被點擊，我們可以使用 ref 來獲得客製化的 input 併手動呼叫他的 `focusTextInput` 函式：

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

注意這種情況只適用於利用 class 來宣告 `CustomTextInput` 的情形：

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Ref 和 Function Component {#refs-and-function-components}

預設上，**你不能在 function component 上使用 `ref`**，因為它們沒有 instance：

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

如果你想要讓其他人將 `ref` 帶到你的 function component，你可以使用 [`forwardRef`](/docs/forwarding-refs.html)（可能與 [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)），或者你可以轉換成 class component。

然而，只要你想要指到的是 DOM element 或 class component，你也可以**在 function component 裡使用 `ref`**：

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // 必須在這裡宣告 textInput 使 ref 可以參考到它
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### 對 Parent Component 公開 DOM 的 Ref {#exposing-dom-refs-to-parent-components}

在很少的情況下，你可能會想要在 parent component 取得 child 的 DOM 節點。在一般的情形下，並不建議這麼做，因為這會破壞 component 的封裝，但有時候這麼做對於觸發 focus 或測量 child 的 DOM 節點的大小、位置是很有用的。

雖然你可以[在 child component 新增一個 ref](#adding-a-ref-to-a-class-component)，但這並不是理想的解法，因為你只能拿到一個 component 的 instance 而不是一個 DOM 節點。另外，在 function component 裡並不適用。

如果你使用比 React 16.3 還新的版本，在這種情形下，我們推薦使用[傳送 ref](/docs/forwarding-refs.html)。**傳送 Ref 使得 component 能夠選擇要不要把 child component 的 ref 當作自己的 ref**。你可以在[傳送 ref 的文件裡](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)找到詳細關於怎麼把 child 的 DOM 節點公開給 parent component 的範例。

如果你使用比 React 16.2 還舊的版本，或你需要比傳送 ref 的方式有更多的彈性，你可以使用[這個不同的方式](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509)並把 ref 當作另個有名字的 prop 來傳進去。

可能的話，我們會建議不要把 DOM 節點公開，但這可能是個有用的逃生艙。要注意的是，這個方式需要你在 child component 新增一些程式碼。如果你對 child component 的實作完全無法控制，你的最終選擇是使用[`findDOMNode()`](/docs/react-dom.html#finddomnode)，但我們並不建議使用，且在 [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) 裡他會被淘汰掉。

### Callback Refs {#callback-refs}

React 也支援另一種設定 ref 的方式，這種方法叫做「callback refs」，它提供了對 ref 的設定上更細緻的控制。

不是將 `createRef()` 所產生的 `ref` 傳遞下去，而是把一個 function 往下傳。這個 function 會將 React component 的 instance 或 HTML DOM 作為他的參數，然後可以被儲存之後在別的地方使用。

下面的例子實作了一個常見的模式：利用 `ref` 的 callback 來儲存一個在 instance 屬性裡 DOM 節點的參考。

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // 利用原生的 DOM API 來 focus 文字輸入
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // 在 mount 的時候自動 focus 輸入
    this.focusTextInput();
  }

  render() {
    // 利用 `ref` callback 來儲存 instance 欄位裡文字輸入 DOM 的參考
    // （例如：this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React 會在 component 安裝時用 DOM element 呼叫 `ref` callback，然後在 unmount 時用 `null` 呼叫他。Ref 被保證在 `componentDidMount` 或 `componentDidUpdate` 觸發時能夠維持在最新的狀態。

你可以將 callback ref 在 component 之間傳遞，就像你可以用一樣的方式在 `React.createRef()` 所產生的 object ref 一樣。

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

在上面的範例裡，`Parent` 將他的 ref callback 做為一個 `inputRef` prop 傳到 `CustomTextInput`，然後 `CustomTextInput` 將一樣的 function 當作特別的 `ref` 屬性來傳給 `<input>`。因此，在 `Parent` 的 `this.inputElement` 會被設為與在 `CustomTextInput` 裡 `<input>` element 相關的 DOM 節點。

### Legacy API: String Refs {#legacy-api-string-refs}

如果你以前就使用過 React，你可能對一個舊的 API 有點熟悉，當 `ref` 屬性是字串的時候，例如 `"textInput"`，然後 DOM 節點被當作 `this.refs.textInput` 來取得。我們不建議使用它，因為 string ref 有[一些問題](https://github.com/facebook/react/pull/8333#issuecomment-271648615)，所以他被視為 legacy，且**很有可能會在未來的版本被移除**。

> 注意
>
> 如果你正在使用 `this.refs.textInput` 來取得 ref，我們建議使用 [callback 的方式](#callback-refs)或 [`createRef` API](#creating-refs)。

### 對 callback ref 的警告 {#caveats-with-callback-refs}

如果 `ref` callback 是被 inline function 所定義的，他會在更新的時候被呼叫兩次，第一次用 `null` 然後再用 DOM element 呼叫一次。這是因為新的 function 的 instance 是在每次 render 的時候被產生，所以 React 需要將舊的 ref 清掉然後設定新的。你可以藉由定義 `ref` callback 為 class 上的一個 bound method 來避免這種情形，但在大多情況下他並沒有任何影響。
