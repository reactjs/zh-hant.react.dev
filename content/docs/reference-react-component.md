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

當一個 component 在 render 的過程、生命週期、或在某個子 component 的 constructor 中發生錯誤時，這些方法會被呼叫：

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

當 render 被呼叫時，它將會檢視 `this.props` 和 `this.state` 中的變化，並返回以下類別之一：

- **React elements。** 通常是透過 [JSX](/docs/introducing-jsx.html) 創立的。例如，`<div />`和`<MyComponent />`這兩個 React element 會告訴 React 要 render 一個 DOM node 和一個使用者定義的 component。
- **Arrays and fragments。** 它們會從 render 中返回數個 element。細節請參考[fragments](/docs/fragments.html)。
- **Portals**。它們讓你將 children render 到不同的 DOM 子樹中。細節請參考[portals](/docs/portals.html)。
- **String and numbers。** 這些在 DOM 中將會被 render 為文本 node。
- **Booleans or `null`**。什麼都不 render。（此類型主要是支援 `返回 test && <Child />` 的模式，這裡的 `test` 是一個 boolean 值）。

`render()` function 應為純函數（pure function），這表示：它並不會改變 component 的 state，它在每次呼叫時都會返回同樣的結果，它並不會直接和瀏覽器有所互動。

如果你需要和瀏覽器互動，請在 `componentDidMount()` 或其他的生命週期方法內運行你的程序。將 `render()` 維持在純函式的狀態有助於你對 component 的理解。

> 注意：
>
> 若  [`shouldComponentUpdate()`](#shouldcomponentupdate) 返回的值為 `false` 的話，`render()`將不會被呼叫。

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

你 **可以馬上在 `componentDidMount()` 內呼叫 `setState()`。** 這會觸發一次額外的 render，但這會在瀏覽器更新螢幕之前發生。在這個情況下，即使 `render()` 被呼叫兩次，這確保使用者不會看見這兩次 render 中過渡時期的 state。請謹慎使用這個模式，因為這經常會導致性能問題。在大多數情況下，你應該能夠在  `constructor()` 內指定初始 state 的值。不過，在某些情況下，像是在使用 modal 和 tooltip 的時候，你所 render 的 component 若是依賴某個 DOM node 的大小或位置時，這種模式有時候可能是有必要的。

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

你 **可以馬上在 `componentDidUpdate()` 內呼叫 `setState()`**，但注意這必須要被包圍在一個類似上述範例的條件語句內，否則你會進入一個無限迴圈。這也會導致額外的重新 render。雖然使用者看不見，但這可能會影響 component 的性能。如果你想試著將某些 state 複製到由上往下傳的 prop 的話，請考慮直接使用 prop。請參考[為何複製 prop 到 state 中會產生 bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

如果你的 component 裡面有 `getSnapshotBeforeUpdate()` 這個很少見的生命週期方法，其返回的值將會被當作第三個 「snapshot」 參數傳給 `componentDidUpdate()`。否則這個參數會是 undefined。

> 注意：
>
> 如果 [`shouldComponentUpdate()`](#shouldcomponentupdate) 返回的值為 false 的話，`componentDidUpdate()` 將不會被呼叫。

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` 會在ㄧ個 component 被 unmount 和摧毀後馬上被呼叫。你可以在這個方法內進行任何清理，像是取消 timer 和網路請求或是移除任何在 `componentDidMount()` 內建立的  subscription。

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

這個方法的存在著要是為了 **[性能優化](/docs/optimizing-performance.html)**。請不要依賴這個方法來「避免」 render，因為這很有可能會導致 bug。**請考慮使用 React 內建的 [`PureComponent`](/docs/react-api.html#reactpurecomponent)** 並避免手寫 `shouldComponentUpdate()`。`PureComponent` 會為 prop 和 state 做一個淺層比較（Shallow comparison）並減低你錯過必要更新的機會。

如果你很確定你想要手寫這個方法的話，你可以將 `this.props` 和 `nextProps` 以及 `this.state` 和 `nextState` 做比較並返回 `false` 以告知 React 這次的更新可以被略過。 請注意，返回 `false` 並不會避免子 component 在*它們的* state 改變時重新 render。

我們並不建議你做深度比較（deep equality check）或在 `shouldComponentUpdate()` 內使用 `JSON.stringify()`。它們效率不佳且會造成性能問題。

目前，如果 `shouldComponentUpdate()` 返回 `false` 的話，[`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)、[`render()`](#render) 和 [`componentDidUpdate()`](#componentdidupdate) 都不會被呼叫。在未來，React 可能會把 `shouldComponentUpdate()` 當作一個提示而非一個嚴格指令，而返回 `false` 可能還是會造成 component 重新 render。

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` 會在一個 component 被 render 前被呼叫，不管是在首次 mount 時或後續的更新時。它應該返回一個 object 以更新 state，或返回 null 以表示不需要更新任何 state。

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

`getSnapshotBeforeUpdate()` 會在最近一次 render 的 output 被提交給 DOM 時被呼叫。它讓你在 DOM 改變之前先從其中抓取一些資訊（例如滾動軸的位置）。這個生命週期方法返回的值會被當作一個參數傳遞給 `componentDidUpdate()`。

這個方法並不常見，但它可能會在像是對話串這類需要以某種特殊方始處理滾動軸位置的 UI 中出現。

一個快照（snapshot）的值（或 `null`）應該被返回。

例如：

`embed:react-component-reference/get-snapshot-before-update.js`

在上面這個例子中，讀取 `getSnapshotBeforeUpdate` 內的 `scrollHeight` property 是很重要的，因為「render」階段的生命週期方法（如 `render`）和「提交」階段的生命週期方法（像是 `getSnapshotBeforeUpdate` 和 `componentDidUpdate`）兩者之間可能會有一些延遲。

* * *

### 錯誤邊界 {#error-boundaries}

[錯誤邊界](/docs/error-boundaries.html) 是用於截取子 component tree 中 JavaScript 錯誤、紀錄錯誤、並展示一個備用 UI 而非故障的 component tree 的一群 React component。錯誤邊界會在 render 期間、生命週期方法、以及其下整個 tree 群組所有的 constructor 內截取錯誤。

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
它會接收該錯誤為其參數並返回一個值以更新 state。

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


`componentDidCatch()` 會在「提交」期間被呼叫，所以副作用是允許的。
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

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

Typically, this method can be replaced by `componentDidUpdate()`. If you were reading from the DOM in this method (e.g. to save a scroll position), you can move that logic to `getSnapshotBeforeUpdate()`.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
