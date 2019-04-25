---
id: create-a-new-react-app
title: 建立全新的 React 應用程式
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

使用整合的 toolchain 以得到最佳的使用者和開發者體驗。

本頁將介紹一些受歡迎的 React toolchain，它們有助於以下的工作：

* 擴大文件和 component 的規模。
* 使用來至 npm 的第三方函式庫。
* 偵測早期常見的錯誤。
* 實時在開發環境裡編輯 CSS 和 JS。
* 最佳化線上環境輸出。

本頁所建議的 toolchain 都**不需要進行任何設定就能開始使用**。

## 你可能不需要 Toolchain {#you-might-not-need-a-toolchain}

如果你沒有碰到以上所提到的問題，或者還沒有習慣使用 JavaScript 的工具，你可以考慮[在 HTML 網頁裡加上 `<script>` 標籤來使用 React](/docs/add-react-to-a-website.html)，以及[使用可選的 JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)。

這也是**將 React 加上到現存網頁裡最簡單的方法**。當你覺得使用大型的 toolchain 對你有幫助，你也可以隨時把它們加入！

## 推薦的 Toolchain {#recommended-toolchains}

React 團隊主要推薦以下的方案：

- 如果你正在**學習 React** 或**建立全新的 single-page 應用程式**，請使用 [Create React App](#create-react-app)。
- 如果你正在建立一個**使用 Node.js 的 server-rendered 網頁**，請使用 [Next.js](#nextjs)。
- 如果你正在建立一個**靜態內容的網頁**，請使用 [Gatsby](#gatsby)。
- 如果你正在建立一個 **component 函式庫**或**與現存程式碼倉庫進行接軌**，請使用[更靈活的 Toolchain](#more-flexible-toolchains)。

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) 是一個適合**學習 React** 的環境，而且也是使用 React 建立一個**全新的 [single-page](/docs/glossary.html#single-page-application) 應用程式**的最佳方法。

它會為你設定好開發環境，以便你能夠使用最新的 JavaScript 特性，提供良好的開發者體驗，並且為線上環境最佳化你的應用程式。你需要在你的機器上安裝 Node >= 6 和 npm >= 5.2。要建立項目，請執行：

```bash
npx create-react-app my-app
cd my-app
npm start
```

>提示
>
>`npx` 不是拼寫錯誤 —— 它是一個 [npm 5.2+ 附帶的 package 執行器](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)。

Create React App 並不會處理 backend 邏輯或資料庫；它只會建立一個 frontend build pipeline，以便你配合任何 backend 來使用。基本上，它是使用 [Babel](https://babeljs.io/) 和 [webpack](https://webpack.js.org/)，但你不需要了解任何關於它們的細節。

當你準備好發佈到線上環境，執行 `npm run build` 會在 `build` 文件夾裡建立一個你的應用程式的最佳化版本，你可以從 Create React App 的 [README](https://github.com/facebookincubator/create-react-app#create-react-app--) 和 [使用者指南](https://facebook.github.io/create-react-app/)了解更多資訊。

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) 是一個受歡迎和輕量的框架，用於使用 React 所建立的**靜態和 server-rendered 的應用程式**。它自身已包括了 **styling 和 routing 的方案**，而且它假設你在使用 [Node.js](https://nodejs.org/) 作為伺服器環境。

從 [Next.js 的官方指南](https://nextjs.org/learn/)了解更多。

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) 是使用 React 建立**靜態網頁**的最佳方法。它讓你使用 React component，但會輸出 pre-rendered HTML 和 CSS 來保證最快的載入時間。

從 [Gatsby 的官方指南](https://www.gatsbyjs.org/docs/)和 [starter kit 範例集](https://www.gatsbyjs.org/docs/gatsby-starters/)了解更多。

### 更靈活的 Toolchain {#more-flexible-toolchains}

以下的 toolchain 會提供更多的靈活性和選擇。我們推薦給比較有經驗的使用者：

- **[Neutrino](https://neutrinojs.org/)** 結合了 [webpack](https://webpack.js.org/) 強大的功能與簡單的預設，並包括了 [React 應用程式](https://neutrinojs.org/packages/react/)和 [React component](https://neutrinojs.org/packages/react-components/) 的預設。

- **[nwb](https://github.com/insin/nwb)** 特別適合用作[將 React component 發佈到 npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb)。它也[可以用作](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb)建立 React 應用程式。

- **[Parcel](https://parceljs.org/)** 是一個快速、零設定的網路應用程式 bundler，並且[可以配合 React](https://parceljs.org/recipes.html#react) 一起使用。

- **[Razzle](https://github.com/jaredpalmer/razzle)** 是一個不需要設定的 server-rendering 框架，但它比 Next.js 提供更多的靈活性。

## 從零開始建立 Toolchain {#creating-a-toolchain-from-scratch}

一個 JavaScript 的建立 toolchain 通常包括：

* 一個 **package 管理員**，例如 [Yarn](https://yarnpkg.com/) 或 [npm](https://www.npmjs.com/)。它能讓你充分利用數量龐大的第三方 package，並且輕鬆的安裝或更新它們。

* 一個 **bundler**，例如 [webpack](https://webpack.js.org/) 或 [Parcel](https://parceljs.org/)。它能讓你編寫模組化的程式碼，並將它們組合成小小的 package 以最佳化載入時間。

* 一個 **compiler**，例如 [Babel](https://babeljs.io/)。它能讓你編寫現代 JavaScript 程式碼，並可以在舊版本的瀏覽器裡使用。

如果你傾向從零開始設定屬於自己的 JavaScript toolchain，請[查看這指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)，它會重新建立一些 Create React App 的功能。

別忘了確保你的自訂 toolchain 有[為線上環境進行正確的設定](/docs/optimizing-performance.html#use-the-production-build)。
