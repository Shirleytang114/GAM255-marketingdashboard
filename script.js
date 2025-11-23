/* ======================================================
 * 儀表板主腳本 (script.js)
 * (已整合 BHI 動態圖表 + PR Alert 標記)
 * ====================================================== */

/* --- (模擬) 行銷活動資料庫 --- */
const campaignEvents = {
    "2025-11-03": "PR Alert: Owala 漏水" 
};
/* ------------------------------- */


/**
 * 輔助函數：獲取 YYYY-MM-DD 格式的日期字串
 * @param {Date} date - 日期物件
 * @returns {string} - "YYYY-MM-DD"
 */
function getYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 輔助函數：產生隨機 BHI
 * @param {number} base - 基準 BHI
 * @returns {number} - 0-100 之間的 BHI
 */
function getRandomBHI(base) {
    let value = Math.floor(base + (Math.random() - 0.5) * (base * 0.4));
    if (value > 100) return 100;
    if (value < 0) return 0;
    return value;
}


/**
 * 根據 BHI 數值，切換 Campaign 建議
 */
function checkBHIAndToggleAlerts() {
    const bhiElement = document.getElementById('current-bhi');
    if (!bhiElement) {
        console.error('BHI 元素未找到！');
        return;
    }
    
    const bhiText = bhiElement.innerText; 
    const bhiValue = parseFloat(bhiText); 

    const prItems = document.querySelectorAll('.alert-item.pr-item');
    const growthItems = document.querySelectorAll('.alert-item.growth-item');

    if (bhiValue < 60) { 
        prItems.forEach(item => { item.style.display = 'block'; });
        growthItems.forEach(item => { item.style.display = 'none'; });
    } else { 
        prItems.forEach(item => { item.style.display = 'none'; });
        growthItems.forEach(item => { item.style.display = 'block'; });
    }
}


/**
 * 處理 Keyword Ranking 的分頁切換
 * @param {string} tabName - 'brand', 'cp', 'self'
 */
function showRankingTab(tabName) {
    const tabs = document.querySelectorAll('.ranking-tabs .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const allRankingContents = document.querySelectorAll('.ranking-content');
    allRankingContents.forEach(content => content.classList.remove('active'));

    document.querySelector(`.ranking-tabs .tab[onclick*="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-ranking-content`).classList.add('active');

    if (tabName === 'self') {
        document.getElementById('self-default-content').style.display = 'block';
        document.getElementById('self-search-results').style.display = 'none';
        document.getElementById('self-search-input').value = ''; 
    }
}

/**
 * 處理 Sentiment Analysis 的分頁切換
 */
function handleSentimentTabs() {
    const sentimentTabs = document.querySelectorAll('.sentiment-tabs .tab');
    const sliderThumb = document.querySelector('.slider-thumb');
    if (!sliderThumb) return;

    sentimentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            sentimentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (this.classList.contains('negative')) {
                sliderThumb.style.left = '15%'; 
                sliderThumb.style.borderColor = '#ff8fab';
                sliderThumb.setAttribute('data-tooltip', '生氣 50%\n難過 50%'); 
            } else if (this.classList.contains('natural')) {
                sliderThumb.style.left = '50%'; 
                sliderThumb.style.borderColor = '#777';
                sliderThumb.setAttribute('data-tooltip', '普通 100%');
            } else if (this.classList.contains('positive')) {
                sliderThumb.style.left = '85%'; 
                sliderThumb.style.borderColor = '#40e0d0';
                sliderThumb.setAttribute('data-tooltip', '開心 30%\n興奮 70%');
            }
        });
    });
}

/**
 * 初始化 Sentiment Slider 的狀態
 */
function initializeSentimentSlider() {
    const activeSentimentTab = document.querySelector('.sentiment-tabs .tab.active');
    const sliderThumb = document.querySelector('.slider-thumb');
    if (activeSentimentTab && sliderThumb) {
        if (activeSentimentTab.classList.contains('positive')) {
            sliderThumb.style.left = '85%';
            sliderThumb.style.borderColor = '#40e0d0';
            sliderThumb.setAttribute('data-tooltip', '開心 30%\n興奮 70%');
        } 
    }
}

// (模擬的) 競爭品牌資料庫
const competitorData = {
    "stanley": [{ name: "1. stanley 冰壩杯", volume: "8,000次", width: "95%" }, { name: "2. stanley 吸管杯", volume: "7,500次", width: "90%" }, { name: "3. stanley 聯名", volume: "5,000次", width: "60%" }],
    "hydroflask": [{ name: "1. hydroflask 寬口瓶", volume: "6,000次", width: "80%" }, { name: "2. hydroflask 顏色", volume: "4,000次", width: "50%" }]
};

// (輔助) 產生 Ranking HTML
function generateRankingListHTML(items) {
    let listHTML = '<ol class="ranking-list">';
    items.forEach(item => {
        listHTML += `
            <li>
                <span class="rank-name">${item.name}</span>
                <div class="rank-bar-container"><div class="rank-bar" style="width: ${item.width};"></div></div>
                <span class="rank-volume">平均每月搜尋量：${item.volume}</span>
            </li>`;
    });
    listHTML += '</ol>';
    return listHTML;
}

// (功能) 搜尋競爭品牌
function searchCompetitor() {
    const input = document.getElementById('cp-search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('cp-results-container');
    if (competitorData[input]) {
        resultsContainer.innerHTML = generateRankingListHTML(competitorData[input]);
    } else if (input === "") {
        resultsContainer.innerHTML = '<p class="placeholder-text">請輸入競爭品牌名稱以查看相關關鍵字。</p>';
    } else {
        resultsContainer.innerHTML = `<p class="placeholder-text">找不到關於 "${input}" 的資料。</p>`;
    }
}

// (功能) 搜尋自訂關鍵字
function searchKeyword() {
    const input = document.getElementById('self-search-input').value;
    const defaultContent = document.getElementById('self-default-content');
    const resultsContent = document.getElementById('self-search-results');
    if (input === "") {
        defaultContent.style.display = 'block';
        resultsContent.style.display = 'none';
        return;
    }
    defaultContent.style.display = 'none';
    resultsContent.style.display = 'block';
    const fakeVolume = Math.floor(Math.random() * (15000 - 500) + 500);
    const fakeWidth = Math.min(100, (fakeVolume / 15000) * 100);
    const searchResult = [{ name: `1. ${input}`, volume: `${fakeVolume.toLocaleString()}次`, width: `${fakeWidth}%` }];
    resultsContent.querySelector('h3').innerText = `"${input}" 的搜尋結果`;
    resultsContent.querySelector('ol.ranking-list').innerHTML = generateRankingListHTML(searchResult).replace('<ol class="ranking-list">','').replace('</ol>','');
}


/**
 * 引用方案
 * @param {HTMLElement} buttonElement - 被點擊的按鈕
 * @param {string} planType - 'PR Alert' 或 'Growth Plan'
 */
function quotePlan(buttonElement, planType) {
    const alertItem = buttonElement.closest('.alert-item');
    const keywordText = alertItem.querySelector('p:nth-child(1)').innerText.split('：')[1].trim().replace(/「|」/g, '');
    const bhiText = document.getElementById('current-bhi').innerText;
    const dateInput = document.getElementById('bhi-date-picker').value; 
    
    if (!dateInput) {
        alert("請先在左上角選擇一個日期！");
        return;
    }
    const dateText = dateInput.replace(/-/g, '/'); 

    const newPlan = {
        date: dateText, 
        type: planType, 
        name: keywordText, 
        preBHI: bhiText, 
        period: "N/A", 
        postBHI: "N/A"
    };

    const log = JSON.parse(localStorage.getItem('marketingLog')) || [];
    log.unshift(newPlan); 
    localStorage.setItem('marketingLog', JSON.stringify(log));

    alert(`方案「${keywordText}」已引用！\n即將轉跳到行銷日誌頁面...`);
    window.location.href = 'https://shirleytang114.github.io/GAM255-marketinglog/index.html'; 
}


// ▼▼▼ 【圖表函式 - 已根據您的 BHI 需求更新】 ▼▼▼

// 在頂層宣告圖表變數，以便所有函式都能存取
let volumeChart;

/**
 * ★ 重大更新：根據期間產生「BHI」數據
 * @param {number} period - 7, 30, 或 90
 * @returns {object} - { data: [], yAxisTitle: "" }
 */
function generateChartData(period) {
    const endDate = new Date("2025-11-07T00:00:00"); 
    let data = [];
    let yAxisTitle = 'BHI (%)';

    if (period === 7) {
        // 7 天 BHI 數據
        const baseData = {
            '11/01': 85, '11/02': 85, '11/03': 55,
            '11/04': 65, '11/05': 70, '11/06': 75, '11/07': 72
        };
        const baseDates = ['2025-11-01', '2025-11-02', '2025-11-03', '2025-11-04', '2025-11-05', '2025-11-06', '2025-11-07'];
        
        baseDates.forEach((dateStr) => {
            const label = dateStr.substring(5).replace('-', '/'); 
            const campaign = campaignEvents[dateStr]; 
            
            data.push({
                x: label,
                y: baseData[label],
                isCampaign: !!campaign,
                campaignName: campaign || null
            });
        });
        
    } else if (period === 30) {
        // ▼▼▼ 【修改點：使用您指定的 5 天區間與數據】 ▼▼▼
        yAxisTitle = 'BHI (%) (5-day)'; 

        // 1. 定義 X 軸標籤 (7 個點)
        const baseLabels = ['10/09', '10/14', '10/19', '10/24', '10/29', '11/03', '11/07'];
        
        // 2. 定義對應的 YYYY-MM-DD 日期 (用於檢查活動)
        const baseDates = [ 
            '2025-10-09',
            '2025-10-14',
            '2025-10-19',
            '2025-10-24',
            '2025-10-29',
            '2025-11-03', // 這是您的活動日期
            '2025-11-07'  // 這是「今天」
        ];

        // 3. 定義 7 個 BHI 數據點 (模擬平滑趨勢)
        const baseBHI = [80, 75, 70, 65, 60, 55, 72]; 
        // 趨勢：從 80 開始 -> 緩慢下降 -> 11/03 跌到 55 (危機點) -> 11/07 回升到 72 (今天)

        // 4. 循環建立數據
        for (let i = 0; i < baseLabels.length; i++) {
            const label = baseLabels[i];
            const dateStr = baseDates[i];
            const campaign = campaignEvents[dateStr]; // 檢查 11/03 是否有活動
            const bhi = baseBHI[i];

            data.push({
                x: label,
                y: bhi,
                isCampaign: !!campaign, // 11/03 會是 true
                campaignName: campaign || null
            });
        }
        // ▲▲▲ 【修改結束】 ▲▲▲

    } else if (period === 90) {
        yAxisTitle = '週 BHI (%)'; 
        for (let i = 12; i >= 0; i--) { 
            let date = new Date(endDate);
            date.setDate(date.getDate() - (i * 7)); 
            let dateStr = getYYYYMMDD(date);
            let label = `${date.getMonth() + 1}/${date.getDate()} (W)`;

            const campaign = campaignEvents[dateStr]; 
            
            data.push({
                x: label,
                y: getRandomBHI(70), 
                isCampaign: !!campaign,
                campaignName: campaign || null
            });
        }
    }
    
    return { data, yAxisTitle };
}

/**
 * 更新圖表數據的函式
 * @param {number} period - 7, 30, 或 90
 */
function updateVolumeChart(period) {
    if (!volumeChart) return; 

    const newData = generateChartData(period);
    
    volumeChart.data.datasets[0].data = newData.data;
    
    volumeChart.options.scales.y.title.text = newData.yAxisTitle;
    volumeChart.options.scales.y.max = 100; // BHI 始終 100
    
    // ▼▼▼ 【修改點：讓 7 天和 30 天都顯示所有標籤】 ▼▼▼
    if (period === 7 || period === 30) {
        volumeChart.options.scales.x.ticks.autoSkip = false;
        volumeChart.options.scales.x.ticks.maxRotation = 0;
    } else { // 90 天 (週)
        volumeChart.options.scales.x.ticks.autoSkip = true;
        volumeChart.options.scales.x.ticks.maxRotation = 30;
    }
    // ▲▲▲ 【修改結束】 ▲▲▲

    volumeChart.update();
}


/**
 * 處理 BHI 圖的時間切換按鈕
 */
function handleVolumeChartButtons() {
    const timeButtons = document.querySelectorAll('.time-selector .time-btn');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            let period = 7; 
            if (button.innerText.includes('30')) {
                period = 30;
            } else if (button.innerText.includes('90')) {
                period = 90;
            }
            
            updateVolumeChart(period);
        });
    });
}

/**
 * 初始化 (繪製) BHI 趨勢圖
 */
function initializeVolumeChart() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js 尚未載入！請檢查 HTML 檔案。');
        return;
    }
    const ctxElement = document.getElementById('volumeChart');
    if (!ctxElement) {
        console.error('ID 為 "volumeChart" 的 canvas 元素未找到！');
        return; 
    }
    const ctx = ctxElement.getContext('2d');

    const initialData = generateChartData(7); 

    const chartData = {
        datasets: [{
            label: 'BHI', 
            data: initialData.data, 
            backgroundColor: 'rgba(88, 86, 214, 0.1)', 
            borderColor: 'rgba(88, 86, 214, 1)',     
            borderWidth: 2,
            tension: 0.3, 
            fill: true,
            
            pointBackgroundColor: function(context) {
                const dataPoint = context.raw;
                if (dataPoint && dataPoint.isCampaign) {
                    return '#E74C3C'; 
                }
                return 'rgba(88, 86, 214, 1)'; 
            },
            pointBorderColor: function(context) {
                const dataPoint = context.raw;
                if (dataPoint && dataPoint.isCampaign) {
                    return '#E74C3C'; 
                }
                return 'rgba(88, 86, 214, 1)'; 
            },
            pointRadius: function(context) {
                const dataPoint = context.raw;
                if (dataPoint && dataPoint.isCampaign) {
                    return 6; 
                }
                return 4; 
            },
            pointHoverRadius: function(context) {
                const dataPoint = context.raw;
                if (dataPoint && dataPoint.isCampaign) {
                    return 8; 
                }
                return 6; 
            }
        }]
    };

    const chartOptions = {
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                intersect: false,
                mode: 'index',
                backgroundColor: '#333333',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                titleFont: { weight: 'bold' },
                padding: 10,
                cornerRadius: 8,
                
                callbacks: {
                    title: function(context) {
                        return context[0].label;
                    },
                    label: function(context) {
                        return ` BHI: ${context.parsed.y}%`;
                    },
                    afterBody: function(context) {
                        const dataPoint = context[0].raw;
                        if (dataPoint.isCampaign) {
                            return `\n--- 活動介入 ---\n ${dataPoint.campaignName}`;
                        }
                        return null; 
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true, 
                max: 100, 
                title: {
                    display: true,
                    text: initialData.yAxisTitle 
                }
            },
            x: {
                title: { display: false },
                ticks: {
                    autoSkip: false, 
                    maxRotation: 0 
                }
            }
        }
    };

    volumeChart = new Chart(ctx, { 
        type: 'line', 
        data: chartData,
        options: chartOptions
    });
}


// ★★★ (頁面啟動) ★★★
document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化日期選擇器
    const datePicker = document.getElementById('bhi-date-picker');
    if (datePicker) {
        const todayString = getYYYYMMDD(new Date("2025-11-06"));
        datePicker.value = todayString;
    }

    // 2. 初始化其他元件
    handleSentimentTabs();
    initializeSentimentSlider();

    // 3. 在頁面載入時，立即檢查 BHI
    checkBHIAndToggleAlerts();

    // 4. 【呼叫圖表函式】
    handleVolumeChartButtons();
    initializeVolumeChart();
});