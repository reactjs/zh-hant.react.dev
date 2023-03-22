---
title: 在 JSX 中使用 JavaScript 的語法
---

<Intro>

JSX 允許你在 JavaScript 文件中編寫類似 HTML 標籤的代碼，使渲染邏輯和內容保持在同樣的地方。有時你會想在標籤中添加一些 JavaScript 邏輯或引用一個動態屬性。在這種情況下，你可以在 JSX 中使用花括號來編寫 JavaScript 。

</Intro>

<YouWillLearn>

* 如何使用引號傳遞 string
* 如何使用花括號在 JSX 中引用 JavaScript 變量
* 如何使用花括號在 JSX 中調用 JavaScript 函數
* 如何使用花括號在 JSX 中使用 JavaScript 對象

</YouWillLearn>

## 使用引號傳遞 strings {/*passing-strings-with-quotes*/}

當你想向 JSX 傳遞一個 string attribute 時，你要把它放在單引號或雙引號中：

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

在這裡, `"https://i.imgur.com/7vQD0fPs.jpg"` 和 `"Gregorio Y. Zara"` 被作為 strings 轉遞。

但是如果你想動態地指定 `src` 或 `alt` 文本呢？**你可以替換`"`和`"`為`{`和`}`，以使用 JavaScript 中的值，**

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

注意 `className="avatar"` 和 `src={avatar}` 之間的區別，前者指定了一個 `"avatar"` 的CSS類名，使圖片變成圓形，而後者讀取了 JavaScript 變量 `avatar` 的值。這是因為花括號可以讓你在標籤中使用 JavaScript !

## 使用花括號: 進入 JavaScript 世界的窗口 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX 是編寫 JavaScript 的一種特殊方式。這意味著可以在它裡面透過大括號 `{ }` 使用 JavaScript 。下面的例子首先聲明了一位科學家的名字 `name` ，然後用大括號將其嵌入 `<h1>` 內：

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

試著把 `name` 的值從 `Gregorio Y. Zara` 改為 `Hedy Lamarr` 。看到待辦事項列表的標題如何變化了嗎？

任何的 JavaScript 表達式都可以在花括號之間使用，包括像 `formatDate()` 這樣的函數調用：

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 哪裡使用花括號 {/*where-to-use-curly-braces*/}

你只能在 JSX 中以兩種方式使用花括號。

1. **作為文本**直接在JSX標籤內使用。 `<h1>{name}'s To Do List</h1>` 可以使用，但 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 就不行。
2. **作為 attributes** 緊隨 `=` 符號之後：`src={avatar}` 將讀取 `avatar` 變量，但 `src="{avatar}"` 將傳遞 string `"{avatar}"`。

## 使用 "雙花括號"：JSX 中的 CSS 和其他對象 {/*using-double-curlies-css-and-other-objects-in-jsx*/}

除了 strings、numbers 和其他 JavaScript 表達式外，你甚至可以在 JSX 中傳遞對象。對像也用花括號表示，如 `{ name: "Hedy Lamarr", inventions: 5 }` 。因此，要在JSX中傳遞一個 JS 對象，你必須用另一對花括號包裹該對象：`person={{ name: "Hedy Lamarr", inventions: 5 }}`。

你可能會在 JSX 中看到這種內聯 CSS 樣式。 React 並不要求你使用內聯樣式（CSS類在大多數情況下效果很好）。但是當你需要一個內聯樣式時，你要向 `style` attribute 傳遞一個對象：

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

嘗試改變 `backgroundColor` 和 `color` 的值。

當你這樣寫時，你清楚地看到花括號內的 JavaScript 對象。

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

下次你在JSX中看到 `{{` 和 `}}` 的時候，要知道它只不過是 JSX 花括號中的一個對象而已!

<Pitfall>

內聯的 `style` 屬性是用 camelCase 寫的。例如，HTML `<ul style="background-color: black">` 在你的 component 中應該寫成 `<ul style={{ backgroundColor: 'black' }}>`。

</Pitfall>

## 更多關於 JavaScript 對象和花括號的樂趣 {/*more-fun-with-javascript-objects-and-curly-braces*/}

你可以把幾個表達式移到一個對像中，並在你的 JSX 中使用花括號引用它們。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

在這個例子中，`person` 的 JavaScript 對象包含一個 `name` string 和一個 `theme` 對象。

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

該組件可以像這樣使用這些來自 `person` 的值。

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX 是非常簡潔的模板語言，因為它允許使用 JavaScript 來組織數據和邏輯。

<Recap>

現在你已經幾乎了解 JSX 的所有內容：

* 在引號內的 JSX attributes 被傳遞為字符串。
* 花括號可以讓你將 JavaScript 邏輯和變量帶入標籤中。
* 它們可以在 JSX 標籤內容內部或在屬性中的 = 後立即使用。
* `{{` 和 `}}` 不是特殊的語法：它是一個被包含在 JSX 花括號內的 JavaScript 對象。

</Recap>

<Challenges>

#### 糾正錯誤 {/*fix-the-mistake*/}

這段代碼會崩潰並報錯 `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

你能找到問題所在嗎？

<Hint>看一下花括號裡的內容。我們是否把正確的東西放在那裡？ </Hint>

<Solution>

發生這種情況是因為這個例子將*一個對象本身*渲染到標籤中，而不是一個字符串。 `<h1>{person}'s Todos</h1>` 將試圖渲染整個 `person` 對象! 使用原始對像作為文本內容會拋出一個錯誤，因為React不知道你想如何顯示它們。

要解決這個問題，將 `<h1>{person}'s Todos</h1>` 改為 `<h1>{person.name}'s Todos</h1>` 。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### 將信息提取到一個對像中 {/*extract-information-into-an-object*/}

將圖片的 URL 提取到 `person` 對像中。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

將圖片 URL 移到一個名為 `person.imageUrl` 的屬性中，然後在 `<img>` 標籤中使用花括號讀取它：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### 在 JSX 的花括號中寫表達式 {/*write-an-expression-inside-jsx-curly-braces*/}

在下面的對像中，完整的圖片 URL 被分成四個部分：base URL、`imageId`、`imageSize` 和文件擴展名。

我們希望將這些 attributes 組合在一起形成完整的圖片 URL：基礎 URL（始終為 `https://i.imgur.com/`）、`imageId`（`7vQD0fP`）、`imageSize`（`s`）和文件擴展名（始終為 `.jpg`）。然而，下面 `<img>` 標籤的 src 指定方式存在問題。

你能修復它嗎？

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

要檢查你的修復是否生效，請嘗試將 `imageSize` 的值更改為 `'b'`。在你的編輯後，該圖像應該會改變大小。

<Solution>

你可以將其寫成 `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`。

1. `{` 開始 JavaScript 表達式
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` 生成正確的 URL string
3. `}` 結束 JavaScript 表達式

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

你也可以將這個表達式移到一個單獨的函數中，如下面的 `getImageUrl` 函數：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

變量和函數可以幫助你保持標籤簡潔！

</Solution>

</Challenges>