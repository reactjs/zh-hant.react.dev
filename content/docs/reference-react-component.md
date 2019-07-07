---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

本章節包含了 React component class 的詳細 API 參考。我們假設你對 React 的基本概念已十分熟悉，例如 [Component 和 Prop](/docs/components-and-props.html) 以及 [State 和 生命週期](/docs/state-and-lifecycle.html)。如果你對這些概念還不清楚，請先閱讀相關文件。

## 概觀 {#overview}

在 React 中，你可以將 component 定義成 class 或 function。目前，被定義為 class 的 component 提供了更多功能，我們將會在本章節中逐一介紹。要定義一個 React component class，你需要繼承（extend）`React.Component`：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

在 `React.Component` 的 subclass 中唯一一個你*必須*定義的方法是[`render()`](#render)。本章節中所有其他的方法都並非絕對必要。

**我們強烈建議你不要建立自己的 base component class。** 在 React component 中，[程式的重複使用性主要是透過組合而非繼承來完成的](/docs/composition-vs-inheritance.html)。

>注意：
>
>React 並不會強迫你使用 ES6 class 語法。如果你想避免它的話，你可以使用 `create-react-class` 或一個類似的客製化的 abstraction。想了解更多詳情，請參考[如何在 React 中不使用 ES6](/docs/react-without-es6.html)一文。

### Component 生命週期 {#the-component-lifecycle}

每一個 component 都有數個 「生命週期方法」，你可以[覆蓋（override）](https://en.wikipedia.org/wiki/Method_overriding)這些方法，以便在開發過程中某些特定的時刻運行某些程式。 **你可以使用[這個生命週期表](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)作為速查表。** 以下，常用的生命週期方法將會以粗體表達。其餘的生命週期方法則相對罕見。

#### Mounting {#mounting}

當一個 component 的實例被建立且加入 DOM 中時，其生命週期將會依照下列的順序呼叫這些方法：

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>注意：
>
>下列方法已過時，你在寫新程式應[避免使用](/blog/2018/03/27/update-on-async-rendering.html)：
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### 更新 {#updating}

當 prop 或 state 有變化時，就會產生更新。當一個 component 被重新 render 時，其生命週期將會依照下列的順序呼叫這些方法：

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>注意：
>
>下列方法已過時，你在寫新程式應[避免使用](/blog/2018/03/27/update-on-async-rendering.html)：
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Unmounting {#unmounting}

當一個 component 被從 DOM 中移除時，這個方法將會被呼叫：

- [**`componentWillUnmount()`**](#componentwillunmount)

#### 錯誤處理 {#error-handling}

當一個 component 在 render 的過程、生命週期、或在某個 child component 的 constructor 中發生錯誤時，這些方法會被呼叫：

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### 其他 APIs {#other-apis}

每個 component 也提供了其他 API：

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Class 屬性 {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Instance 屬性 {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## 參考指南 {#reference}

### 常用的生命周期方法 {#commonly-used-lifecycle-methods}

此段落將會介紹你在建立 React component 時最可能會使用到的幾種方法。**想更深入了解生命週期方法，請參考[生命週期表](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)。**

### `render()` {#render}

```javascript
render()
```

`render()` 是 class component 中唯一必要的方法。

當 render 被呼叫時，它將會檢視 `this.props` 和 `this.state` 中的變化，並回傳以下類別之一：

- **React elements。** 通常是透過 [JSX](/docs/introducing-jsx.html) 創立的。例如，`<div />`和`<MyComponent />`這兩個 React element 會告訴 React 要 render 一個 DOM node 和一個使用者定義的 component。
- **Arrays and fragments。** 它們會從 render 中回傳數個 element。細節請參考[fragments](/docs/fragments.html)。
- **Portals**。它們讓你將 children render 到不同的 DOM subtree 中。細節請參考[portals](/docs/portals.html)。
- **String and numbers。** 這些在 DOM 中將會被 render 為文本 node。
- **Booleans or `null`**。什麼都不 render。（此類型主要是支援 `回傳 test && <Child />` 的模式，這裡的 `test` 是一個 boolean 值）。

`render()` function 應為純函數（pure function），這表示：它並不會改變 component 的 state，它在每次呼叫時都會回傳同樣的結果，它並不會直接和瀏覽器有所互動。

如果你需要和瀏覽器互動，請在 `componentDidMount()` 或其他的生命週期方法內運行你的程序。將 `render()` 維持在純函式的狀態有助於你對 component 的理解。

> 注意：
>
> 若  [`shouldComponentUpdate()`](#shouldcomponentupdate) 回傳的值為 `false` 的話，`render()`將不會被呼叫。

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**如果你沒有初始化 state 也不綁定方法的話，你的 React component 就不需要 constructor。**

一個 React component 的 constructor 會在其被 mount 之前被呼叫。當你為一個 `React.Component` subclass 建立 constructor 時，你應該在其他任何宣告之前呼叫 `super(props)`。否則，`this.props` 在 constructor 中的值會出現 undefined 的 bug。

Typically, in React constructors are only used for two purposes:

* 透過指定（assign） `this.state`為一個物件來初始化[內部 state](/docs/state-and-lifecycle.html)。
* 為[event handler](/docs/handling-events.html) 方法綁定實例。

請**不要在 `constructor()` 中呼叫`setState()`**。如果你的 component 需要使用內部 state，請在 constructor 中**將其最初的 state 指定為 `this.state`**：

```js
constructor(props) {
  super(props);
  // 不要在這裏呼叫 this.setState()！
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Constructor 是唯一一個你應該直接指定 `this.state` 的地方。在所有其他的方法中，你則需要使用 `this.setState()`。

請避免在 constructor 中產生任何副作用或 subscription。如果你需要它們的話，請使用 `componentDidMount()`。

>注意：
>
>**請避免複製 prop 在 state 之中！這是一個很常見的錯誤：**
>
>```js
>constructor(props) {
>  super(props);
>  // 請不要這樣做！
>  this.state = { color: props.color };
>}
>```
>
>這樣做的問題是：一來這毫無必要（你可以直接用 `this.props.color`），二來這會產生 bug（任何改變對 `color` prop 所產生的更新都不會出現在 state 中）。
>
>**請在只有在你刻意要忽略 prop 更新的情況下才使用這個模式。** 在這種情況下，比較合理的做法是將 prop 重新命名為 `initialColor` 或 `defaultColor`。如此一來，你可以在必要的情況下透過[修改一個 component 的 `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 來強迫它「重置」其初始的 state。
>
>若想知道如何處理 state 依賴 prop 的情況，請參考我們 [關於避免 derived state 的部落格文章](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

在一個 component 被 mounted（加入 DOM tree 中）後，`componentDidMount()` 會馬上被呼叫。需要 DOM node 的初始化應該寫在這個方法裡面。如果你需要從遠端終端點（remote endpoint）請求資料的話, 此處非常適合進行實例化網路請求（network request）。

這個方法適合設立任何 subscription。設立完 subscription 後，別忘了在 `componentWillUnmount()` 內取消 subscription。

你 **可以馬上在 `componentDidMount()` 內呼叫 `setState()`。** 這會觸發一次額外的 render，但這會在瀏覽器更新螢幕之前發生。在這個情況下，即使 `render()` 被呼叫兩次，這確保使用者不會看見這兩次 render 中過渡時期的 state。請謹慎使用這個模式，因為這經常會導致效能問題。在大多數情況下，你應該能夠在  `constructor()` 內指定初始 state 的值。不過，在某些情況下，像是在使用 modal 和 tooltip 的時候，你所 render 的 component 若是依賴某個 DOM node 的大小或位置時，這種模式有時候可能是有必要的。

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` 會在更新後馬上被呼叫。這個方法並不會在初次 render 時被呼叫。

在 component 更新之後，可以在此處對 DOM 進行運作。此處也適合做網路請求，如果你有比較目前的 prop 和之前的 prop 的話（如果 prop 沒有改變的話，網路請求可能並非必要）。

```js
componentDidUpdate(prevProps) {
  // 常見用法（別忘了比較 prop）：
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

你 **可以馬上在 `componentDidUpdate()` 內呼叫 `setState()`**，但注意這必須要被包圍在一個類似上述範例的條件語句內，否則你會進入一個無限迴圈。這也會導致額外的重新 render。雖然使用者看不見，但這可能會影響 component 的效能。如果你想試著將某些 state 複製到由上往下傳的 prop 的話，請考慮直接使用 prop。請參考[為何複製 prop 到 state 中會產生 bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

如果你的 component 裡面有 `getSnapshotBeforeUpdate()` 這個很少見的生命週期方法，其回傳的值將會被當作第三個 「snapshot」 參數傳給 `componentDidUpdate()`。否則這個參數會是 undefined。

> 注意：
>
> 如果 [`shouldComponentUpdate()`](#shouldcomponentupdate) 回傳的值為 false 的話，`componentDidUpdate()` 將不會被呼叫。

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` 會在ㄧ個 component 被 unmount 和摧毀後馬上被呼叫。你可以在這個方法內進行任何清理，像是取消計時器和網路請求或是移除任何在 `componentDidMount()` 內建立的  subscription。

你 **不應該在 `componentDidUpdate()` 內呼叫 `setState()`**，因為這個 component 永遠不會在重新 render。當一個 component 實例被 unmount 後，它就永遠不會再被 mount。

* * *

### 不常使用的生命週期方法 {#rarely-used-lifecycle-methods}

這個章節內介紹的方法是在那些不常見的情況中使用的。它們有時很方便，但是你大多數的 component 大概不會需要使用它們。**你可以在這個[生命週期表](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)上方點選「顯示不常使用的生命週期方法」，並看到以下所介紹的方法。**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

你可以使用 `shouldComponentUpdate()` 來讓 React 知道一個 component 的 output 並不會被目前在 state 或 prop 內的改變所影響。React 的預設行為是每當 state 有所改變時就重新 render。在絕大多數的情況下，你應該依賴這個預設行為。

`shouldComponentUpdate()` 會在新的 prop 或 state 被接收之後並在該 component 被 render 之前被呼叫。其預設值是 `true`。這個方法並不會 component 初次 render 時或使用 `forceUpdate()` 時被呼叫。

這個方法的存在著要是為了 **[效能優化](/docs/optimizing-performance.html)**。請不要依賴這個方法來「避免」 render，因為這很有可能會導致 bug。**請考慮使用 React 內建的 [`PureComponent`](/docs/react-api.html#reactpurecomponent)** 並避免手寫 `shouldComponentUpdate()`。`PureComponent` 會為 prop 和 state 做一個淺層比較（Shallow comparison）並減低你錯過必要更新的機會。

如果你很確定你想要手寫這個方法的話，你可以將 `this.props` 和 `nextProps` 以及 `this.state` 和 `nextState` 做比較並回傳 `false` 以告知 React 這次的更新可以被略過。 請注意，回傳 `false` 並不會避免 child component 在*它們的* state 改變時重新 render。

我們並不建議你做深度比較（deep equality check）或在 `shouldComponentUpdate()` 內使用 `JSON.stringify()`。它們效率不佳且會造成效能問題。

目前，如果 `shouldComponentUpdate()` 回傳 `false` 的話，[`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)、[`render()`](#render) 和 [`componentDidUpdate()`](#componentdidupdate) 都不會被呼叫。在未來，React 可能會把 `shouldComponentUpdate()` 當作一個提示而非一個嚴格指令，而回傳 `false` 可能還是會造成 component 重新 render。

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` 會在一個 component 被 render 前被呼叫，不管是在首次 mount 時或後續的更新時。它應該回傳一個 object 以更新 state，或回傳 null 以表示不需要更新任何 state。

這個方法是為了某些[很少見的例子](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)而存在的，像是有時 state 會依賴 prop 在一段時間過後所產生的改變。例如，也許建立一個 `<Transition>` component 是很方便的，我們可以用它來比較其之前與之後的 children，並決定我們要 animate in and out 哪一個 child。

繼承 state 會導致冗長的程式碼並使你的 component 很難理解。[請確認你知道這些較為簡單的替代方案](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

* 如果你需要在某個 prop 改變時產生相對應的**副作用**（例如，資料提取或使用動畫），請使用 [`componentDidUpdate`](#componentdidupdate)。

* 如果你想要 **在某個 prop 改變時重新計算某些資料**，[請使用 memoization helper](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。

* 如果你想要 **在某個 prop 改變時「重置」某個 state**，請考慮建立一個[完全被控制](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 的 component 或[帶有 `key` 的完全被控制](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) component。

這個方法無法觸及一個 component 的實例。如果你想要這麼做的話，你可以把一個 component 的 prop 和 state 提取出來變成 pure funtion，並寫在該 class definition 之外，並透過這樣的方式在 `getDerivedStateFromProps()` 和其他 class 方法之間重複使用某些程式碼。

請注意這個方法在*每一次* render 時都會被觸發，不論原因為何。這和 `UNSAFE_componentWillReceiveProps` 有所不同，這個方法只有在 parent 導致重新 render 時被觸發，而非在本地的 `setState` 導致重新 render 時被觸發。

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` 會在最近一次 render 的 output 被提交給 DOM 時被呼叫。它讓你在 DOM 改變之前先從其中抓取一些資訊（例如滾動軸的位置）。這個生命週期方法回傳的值會被當作一個參數傳遞給 `componentDidUpdate()`。

這個方法並不常見，但它可能會在像是對話串這類需要以某種特殊方始處理滾動軸位置的 UI 中出現。

一個快照（snapshot）的值（或 `null`）應該被回傳。

例如：

`embed:react-component-reference/get-snapshot-before-update.js`

在上面這個例子中，讀取 `getSnapshotBeforeUpdate` 內的 `scrollHeight` property 是很重要的，因為「render」階段的生命週期方法（如 `render`）和「提交」階段的生命週期方法（像是 `getSnapshotBeforeUpdate` 和 `componentDidUpdate`）兩者之間可能會有一些延遲。

* * *

### 錯誤邊界 {#error-boundaries}

[錯誤邊界](/docs/error-boundaries.html) 是用於截取 child component tree 中 JavaScript 錯誤、紀錄錯誤、並展示一個備用 UI 而非故障的 component tree 的一群 React component。錯誤邊界會在 render 期間、生命週期方法、以及其下整個 tree 群組所有的 constructor 內截取錯誤。

一個 class component 會變成錯誤邊界，如果其定義了 `static getDerivedStateFromError()` 和 `componentDidCatch()` 兩種或其中之一的生命週期方法。 從這些生命週期方法中更新 state 讓你截取在其下的 tree 內未被處理的 JavaScript 錯誤，並展示一個備用 UI。

請只在從意料之外的異常中使用錯誤邊界。**請不要用它來控制流程。**

想了解更多，請參考[*React 16 中的錯誤邊界*](/blog/2017/07/26/error-handling-in-react-16.html)一文。

> 注意：
> 
> 錯誤邊界只會截取在 tree 中、自身**以下**的 component 中的錯誤。錯誤邊界無法截取自身內的錯誤。

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

這個生命週期方法會在某個錯誤被一個 descendant component 提出後被呼叫。
它會接收該錯誤為其參數並回傳一個值以更新 state。

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state，如此下次 render 時 React 才能展示備用 UI
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // 你可以展示任何備用 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 注意：
>
> `getDerivedStateFromError()` 會在「render」期間被呼叫，所以副作用是不被允許的。
如果你想要使用副作用的話，請使用 `componentDidCatch()`。

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

這個生命週期方法會在某個錯誤被一個 descendant component 提出後被呼叫。
它接受兩個參數：

1. `error` - 被提出的錯誤。
2. `info` - 一個有 `componentStack` key 的 object，這個 key 內含有[哪一個 component 提出錯誤的資訊](/docs/error-boundaries.html#component-stack-traces)。


`componentDidCatch()` 會在「提交」期間被呼叫，所以副作用是被允許的。
這個方法應該被用來做類似紀錄錯誤這類的事情：

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state，如此下次 render 時 React 才能展示備用 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // ComponentStack 的範例：
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 你可以展示任何備用 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 注意：
> 
> 在有錯誤的情況下，你可以透過呼叫 `setState` 來展示一個含有 `componentDidCatch()` 的 備用 UI，但這個方法會在未來的發佈中被棄用。
> 請使用 `static getDerivedStateFromError()` 來處理備用 render。

* * *

### 過時的生命週期方法 {#legacy-lifecycle-methods}

以下介紹的幾個生命週期方法是「過時」的。它們仍然能運作，但我們並不建議你在新的程式碼內使用這些方法。你可以[在這篇文章中](/blog/2018/03/27/update-on-async-rendering.html)了解如何從過時的方法遷移至我們建議的方法。

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> 注意：
>
> 這個生命週期方法先前的命名是 `componentWillMount`。這個命名直到第 17 版仍然能繼續運作。請使用[`重新命名不安全的生命週期方法` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 來自動更新你的 component。

`UNSAFE_componentWillMount()` 會在 mounting 發生前被呼叫。它會在 `render()` 前被呼叫，因此在這個方法內同步呼叫 `setState()` 並不會觸發額外的 render。不過，一般情況來說，我們建議你使用 `constructor()` 來初始化 state。

請避免在這個方法中帶入任何的副作用或 subscription。如果你需要那樣做的話，請使用 `componentDidMount()`。

這是唯一一個在伺服器端 render 時被呼叫的生命週期方法。

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> 注意：
>
> 這個生命週期方法先前的命名是 `componentWillReceiveProps`。這個命名直到第 17 版仍然能繼續運作。請使用[`重新命名不安全的生命週期方法` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 來自動更新你的 component。

> 注意：
>
> 這個生命週期方法常常會導致 bug 和程式碼的不一致。
>
> * 如果你需要在某個 prop 改變時 **執行一個相對應的副作用** （例如資料提取或使用動畫），請使用[`componentDidUpdate`](#componentdidupdate) 這個生命週期方法。
> * 如果你想要 **只在某個 prop 改變時重新計算某些資料**，[請使用 memoization helper](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。
> * 如果你想要 **在某個 prop 改變時「重置」某個 state**，請考慮建立一個[完全被控制](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 的 component 或[帶有 `key` 的完全被控制](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) component。
>
> 針對以上這些用例，請[遵照這篇文章內推薦的方法來處理繼承的 state](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

`UNSAFE_componentWillReceiveProps()` 會在一個被 mount 的 component 接收新的 prop 前被呼叫。如果你需要在某個 prop 改變時更新 state 的話（例如，重置 state），你可以在這個生命週期方法裡面比較 `this.props` 和`nextProps`，並使用 `this.setState()` 進行 state 的轉移。

請注意如果一個 parent component 導致你的 component 重新 render 的話，即使 prop 沒有改變，這個方法仍然會被呼叫。如果你不想要有這些改變的話，請確認你有比較目前和之後的 prop 的值。

React 並不會在初次 [mounting](#mounting) 時使用初始化的 propr 來呼叫 `UNSAFE_componentWillReceiveProps()`。它只會在 component 某些 prop 可能會更新時呼叫這個方法。一般來說，呼叫 `this.setState()` 並不會觸發 `UNSAFE_componentWillReceiveProps()`。

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> 注意：
>
> 這個生命週期方法先前的命名是 `componentWillUpdate`。這個命名直到第 17 版仍然能繼續運作。請使用[`重新命名不安全的生命週期方法` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 來自動更新你的 component。

`UNSAFE_componentWillUpdate()` 會在 render 發生之前、當新的 prop 或 state 正在被接收時被呼叫。請將這個方法作為更新發生之前做準備的一個機會。這個方法並不會在初次 render 時被呼叫。

請注意你不能在這裡呼叫 `this.setState()`，你也不應該在這裡進行其他任何在 `UNSAFE_componentWillUpdate()` 回傳之前會觸發 React component 更新的行為（例如 dispatch 一個 Redux action）。

通常，這個方法可以被 `componentDidUpdate()` 取代。如果你在這個方法內從 DOM 中讀取資料（例如儲存滾動軸的位置），你可以將那部分的邏輯移到 `getSnapshotBeforeUpdate()` 裡面。

> 注意：
>
> 如果 [`shouldComponentUpdate()`](#shouldcomponentupdate) 回傳 false 的話，`UNSAFE_componentWillUpdate()` 將不會被呼叫。

* * *

## 其他的 API {#other-apis-1}

和上述那些由 React 替你呼叫的生命週期方法不同，以下介紹的方法是*你*可以從你的 component 呼叫的。

只有兩個方法： `setState()` 和 `forceUpdate()`。

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` 會將改變排進一個 queue 中，並告知 React 這個 component 以及它的 children 需要用更新後的 state 重新 render。這是你會在事件處理和伺服器回應用來更新使用者介面最主要的方法。

請把 `setState()` 想成一個*請求*而非一個馬上對 component 進行更新的指令。為了達到更好的效能，React 也許會延遲這個請求，然後一次更新數個 component。React 並不保證 state 的改變會馬上發生。

`setState()` 並不會總是馬上更新 component。它有可能會將更新分批處理更新或延遲到稍後才更新。這使得在呼叫 `setState()` 後讀取 `this.state` 成為一個潛在的問題。因此請不要這麼做。相反的，請使用 `componentDidUpdate` 或一個 `setState` callback（`setState(updater, callback)`）。不論你使用哪一個，React 都保證它會在更新後被觸發。如果你需要基於先前的 state 來設定 state 的話，請閱讀以下關於 `updater` 的參數。

除非 `shouldComponentUpdate()` 回傳 `false`，`setState()` 一定會導致重新 render。如果你有使用 mutable object，或者你無法在 `shouldComponentUpdate()` 裡面建立條件式 render 的邏輯的話，只在新的 state 和先前的 state 不同時呼叫 `setState()` 將會避免不必要的重新 render。

這個方法的第一個參數是一個帶有如下的 signature 的 `updater` function：

```javascript
(state, props) => stateChange
```

`state` 是當某個改變正在被應用時對 component state 的一個參考（reference）。它不應該直接被 mutate。相反的，任何改變都應該用一個基於 `state` 和 `props` 的 input 所建立的新的 object 來表示。例如，假設我們想要使用 `props.step` 來增加 state 中的某個值的話：

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

被 updater function 所接受的 `state` 和 `props` 兩者都保證一定會被更新到最新的狀態。Updater 的 output 會被和 `state` 淺層合併。

`setState()` 的第二個參數是一個非必要、選擇性的 callback function。它會在 `setState` 完成且 component 被重新 render 後被執行。一般來說如果你要使用這樣的邏輯的話，我們比較推薦你使用 `componentDidUpdate()`。

你可以選擇將一個 object（而非 function）作為第一個參數傳給 `setState()`：

```javascript
setState(stateChange[, callback])
```

這會將 `stateChange` 淺層合併至新的 state 中。舉個例子，假設你想調整購物車中物品的數量：

```javascript
this.setState({quantity: 2})
```

這種形式的 `setState()` 也是同步的，而同樣一個週期中的多次呼叫有可能會被結合成一批做處理。例如，假設你想在同一個週期中增加某個物品的數量超過一次的話，這樣做的結果會和以下程式碼相同：

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

在同一個週期中，後續的呼叫會覆蓋之前的呼叫所產生的值，所以物品的數量只會被增加一次。如果下個 state 是根據目前的 state 而決定的話，我們比較建議你用 updater function 來更新 state：

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

想了解更多細節，請參考：

* [State 和生命週期指南](/docs/state-and-lifecycle.html)
* [深入解析： 為什麼 `setState()` 的呼叫會分批處理？什麼時候會如此？](https://stackoverflow.com/a/48610973/458193)
* [深入解析： 為什麼 `this.state` 不會馬上被更新？](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

當你的 component 的 state 或 prop 改變的時候，你的 component 的預設行為是會重新 render。如果你的 `render()` 方法還需要其他資料的話，你可以藉由呼叫 `forceUpdate()` 來告訴 React 這個 component 需要重新 render。

呼叫 `forceUpdate()` 會導致  `render()` 被呼叫於該 component 並跳過 `shouldComponentUpdate()`。這會觸發 children component 正常的生命週期方法，包含每個 child 的 `shouldComponentUpdate()` 方法。React 依然只會在標示（markup）改變時更新 DOM。

正常情況來說你應該避免使用 `forceUpdate()` 並只從 `render()` 中的 `this.props` 和 `this.state` 讀取。

* * *

## Class 屬性 {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` 可以在一個 component class 自身被定義為一個屬性，它被用來設定該 class 的預設 propr。它是為了 undefined（而非 null） 的 prop 使用的。例如：

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

如果 `props.color` 的值沒有被提供的話，它會被預設為 `'blue'`：

```js
  render() {
    return <CustomButton /> ; // props.color 被預設為 `'blue'`
  }
```

如果 `props.color` 的值被設為 null，其值會繼續為 null：

```js
  render() {
    return <CustomButton color={null} /> ; // props.color 繼續為 null
  }
```

* * *

### `displayName` {#displayname}

`displayName` string 是用來 debug 的。通常，你不需要明確的設定這個屬性，因為它可以根據定義該 component 的 function 或 class 的名稱推斷這個值為何。當你為了 debug 或建立一個 higher-order component 而需要展示一個不同的名字時，你可能會想要明確的設定這個值，請參考[如何包覆 Display Name 並輕鬆 debug](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)。

* * *

## 實例屬性 {#instance-properties-1}

### `props` {#props}

`this.props` 包含了該 component 的呼叫者所定義的 prop。想了解 prop 的基礎概念，請參考 [Components and Props](/docs/components-and-props.html) 一文。

值得注意的是，`this.props.children` 是一個特別的 prop，通常在 JSX 表達式內的 child tag 內所定義，而不是其自身的 tag。

### `state` {#state}

State 包含了某個 component 內特定的、會隨時間改變的資料，。這個 state 是由使用者定義的。它應是一個簡單的 JavaScript object。

如果某個值並沒有在 render 或資料流中被使用（例如計時器的 ID），你不需要將它放在 state 內。這類的值可以在 component 實例上被定義為 field。

想更了解 state 如何運作，請參考 [State 和生命週期](/docs/state-and-lifecycle.html)。

請永遠不要直接 mutate `this.state`，因為後續的 `setState()` 會替換掉你的 mutation。請將 `this.state` 視為不可變的。
