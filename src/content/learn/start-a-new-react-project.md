---
title: 開始一個新的 React 專案
---

<Intro>

如果你想要完全使用 React 建立一個新的應用程式或網站，我們建議選擇一個在社群中廣受歡迎的 React 驅動框架。

</Intro>


你可以在沒有框架的情況下使用 React，然而我們發現大多數應用程式和網站最終都會為一些常見問題構建解決方案，例如 code-splitting、routing、data fetching 以及和產生 HTML。這些問題對所有的 UI library 來說都是常見的，不僅僅是 React。

通過從框架開始，你可以快速上手 React，並避免最終需要自己建構一個框架。

<DeepDive>

#### 我可以在沒有框架的情況下使用 React 嗎？ {/*can-i-use-react-without-a-framework*/}

你絕對可以在沒有框架的情況下使用 React ——這就是你[在頁面的一部分中使用 React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)的方式。**但是，如果你完全使用 React 建立新應用程式或網站，我們建議使用框架。**

原因如下。

即使一開始你不需要 routing 或 data fetching，你可能很快就會想為它們加入一些 library。隨著每新增一個功能，JavaScript 的 bundle 會逐漸增大，你可能需要想辦法為每個 route 單獨分割程式碼。隨著 data fetching 需求變得更複雜，你可能會遇到伺服器與客戶端的網路 waterfall 效應，這會讓你的應用程式感覺非常慢。當你的使用者群體包括更多網路條件差或低端設備的使用者時，你可能需要從 component 產生 HTML，以便提早顯示內容——無論是在伺服器上，還是在建構時。將你的設定更改為在伺服器或建置過程中執行部分程式碼可能會非常棘手。

**這些問題並非 React 特有。這就是為什麼 Svelte 有 SvelteKit，Vue 有 Nuxt 等框架**。如果你想自己解決這些問題，你需要將你的 bundler 與 routing 和 data fetching 整合。雖然讓初始設定執行起來不難，但要建立一個即使隨著應用程式擴展仍能快速載入的應用程式，涉及許多微妙之處。你會希望發送最少量應用程式的程式碼，但同時在一次客戶端與伺服器的往返中傳送頁面所需的所有資料。你可能會希望在 JavaScript 程式碼執行之前，頁面已經具備互動性，以支援漸進式增強。你還可能會希望為你的行銷頁面生成一個完全靜態的 HTML 文件夾，這樣它們可以在任何地方託管，並且即使 JavaScript 被禁用也能執行。構建這些功能需要投入相當的精力。

**此頁面的 React 框架預設解決了這些問題，無需你額外處理。** 它們允許你從一個非常精簡的應用程式開始，然後根據需求進行擴充。每個 React 框架都有其社群，因此尋找問題的答案和升級工具會更容易。框架也為你的程式碼提供了結構，幫助你和其他人在不同項目之間保持 context 和技能。相反地，使用自定義設定時，你更容易陷入不受支援的依賴版本中，最終會構建出你自己的框架——儘管它沒有社群或升級路徑（而且如果像我們過去所做的一樣，設計可能更隨意）。

<<<<<<< HEAD
如果你的應用程式有這些框架無法很好滿足的特殊限制，或者你更喜歡自己解決這些問題，你可以使用 React 建立自己的自定義設定。從 npm 下載 `react` 和 `react-dom`，使用像 [Vite](https://vitejs.dev/) 或 [Parcel](https://parceljs.org/) 這樣的 bundler 設定自定義建構過程，然後根據需求增加其他工具，用於 routing、靜態生成或伺服器端渲染等功能。
=======
If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vite.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.
>>>>>>> 91614a51a1be9078777bc337ba83fc62e606cc14

</DeepDive>

## 生產級別的 React 框架 {/*production-grade-react-frameworks*/}

這些框架支援你在 production 環境中部署和擴充應用程式所需的所有功能，並正在努力支持我們的 [full-stack 架構願景](#which-features-make-up-the-react-teams-full-stack-architecture-vision)。我們推薦的所有框架都是開源的，擁有活躍的社區提供支援，並且可以部署到你自己的伺服器或託管提供商。如果你是框架作者，有興趣被列入這個清單，[請讓我們知道](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)。

### Next.js {/*nextjs-pages-router*/}

**[Next.js 的 Pages Router](https://nextjs.org/) 是一個 full-stack 的 React 框架**。它非常靈活，允許你建立任何規模的 React 應用程式——從主要是靜態的部落格到複雜的動態應用程式。要建立一個新的 Next.js 專案，可以在終端執行以下指令：

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
