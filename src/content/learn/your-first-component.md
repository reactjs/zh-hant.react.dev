---
title: 你的第一個 Component
---

<Intro>

*Component* 是 React 的核心概念之一，它們是建構使用者介面 (UI) 的基礎，是你踏上 React 旅程的完美開端！

</Intro>

<YouWillLearn>

* 什麼是 Component
* Component 在 React 中扮演了什麼角色
* 如何編寫你的第一個 React Component

</YouWillLearn>

## Components: UI 的建構塊 {/*components-ui-building-blocks*/}

在網頁中，HTML 允許我們透過使用內建標籤來建立富有結構的文件，像是 `<h1>` 與 `<li>`：

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

此 markup 以 `<article>` 來表示文章，以 `<h1>` 來表示它的標題， 並且使用 `<ol>` 來表示有序的（縮寫）列表內容，這些 markup 結合了 CSS 樣式，以及使用 JavaScript 展現互動性，你在網頁上所看到的 － 每一個側邊欄、大頭貼、互動視窗的 UI 模組背後都是這麼運作的。

React 允許你將 markup、CSS 以及 JavaScript 結合為自定義「component」, **即應用程式中可複用的 UI 元素**。上文中的程式碼可以改寫為一個能夠 render 在各個頁面上的 `<TableOfContents />` component，實際上，使用的依舊是 `<article>`、`<h1>` 等相同的標籤。

就像是 HTML 標籤一樣，你可以編寫、排序以及使用巢狀結構來設計整個頁面。例如，你正在看閱讀的文件頁面就是由 React component 所組成：

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

隨著專案的成長，你會發現有許多設計可以透過複用已經完成的 component 來實現，進而加速你的開發時程。上文所提到的列表內容，可以透過 `<TableOfContents />` component 加入到任意頁面中！你甚至可以使用 React 開源社群（例如 [Chakra UI](https://chakra-ui.com/) 與 [Material UI](https://material-ui.com/)）所分享的大量 component 來快速啟動開發。

## 定義 component {/*defining-a-component*/}

傳統網頁開發時，網頁開發者會使用標記式語言來描述內容，然後透過 JavaScript 來實現互動，這種方式展現了良好的網頁互動。現今許多的網頁與應用程式都需具有互動性。React 將互動性視為重要指標，並且使用了相同的技術：**React component 是一個可以使用 markup 進行擴充的 JavaScript 函式**，如下所示（你可以編輯下方的範例）：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

以下為建構 component 的方法：

### 第一步：Export the component {/*step-1-export-the-component*/}

`export default` 前綴是一種 [JavaScript 標準語法](https://developer.mozilla.org/zh-TW/docs/web/javascript/reference/statements/export) （並非 React 特性）。它允許你標記檔案中的主要函式，以便你之後可以在其他檔案 import 它。（更多 import 內容請參閱 [Importing 和 Exporting Component](/learn/importing-and-exporting-components) ！）

### 第二步：定義函式 {/*step-2-define-the-function*/}

透過 `function Profile() { }` 定義名為 `Profile` 的 JavaScript 函式。

<Pitfall>

React component 為常規的 JavaScript 函式，但**它們的名稱必須以大寫字母為開頭**，否則將無法運行！

</Pitfall>

### 第三步：新增 markup {/*step-3-add-markup*/}

component 會回傳一個帶有 `src` 與 `alt` 屬性的 `<img />` 標籤。`<img />` 寫法像 HTML，但它實際上是 JavaScript！這種語法被稱為 [JSX](/learn/writing-markup-with-jsx)，它允許你在 JavaScript 中嵌入 markup。

回傳的內容可以全寫在同一行，如下方 component：

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

但是，如果你的 markup 與 `return` 關鍵字不在同一行，則必須使將它們包裹在一對括號中，如下所示：

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

沒有使用括號包裹的話，任何在 `return` 下一行的程式碼都
 [將被忽略](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)！

</Pitfall>

## 使用 component {/*using-a-component*/}

現在，你已經定義了 `Profile` component，你可以將它們嵌套進其他的 component 中。舉例來說，你可以 export 一個包含多個 `Profile` component 的 `Gallery` component：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### 瀏覽器看見了什麼 {/*what-the-browser-sees*/}

注意下方兩者的區別：

* `<section>` 是小寫的，所以 React 知道我們指的是 HTML 標籤。
* `<Profile />` 的開頭為大寫字母 `P`，所以 React 知道我們想要使用的是名為 `Profile` 的 component。

`Profile` 包含了更多 HTML：`<img />`。瀏覽器最後看見的內容會是這樣：

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### 嵌套與組織 component {/*nesting-and-organizing-components*/}

Component 為常規的 JavaScript 函式，所以你可以將多個 component 放在同一個檔案中。這在 component 相對較小或是彼此關係緊密時是非常方便的。如果檔案變得過於擁擠，你可以隨時將 `Profile` 移至不同的檔案。你可以立即在 [import 相關章節](/learn/importing-and-exporting-components) 學習如何做到這些。

由於 `Profile` component 在 `Gallery` 中被 render－甚至數次！－我們可以將 `Gallery` 稱為 **parent component**，將每個 `Profile` 視為「child」render。這是 React 神奇所在之一，你可以透過定義 component 一次，然後根據需求在多個地方多次使用。

<Pitfall>

Component 可以 render 其他的 component，但是**請不要嵌套它們的定義：**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

上方這段程式碼[非常慢，並且將導致 bug 的發生](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state)。因此，你應該在頂層定義每個 component：

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

當 child component 需要獲取 parent 的數據，你需要[透過 props 傳遞](/learn/passing-props-to-a-component)，而不是嵌套定義。

</Pitfall>

<DeepDive>

#### 萬物皆是 Component {/*components-all-the-way-down*/}


你的 React 應用程式從「root」component 開始。通常，在你啟動一個新專案時，它會自動被建立。例如，如果你使用 [CodeSandbox](https://codesandbox.io/) 或 [Next.js](https://nextjs.org/) 框架，root component 會定義在 pages/index.js 中。在這些例子中，你一直在 export root component。

<<<<<<< HEAD
[基於 React 的框架](/learn/creating-a-react-app)更進一步。它們不使用空的 HTML 檔案，然後讓 React 用 JavaScript「接管」頁面管理，而是*也*會從你的 React 元件自動生成 HTML。這讓你的應用程式能夠在 JavaScript 程式碼載入之前就顯示一些內容。
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

[基於 React 的框架]((/learn/start-a-new-react-project)) 更進一步。它們不只是使用空的 HTML 檔案並讓 React 通過 JavaScript 管理頁面，它們*還會*自動從你的 React component 中生成 HTML。這使得你的應用程式在 JavaScript 程式碼載入之前就能顯示一些內容。

儘管如此，許多網站僅使用 React 來[增加「互動性」](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)，它們有許多 root component，而不是整個頁面中的單個 component。你可以根據需求盡可能多或盡可能少地使用 React。

</DeepDive>

<Recap>

你剛剛第一次體驗了 React！讓我們來回顧一些重點。

* React 允許你建立 component，**應用程式中可複用的 UI 元素**。
* 在 React 應用程式中，所有的 UI 模塊都是一個 component。
* React component 是常規的 JavaScript 函式，除了：

  1. 它們的名字總是以大寫字母為開頭。
  2. 它們回傳 JSX markup。

</Recap>



<Challenges>

#### Export the component {/*export-the-component*/}

由於 root component 沒有被 export，導致這個 sandbox 無法運作：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

請試著在查閱解答前自行修復它！

<Solution>

在函式定義前加上 `export default`，如下所示：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

你可能會想知道，為什麼單獨寫 `export` 時不足以修復這個問題。你可以在 [Importing 和 Exporting Component](/learn/importing-and-exporting-components) 中了解 `export` 與 `export default` 之間的區別。

</Solution>

#### 修復回傳內容 {/*fix-the-return-statement*/}

`return` 內容出了點問題，你能夠修復它嗎？

<Hint>

當你嘗試修復它的時候，你可能會收到「Unexpected token」的報錯。在這個情形下，請確認分號是否位於右括號*之後*。在 `return ( )` 內留下分號將會導致錯誤發生。

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

你可以透過將回傳的內容移至同一行來修復這個問題，如下：

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

或者使用括號包裹回傳的 JSX markup，將左括號放在 `return` 的後面：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### 發現錯誤 {/*spot-the-mistake*/}

`Profile` component 的宣告及使用發生了問題，你能指出其中的錯誤嗎？（試著回憶 React 是如何判別 component 與常規的 HTML 標籤！）

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React component 的命名必須以大寫字母為首。

將 `function profile()` 改為 `function Profile()`，然後將所有的 `<profile />` 改為 `<Profile />`：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### 自定義 component {/*your-own-component*/}

從頭編寫一個 component。 你可以給定它任何有效名稱，然後回傳任何 markup。如果你沒有想法，你可以編寫一個顯示 `<h1>Good job!</h1>` 的 `Congratulations` component。別忘了 export 它！

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
