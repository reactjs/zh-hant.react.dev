---
title: 開始一個新的 React 專案
---

<Intro>

<<<<<<< HEAD
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
=======
If you're starting a new project, we recommend to use a toolchain or a framework. These tools provide a comfortable development environment but require a local Node.js installation.

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks
* How to start a project with a minimal toolchain
* How to start a project with a fully-featured framework
* What's inside popular toolchains and frameworks

</YouWillLearn>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. This means there are several ways to start a new React project:

* [Start with an **HTML file and a script tag**.](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.

## Getting started with a minimal toolchain {/*getting-started-with-a-minimal-toolchain*/}

If you're **learning React,** we recommend [Create React App](https://create-react-app.dev/). It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js](https://nodejs.org/en/). Then open your terminal and run this line to create a project:
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

現在你可以執行你的應用程式：

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

更多資訊，[請參考官方指南](https://create-react-app.dev/docs/getting-started)。

<<<<<<< HEAD
> Create React App 並不處理後端或是資料庫的邏輯；它只建立了一個前端的建構管道。意思是你可以搭配任何的後端使用。如果你正在尋找更多像是 routing 和 server-side 邏輯的功能，請繼續閱讀下去！

### 其他選項 {/*other-options*/}

Create React App 對於開始使用 React 是很棒的，但如果你想要一個更輕量的工具鏈，你可以嘗試其他流行的工具鏈：
=======
> Create React App doesn't handle backend logic or databases. You can use it with any backend. When you build a project, you'll get a folder with static HTML, CSS and JS. Because Create React App can't take advantage of the server, it doesn't provide the best performance. If you're looking for faster loading times and built-in features like routing and server-side logic, we recommend using a framework instead.

### Popular alternatives {/*popular-alternatives*/}
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)

<<<<<<< HEAD
## 使用 React 和一個框架進行建構 {/*building-with-react-and-a-framework*/}

如果你想要開始一個龐大、production-ready 的專案，[Next.js](https://nextjs.org/) 是一個很好的起點。Next.js 是一個用 React 建構靜態和伺服器渲染應用程式的流行、輕量級的框架。它預設包含了 routing、styling，以及 server-side rendering 等功能，讓你的可以專案快速的啟動和執行。

[開始使用 Next.js 建構](https://nextjs.org/docs/getting-started)的官方指南。

### 其他選項 {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) 讓你用 React 和 GraphQL 來產生靜態網站。
* [Razzle](https://razzlejs.org/) 是一個不需要任何設置的 server-rendering 框架，但是比 Next.js 提供更多彈性。
=======
## Building with a full-featured framework {/*building-with-a-full-featured-framework*/}

If you're looking to **start a production-ready project,** [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

The [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) tutorial is a great introduction to building with React and Next.js.

### Popular alternatives {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

## 客製化工具鏈 {/*custom-toolchains*/}

<<<<<<< HEAD
你可能更喜歡建立和設置你自己的工具鏈。JavaScript 建構工具鏈通常由以下部分所組成：

* 一個 **package manager** — 讓你可以安裝、升級以及管理 third-party package。[Yarn](https://yarnpkg.com/) 和 [npm](https://www.npmjs.com/) 是兩個最流行的 package manager。
* 一個 **bundler** — 讓你可以撰寫模組化的程式，並將這些模組化程式 bundle 成更小的 package 來最佳化載入時間。[Webpack](https://webpack.js.org/)、[Snowpack](https://www.snowpack.dev/)、[Parcel](https://parceljs.org/) 是一些流行的 bundler。
* 一個 **compiler** — 讓你可以撰寫現代化的 JavaScript 程式且仍然可以在舊的瀏覽器執行。[Babel](https://babeljs.io/) 就是一個這樣的例子。

在大型專案中，你可能也希望有工具可以在單一個 repository 內管理多個 package。[Nx](https://nx.dev/react) 就是這一種工具的例子。

如果你傾向從頭設置你自己的 JavaScript 工具鏈，請[查看本指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)它重新建立了一些 Create React App 的功能。
=======
You may prefer to create and configure your own toolchain. A toolchain typically consists of:

* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](http://typescript.org/), [swc](https://swc.rs/).
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc](https://swc.rs/).
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express](https://expressjs.com/).
* A **linter** checks your code for common mistakes. Popular linters: [ESLint](https://eslint.org/).
* A **test runner** lets you run tests against your code. Popular test runners: [Jest](https://jestjs.io/).

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react).

>>>>>>> 26a870e1c6e232062b760d37620d85802750e985
