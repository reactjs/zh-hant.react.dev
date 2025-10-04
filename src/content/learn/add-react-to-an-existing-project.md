---
title: 將 React 加入到一個現有的專案
---

<Intro>

如果你想要為現有的專案新增一些互動性，你不必重新使用 React 重寫它。將 React 加入到現有技術棧中，並且在任何地方 render 互動的 React component。

</Intro>

<Note>

**你需要在開發環境安裝 [Node.js](https://nodejs.org/en/)。** 雖然你可以在線上或是使用簡單的 HTML 頁面[嘗試 React](/learn/installation#try-react)，但實際上，大多數你想要用於開發的 JavaScript 工具都需要 Node.js。

</Note>

## 將 React 用於你現有網站的整個子路由上 {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

假設你有一個現有的網站應用程式在 `example.com`，使用其他伺服器技術（例如 Rails）建構，你想要在 `example.com/some-app/` 開頭的所有 route 使用 React。

以下是我們推薦的設定方式：

1. 使用其中一個[基於 React 的框架]((/learn/start-a-new-react-project))來**建構你的應用程式中的 React 部分**。
2. **在你的框架設定中指定 `/some-app` 作為*基本路徑***。（這裡是如何設定：[Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)、[Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/))。
3. **設定你的伺服器或代理**，讓所有在 `/some-app/` 下的請求都由 React 應用程式處理。

這可確保你的應用程式的 React 部分可以[受益於融入這些框架的最佳實踐](/learn/build-a-react-app-from-scratch#consider-using-a-framework)。

許多基於 React 的框架都是 full-stack，可以讓你的 React 應用程式獲得伺服器的優勢。然而，但即使你不能或不想在伺服器上執行 JavaScript，也可以使用相同的方法。在這種情況下，請將 HTML/CSS/JS 匯出（例如 Next.js 的 [`next export` 輸出](https://nextjs.org/docs/advanced-features/static-html-export)、Gatsby 的預設匯出）放在 `/some-app/` 上。

## 在現有的部分頁面使用 React {/*using-react-for-a-part-of-your-existing-page*/}

假設你有一個使用其他技術（例如伺服器像是 Rails 或客戶端像是 Backbone）建立的現有頁面，並且你想在該頁面上某處呈現互動式的 React component。這是整合 React 的常見方式 - 事實上，在 Meta 多年來大部分 React 使用情況都是如此！

你可以透過以下兩個步驟：

1. **設定一個 JavaScript 環境**，讓你可以使用 [JSX 語法](/learn/writing-markup-with-jsx)，並使用 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 語法將你的程式碼分成模組，同時從 [npm](https://www.npmjs.com/) package registry 中使用 package（例如 React）。
2. 在頁面上你想要看得的地方 **render 你的 React component**。

確切的方法取決於你現有的頁面的設定，讓我們逐步了解一些細節。

### 步驟一：建立模組化的 JavaScript 環境 {/*step-1-set-up-a-modular-javascript-environment*/}

一個模組化的 JavaScript 環境讓你可以將 React component 寫在單獨的檔案中，而不是全部寫在一個檔案中。它還允許你使用所有其他開發者在 [npm](https://www.npmjs.com/) registry 上發佈的 package，包括 React 本身！如何做這取決於你現有的設定：

* **如果你的應用程式已經拆分成使用 `import` 語句的檔案**，請嘗試使用你已經設定好的設定。檢查在你的 JS 程式碼中寫入 `<div />` 是否會導致語法錯誤。如果它導致了語法錯誤，則可能需要[使用 Babel 轉換你的 JavaScript 程式碼](https://babeljs.io/setup)，並啟用 [Babel React preset](https://babeljs.io/docs/babel-preset-react) 來使用 JSX。

* **如果你的應用程式沒有現有的 JavaScript module 的編譯設定**，請使用 [Vite](https://vitejs.dev/) 進行設定。Vite 社群維護[與後端框架的多個整合](https://github.com/vitejs/awesome-vite#integrations-with-backends)，包括 Rails、Django 和 Laravel。如果你的後端框架未被列出，請[按照此指南](https://vite.dev/guide/backend-integration.html)手動將 Vite 建構與你的後端整合。

為了檢查你的設定是否正常運作，請在你的專案資料夾中執行此命令：

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

然後在你的主要 JavaScript 檔案（可能叫做 `index.js` 或 `main.js`）的頂部加入這些程式碼：

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

如果你的整個網頁內容都被替換成了「Hello, world!」，那麼一切正常！請繼續閱讀。

<Note>

將一個模組化的 JavaScript 環境整合到現有專案中，對於第一次嘗試的人來說可能會感到令人生畏，但它是值得的！如果你卡住了，請嘗試使用我們的[社群資源](/community)或 [Vite Chat](https://chat.vite.dev/)。

</Note>

### 步驟二：在頁面上的任何位置 render React component {/*step-2-render-react-components-anywhere-on-the-page*/}

在前一步驟中，你將此程式碼放在主檔案的頂部：

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

當然，你實際上不想清除現有的 HTML 內容！

刪除這段程式碼。

相反地，你可能想要在 HTML 中的特定位置 render 你的 React component。打開你的 HTML 頁面（或產生它的 server template），並為任何 tag 加入一個唯一的 [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute，例如：

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

這讓你可以使用 [`document.getElementById`](https://developer.mozilla.org/zh-TW/docs/Web/API/Document/getElementById) 找到該 HTML 元素，並將其傳遞給 [`createRoot`](/reference/react-dom/client/createRoot)，以便你可以在其中 render 自己的 React component：

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

注意原始的 HTML 內容從 `index.html` 被保留下來，但是你自己的 `NavigationBar` React component 現在出現在你 HTML 中的 `<nav id="navigation">` 內。閱讀 [`createRoot` 使用文件](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)以了解更多關於在現有 HTML 頁面中 render React component 的資訊。

當你在現有的專案中採用 React 時，通常會從小的互動式 component（如按鈕）開始，然後逐漸「向上移動」，直到最終整個頁面都是使用 React 建構的。如果你達到了那裡，我們建議立即遷移到[一個 React 框架](/learn/start-a-new-react-project) ，以充分利用 React 的優勢。

## 在現有的原生手機應用程式中使用 React Native {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) 也可以逐步地整合到現有的原生應用程式中。如果你已經有一個 Android（Java 或 Kotlin）或 iOS（Objective-C 或 Swift）的原生應用程式，請[按照此指南](https://reactnative.dev/docs/integration-with-existing-apps)將 React Native 畫面加入到其中。
