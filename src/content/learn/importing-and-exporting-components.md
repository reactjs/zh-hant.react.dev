---
title: Importing 和 Exporting Component
---

<Intro>

Component 的神奇之處在於它的可複用性：你可以建立 component 並與其他 component 組合。但當你嵌套越來越多 component，則需要開始將它們拆分為不同的檔案。這將會提升檔案的閱讀性，也能讓 component 重複應用在更多地方。

</Intro>

<YouWillLearn>

- 什麼是 root component 檔案
- 如何 import 和 export 一個 component
- 何時使用 default 和 named import 和 export
- 如何從一個檔案 import 和 export 多個 component
- 如何將 component 拆分為多個檔案

</YouWillLearn>

## root component 檔案 {/_the-root-component-file_/}

在[你的第一個 Component](/learn/your-first-component) 中，你建立了一個 `Profile` component，並且 render 在 `Gallery` component 裡：

<Sandpack>

```js
function Profile() {
  return <img src='https://i.imgur.com/MK3eW3As.jpg' alt='Katherine Johnson' />
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

在此範例中，目前所有的 component 都定義在名為 `App.js` 的 **root component 檔案**中。在 [Create React App](https://create-react-app.dev/) 中，你的應用程式應在 `src/App.js` 檔案中定義。根據你的配置，root component 可能會位於其他檔案中。如果你使用像是 Next.js 這種路由基於檔案的框架，那你每個頁面的 root component 都會不一樣。

## Exporting 和 importing 一個 component {/_exporting-and-importing-a-component_/}

如果將來你想要改變首頁，在此頁面放入科學書籍列表，或者需要將所有的資料移至其他檔案中。將 `Gallery` 以及 `Profile` 移出 root component 檔案會更加合理。這將會使它們更加模組化，並且可以在其他檔案中複用。你可以透過以下三個步驟拆分 component：

1. **創建** 一個新的 JS 檔案來存放該 component
2. **Export** 該檔案中的 component 函式（可以使用 [default](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 或 [named](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) export）。
3. 在需要使用該 component 的檔案中 **import**（可以根據相應的 import 方式使用 [default](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 或 [named](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) export）。

這裡將 `Profile` 與 `Gallery` 從 `App.js` 檔案中移出，並放入一個名為 `Gallery.js` 的新檔案中。現在，你可以在 `App.js` import `Gallery.js` 中的 `Gallery`：

<Sandpack>

```js App.js
import Gallery from './Gallery.js'

export default function App() {
  return <Gallery />
}
```

```js Gallery.js
function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

請注意此範例是如何將 component 拆分為兩個檔案：

1. `Gallery.js`:
   - 定義了 `Profile` component，該 component 僅在同個檔案中使用，並沒有被 export。
   - 使用 **default export** 的方式， export `Gallery` component
2. `App.js`:
   - 使用 **default import** 的方式，從 `Gallery.js` import `Gallery`
   - 使用 **default export** 的方式，export root component `App`

<Note>

你可能會遇到沒有寫上副檔名 `.js` 的狀況：

```js
import Gallery from './Gallery'
```

不管是 `'./Gallery.js'` 還是 `'./Gallery'` 都可以在 React 中運作，但前者更貼近 [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)。

</Note>

<DeepDive>

#### Default vs named export {/_default-vs-named-exports_/}

JavaScript 有兩種主要用來 export 值的方式：default export 以及 named export。 目前為止，我們的範例只有用到 default export。但你可以在同一個檔案中，選擇使用其中一種，或者兩種都使用。**一個檔案中僅能有一個 default export，但可以有多個 named export**。

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

Component 的 export 方式決定了其 import 方式。當你試著用 default export，import named export 的 component 將會報錯！下方圖表可以幫助你更好地理解它們：

| 語法    | import 陳述                           | export 陳述                             |
| ------- | ------------------------------------- | --------------------------------------- |
| Default | `export default function Button() {}` | `import Button from './button.js';`     |
| Named   | `export function Button() {}`         | `import { Button } from './button.js';` |

當使用 default import 時，你可以在 `import` 後使用任意命名。例如 `import Banana from './button.js'`，你仍舊可以獲取一致的預設 export 內容。相反地，對於 named import，import 與 export 的名稱必須一致。這也是為什麼它們被稱為 _named_ import！

**當檔案中只需要 export 一個 component 時，人們通常會使用 default export，當檔案包含多個 component 或值需要 export 時，則會使用 named export**。無論你偏好哪種方式，請記得給予 component 以及對應檔案一個有意義的命名。不建議使用未命名的 component，像是 `export default () => {}`，這將導致除錯變得困難。

</DeepDive>

## 從同一檔案 export 及 import 多個 component {/_exporting-and-importing-multiple-components-from-the-same-file_/}

如果你只想要展示一個 `Profile`，而非整個圖集。你也可以 export `Profile` component。但是 `Gallery.js` 已經包含 _default_ export，你不能有*兩個* default export。你可以建立一個新檔案以進行 default export，或是你可以將 `Profile` 進行 _named_ export。**同一檔案只能有一個 default export，但可以有多個 named export！**

> 為了減少 default export 和 named export 之間的混淆，有些團隊會選擇只使用其中一種風格（default 或 named），或者避免在同一個檔案中混合使用。這因人而異，選擇最適合你的即可！

首先，使用 named export 的方式，將 `Profile` 從 `Gallery.js` **export**（不使用 `default` 關鍵字）：

```js
export function Profile() {
  // ...
}
```

接著，使用 named import 的方式，從 `Gallery.js` **import** `Profile` 至 `App.js`（使用大括號）：

```js
import { Profile } from './Gallery.js'
```

最後，在 `App` component 中 **render** `<Profile />`：

```js
export default function App() {
  return <Profile />
}
```

現在 `Gallery.js` 包含兩個 export：一個是 default export 的 `Gallery`，一個是 named export 的 `Profile`。`App.js` 都 import 了它們。請試著將下方範例中的 `<Profile />` 改為 `<Gallery />`：

<Sandpack>

```js App.js
import Gallery from './Gallery.js'
import { Profile } from './Gallery.js'

export default function App() {
  return <Profile />
}
```

```js Gallery.js
export function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

現在，你混合使用了 default export 以及 named export：

- `Gallery.js`:
  - 使用 **named export** 的方式，export `Profile` component，並命名為 `Profile`。
  - 使用 **default export** 的方式，export `Gallery` component。
- `App.js`:
  - 使用 **named import** 的方式，從 `Gallery.js` import `Profile`，並命名為 `Profile`。
  - 使用 **default import** 的方式，從 `Gallery.js` import `Gallery`。
  - 使用 **default export** 的方式，export root component `App`。

<Recap>

在本章節中，你學到了：

- 什麼是 root component 檔案
- 如何 import 和 export 一個 component
- 何時使用 default 和 named import 和 export
- 如何從一個檔案 import / export 多個 component
- 如何將 component 拆分為多個檔案

</Recap>

<Challenges>

#### 進一步拆分 component {/_split-the-components-further_/}

現在，`Gallery.js` 同時 export 了 `Profile` 與 `Gallery`，這會讓人感到有些混淆。

試著將 `Profile` component 移至 `Profile.js`，然後更新 `App` component，依序 render `<Profile />` 與 `<Gallery />`。

你可能會使用 default export 或 named export 的方式來 export `Profile`，但請確保在 `App.js` 與 `Gallery.js` 中使用了相對應的 import 語法！具體方法可參考下方表格：

| 語法    | export 陳述                           | import 陳述                             |
| ------- | ------------------------------------- | --------------------------------------- |
| Default | `export default function Button() {}` | `import Button from './button.js';`     |
| Named   | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

別忘了在呼叫它們的地方 import 你的 component，因為 `Gallery` 也會使用到 `Profile`。

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js'
import { Profile } from './Gallery.js'

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  )
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```js Profile.js

```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

當你成功使用其中一種 export 方式時，請嘗試使用另一種方法實現。

<Solution>

Named export 的解決方法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js'
import { Profile } from './Profile.js'

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  )
}
```

```js Gallery.js
import { Profile } from './Profile.js'

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```js Profile.js
export function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

Default export 的解決方法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js'
import Profile from './Profile.js'

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  )
}
```

```js Gallery.js
import Profile from './Profile.js'

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  )
}
```

```js Profile.js
export default function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />
}
```

```css
img {
  margin: 0 10px 10px 0;
  height: 90px;
}
```

</Sandpack>

</Solution>

</Challenges>