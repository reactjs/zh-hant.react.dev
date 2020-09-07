---
id: testing-environments
title: 測試環境
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

本份文件介紹了可能影響環境的因素以及某些場景下的建議。

### Test runner {#test-runners}

像是 [Jest](https://jestjs.io/)、[mocha](https://mochajs.org/)、[ava](https://github.com/avajs/ava) 的 Test runner 讓你以常規的 JavaScript 來撰寫測試，並在開發過程中執行它們。此外，test suite 也會作為持續整合中執行的一部份。

- Jest 廣泛的兼容 React 專案，支援像是 [module](#mocking-modules) 和 [timer](#mocking-timers)，以及 [`jsdom`](#mocking-a-rendering-surface) 的 mock 功能。**如果你使用 Create React App，[內建已經包含了 Jest ](https://facebook.github.io/create-react-app/docs/running-tests) 與有用的預設設定。**
- 像是 [mocha](https://mochajs.org/#running-mocha-in-the-browser) 之類的函式庫，在實際的瀏覽器環境中可以很好地工作，並且可以幫助明確需要它的測試在實際的瀏覽器環境中可以很好的運作，並且可以幫助明確需要它的測試。
- End-to-end 測試被用在較長需要橫跨多個頁面的流程，並且需要一個[不同的設定](#end-to-end-tests-aka-e2e-tests)。

### Mock 一個 render 的 surface {#mocking-a-rendering-surface}

測試通常不會在存取像是瀏覽器真實的 surface 的環境中執行。對於這些環境，我們建議使用 [`jsdom`](https://github.com/jsdom/jsdom) 模擬一個瀏覽器，它是一個可以在 Node.js 中執行的輕量瀏覽器實作。

在大多數情況下，jsdom 的行為像是一個正常的瀏覽器，但是沒有像是 [layout 和 navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform) 的功能。這對於大部分基於 web component 的測試仍然有用，因為它執行的速度比每次測試都啟動瀏覽器還要來得快。它也在相同的 process 執行你的測試，因此你可以撰寫程式來檢查和 assert 被 render 的 DOM。

就像在一個真實的瀏覽器一樣，jsdom 讓我們模擬使用者的互動；測試可以在 DOM node 上 dispatch event，並且觀察和 assert 這些操作[<small>（範例）</small>](/docs/testing-recipes.html#events)的 side effect。

上述的設定可以撰寫大部分的 UI 測試：使用 Jest 作為 test runner，render 到 jsdom，透過 `act()` helper [<small>（範例）</small>](/docs/testing-recipes.html) 將使用者互動指定為瀏覽器 event 的序列。例如，React 本身許多的測試都是由此組合所撰寫的。

如果你正在撰寫一個函式庫，它主要測試於特定的瀏覽器行為，並要求原生的瀏覽器行為像是 layout 或是真實的輸入，你可以使用像是 [mocha](https://mochajs.org/) 的測試框架。

在_無法_模擬 DOM 的環境中（例如：在 Node.js 上測試 React Native 的 component），你可以使用 [event simulation helper](/docs/test-utils.html#simulate) 來模擬互動的 element。或者，你可以使用 [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro) 的 `fireEvent` helper。

像是 [Cypress](https://www.cypress.io/)、[puppeteer](https://github.com/GoogleChrome/puppeteer) 和 [webdriver](https://www.seleniumhq.org/projects/webdriver/) 的框架對於執行 [end-to-end tests](#end-to-end-tests-aka-e2e-tests) 非常有用。

### Mock 函式 {#mocking-functions}

當撰寫測試時，我們會想要 mock 在我們測試環境中沒有等效的程式碼部分（例如：在 Node.js 內判斷 `navigator.onLine` 狀態）。測試也可以監視（spy）某些函式，並觀察其他部分的測試如何與它交互。可以使用易於測試的版本，對於選擇性地來 mock 這些函式很有用。

這特別是對於資料的 fetch 非常有用。通常最好是使用「假」資料來測試，避免從真實 API endpoint 取得資料，造成緩慢和脆弱的測試[<small>（範例）</small>](/docs/testing-recipes.html#data-fetching)。這增進了測試的可預期性。像是 [Jest](https://jestjs.io/) 和 [sinon](https://sinonjs.org/) 的函式庫，都支援 mock 函式。對於 end-to-end 測試來說，mock network 可能會更困難，但你仍然可能也想要在測試中測試真實的 API endpoint。

### Mocking module {#mocking-modules}

有些 component 與其他 module 可能有依賴關係，在測試環境中可能會無法運作，或者是對於測試不可缺少的。選擇性的 mock 這些 module 並進行適當的替換會很有用[<small>（範例）</small>](/docs/testing-recipes.html#mocking-modules)。

在 Node.js 中，像是 Jest 的 runner [支援 mock module](https://jestjs.io/docs/en/manual-mocks)。你也可以選擇像是 [`mock-require`](https://www.npmjs.com/package/mock-require) 的函式庫。

### Mocking timer {#mocking-timers}

Component 可能使用基於像是 `setTimeout`、`setInterval` 或是 `Date.now` 的時間函式。在測試環境中，可以透過 mock 這些函式來做替換，對於你想要手動「提前」時間非常有用。這可以確保你的測試很快地執行！依賴於 timer 的測試仍然可以按順序 resolve，但速度更快[<small>（範例）</small>](/docs/testing-recipes.html#timers)。大部分的測試框架，包含 [Jest](https://jestjs.io/docs/en/timer-mocks)、[sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) 以及 [lolex](https://github.com/sinonjs/lolex) 讓你可以在測試中 mock timer。

有時候你可能不想要 mock timer。例如，或許你想要測試一個 animation，或是與一個對時間較敏感的 endpoint 交互（像是 API 的 rate limiter）。函式庫的 timer mock 讓你在每個測試的基礎上啟用和關閉它們，所以你可以明確的選擇這些測試的執行方式。

### End-to-end 測試 {#end-to-end-tests-aka-e2e-tests}

End-to-end 測試對於測試更長的 workflow 非常有用，特別是當它們對於你的商業邏輯至關重要時（像是付款或是註冊）。對於這些測試，你可能需要測試真實瀏覽器是如何 render 整個應用程式，從真實 API endpoint 來 fetch 資料，使用 session 和 cookie，在不同的連結之間導航。你可能不只想要 assert 在 DOM 上的 state，而且還要備份資料的 assert（例如：驗證更新是否已經被儲存到資料庫）。

在這個場景下，你將使用像是 [Cypress](https://www.cypress.io/) 的測試框架，或是像是 [puppeteer](https://github.com/GoogleChrome/puppeteer) 的函式庫，所以你可以在不同的 route 之間切換，並 assert side effect，而不是只有在瀏覽器內，也有可能在後端。
