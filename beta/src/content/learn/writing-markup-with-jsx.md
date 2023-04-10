---
title: 用 JSX 撰寫 Markup
---

<Intro>

*JSX* 是一種 JavaScript 的擴充語法，讓你能夠在 JavaScript 檔案中編寫類似 HTML 的 markup。雖然也可以使用其他的方式來編寫 component，但大多數的 React 開發者偏好於使用簡明的 JSX，並在大部分代碼庫中使用它。

</Intro>

<YouWillLearn>

* 為什麼 React 耦合 markup 與 render 邏輯
* JSX 與 HTML 有什麼區別
* 如何透過 JSX 展示資訊

</YouWillLearn>

## JSX：將 markup 引入 JavaScript {/*jsx-putting-markup-into-javascript*/}

網頁是建構於 HTML、CSS 與 JavaScript 之上的。多年以來，網頁開發者將內容存放在 HTML，在 CSS 中設計樣式，然後將邏輯存放於 JavaScript 中－通常是在不同的文件中！頁面內容透過標記式語言存放於 HTML 檔案中，而邏輯則單獨存放在 JavaScript 檔案中：

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

但隨著網頁的交互性越來越強，邏輯增加了對內容的決定性。JavaScript 負責了 HTML 的內容！ 這也是為什麼**在 React 中，render 邏輯與 markup 存在於同一個地方－component**。

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React component

</Diagram>

</DiagramGroup>

將一個按鈕的 render 邏輯與 markup 放在一起，可以確保它們在每次編輯時都能互相保持同步。反之，彼此無關的細節則是互相隔離的，像是按鈕的 markup 與側邊欄的 markup。這樣可以使修改其中一方時更加安全。

每個 React component 都是一個 JavaScript 函式，裡面可能會包含一些用於瀏覽器 render 的 markup。 React component 使用名為 JSX 的擴充語法來表示 markup。JSX 看起來像是 HTML，但它的語法較為嚴格，並且可以展示動態資訊。了解這些區別的最好方式就是將一些 HTML markup 轉換為 JSX markup。

<Note>

JSX 與 React 是互相獨立的東西，它們經常一起被使用，但你 *可以* [單獨地使用它們](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)。JSX 是一種擴充語法，React 則是一個 JavaScript 函式庫。

</Note>

## 將 HTML 轉換為 JSX {/*converting-html-to-jsx*/}

假設你有一些 (完全有效的) HTML：

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

然後你想要將它放入你的 component：

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

如果像下方這樣直接複製貼上是沒有辦法運作的：


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

這是因為 JSX 比語法 HTML 更加嚴格，且有更多的規則！上方的錯誤訊息可以幫助你修復 markup，或是你也可以參考下方的指引。

<Note>

大多數情況下，React 在屏幕上的錯誤訊息可以幫助你找到問題所在，如果在編寫過程中遇到問題就參考一下它們吧！

</Note>

## JSX 的規則 {/*the-rules-of-jsx*/}

### 1. 回傳單一根元素 {/*1-return-a-single-root-element*/}

如果想要在一個 component 中回傳多個元素，**請將它們包裹進父標籤**。

例如，你可以使用一個 `<div>` 標籤：

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


如果你不想要在你的 markup 放入多餘的 `<div>` 標籤，可以改為使用 `<>` 與 `</>`：

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

這個空標籤稱為 *[Fragment](/reference/react/Fragment)*，Fragment 允許你將元素集合在一起，且不會在 HTML 中產生額外節點。

<DeepDive>

#### 為什麼多個 JSX 標籤需要被包裹起來？ {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX 看起來與 HTML 非常相似，但它實際上是 JavaScript 物件。你不能在沒有使用 array 包裹它們的情況下，在一個函式裡回傳兩個物件。這解釋了為什麼你不能在沒有使用其他標籤或 Fragment 包裹的情況下回傳兩個 JSX 標籤。

</DeepDive>

### 2. 閉合所有標籤 {/*2-close-all-the-tags*/}

JSX 標籤需要明確地閉合：如果是自閉標籤，像是 `<img>`，則需要改為 `<img />`，而像 `<li>oranges` 這樣只有開始標籤的元素則需改為 `<li>oranges</li>`。

海蒂・拉瑪的照片與列表項目更改後如下：

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. <s>全部</s> 大部分使用駝峰式命名！ {/*3-camelcase-salls-most-of-the-things*/}

JSX 最終會被轉化為 JavaScript，編寫在 JSX 中的屬性會變成 JavaScript 物件中的 key。在你的 component 中，你會經常需要使用變數的方式讀取這些屬性。但是 JavaScript 對變數命名有限制。例如，它們的名字不能包含連字號，或者是使用像是 `class` 這樣的保留字。

這就為什麼在 React 中，許多 HTML 與 SVG 屬性都使用駝峰式命名法。例如，將 `stroke-width` 改為 `strokeWidth`。由於 `class` 為保留字，因此在 React 中需要改為使用 `className` 來替代。 這也是依據 [相應的 DOM 屬性](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 命名：

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

你可以 [在 DOM component props 列表找到所有屬性](/reference/react-dom/components/common)，如果你在過程中發生了錯誤，別擔心－React 會在 [瀏覽器控制台](https://developer.mozilla.org/docs/Tools/Browser_Console) 打印出可能的更正信息。

<Pitfall>

由於歷史原因，[`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) 與 [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) 屬性的寫法與 HTML 相同，同樣使用連字號。

</Pitfall>

### 專業提醒：使用 JSX 轉換器 {/*pro-tip-use-a-jsx-converter*/}

轉換所有現有的 markup 屬性是一件繁瑣的事情！我們建議使用 [轉換器](https://transform.tools/html-to-jsx) 來將現有 HTML 與 SVG 轉換為 JSX。轉換器在實務上是非常實用的，但我們仍有必要去理解轉換過程，這樣你就可以編寫自己的 JSX 了。

以下為最終結果:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

現在，你知道為什麼我們需要 JSX，並且知道如何在 component 中使用它：

* 由於 render 邏輯與 markup 關係緊閉，所以 React 將它們存放在同一個 component 中。
* JSX 與 HTML 非常相似，但它們有些許不同，如果你需要轉換它們，你可以使用 [轉換器](https://transform.tools/html-to-jsx)。
* 錯誤提示訊息通常能指引你往正確的方向修復 markup。

</Recap>



<Challenges>

#### 將 HTML 轉換為 JSX {/*convert-some-html-to-jsx*/}

下方的 HTML 是直接被複製到 component 中的，並非有效的 JSX。請試著修復它：

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

手動修復或是使用轉換器都可以的，一切取決於你！

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
