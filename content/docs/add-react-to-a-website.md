---
id: add-react-to-a-website
title: 將 React 加入到網頁
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

按自己所需可多可少的採用 React。

React 在剛推出的時候就容許被逐步採用，**你可以按自己所需可多可少的**採用 React。 或許你只想在現存的網頁上增加少量的互動性。採用 React component 會是個非常好的選擇。

大部分的網頁不是，也不需要是 single-page 的應用程式。你只需要**幾行的程式碼，並且不需要任何建立工具**，就可以在你一少部分的網頁上嘗試採用 React。你可以選擇逐步擴大它的應用範圍，或是只使用在少部分的可變 widget 上。

---

- [一分鐘內加入 React](#add-react-in-one-minute)
- [可選：嘗試 React 與 JSX](#optional-try-react-with-jsx)（不需要 bundler！）

## 一分鐘內加入 React {#add-react-in-one-minute}

在本章節裡，我們會示範如何在 HTML 網頁上加入一個 React component。你可以利用自己的網頁，或建立一個空白的 HTML 文件來跟隨着我們練習。

我們不需要任何複雜的工具或安裝需求 —— **你只需要連接到網路和一分鐘的時間，就能完成本章節。**

可選：[下載完整範例 (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)

### 第一步：在 HTML 上加入一個 DOM Container {#step-1-add-a-dom-container-to-the-html}

首先，打開你想編輯的 HTML 網頁。在你想利用 React 來展示內容的位置上，加上一個空白的 `<div>` 標籤。例如：

```html{3}
<!-- ... 現存 HTML ... -->

<div id="like_button_container"></div>

<!-- ... 現存 HTML ... -->
```

我們給這個 `<div>` 加上一個獨一無二的 `id` HTML attribute。這會容許我們稍後在 JavaScript 程式碼裡找到它，並且在裡面展示一個 React component。

>提示
>
>你可以放置像這樣的「container」`<div>` 在 `<body>` 標籤裡的**任何地方**。你也可以按需要，在一頁裡放置多個獨立的 DOM container。它們通常都是空白的 —— React 會替換 DOM container 裡任何現存的內容。

### 第二步：加上 Script 標籤 {#step-2-add-the-script-tags}

下一步，在 HTML 網頁的 `</body>` 結束標籤前，加上三個 `<script>` 標籤。

```html{5,6,9}
  <!-- ... 其他 HTML ... -->

  <!-- 載入 React。 -->
  <!-- 注意：在發佈應用程式前，請把「development.js」替換成「production.min.js」。 -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

  <!-- 載入我們的 React component。-->
  <script src="like_button.js"></script>

</body>
```

前兩個的標籤會載入 React。第三個會載入你的 component 程式碼。

### 第三步：建立一個 React Component {#step-3-create-a-react-component}

在你的 HTML 網頁旁邊，建立一個名為 `like_button.js` 的文件

打開**[這個 starter code](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**，然後把它貼上到你剛建立的文件裡。

>提示
>
>這程式碼定立了一個名為 `LikeButton` 的 React component。請別擔心如果你還沒明白它 —— 我們會在[實用指南](/tutorial/tutorial.html)和[主要概念指南](/docs/hello-world.html)裡解構 React 的基礎。目前，我們就先讓它展示在畫面上吧！

在 **[starter code](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** 之後，請在 `like_button.js` 的底部加上以三行的程式碼:

```js{3,4,5}
// ... 你貼上的 starter code ...

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
```

這三行的程式碼會找我們在第一步所加入的 `<div>`，用它建立一個 React app 然後在裡面顯示我們的「Like」按鈕 React component。

### 大功告成！ {#thats-it}

沒有第四步了。**你剛剛已經將第一個 React component 加入到你的網頁上。**

查看後續的章節了解更多有關採用 React 的提示。

**[按這裡看完整範例的程式碼](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[下載完整範例 (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)**

### 提示：重用 Component {#tip-reuse-a-component}

通常，你會想把 React component 展示在 HTML 網頁上的不同地方。以下的範例是展示我們的「Like」按鈕三次，再各自傳送資料給它們：

[按這裡看完整範例的程式碼](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[下載完整範例 (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/279839cb9891bd41802ebebc5365e9dec08eeb9f.zip)

>注意
>
>當網頁上以 React 驅動的部分是互相獨立的時候，這種策略會非常有用。在 React 的程式碼裡，使用 [component composition](/docs/components-and-props.html#composing-components) 會反而比較容易。

### 提示：為線上環境壓縮 JavaScript  {#tip-minify-javascript-for-production}

在部署你的網頁到線上環境之前，要留意沒壓縮的 JavaScript 會明顯的減慢使用者載入網頁的速度。

如果你已經壓縮了應用程式的 scripts，而且確保了你發佈的 HTML 是載入了以 `production.min.js` 結尾的 React 版本，那麼**你的網頁已經發佈就緒**：

```js
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

如果你沒有一個為你的 scripts 進行壓縮的步驟，[這裡有個方法設定](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)。

## 可選：嘗試 React 與 JSX {#optional-try-react-with-jsx}

上面所接觸的範例，我們只倚靠着瀏覽器自身所支援的特性。這就是為什麼我們會用一個 JavaScript function call 來告訴 React 要展示什麼：

```js
const e = React.createElement;

// 展示一個「Like」<button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

不過，React 也提供了一個使用 [JSX](/docs/introducing-jsx.html) 的選擇：

```js
// 展示一個「Like」<button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

這兩段的程式碼是等同的。雖然 **JSX 是[完全可選的](/docs/react-without-jsx.html)**，但許多人也覺得它有助編寫 UI 程式碼 —— 無論是使用 React 或其他函式庫。

你可以使用[這個線上轉換器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.7) 來嘗試 JSX。

### 快速嘗試 JSX {#quickly-try-jsx}

在你的項目中，嘗試 JSX 最快的方法就是將這個 `<script>` 標籤加入你的網頁上：

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```
現在你就可以在任何 `<script>` 標籤裡使用 JSX，方法就是為它們加上 `type="text/babel"` 的 attribute。這裡是個 [HTML 文件與 JSX 的範例](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)，你可以下載來嘗試一下。

現在你可以透過加入 `type="text/babel"` attribute 在任何 `<script>` tag 中使用 JSX。這裡是[一個帶有 JSX 的 HTML 範例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下載並且試試看。

這種方式最適合用來學習和建立簡單的示範。然而，它會令你的網頁變慢，而且並**不適合發佈到線上環境**。當你準備好到下一步，請移除掉你剛加入的 `<script>` 標籤和 `type="text/babel"` attribute。在下一個章節，你會設定一個 JSX preprocessor 來自動轉換所有的 `<script>` 標籤。

### 將 JSX 加入到項目 {#add-jsx-to-a-project}

將 JSX 加入到項目裡並不需要複雜的工具，例如一個 bundler 或開發伺服器。本質上，加入 JSX **就像加入一個 CSS preprocessor。**這只需要你安裝 [Node.js](https://nodejs.org/) 到你的電腦裡。

在 terminal 轉到你的項目文件夾裡，再貼上以下的兩行指令：

1. **第一步：** 執行  `npm init -y`（如果失敗了，[這裡有方法解決](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)）
2. **第二步：** 執行  `npm install babel-cli@6 babel-preset-react-app@3`

>提示
>
>我們**只使用 npm 來安裝 JSX preprocessor**，之後你並不再需要它。React 和你的應用程式碼都可以留在`<script>` 標籤裡，並不需要進行修改。

恭喜你！你剛剛為你的項目加入了**發佈就緒的 JSX 設定**了。


### 執行 JSX Preprocessor {#run-jsx-preprocessor}

建立一個名為 `src` 的文件夾，然後執行這個終端指令：

```console
npx babel --watch src --out-dir . --presets react-app/prod
```

>Note
>
>`npx` 不是拼寫錯誤 —— 它是一個 [npm 5.2+ 附帶的 package 執行器](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)。
>
>如果你看見一個寫着「You have mistakenly installed the `babel` package」的錯誤訊息，你或許跳過了[上一步](#add-jsx-to-a-project)。在同一個文件夾裡執行它，然後再重新嘗試。

請不要等待它完成 —— 這個指令會啟動一個 JSX 自動監測器。

如果你現在利用這個 **[JSX starter code](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)** 建立一個名為的 `src/like_button.js` 文件，監測器會建立一個預先處理過，由普通 JavaScript 程式碼組成，並且適合瀏覽器載入的 `like_button.js`。當你使用 JSX 來編輯文件時，轉換過程會自動重新執行。

再者，這也容許我們在舊瀏覽器上，使用現代 JavaScript 的語法特性，例如 class。我們剛加入的工具叫 Babel，你可以在[它的官方文件](https://babeljs.io/docs/en/babel-cli/)裡了解更多。

如果你發現自己習慣了使用各種建立工具，而且希望它們為你做更多，[下一個章節](/docs/create-a-new-react-app.html)會介紹一些受歡迎和容易上手的 toolchains。不過，只利用 script 標籤也游刃有餘！
