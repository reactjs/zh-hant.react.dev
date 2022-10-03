---
title: 開始一個新的 React 專案
---

<Intro>

如果你正要開始一個新專案，我們推薦使用 toolchain 或是 framework。這些工具提供一個舒適的開發環境，但是本機端需要安裝 Node.js。

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks Toolchain 和 framework 有什麼差異
* How to start a project with a minimal toolchain 如何從最小的 toolchain 開始一個新專案
* How to start a project with a fully-featured framework 如何從功能完整的 framework 開始一個新專案
* What's inside popular toolchains and frameworks 流行的 toolchain 和 framework 內有些什麼

</YouWillLearn>

## 選擇你自己的冒險 {/*choose-your-own-adventure*/}

React 是一個 library，讓你透過將 UI 程式碼分解成各個稱為 component 來組織你的 UI。React 不在意你的 routing 或是 data management。對於這些功能，你將需要使用 third-party library 或是撰寫你自己的解決方案。意思是你有許多種方式可以開始一個新的 React 專案：

* [從 **HTML 文件和 script tag 開始**。](/learn/add-react-to-a-website) 這不需要設定 Node.js，但提供的功能有限。
* 從**使用 toolchain 的最小設置開始**，根據專案需求來增加功能。（非常適合的學習！）
* 從一個 **opinionated 框架** 開始，它內建有 data fetching 和 routeing 等常見功能。

## 從一個最小的 toolchain 開始 {/*getting-started-with-a-minimal-toolchain*/}

如果你是剛開始使用 React，我們推薦 [Create React App](https://create-react-app.dev/)。它是最流行嘗試 React 功能的方式，也是建立一個新的 single-page、client-side application 的好方式。它是為 React 設計的，但對 routing 或 data fetching 不是 opinionated 的。

首先，安裝 [Node.js](https://nodejs.org/en/)。接著打開你的 terminal 並且執行這行來建立一個專案：

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

現在你可以執行你的應用程式：

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

更多資訊，[請參考官方指南](https://create-react-app.dev/docs/getting-started)。

> Create React App 並不處理後端或是資料庫的邏輯。你可以將它與任何 backend 一起使用。當你建立一個專案時，你會有一個資料夾與一些靜態的 HTML、CSS 和 JS。因為 Create React App 不能利用 server，所以它不能提供最好的效能。如果你追求更快的載入時間以及內建像是 routing 或 server-side logic，我們建議您使用框架。

<<<<<<< HEAD
### 熱門替代選項 {/*popular-alternatives*/}
=======
### Popular alternatives {/*toolkit-popular-alternatives*/}
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## 用一個功能齊全的 framework 來建構 {/*building-with-a-full-featured-framework*/}

如果你想要**開始一個 production-ready 的專案**，[Next.js](https://nextjs.org/) 是一個很好的起點。Next.js 是一個用 React 建構靜態和伺服器渲染應用程式的流行、輕量級的框架。它預設包含了 routing、styling，以及 server-side rendering 等功能，讓你的可以專案快速的啟動和執行。

[Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) 教學很好的介紹使用 React 和 Next.js 來進行構建。

<<<<<<< HEAD
### 熱門替代選項 {/*popular-alternatives*/}
=======
### Popular alternatives {/*framework-popular-alternatives*/}
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## 客製化 Toolchain {/*custom-toolchains*/}

你可能更喜歡建立和設置你自己的 toolchain。Toolchain 通常包括：

* 一個 **package manager** 讓你可以安裝、升級以及管理 third-party package。熱門的 package managers：[npm](https://www.npmjs.com/)（Node.js 內建）、[Yarn](https://yarnpkg.com/)、[pnpm](https://pnpm.io/)。
* 一個 **compiler** 讓你編譯現代語法功能以及像是 JSX 或 type annotation 的額外語法給瀏覽器。熱門的 compilers：[Babel](https://babeljs.io/)、[TypeScript](http://typescript.org/)、[swc](https://swc.rs/)。
* 一個 **bundler** 讓你可以撰寫模組化的程式，並將這些模組化程式 bundle 成更小的 package 來最佳化載入時間。熱門的 bundlers： [webpack](https://webpack.js.org/)、[Parcel](https://parceljs.org/)、[esbuild](https://esbuild.github.io/)、[swc](https://swc.rs/)。
* 一個 **minifier** 讓你的程式碼更 compact 讓載入速度更快。熱門的 minifiers：[Terser](https://terser.org/), [swc](https://swc.rs/)。
* 一個 **server** 處理 server 請求，所以你可以 render component 成 HTML。熱門的 servers：[Express](https://expressjs.com/)。
* 一個 **linter** 檢查你的程式碼是否存在常見錯誤。熱門的 linters：[ESLint](https://eslint.org/)。
* 一個 **test runner** 讓你針對你的程式碼進行測試。熱門的 test runners：[Jest](https://jestjs.io/)。

如果你傾向從頭設置你自己的 JavaScript toolchain，請[查看本指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)它重新建立了一些 Create React App 的功能。Framework 通常還會提供 routing 和 data fetching 解決方案。在大型專案中，你可能還會想使用像是 [Nx](https://nx.dev/react) 或是 [Turborepo](https://turborepo.org/) 來幫助你在一個 repository 來管理多的 package。
