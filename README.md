# 📊 Interactive Marketing Dashboard (互動式行銷儀表板)

這是一個專為品牌行銷團隊設計的**互動式數據儀表板**。
旨在整合聲量監測、情緒分析、關鍵字排名以及自動化策略建議，
幫助行銷人員即時掌握品牌健康度 (Brand Health Index, BHI)。

目前演示案例以 **「Owala 水壺」** 為虛擬分析對象。

## ✨ 專案特色 (Key Features)

### 1. 核心指標監測 (Core Metrics)
- **BHI 品牌健康度**：即時顯示當前分數，並依據分數高低給予狀態建議（如：穩定、需注意）。
- **趨勢圖表 (Trend Chart)**：整合 `Chart.js`，視覺化呈現 7天 / 30天 / 90天 的聲量趨勢。
- **事件標記**：圖表會自動標記行銷活動或公關危機發生的時間點（以紅點顯示），方便回溯成效。

### 2. 智慧策略建議 (Automated Strategy)
- **動態警報系統**：系統會根據 BHI 分數自動切換建議方案。
    - **當 BHI < 60%**：觸發 **PR Alert (紅色)**，建議啟動公關危機處理。
    - **當 BHI ≥ 60%**：顯示 **Growth Plan (青色)**，建議執行成長型行銷活動。
- **方案引用**：點擊「引用此方案」會將決策記錄至 `localStorage`，並轉跳至行銷日誌頁面。

### 3. 全方位輿情分析 (Sentiment & Keywords)
- **情緒分析滑桿**：互動式 UI，可切換 正面/中性/負面 標籤，並透過 Tooltip 顯示詳細情緒佔比。
- **多來源監測**：整合 Dcard, PTT, Yahoo, Google 等平台的熱門討論文章。
- **關鍵字排名 (Keyword Ranking)**：
    - **Brand**：自家品牌熱門關鍵字。
    - **CP (Competitor)**：競爭對手搜尋功能 (模擬資料庫：Stanley, Hydroflask)。
    - **Self**：自訂關鍵字查詢功能。

## 🛠️ 技術棧 (Tech Stack)

- **Frontend**: HTML5, CSS3 (Flexbox & Grid Layout), Vanilla JavaScript (ES6+)
- **Visualization**: [Chart.js](https://www.chartjs.org/) (客製化折線圖與互動 Tooltip)
- **Icons**: 外部圖片連結 (Dcard/PTT/Yahoo/Google Icons)
- **Storage**: Browser LocalStorage (用於資料傳遞)

## 📂 檔案結構

```text
.
├── index.html      # 儀表板主頁面結構
├── style.css       # 響應式設計、配色與卡片樣式
├── script.js       # 業務邏輯、圖表繪製、互動事件處理
└── README.md       # 專案說明文件