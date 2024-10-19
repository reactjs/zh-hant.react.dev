---
title: 開始一個新的 React 專案
---

<Intro>

如果你想要完全使用 React 建立一個新的應用程式或網站，我們建議選擇一個在社群中廣受歡迎的 React 驅動框架。

</Intro>


你可以在沒有框架的情況下使用 React，然而我們發現大多數應用程式和網站最終都會為一些常見問題構建解決方案，例如 code-splitting、routing、data fetching 以及和產生 HTML。這些問題對所有的 UI library 來說都是常見的，不僅僅是 React。

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## 生產級別的 React 框架 {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) 是一個 full-stack 的 React 框架。**它非常靈活，允許你建立任何規模的 React 應用程式——從主要是靜態的部落格到複雜的動態應用程式。要建立一個新的 Next.js 專案，可以在終端執行以下指令：

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

如果你是第一次使用 Next.js，請參考[學習 Next.js 課程。](https://nextjs.org/learn)

Next.js 是由 [Vercel](https://vercel.com/) 維護。你可以將 [Next.js 應用程式部署](https://nextjs.org/docs/app/building-your-application/deploying)到任何 Node.js 或 serverless 主機，或是你自己的伺服器上。Next.js 也支援 [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)，它不需要伺服器。

### Remix {/*remix*/}

**[Remix](https://remix.run/) 是一個具有巢狀路由（nested route）的全端 React 框架。** 它讓你將應用程式分解成巢狀的部分，這些部分可以平行載入資料，並根據使用者的操作更新。要建立新的 Remix 專案，執行：

<TerminalBlock>
npx create-remix
</TerminalBlock>

如果你是第一次使用 Remix，請參考 Remix [部落格教學](https://remix.run/docs/en/main/tutorials/blog)（短篇）以及[應用程式教學](https://remix.run/docs/en/main/tutorials/jokes)（長篇）。

Remix 是由 [Shopify](https://www.shopify.com/) 維護。當你建立 Remix 專案時，需要[選擇部署目標](https://remix.run/docs/en/main/guides/deployment)。你可以使用或撰寫一個 [adapter](https://remix.run/docs/en/main/other-api/adapter)，將 Remix 應用程式部署到任何 Node.js 或 serverless 主機上。

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) 是一個用於快速 CMS 支援網站的 React 框架。** 它豐富的外掛生態系，以及 GraphQL 資料層，簡化了將內容、API 和服務整合到一個網站中。要建立新的 Gatsby 專案，請執行以下命令：

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

如果你是第一次使用 Gatsby，請參考 [Gatsby 教學](https://www.gatsbyjs.com/docs/tutorial/)。

Gatsby 由 [Netlify](https://www.netlify.com/) 維護。你可以將完全靜態的 [Gatsby 網站部署](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)到任何靜態主機上。如果你選擇使用 server-only 的功能，請確保你的主機供應商支援它們用於 Gatsby。

### Expo（針對 native apps） {/*expo*/}

**[Expo](https://expo.dev/) 讓你可以建立有著完全原生的 UI ，且通用於 Android、iOS 和 Web 的應用程式。** 它提供了一個 [React Native](https://reactnative.dev/) 的 SDK，使原生部分更容易使用。要建立新的 Expo 專案，請執行：

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

如果你是第一次使用 Expo，請參考 [Expo 教學](https://docs.expo.dev/tutorial/introduction/)。

Expo 由 [Expo（公司）](https://expo.dev/about)維護。使用 Expo 構建應用程式是免費的，你可以無限制地將它們提交到 Google 和 Apple 應用商店。另外，Expo 還提供可選的付費雲服務。

## 前沿的 React 框架 {/*bleeding-edge-react-frameworks*/}

當我們探索如何繼續改進 React 時，我們意識到更緊密地將 React 與框架整合（特別是 routing、bundling 和伺服器技術），是我們幫助 React 使用者構建更好應用程式的大好機會。Next.js 團隊已同意與我們合作研究、開發、整合和測試與框架無關（framework-agnostic）的前沿 React 功能，像是 [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) 。

這些功能每天都越來越接近 production-ready，我們已與其他 bundler 和框架開發人員進行了交談，以整合它們。我們的希望是，在一年或兩年內，此頁面上列出的所有框架都將完全支持這些功能。（如果你是一位框架作者，有興趣與我們合作實驗這些功能，請告訴我們！）

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js 的 App Router](https://nextjs.org/docs) 是 Next.js API 的重新設計，旨在實現 React 團隊的全端架構願景。**它允許你在執行於伺服器上或甚至是構建期間的 asynchronous component 中取得資料。

Next.js 是由 [Vercel](https://vercel.com/) 維護。你可以將 [Next.js 應用程式部署](https://nextjs.org/docs/app/building-your-application/deploying)到任何 Node.js 或 serverless 主機，或是你自己的伺服器上。Next.js 還支援 [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)，不需要伺服器即可執行。

<DeepDive>

#### React 團隊的全端架構願景包含哪些特點？ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js 的 App Router bundler 完全實作了官方的 [React Server Components 規範](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)。這讓你可以在單個 React tree 中混合 build-time、server-only 和和互動式元件。

例如，你可以將一個 server-only 的 React component 撰寫為 `async` 函式，該函式從資料庫或文件中讀取資料。然後，你可以將資料從該 component 傳遞給互動式 component：

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js 的 App Router 也整合了[使用 Suspense 進行 data fetching](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)。這讓你可以直接在 React tree 中為使用者介面不同部分指定載入狀態（例如：skeleton placeholder）：

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components 和 Suspense 是 React 的功能，而不是 Next.js 的。然而，在框架層面採用它們需要計畫和以及複雜的實現工作。目前，Next.js APP Router 是最完整的實現方式。React 團隊正在與 bundler開發人員合作，使這些功能在下一代框架中更容易實現。

</DeepDive>
