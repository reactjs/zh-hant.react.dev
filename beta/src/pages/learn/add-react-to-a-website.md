---
title: 將 React 加入到網頁
---

<Intro>

React 從一開始就被設計成逐步採用的方式，你可以根據你的需求使用部分或是大量的 React。無論你是用 micro-frontend 開發，或是現有的系統，或只是想要嘗試 React，你可以透過幾行程式碼將 React component 加入你的 HTML 頁面 - 而且不需要構建工具！

</Intro>

## 一分鐘內加入 React {/*add-react-in-one-minute*/}

你可以在一分鐘內加入一個 React component 到你現有的 HTML 頁面。用你的網站或者是[一個空白的 HTML 檔案](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip) - 你所需的是一個網路連線和一個像是 Notepad 的文字編輯器（或是 VSCode - 請查看[如何設定](/learn/editor-setup/)指南）！

### 第一步：加入一個 Element 到 HTML {/*step-1-add-an-element-to-the-html*/}

在你想要編輯的 HTML 頁面，加入一個 HTML element 像是一個空 `<div>` 標籤和一個唯一的 `id` 來標記你想使用 React 顯示的地方。

你可以在 `<body>` 標籤內的任何地方放置一個像是 `<div>` 的「container」element。React 將替換 HTML element 中的任何現有內容，因此它們通常是空的。你可以根據需求在一個頁面上有任意多個這些 HTML element。

```html {3}
<!-- ... existing HTML ... -->

<div id="component-goes-here"></div>

<!-- ... existing HTML ... -->
```

### 第二步：加入 Script 標籤 {/*step-2-add-the-script-tags*/}

在 HTML 頁面的 `</body>` 標籤結束之前，為以下檔案加入三個 `<script>` 標籤：

<<<<<<< HEAD
- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) 載入 React 的核心
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) 讓 React render HTML element 到 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)。
- **like_button.js** 是你在第三步將要撰寫 component 的地方！
=======
- [**react.development.js**](https://unpkg.com/react@18/umd/react.development.js) loads the core of React
- [**react-dom.development.js**](https://unpkg.com/react-dom@18/umd/react-dom.development.js) lets React render HTML elements to the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **like_button.js** is where you'll write your component in step 3!
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

<Gotcha>

當部署時，替換「development.js」為「production.min.js」。

</Gotcha>

```html
  <!-- end of the page -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### 第三步：建立一個 React Component {/*step-3-create-a-react-component*/}

建立一個 **like_button.js** 的檔案在你接下來的 HTML 頁面，加入這個程式碼片段，並儲存檔案。這個程式碼定義一個名為 `LikeButton` 的 React component。[你可以在我們的指南中學習更多關於建立 component 的資訊。](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### 第四步：把你的 React Component 加入到頁面 {/*step-4-add-your-react-component-to-the-page*/}

<<<<<<< HEAD
最後，在 **like_button.js** 底部加入兩行。這兩行程式碼找到你在第一步中加入 HTML 到 `<div>`，然後在其中顯示「Like」按鈕的 React component。
=======
Lastly, add three lines to the bottom of **like_button.js**. These three lines of code find the `<div>` you added to your HTML in the first step, create a React app with it, and then display the "Like" button React component inside of it.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

```js
const domContainer = document.getElementById('component-goes-here');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton));
```

**恭喜你/妳！你剛剛在你的網站上 render 了你的第一個 React component！**

- [瀏覽完整範例的原始碼](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [下載完整範例（2KB zipped）](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### 你可以重複使用 Component！ {/*you-can-reuse-components*/}

<<<<<<< HEAD
你可能想要在同一個 HTML 頁面的多個地方顯示一個 React component。當頁面中由 React 驅動的部分彼此隔離時，這是最有用的。你可以透過多次呼叫 `ReactDOM.render()` 和多個 container element 來做到這一點。
=======
You might want to display a React component in multiple places on the same HTML page. This is most useful while React-powered parts of the page are isolated from each other. You can do this by calling `ReactDOM.createRoot()` multiple times with multiple container elements.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

1. 在 **index.html** 中，加入一個額外的 `<div id="component-goes-here-too"></div>` container element。
2. 在 **like_button.js** 中，為新的 container element 加入一個額外的 `ReactDOM.render()`：

```js {6,7,8,9}
const root1 = ReactDOM.createRoot(
  document.getElementById('component-goes-here')
);
root1.render(React.createElement(LikeButton));

const root2 = ReactDOM.createRoot(
  document.getElementById('component-goes-here-too')
);
root2.render(React.createElement(LikeButton));
```

請查看[一個顯示了三次「Like」按鈕並向它傳送了一些資料的範例](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)！

### 第五步：為線上環境壓縮 JavaScript {/*step-5-minify-javascript-for-production*/}

壓縮的 JavaScript 會顯著降低使用者載入頁面的時間。在部署你的網站到 production 之前，將 scripts 進行壓縮是個好主意。

- **如果你沒有為 script 設定壓縮步驟**，[這裡有設定方式](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)。
- **如果你已經將你的應用程式 script 進行 minify**，如果你確保部署的 HTML 是載入 `production.min.js` 結尾的 React 版本，你的網站將是 proudction-ready 的，像是如下：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## 嘗試 React 與 JSX {/*try-react-with-jsx*/}

上面的範例是依賴瀏覽器原生支援的功能。這就是為什麼 **like_button.js** 使用 JavaScript function 呼叫來告訴 React 要顯示什麼：

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

然而，React 也提供了使用 [JSX](/learn/writing-markup-with-jsx) 的選項，一種類似 HTML 的 JavaScript 語法來替代：

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

這兩個程式碼片段是等效的。JSX 是在 JavaScript 中描述 markup 的流行語法。許多人發現它很熟悉並對於撰寫 UI 程式碼非常有幫助 -- 無論是使用 React 或是其他 library。你可能會在其他專案中看到「markup 散佈在你的 JavaScript 之中」。

> 你可以使用[這個線上轉換器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3)來體驗將 HTML markup 轉換成 JSX。

### 嘗試 JSX {/*try-jsx*/}

在你的專案中最快速嘗試 JSX 的方式就是將 Babel compiler、React 以及 ReactDOM 加入到你頁面的 `<head>`，像是：

```html {6}
<!-- ... rest of <head> ... -->

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... rest of <body> ... -->
```

現在你可以透過加入 `type="text/babel"` 屬性在任何 `<script>` 中來使用 JSX。例如：

```jsx {1}
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<h1>Hello, world!</h1>);
</script>
```

將 **like_button.js** 轉換為使用 JSX：

1. 在 **like_button.js** 中，

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

替換成:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. 在 **index.html** 中，加入 `type="text/babel"` 到 like 按鈕的 script 標籤：

```html
<script src="like_button.js" type="text/babel"></script>
```

這裡是[一個帶有 JSX 的 HTML 檔案範例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下載體驗嘗試。

這個方法對於學習和建立一個間單的 demo 是沒問題的。然而，它使你的網站變慢以及**不適合於用 production 環境**。當你準備繼續前進時，移除這個新的 `<script>` 標籤以及你所加入的 `type="text/babel"` attribute。相反的，在下個章節你將會設定一個 JSX 預處理器來自動轉換你所有的 `<script>` 標籤。

### 加入 JSX 到專案內 {/*add-jsx-to-a-project*/}

加入 JSX 到一個專案不需要像是 [bundler](/learn/start-a-new-react-project#custom-toolchains) 的複雜工具或是一個開發伺服器。加入一個 JSX 預處理器就像加入一個 CSS 預處理器一樣。

在你的 terminal 進入到你的專案下，並貼上這兩個命令（**請確認你已經安裝 [Node.js](https://nodejs.org/)！**）：

1. `npm init -y` （如果它失敗了，[這裡是修正方式](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)）
2. `npm install babel-cli@6 babel-preset-react-app@3`

你只需要 npm 來安裝 JSX 預處理器。你不需要做其他任何事情。React 和應用程式的程式碼可以保持為 `<script>` 標籤不需要做任何變動。

恭喜你！你剛剛在專案內加入了**production-ready 的 JSX 設定**。

### 執行 JSX 預處理器 {/*run-the-jsx-preprocessor*/}

你可以對 JSX 進行預處理，這樣每次你儲存一個包含 JSX 的檔案時，轉換會重新執行，將 JSX 檔案轉換成新的、普通的 JavaScript 檔案。

1. 建立一個 **src** 的資料夾
2. 在你的 terminal 執行這個命令：`npx babel --watch src --out-dir . --presets react-app/prod `（不需要等待它完成！這個命令啟動一個 JSX 的 automated watcher。）
3. 移動你 JSX 化的 **like_button.js** 到新的 **src** 資料夾（或是建立一個包含此 [JSX 入門程式碼](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js)的 **like_button.js**）

Watcher 將會建立一個預處理的 **like_button.js**，使用適合瀏覽器的普通 JavaSripct 的程式碼。

<Gotcha>

如果你看到一個錯誤訊息：「You have mistakenly installed the `babel` package」，你可能漏掉了[上一步](#add-jsx-to-a-project)。在相同的資料夾執行它，然後再試一次。

</Gotcha>

作為獎勵，這也讓你可以使用現代的 JavaScript 語法功能像是 class，不需要擔心在舊的瀏覽器會壞掉。我們剛才用的工具叫做 Babel，你可以從[它的文件](https://babeljs.io/docs/en/babel-cli/)中了解更多關於它的資訊。

如果你正在適應建構工具並希望它們為你做更多的事情，[我們這裡涵蓋了最流行和最容易接近的工具鏈](/learn/start-a-new-react-project)。

<DeepDive title="React without JSX">

最初引入 JSX 是為了讓使用 React 撰寫 component 的感覺可以像是撰寫 HTML 一樣。從那時候開始，這個語法變已經變得很普遍了。然而，在有些情況下，你可能不想或是不能使用 JSX。你有兩個選擇：

- 使用像 [htm](https://github.com/developit/htm) 作為 JSX 的替代方案，它不使用 compiler — 它使用 JavaScript 原生的 tag template。
- 使用 [`React.createElement()`](/apis/createelement)，它有一個特殊的結構，解釋如下。

使用 JSX，你可以像這樣撰寫 component：

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

使用 `React.createElement()`，你會這樣寫：

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

它接受三個參數：`React.createElement(component, props, children)`。這是它們的工作原理：

1. 一個 **component**，可以是一個字串，代表一個 HTML element 或是一個 function component
2. 一個任何[你想要傳遞的 **props**](/learn/passing-props-to-a-component) 的 object
3. Component 可能有任何的 **children** 的 object，像是 text string

如果你厭倦輸入 `React.createElement()`，一個常見的模式是指定一個 shorthand：

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

如果你使用這個 `React.createElement()` 的 shorthand 形式，在沒有 JSX 的情況下使用 React 幾乎一樣的方便。

</DeepDive>
