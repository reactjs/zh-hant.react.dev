---
title: 導入及導出 Component
---

<Intro>

Component 的神奇之處在於它的可複用性： 你可以創建一個由其他 component 組成的 component。但當你嵌套越來越多 component，則需要開始將它們拆分為不同的檔案。這將會提升檔案的閱讀性，也能讓 component 重複應用在更多地方。

</Intro>

<YouWillLearn>

* 什麼是根 component 檔案
* 如何導入以及導出一個 component
* 何時使用預設和具名導入導出
* 如何從一個檔案導入以及導出多個 component
* 如何將 component 拆分為多個檔案

</YouWillLearn>

## 根 component 檔案 {/*the-root-component-file*/}

在 [你的第一個 Component](/learn/your-first-component) 中，你創建了一個 `Profile` component，並且 render 在 `Gallery` component 裡：

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

在此範例中，目前所有的 component 都定義在名為 `App.js` 的**根 component 檔案**中。在 [Create React App](https://create-react-app.dev/) 中，你的應用程式應在 `src/App.js` 檔案中定義。根據你的配置，根 component 可能會位於其他檔案中。如果你使用像是 Next.js 這種基於檔案進行路由的框架，那你每個頁面的根 component 都會不一樣。

## 導出以及導入一個 component {/*exporting-and-importing-a-component*/}

如果將來你想要改變首頁，在此頁面放入科學書籍列表，或者需要將所有的資料移至其他檔案中。將 `Gallery` 以及 `Profile` 移出根 component 檔案會更加合理。這將會使它們更加模組化，並且可以在其他檔案中複用。你可以透過以下三個步驟拆分 component：

1. **創建** 一個新的 JS 檔案來存放該 component
2. **導出** 該檔案中的 component 函式（可以使用 [預設導出](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 或 [具名導出](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)）
3. 在需要使用該 component 的檔案中**導入**（可以根據相應的導出方式使用 [預設導入](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 或 [具名導入](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)）

這裡將 `Profile` 與 `Gallery` 從 `App.js` 檔案中移出，並放入一個名為 `Gallery.js` 的新檔案中。現在，你可以在 `App.js` 導入 `Gallery.js` 中的 `Gallery`：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

請注意此範例是如何將 component 拆分為兩個檔案：

1. `Gallery.js`:
     - 定義了 `Profile` component，該 component 僅在同個檔案中使用，並沒有被導出。
     - 使用**預設導出**的方式， 導出 `Gallery` component
2. `App.js`:
     - 使用**預設導入**的方式，從 `Gallery.js` 導入 `Gallery`
     - 使用**預設導出**的方式，導出根 component `App`


<Note>

你可能會遇到沒有寫上副檔名 `.js` 的狀況：

```js 
import Gallery from './Gallery';
```

不管是 `'./Gallery.js'` 還是 `'./Gallery'` 都可以在 React 中運行，但前者更貼近 [原生 ES 模組](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)。

</Note>

<DeepDive>

#### 預設導出 vs 具名導出 {/*default-vs-named-exports*/}

JavaScript 有兩種主要用來導出值的方式：預設導出以及具名導出。 目前為止，我們的範例只有用到預設導出。但你可以在同一個檔案中，選擇使用其中一種，或者兩種都使用。**一個檔案中僅能有一個預設導出，但可以有多個具名導出**。

![預設導出以及具名導出](/images/docs/illustrations/i_import-export.svg)

Component 的導出方式決定了其導入方式。當你試著用預設導入，導入具名導出的 component 時將會報錯！下方圖表可以幫助你更好地理解它們：

| 語法           | 導出陳述                           | 導入陳述                          |
| -----------      | -----------                                | -----------                               |
| 預設  | `export default function Button() {}` | `import Button from './button.js';`     |
| 具名    | `export function Button() {}`         | `import { Button } from './button.js';` |

當使用預設導入時，你可以在 `import` 後使用任意命名。例如 `import Banana from './button.js'`，你仍舊可以獲取一致的預設導出內容。相反地，對於具名導入，導入與導出的名稱必須一致。這也是為什麼它們被稱為 _具名_ 導入！

**當檔案中只需要導出一個 component 時，人們通常會使用預設導出，當檔案包含多個 component 或值需要導出時，則會使用具名導出**。無論你偏好哪種方式，請記得給予 component 以及對應檔案一個有意義的命名。不建議使用未命名的 component，像是 `export default () => {}`，這將導致除錯變得困難。

</DeepDive>

## 從同一檔案導出及導入多個 component {/*exporting-and-importing-multiple-components-from-the-same-file*/}

如果你只想要展示一個 `Profile`，而非整個圖集。你也可以導出 `Profile` component。但是 `Gallery.js` 已經包含 *預設* 導出，你不能 _兩個_ 預設導出。你可以創建一個新檔案以進行預設導出，或是你可以將 `Profile` 進行 *具名* 導出。**同一檔案只能有一個預設導出，但可以有多個具名導出！**

> 為了減少預設導出和具名導出之間的混淆，有些團隊會選擇只使用其中一種風格（預設或具名），或者避免在同一個檔案中混合使用。這因人而異，選擇最適合你的即可！

首先，使用具名導出的方式，將 `Profile` 從 `Gallery.js` **導出**（不使用 `default` 關鍵字）：

```js
export function Profile() {
  // ...
}
```

接著，使用具名導入的方式，從 `Gallery.js` **導入** `Profile` 至 `App.js`（使用大括號）：

```js
import { Profile } from './Gallery.js';
```

最後，在 `App` component 中 **render** `<Profile />`：

```js
export default function App() {
  return <Profile />;
}
```

現在 `Gallery.js` 包含兩個導出：一個是預設導出的 `Gallery`，一個是具名導出的 `Profile`。`App.js` 均導入了它們。請試著將下方範例中的 `<Profile />` 改為 `<Gallery />`：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

現在，你混合使用了預設導出以及具名導出：

* `Gallery.js`:
  - 使用 **具名導出** 的方式，導出 `Profile` component，並命名為 `Profile`。
  - 使用 **預設導出** 的方式，導出 `Gallery` component。
* `App.js`:
  - 使用 **具名導入** 的方式，從 `Gallery.js` 導入 `Profile`，並命名為 `Profile`。 
  - 使用 **預設導入** 的方式，從 `Gallery.js` 導入 `Gallery`。
  - 使用 **預設導出** 的方式，導出根 component `App`。

<Recap>

在本章節中，你學到了：

* 什麼是根 component 檔案
* 如何導入以及導出一個 component
* 何時使用預設和具名導入導出
* 如何從一個檔案導入以及導出多個 component
* 如何將 component 拆分為多個檔案

</Recap>



<Challenges>

#### 進一步拆分 component {/*split-the-components-further*/}

現在，`Gallery.js` 同時導出了 `Profile` 與 `Gallery`，這會讓人感到有些混淆。

試著將 `Profile` component 移至 `Profile.js`，然後更新 `App` component，依序 render `<Profile />` 與 `<Gallery />`。

你可能會使用預設導出或具名導出的方式來導出 `Profile`，但請確保在 `App.js` 與 `Gallery.js` 中使用了相對應的導入語法！具體方法可參考下方表格：

| 語法           | 導出陳述                           | 導入陳述                          |
| -----------      | -----------                                | -----------                               |
| 預設  | `export default function Button() {}` | `import Button from './button.js';`     |
| 具名    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

別忘了在呼叫它們的地方導入你的 component，因為 `Gallery` 也會使用到 `Profile`。

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
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

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

當你成功使用其中一種導出方式時，請嘗試使用另一種方法實現。

<Solution>

具名導出的解決方法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

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

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

預設導出的解決方法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

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

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
