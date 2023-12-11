---
title: 開始一個新的 React 專案
---

<Intro>

如果你想要完全使用 React 建立新的應用程式或網站，我們建議從社群中流行的 React 框架中選擇一個。框架提供大多數應用程式和網站最終需要的功能，包括路由（routing）、資料擷取（data fetching）和產生 HTML。

</Intro>

<Note>

**你需要在你的本機開發環境安裝 [Node.js](https://nodejs.org/en/)。** 你*也*可以選擇使用 Node.js 在 production 環境，但你不需要這麼做。許多 React 框架支援匯出靜態的 HTML/CSS/JS 文件。

</Note>

## 生產級別的 React 框架 {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) 是一個全端 React 框架。** 它非常靈活，讓你可以建立任何大小的 React 應用程式 - 從大部分是靜態的部落格到複雜動態的應用程式。要建立新的 Next.js 專案，在你的終端機中執行以下命令：

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
如果你是第一次使用 Next.js，請參考 [Next.js 教學](https://nextjs.org/learn/foundations/about-nextjs)。
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

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

<DeepDive>

#### 我可以只使用 React 而沒有框架嗎？ {/*can-i-use-react-without-a-framework*/}

你絕對可以在沒有框架的情況下使用 React--這是你如何[在頁面的一部分中使用 React。](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **然而，如果你正在完全使用 React 建立一個新的應用程式或網站，我們建議你使用框架。**

以下是為什麼這麼做的原因。

即使在一開始可能不需要 routing 或是 data fetching，你可能還是想要增加一些相關的函式庫。隨著每個新功能的加入，JavaScript bundle 會越來越大，你可能需要找出如何為每個 routing 單獨拆分程式碼。當 data fetching 需求變得更加複雜時，你可能會遇到 server-client 的 network waterfalls，這會使你的應用程式感覺非常緩慢。當你的使用者中包含了有低速網路和低階設備的受眾時，你可能需要從 component 產成 HTML 以提早顯示內容 - 無論是在伺服器上或在建置期間。更改設定以在伺服器上或在建置期間執行部分程式碼可能非常棘手。

**這些問題並非 React 特有的。這就是為什麼 Svelte 有 SvelteKit，Vue 有 Nuxt 等等。** 要自己解決這些問題，你需要將 bundle 工具與 routing 和 data fetching 函式庫整合在一起。一開始設定不難，但隨著時間的推移，但要製作一個即使隨時間的推移也能快速載入的應用程式，會涉及很多細節。你希望傳送最少量的程式碼，在單個 client-server 往返，且與頁面所需的任何資料並行。你可能希望在 JavaScript 程式碼執行之前就可與頁互動面，以支援漸進式增強（progressive enhancement）功能。你可能還想產生完全靜態的 HTML 文件來顯示行銷網頁，在禁用 JavaScript 時也可以在任何地方托管且正常運作。而自己構建這些功能會很費工。

**這個頁面上的 React 框架可以自動解決這些問題，而不需要你做任何額外的工作。** 它們讓你可以從非常簡單的開始，然後根據你的需求擴展應用程式。每個 React 框架都有一個社群，因此更容易找到答案和升級工具。框架還可以給你的程式碼提供結構，幫助你和其他人在不同項目之間維持一定的脈絡和技能。相反地，使用客製化設定會更容易陷入不支援依賴版本中，最終你將建立自己的框架 - 雖然沒有社區或升級路徑（就像我們過去做過的那些，更加混亂的設計）。

如果你仍然不信服，或者你的應用程式有這些框架無法很好地滿足的非常規限制，並且你想要自己客制設定，我們不能阻止你 - 去做吧！從 npm 中獲取 `react` 和`react-dom`，使用像 [Vite](https://vitejs.dev/) 或 [Parcel](https://parceljs.org/) 這樣的 bundle 工具設定自己的客製構建過程，並根據需求新增 routing、static generation 或 server-side rendering 等等的工具。
</DeepDive>

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
