---
id: glossary
title: React 術語表
layout: docs
category: Reference
permalink: docs/glossary.html

---

## 單頁應用程式 {#single-page-application}

單頁應用程式會載入一個 HTML 頁面和其他所需要的資源（例如 JavaScript 和 CSS），之後在頁面或後續頁面上的互動都不需要往返伺服器，這表示該頁面不會被重新載入。

縱使你可以用 React 來建立單頁應用程式，但這不是必需的。React 也可以被用在現有網站的一小部分以增強交互性。用 React 編寫的代碼可以與伺服器 render (例如 PHP) 的 markup 或其他客戶端 library 完美兼容。事實上，React 在 Facebook 中也是這樣使用的。

## ES6，ES2015，ES2016，等 {#es6-es2015-es2016-etc}

這些縮略詞都是指最新版本的 ECMAScript 語言規範標準，而 JavaScript 語言就是它們的一個實現。ES6 版本（也被稱為 ES2015）包含了許多新特性，例如：arrow function，class，樣板字面值，`let` 與 `const` 變數聲明。你可以在[這裏](https://en.wikipedia.org/wiki/ECMAScript#Versions)了解更多版本的新特性。

## 編譯器 {#compilers}

JavaScript 編譯器接受 JavaScript 代碼，對其進行轉換並返回不同的格式的 JavaScript 代碼。最常見的使用例子是把 ES6 語法轉換為一些舊瀏覽器能夠辨識的語法。[Babel](https://babeljs.io/) 是 React 上最常用的編譯器。

## 打包工具 {#bundlers}

打包工具將多個獨立的 JavaScript 及 CSS 模組（通常有數百個）組合成數個文件，針對瀏覽器作出優化。在 React 應用程式常用的打包工具包括 [Webpack](https://webpack.js.org/) 和 [Browserify](http://browserify.org/)。

## 套件管理工具 {#package-managers}

套件管理工具是用來管理項目的 dependency。[npm](https://www.npmjs.com/) 和 [Yarn](https://yarnpkg.com/) 都是在 React 上常用的套件管理工具。它們都是使用相同 npm 套件注冊表的客戶端。

## CDN {#cdn}

CDN 即是 內容傳遞網路。CDN 從全球各地的伺服器提供靜態內容的緩存。

## JSX {#jsx}

JSX 是一種 JavaScript 語法的擴展。它跟模板語言類似，但具有 JavaScript 的全部功能。JSX 會被編譯為 `React.createElement()`，然後返回被稱為 React element 的 JavaScript object。JSX 的基本簡介可以參見[這裏](/docs/introducing-jsx.html)，更深入的教程可以參見[這裏](/docs/jsx-in-depth.html)。

React DOM 使用 camelCase 來命名 HTML 屬性名稱。例如，`tabindex` 在 JSX 中寫作 `tabIndex`。而 `class` 因為是 JavaScript 中的保留字，所以寫作 `className`：

```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
```  

## [Elements](/docs/rendering-elements.html) {#elements}

React element 是 React 應用程式的建構模塊。有人可能會將 element 跟更廣為人知的 component 概念混淆。element 描述你在屏幕上看到甚麼。React element 是不可變的。

```js
const element = <h1>Hello, world</h1>;
```

通常 element 不會被直接使用，而是在 component 中被返回。

## [Components](/docs/components-and-props.html) {#components}

React component 是一段小，可重複使用的代碼，用來返回一個被 render 在頁面的 React element。最簡單的 React component 是一個普通的 JavaScript function，返回一個 React element。

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Component 也可以是 ES6 class：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Component 可以分解為不同的功能部件，並在其他 component 中使用。Component 可以返回其他 component，array，string 和 number。一個很好的經驗法則是，如果你的 UI 中有一部份被重複使用多次（Button，Panel，Avatar），或自身就足夠複雜（App，FeedStory，Comment），這些都是成為可重複使用 component 的好選擇。Component 的名字必需以大寫字母開始（`<Wrapper/>` **而不是** `<wrapper/>`）。參見[這裏](/docs/components-and-props.html#rendering-a-component)來了解更多 render component 的資料。

### [`props`](/docs/components-and-props.html) {#props}

`props` 是 React component 的輸入。它們是從父 component 傳遞到子 component 的數據。

請記著 `props` 是只讀的。不應該以任何方式來修改它們。

```js
// 錯誤!
props.number = 42;
```

如果你需要修改某些數值來反映用戶輸入或網絡響應，請使用 `state` 來代替。

### `props.children` {#propschildren}

`props.children` 在每個 component 上都可用。它包含 component 開始至完結標記之間的內容。例如：

```js
<Welcome>Hello world!</Welcome>
```

字串 `Hello world!` 在 `Welcome` component 可以在 `props.children` 中獲取。

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

以 class 定義的 component，使用 `this.props.children`：

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

當一個 component 與其相關的數據會隨時間而改變，就需要 `state`。例如，一個 `Checkbox` component 可能需要 `isChecked` 的 state，而 `NewFeed` component 可能希望追蹤 `fetchedPosts` 在它的 state 中。

`state` 和 `props` 最主要的區別是 `props` 是由父 component 傳遞，而 `state` 是由 component 本身管理的。一個 component 不能改變自己的 `props`，但就可以改變自己的 `state`。

對於每個特定變化的數據，應該只有一個 component「擁有」它在 state 中。不要試圖同步兩個不同 component 的 state。反而，把 [state 提升](/docs/lifting-state-up.html)至最接近它們的共同 ancestor，並把它以 props 的形式傳遞至它們兩個。

## [生命週期方法](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

生命週期方法是用來在 component 不同階段來執行自訂功能。以下的事件都有生命週期方法：當 component 被建立和加入在 DOM 裏（[mounting](/docs/react-component.html#mounting)），當 component 更新，以及從 DOM 中 unmount 或移除時。

 ## [Controlled](/docs/forms.html#controlled-components) 與 [Uncontrolled Components](/docs/uncontrolled-components.html)

React 有兩個不同的方案處理表格輸入。

表格輸入 element 的值是由 React 來控制，就被稱為 *controlled component*。當用戶輸入數據到 controlled component，就會觸發一個 event handler，並且用你的代碼決定輸入是否有效（通過重新 render 更新後的數值）。如果你不重新 render，表格 element 將保持不變。

一個 *uncontrolled component* 就像表格 element 一樣在 React 以外工作。當用戶輸入數據到一個表格列（input box，dropdown 等）時，不需要 React 處理任何東西，更新的數據就會被反映出來。但同時這意味著你不能強迫表格列有特定的數值。

在大多數的情況下你應用使用 controlled components。

## [Keys](/docs/lists-and-keys.html) {#keys}

「key」是一個特別的 string attribute ，你需要在建立 element array 時加上。Key 幫助 React 分辨那個 element 被更改，添加，或已移除。Key 應該放在 array element 的內部，使 element 有一個穩定的標記。

Key 只需要在同一個 array 的 sibling element 中是唯一的。它們不需要在整個應用程式或個別 component 中是唯一。

不要將類似 `Math.random()` 的值賦予給 key。Key 有一個誇重新 render 都「隱定的標記」是很重要的，這樣 React 才可以確定項目何時被添加，移除，或重新排序。在理想情況下，key 應該對應來自至於數據唯一而穩定的標記，例如 `post.id`。

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React 支持一個可以附加到任何 component 的特殊 attribute。Ref attribute 可以是由 [`React.createRef()` function](/docs/react-api.html#reactcreateref) 返回的 object，或一個 callback function，或一個 string (在舊有 API 中)。當 `ref` attribute 是 callback function 時，該 function 接受底層的 DOM element 或 class instance（視乎 element 的類別）作為參數。這使你可以直接訪問 DOM element 或 component instance。

不要過度使用 ref。假若你發現你在應用程式中經常使用 ref 來「實現某些事情」，請考慮對 [由上而下的數據流](/docs/lifting-state-up.html) 更熟悉。

## [Events](/docs/handling-events.html) {#events}

在 React element 中處理 event 有一些語法上的不同：

* React 的 event handler 以 camelCase 來名命，而不是小寫。
* 在 JSX 你需要傳入一個 function 到 event handler，而不是一個 string。

## [Reconciliation](/docs/reconciliation.html) {#reconciliation}

當一個 component 的 props 或 stats 改變時，React 通過比較新返回的 element 和之前 render 的來決定是否需要實際的 DOM 更新。當它們不相等時，React 將更新 DOM。這個過程被稱為「reconciliation」。
