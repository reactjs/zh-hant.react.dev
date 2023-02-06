---
title: 將 React 加入到網頁
---

<Intro>

你不必使用 React 構建整個網站。將 React 加入到 HTML 不需要安裝，只需一分鐘，就可以讓你立即開始撰寫互動式的 component。

</Intro>

<YouWillLearn>

* 如何在一分鐘內加入 React 到你的 HTML 頁面
* JSX 語法是什麼以及如何快速嘗試它
* 如何為 production 環境設定 JSX 預處理器

</YouWillLearn>

## 一分鐘內加入 React {/*add-react-in-one-minute*/}

React 從一開始就被設計成逐步採用的方式。大多數網站都沒有（也不需要）完全使用 React 構建。本指南展示如何加入一些“互動性”到現有的 HTML 頁面。

用你的網站或者是[一個空白的 HTML 檔案](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip)。你所需的是網路連線和一個像是 Notepad 或 VSCode 的文字編輯器。（這裡是[如何為你的編輯器設定](/learn/editor-setup/) syntax highlighting！）

### 第一步：加入一個 root HTML 標籤 {/*step-1-add-a-root-html-tag*/}

首先，打開你想要編輯的 HTML 頁面。加入一個空的 `<div>` 標籤來標記你想要讓 React 顯示的點。給予這個 `<div>` 一個唯一的 `id` attribute value。例如：

```html {3}
<!-- ... existing HTML ... -->

<div id="like-button-root"></div>

<!-- ... existing HTML ... -->
```

它被稱為「root」，因為它是 React tree 的起點。你可以在 `<body>` 標籤內的任何位置放置像是這樣的 root HTML 標籤。將其留空，因為 React 會將其內容替換為你的 React component。

你可以根據需求在一個頁面是有多個 root HTML 標籤。

### 第二步：加入 script 標籤 {/*step-2-add-the-script-tags*/}

在 HTML 頁面的 `</body>` 標籤結束之前，為以下檔案加入三個 `<script>` 標籤：

- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) lets you define React components.
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) lets React render HTML elements to the [DOM.](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
- **`like-button.js`** is where you'll write your component in the next step!

你的 HTML 現在看起來應該像這樣：

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Pitfall>

在你部署到線上之前，確保你將 `development.js` 替換為 `production.min.js`！React 的開發版本提供了很多有用的錯誤消息，但會減慢你的網站速度*很多。*

</Pitfall>

### 第三步：建立一個 React component {/*step-3-create-a-react-component*/}

建立一個叫做 **`like-button.js`** 的檔案在你接下來的 HTML 頁面，加入這個程式碼片段，並儲存檔案。這個程式碼定義一個名為 `LikeButton` 的 React component。（在 [Quick Start](/learn) 中了解更多關於撰寫 component 的資訊！）

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

最後，在 **`like-button.js`** 底部加入三行程式碼。這三行程式碼找到你在第一步中加入 HTML 到 `<div>`，建立一個 React root，然後在裡面顯示「Like」按鈕的 React component：

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**恭喜你/妳！你剛剛在你的網站上 render 了你的第一個 React component！**

- [View the full example source code](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [Download the full example (2KB zipped)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)

#### 你可以重複使用 Component！ {/*you-can-reuse-components*/}

你可能想要在同一個 HTML 頁面的多個地方顯示一個 React component。當頁面中由 React 驅動的部分彼此隔離時，這是最有用的。你可以透過多次呼叫 ReactDOM.createRoot() 和多個 container element 來做到這一點。例如：

1. In **`index.html`,** add an additional container element `<div id="another-root"></div>`.
2. In **`like-button.js`,** add three more lines at the end:

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

如果你需要在很多地方渲染同一個組件，你可以為每個 root 分配一個 CSS `class` 而不是 `id`。這是[一個顯示三個「Like」按鈕並向每個按鈕傳遞資料的範例。](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)

### 第五步：為線上環境壓縮 JavaScript {/*step-5-minify-javascript-for-production*/}

壓縮的 JavaScript 會顯著降低使用者載入頁面的時間。在部署你的網站到 production 之前，將 scripts 進行壓縮是個好主意。

- **If you don't have a minification step** for your scripts, [here's one way to set it up.](https://gist.github.com/gaearon/ee0201910608f15df3f8cd66aa83f98e)
- **If you already minify** your application scripts, your site will be production-ready if you ensure that the deployed HTML loads the versions of React ending in `production.min.js` like so:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## 嘗試 React 與 JSX {/*try-react-with-jsx*/}

上面的範例是依賴瀏覽器原生支援的功能。這就是為什麼 **`like-button.js`** 使用 JavaScript function 呼叫來告訴 React 要顯示什麼：

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

然而，React 也提供了使用 [JSX](/learn/writing-markup-with-jsx) 的選項，一種類似 HTML 的 JavaScript 語法來替代：

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

這兩個程式碼片段是等效的。JSX 是在 JavaScript 中描述 markup 的流行語法。許多人發現它很熟悉並對於撰寫 UI 程式碼非常有幫助--無論是使用 React 或是其他 library。

> 你可以使用這個[線上轉換器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17)來體驗將 HTML markup 轉換成 JSX。

### 嘗試 JSX {/*try-jsx*/}

在你的專案中最快速嘗試 JSX 的方式就是將 Babel compiler 作為一個 `<script>` 加入到頁面中。放在 **`like-button.js`** 之前，並且在 **`like-button.js`** 的 `<script>` 加上 `type="text/babel"` attribute：

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

現在你可以打開 **`like-button.js`** 並替換

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

使用等效的 JSX 程式碼：

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

一開始將 JS 與 markup 混合起來可能會感覺到有點不正常，但它會讓你越來越喜歡！請查看 [Writing Markup in JSX](/learn/writing-markup-with-jsx) 的介紹。這裡是[一個帶有 JSX 的 HTML 檔案範例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下載體驗嘗試。

<Pitfall>

Babel `<script>` 編譯器非常適合學習和建立簡單的 demo。但是，**它讓你的網站變慢而且不適用在 production**。當你決定往前進時，移除 Babel `<script>` 標籤並且移除你在前面步驟加入的 `type="text/babel"` attribute。相反的，在下一章節中，你將設定一個 JSX 預處理器來將所有的 `<script>` 標籤從 JSX 轉換為 JS。

</Pitfall>

### 加入 JSX 到專案內 {/*add-jsx-to-a-project*/}

加入 JSX 到一個專案不需要像是 [bundler](/learn/start-a-new-react-project#custom-toolchains) 的複雜工具或是一個開發伺服器。加入一個 JSX 預處理器就像加入一個 CSS 預處理器一樣。

在你的 terminal 進入到你的專案下，並貼上這兩個命令（**請確認你已經安裝 [Node.js](https://nodejs.org/)！**）：

<<<<<<< HEAD
1. `npm init -y` （如果它失敗了，[這裡是修正方式](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)）
2. `npm install babel-cli@6 babel-preset-react-app@3`
=======
1. `npm init -y` (if it fails, [here's a fix](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install @babel/cli@7 babel-preset-react-app@10`
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

你只需要 npm 來安裝 JSX 預處理器。你不需要做其他任何事情。React 和應用程式的程式碼可以保持為 `<script>` 標籤不需要做任何變動。

恭喜你！你剛剛在專案內加入了**production-ready 的 JSX 設定**。

### 執行 JSX 預處理器 {/*run-the-jsx-preprocessor*/}

你可以對 JSX 進行預處理，這樣每次你儲存一個包含 JSX 的檔案時，轉換會重新執行，將 JSX 檔案轉換成瀏覽器可以理解的普通的 JavaScript 檔案。設定方法如下：

<<<<<<< HEAD
1. 建立一個 **`src`** 的資料夾。
2. 在你的 terminal 執行這個命令：`npx babel --watch src --out-dir . --presets react-app/prod `（不需要等待它完成！這個命令啟動一個 automated watcher，觀察 `src` 內的 JSX 的編輯。）
3. 移動你 JSX 化的 **`like-button.js`** ([它看起來應該像這樣！](https://gist.githubusercontent.com/gaearon/1884acf8834f1ef9a574a953f77ed4d8/raw/dfc664bbd25992c5278c3bf3d8504424c1104ecf/like-button.js)) 到新的 **`src`** 資料夾。
=======
1. Create a folder called **`src`.**
2. In your terminal, run this command: `npx babel --watch src --out-dir . --presets babel-preset-react-app/prod ` (Don't wait for it to finish! This command starts an automated watcher for edits to JSX inside `src`.)
3. Move your JSX-ified **`like-button.js`** ([it should look like this!](https://gist.githubusercontent.com/gaearon/be5ae0fbf563d6c5fe5c1563907b13d2/raw/4c0d0b8c7f4fcb341720424c28c72059f8174c62/like-button.js)) to the new **`src`** folder.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

Watcher 將會建立一個預處理的 **`like-button.js`**，使用適合瀏覽器的普通 JavaSripct 的程式碼。

<Pitfall>

如果你看到一個錯誤訊息：「You have mistakenly installed the `babel` package」，你可能漏掉了[上一步](#add-jsx-to-a-project)。在相同的資料夾執行它，然後再試一次。

</Pitfall>

我們剛才用的工具叫做 Babel，你可以從[它的文件](https://babeljs.io/docs/en/babel-cli/)中了解更多關於它的資訊。除了 JSX，它還讓你使用最新的 JavaScript 語法功能而不需要擔心弄壞瀏覽器。

如果你正在適應建構工具並希望它們為你做更多的事情，[我們這裡涵蓋了最流行和最容易接近的工具鏈](/learn/start-a-new-react-project)。

<DeepDive>

#### React without JSX {/*react-without-jsx*/}

最初引入 JSX 是為了讓使用 React 撰寫 component 的感覺可以像是撰寫 HTML 一樣。從那時候開始，這個語法變已經變得很普遍了。然而，在有些情況下，你可能不想或是不能使用 JSX。你有兩個選擇：

<<<<<<< HEAD
- 使用像 [htm](https://github.com/developit/htm) 作為 JSX 的替代方案，它不使用 compiler 而是使用 JavaScript 的 [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)。
- 使用  [`React.createElement()`](/apis/react/createElement)，它有一個特殊的結構，解釋如下。
=======
- Use a JSX alternative like [htm](https://github.com/developit/htm) which uses JavaScript [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead of a compiler.
- Use [`React.createElement()`](/reference/react/createElement) which has a special structure explained below.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

使用 JSX，你可以像這樣撰寫 component：

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />, );
```

使用 `React.createElement()`，你會這樣寫：

```js
function Hello(props) {
  return React.createElement('div', null, 'Hello ', props.toWhat);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(Hello, { toWhat: 'World' }, null)
);
```

它接受多個參數：`React.createElement(component, props, ...children)`。

這是它們的工作原理：

1. 一個 **component**，可以是一個字串，代表一個 HTML element 或是一個 function component
2. 一個任何[你想要傳遞的 **props**](/learn/passing-props-to-a-component) 的 object
3. 剩下的是該 component 可能擁有的 **children**，例如是文字或其他 element

如果你厭倦輸入 `React.createElement()`，一個常見的模式是指定一個 shorthand：

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

那麼，如果你更喜歡這種風格，它可以和 JSX 一樣方便。

</DeepDive>
