---
id: faq-structure
title: File Structure
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### 有任何建構 React 專案的推薦方式嗎？ {#is-there-a-recommended-way-to-structure-react-projects}

React 對你如何將檔案放入資料夾中並無意見。不過你可以考慮幾種在生態系中常見的方法。

#### 以功能或路徑分類 {#grouping-by-features-or-routes}

一種建構專案的常見方式是將 CSS，JS，和測試檔案放在以功能或路徑分類的資料夾中。

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

「功能」的定義並不是統一的，且其粒度由你決定。如果你無法列出最高階層的資料夾，你可以詢問你的產品使用者，產品包含哪些主要部分，然後以他們的心智模型作為藍圖。

#### 以檔案類型分類 {#grouping-by-file-type}

另一個受歡迎的建構專案方式是將相似的檔案組在一起，例如：

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

有些人也喜歡進一步將 component 按照其在應用程式中的角色分進不同的資料夾裡。例如，[Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) 便是一個基於此原則的設計方法。記得，把類似的方法視為有幫助的例子而非必須遵守的嚴格規定，通常會更有成效。

#### 避免太多巢狀 {#avoid-too-much-nesting}

JavaScript 專案中有很多和深度巢狀目錄有關的痛點。撰寫其中的相對導入或是在檔案移動後更新這些導入變得越來越難。除非你有非常令人信服的原因必須使用深度巢狀資料夾，不然請考慮限制你自己在一個專案中使用最多三層或四層資料夾。當然，這只是一個建議，且也不一定會和你的專案有關。

#### 不要想得太多 {#dont-overthink-it}

如果你才剛開始一個專案，[請不要花超過五分鐘](https://en.wikipedia.org/wiki/Analysis_paralysis)在選擇檔案結構。選擇以上任何方法（或想一個你自己的）然後開始寫程式碼！畢竟在你寫了一些真正的程式碼後你很可能會想重新思考。

如果你感到完全卡住，從把所有檔案放在一個資料夾開始。最終它會變大到你會想將某些檔案和剩下的分開。在那時你就會有足夠的認知去分辨哪些檔案你最常一起更改。一般來說，把經常一起更改的檔案放得和彼此近一些是個好主意。這個原則稱為「colocation」。

當專案變得更大時，實務上他們通常會使用上述兩種方法的混合。所以在一開始選擇「正確的」那一個並不是非常重要。
