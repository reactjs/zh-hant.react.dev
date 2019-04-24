---
id: getting-started
title: 開始
permalink: docs/getting-started.html
next: add-react-to-a-website.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
  - "docs/installation.html"
  - "download.html"
  - "downloads.html"
  - "docs/try-react.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
---

本章節是 React 文件與相關資訊的概覽。

**React** 是一個實作使用者界面的 JavaScript 函式庫。請到我們的[主頁](/)或[教學](/tutorial/tutorial.html)中學習什麼是 React。

---

- [嘗試 React](#try-react)
- [學習 React](#learn-react)
- [了解最新消息](#staying-informed)
- [版本化文件](#versioned-documentation)
- [找不到相關資訊？](#something-missing)

## 嘗試 React {#try-react}

React 在剛推出的時候就容許被逐步採用，**你可以按自己所需可多可少的**採用 React。不管你是想初步嘗試 React、在簡單的 HTML 網頁上加入互動性，或是實作一個使用 React 驅動的複雜應用程式，這章節裏的連結會幫助你開始。

### 線上體驗 {#online-playgrounds}

如果你有興趣嘗試 React，你可以使用一些線上編輯器，包括 [CodePen](codepen://hello-world)、[CodeSandbox](https://codesandbox.io/s/new)，或 [Glitch](https://glitch.com/edit/#!/remix/starter-react-template)，實作一個 Hello World 的範例。

如果你偏向使用自己的編輯器，你可以[下載此 HTML 文件](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)進行修改，並從本機文件系統裡把它打開到瀏覽器。這會進行一個緩慢的 runtime 程式碼轉換，因此我們建議只把這文件用作簡單的示範。

### 將 React 加入到網頁 {#add-react-to-a-website}

你可以[在一分鐘內將 React 加入到一個 HTML 網頁上](/docs/add-react-to-a-website.html)。你可以選擇逐步擴大它的應用範圍，或是只使用在少部分的可變 widget 上。

### 實作全新的 React 應用程式 {#create-a-new-react-app}

當你剛實作全新的 React 應用程式時，[一個簡單的 HTML 網頁配上 script 標籤](/docs/add-react-to-a-website.html)或許依然是最好的選擇。這樣我們就可以在一分鐘內設定好。

當你的應用程式逐漸擴大，你或許要考慮使用一個比較綜合的設定方法。我們推薦使用[一些 JavaScript toolchains](/docs/create-a-new-react-app.html) 來設定大型的應用程式。它們只需要一點，甚至一點配置也不需要，就能讓我們充份使用豐富的 React ecosystem。

## 學習 React {#learn-react}

學習 React 的人來至於不同的背景，以及不同的學習方式。無論你是偏向理論化，或是實踐化的方式，我們希望本章節會對你有所幫助。

* 如果你喜歡**動手做**，請從我們的[實用指南](/tutorial/tutorial.html)開始。
* 如果你喜歡**按部就班學習概念**，請從我們的[主要概念指南](/docs/hello-world.html)開始。

與學習其他全新的科技一樣，學習 React 會有一定的難度。我們相信只要多練習和添加多一份耐心，你*一定會*掌握到 React。

### 第一個範例 {#first-examples}

[React 首頁](/)包含了幾個小型的 React 範例與實時編輯器。即使你還沒完全了解 React，你也可以嘗試變更它們的程式碼，看看結果會怎樣。

### 初學者的 React {#react-for-beginners}

如果你覺得 React 官方文件學習的節奏比較快，不太適應，請先看看 [Tania Rascia 所編寫的 React 概覽](https://www.taniarascia.com/getting-started-with-react/)。她會以初學者的角度，介紹 React 的主要概念。當你看完了，嘗試再回來繼續學習吧！

### 設計師的 React {#react-for-designers}

如果你是來至於設計背景的，[這些資源](https://reactfordesigners.com/)會是一個很好的起點。

### JavaScript 的資源 {#javascript-resources}

我們假設你有一些 JavaScript 的基礎知識。你不需要是 JavaScript 的專家，只是同時學習 React 和 JavaScript 會比較困難。

我們建議先看[這裏的 JavaScript 概覽](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/A_re-introduction_to_JavaScript)來測試自己的認識程度。這需要花費大概 30 分鐘到 1 小時，但這會增加你學習 React 的信心。

>提示
>
>當你遇到 JavaScript 的困難時，[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 和 [javascript.info](https://javascript.info/) 會是非常好的查閱資源。你也可以在[社群支援論壇](/community/support.html)上尋找幫助。

### 實用指南 {#practical-tutorial}

如果你喜歡**動手做**，請參考我們的[實用指南](/tutorial/tutorial.html)。我們會利用 React 實作一個井字遊戲。你可能對遊戲開發不感興趣，因而很想跳過這個部份，但請給它一個機會。在這指南所學習的技巧，將會是實作*任何* React 應用程式的重要基礎，掌握到它們會讓你更了解 React。

### 按部就班學習指南 {#step-by-step-guide}

如果你喜歡**按部就班學習概念**，我們的[主要概念指南](/docs/hello-world.html)會是一個很好的起點。指南裏每個章節都是建基於上一個章節的學習內容，這樣你就不會錯過任何內容。

### 用 React 思考 {#thinking-in-react}

許多 React 使用者都表示在閱讀了[用 React 思考](/docs/thinking-in-react.html)後對 React 恍然大悟。它可能是最源遠流長的 React 指南，至今依然極具價值。

### 課程推薦 {#recommended-courses}

相比官方文件，有時候大家會覺得第三方的書籍和影片教學對學習更有幫助。因此我們整合了一系列的[課程推薦](/community/courses.html)，有些課程更是免費的。

### 進階概念 {#advanced-concepts}

當你對[主要概念](#main-concepts)有所掌握，並嘗試使用了一點 React，你可能會對比較進階的課題感興趣。進階指南會介紹一些強大但不常用的 React 特點，例如 [context](/docs/context.html) 和 [refs](/docs/refs-and-the-dom.html)。

### API 參考 {#api-reference}

當你想了解更多有關特定 React API 的資訊時，這章節會非常有用。例如 [`React.Component` API 參考](/docs/react-component.html)會解構 `setState()` 是怎樣運作，以及介紹不同生命週期方法的使用方法。

### 術語表與常見問題 {#glossary-and-faq}

[術語表](/docs/glossary.html)包含了 React 文件裏最常見的術語。為了解答大家對於一些常見課題的疑問，包括 [發送 AJAX 請求](/docs/faq-ajax.html)、[component state](/docs/faq-state.html) 和[文件結構](/docs/faq-structure.html)，我們因此也提供了一個常見問題的章節。

## 了解最新消息 {#staying-informed}

[React 部落格](/blog/)是 React 團隊發佈更新消息的官方渠道。任何重要消息，包括更新日誌或棄用通知，都會在這裏先發佈。

你也可以在 Twitter 追蹤 [@reactjs 帳號](https://twitter.com/reactjs)，只閱讀官方部落格也不會令你錯過重要消息。

<<<<<<< HEAD
並非所有 React 版本發佈值得我們在部落格裏發佈文章，但你可以在 React 的程式碼倉庫中的[`CHANGELOG.md` 文件](https://github.com/facebook/react/blob/master/CHANGELOG.md)或 [Releases](https://github.com/facebook/react) 頁面，找到每個版本發佈的詳細更新日誌。
=======
Not every React release deserves its own blog post, but you can find a detailed changelog for every release [in the `CHANGELOG.md` file in the React repository](https://github.com/facebook/react/blob/master/CHANGELOG.md), as well as on the [Releases](https://github.com/facebook/react/releases) page.
>>>>>>> 6bc6e7b1411d4befc3ecfbe45b898ca474116020

## 版本化文件 {#versioned-documentation}

官方文件會一直與最新穩定版本的 React 保持同步。至 React 16 以來，你可以在這[另一頁](/versions)找到舊版本的 React 文件。注意，舊版本的文件是取至該版本發佈時的狀態，並不會有持續的更新。

## 找不到相關資訊？ {#something-missing}

如果你找不到相關的資訊，或是對部份的內容有疑惑，請連同你的建議，在[此文件倉庫提出 issue](https://github.com/reactjs/reactjs.org/issues/new) 或是在 Twitter 上提及 [@reactjs 帳號](https://twitter.com/reactjs)。我們樂意聆聽你的意見。
