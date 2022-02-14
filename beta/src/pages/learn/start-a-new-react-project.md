---
title: 開始一個新的 React 專案
---

<Intro>

如果你正在學習 React 或是考慮將它加入到現有的專案，你可以透過[將 React 加入到網頁](/learn/add-react-to-a-website)快速的開始。如果你的專案將需要許多 component 以及檔案，是時候該考慮以下的選項了！

</Intro>

## 選擇你自己的冒險 {/*choose-your-own-adventure*/}

React 是一個 library，讓你透過將 UI 程式碼分解成各個稱為 component 來組織你的 UI。React 不在意你的 routing 或是 data management。對於這些功能，你將需要使用 third-party library 或是撰寫你自己的解決方案。意思是你有許多種方式可以開始一個新的 React 專案：

* 從**僅使用工具鏈的最小設置開始**，根據專案需求來增加功能。
* 從一個已經內建通用功能的 **opinionated 框架**開始。

無論你是剛開始使用 React，還是想要建立一些大專案，或者想要設定你自己的工具鏈，這份指南將會指引你走向正確的途徑。

## 開始使用 React 的工具鏈 {/*getting-started-with-a-react-toolchain*/}

如果你是剛開始使用 React，我們推薦 [Create React App](https://create-react-app.dev/)，是最流行嘗試 React 功能的方式，也是建立一個新的 single-page、client-side application 的好方式。Create React App 是一個專門為 React 設置的 unopinionated 工具鏈。工具鏈有助於解決以下問題：

* 擴展到許多檔案以及 component
* 從 npm 使用 third-party library
* 提早發現常見錯誤
* 在開發中即時的編輯 CSS 以及 JS
* 針對 production 進行最佳化的輸出

你可以在 terminal 中使用一行指令來開始建構 Create React App！(**請確認你已經安裝了 [Node.js](https://nodejs.org/)！**)

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

現在你可以執行你的應用程式：

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

更多資訊，[請參考官方指南](https://create-react-app.dev/docs/getting-started)。

> Create React App 並不處理後端或是資料庫的邏輯；它只建立了一個前端的建構管道。意思是你可以搭配任何的後端使用。如果你正在尋找更多像是 routing 和 server-side 邏輯的功能，請繼續閱讀下去！

### 其他選項 {/*other-options*/}

Create React App 對於開始使用 React 是很棒的，但如果你想要一個更輕量的工具鏈，你可以嘗試其他流行的工具鏈：

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## 使用 React 和一個框架進行建構 {/*building-with-react-and-a-framework*/}

如果你想要開始一個龐大、production-ready 的專案，[Next.js](https://nextjs.org/) 是一個很好的起點。Next.js 是一個用 React 建構靜態和伺服器渲染應用程式的流行、輕量級的框架。它預設包含了 routing、styling，以及 server-side rendering 等功能，讓你的可以專案快速的啟動和執行。

[開始使用 Next.js 建構](https://nextjs.org/docs/getting-started)的官方指南。

### 其他選項 {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) 讓你用 React 和 GraphQL 來產生靜態網站。
* [Razzle](https://razzlejs.org/) 是一個不需要任何設置的 server-rendering 框架，但是比 Next.js 提供更多彈性。

## 客製化工具鏈 {/*custom-toolchains*/}

你可能更喜歡建立和設置你自己的工具鏈。JavaScript 建構工具鏈通常由以下部分所組成：

<<<<<<< HEAD
* 一個 **package manager** — 讓你可以安裝、升級以及管理 third-party package。[Yarn](https://yarnpkg.com/) 和 [npm](https://www.npmjs.com/) 是兩個最流行的 package manager。
* 一個 **bundler** — 讓你可以撰寫模組化的程式，並將這些模組化程式 bundle 成更小的 package 來最佳化載入時間。[Webpack](https://webpack.js.org/)、[Snowpack](https://www.snowpack.dev/)、[Parcel](https://parceljs.org/) 是一些流行的 bundler。
* 一個 **compiler** — 讓你可以撰寫現代化的 JavaScript 程式且仍然可以在舊的瀏覽器執行。[Babel](https://babeljs.io/) 就是一個這樣的例子。
=======
* A **package manager**—lets you install, update and manage third-party packages. [Yarn](https://yarnpkg.com/) and [npm](https://www.npmjs.com/) are two popular package managers.
* A **bundler**—lets you write modular code and bundle it together into small packages to optimize load time. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/) are several popular bundlers.
* A **compiler**—lets you write modern JavaScript code that still works in older browsers. [Babel](https://babeljs.io/) is one such example.
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025

在大型專案中，你可能也希望有工具可以在單一個 repository 內管理多個 package。[Nx](https://nx.dev/react) 就是這一種工具的例子。

如果你傾向從頭設置你自己的 JavaScript 工具鏈，請[查看本指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)它重新建立了一些 Create React App 的功能。
