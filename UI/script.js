const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const modelSelector = document.getElementById('modelSelector');
const modelUsedName = document.getElementById('modelUsedName');
const resultSection = document.getElementById('resultSection');
const sentimentBadge = document.getElementById('sentimentBadge');
const confidenceValue = document.getElementById('confidenceValue');
const confidenceWarning = document.getElementById('confidenceWarning');
const heatmapWrapper = document.getElementById('heatmapWrapper');
const attentionContainer = document.getElementById('attentionContainer');
const xaiList = document.getElementById('xaiList');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const toastContainer = document.getElementById('toastContainer');

const navItems = document.querySelectorAll('.nav-item');
const tabButtons = document.querySelectorAll('.tab-btn');
const historyTableBody = document.getElementById('historyTableBody');

const csvTableBody = document.getElementById('csvTableBody');
const loadCsvBtn = document.getElementById('loadCsvBtn');
const filterLabel = document.getElementById('filterLabel');
const filterSplit = document.getElementById('filterSplit');
const csvStatus = document.getElementById('csvStatus');
const csvPrevBtn = document.getElementById('csvPrevBtn');
const csvNextBtn = document.getElementById('csvNextBtn');

const statsPositive = document.getElementById('statsPositive');
const statsNeutral = document.getElementById('statsNeutral');
const statsNegative = document.getElementById('statsNegative');
const statsTotal = document.getElementById('statsTotal');
const sentimentBarChart = document.getElementById('sentimentBarChart');

const sections = {
    analysisSection: document.getElementById('analysisSection'),
    dataSection: document.getElementById('dataSection'),
};
const tabs = {
    historyTab: document.getElementById('historyTab'),
    csvTab: document.getElementById('csvTab'),
    statsTab: document.getElementById('statsTab'),
};

const translations = {
    vi: {
        appTitle: "Phân tích cảm xúc - Advanced Dashboard",
        navAnalysis: "Phân tích cảm xúc",
        navData: "Quản lý dữ liệu",
        breadcrumb: "Dashboard › Sentiment Analysis",
        appSubtitle: "Phân tích cảm xúc với Transformer, trực quan hóa Attention và thống kê chi tiết.",
        selectModel: "Chọn mô hình dự đoán:",
        modelBasic: "MLP Basic (Baseline)",
        inputLabel: "Nhập câu cần phân tích:",
        inputPlaceholder: "Ví dụ: I really love this product, it's amazing!",
        analyzeBtn: "Phân tích ngay",
        resultFrom: "Kết quả từ",
        confidenceLabel: "Độ tin cậy:",
        noResult: "CHƯA CÓ",
        warningLabel: "Lưu ý:",
        warningText: "Độ tin cậy thấp. Kết quả có thể không chính xác.",
        attentionTitle: "Self-Attention Map",
        attentionSubtitle: "Tương quan giữa các từ trong câu",
        xaiTitle: "Giải thích mô hình (XAI)",
        xaiSubtitle: "Các từ khóa quan trọng nhất đóng góp vào dự đoán:",
        tabHistory: "Lịch sử",
        tabCsv: "Dữ liệu CSV",
        tabStats: "Thống kê & Word Cloud",
        thStt: "STT",
        thText: "Câu phân tích",
        thModel: "Mô hình",
        thResult: "Kết quả",
        thTime: "Thời gian",
        noHistory: "Chưa có dữ liệu.",
        clearHistory: "Xóa lịch sử",
        filterByLabel: "Lọc theo Label:",
        allLabels: "Tất cả Label",
        filterBySplit: "Lọc theo Split:",
        allSplits: "Tất cả Split",
        filterBtn: "Lọc / Tải lại",
        noCsvLoaded: "Chưa tải dữ liệu.",
        thId: "ID",
        thSplit: "Split",
        thSentence: "Câu văn",
        thLabel: "Label",
        csvLoadPrompt: "Nhấn nút để tải dữ liệu.",
        btnPrev: "Trước",
        btnNext: "Sau",
        statTotal: "Tổng cộng",
        chartLabel: "Phân bổ cảm xúc (Lịch sử)",
        wcHeader: "Word Cloud (Top từ khóa)",
        wcSubtitle: "Trực quan hóa các từ xuất hiện nhiều nhất trong bộ dữ liệu gốc.",
        toastAnalysisSuccess: "Phân tích thành công!",
        toastAnalysisError: "Lỗi kết nối server: ",
        toastThemeLight: "Đã chuyển sang chế độ sáng",
        toastThemeDark: "Đã chuyển sang chế độ tối",
        toastLangSwitch: "Đã chuyển ngôn ngữ sang tiếng Việt",
        toastCsvFilter: "Đã tìm thấy dòng phù hợp",
        confirmClearHistory: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử?",
    },
    en: {
        appTitle: "Sentiment Analysis - Advanced Dashboard",
        navAnalysis: "Sentiment Analysis",
        navData: "Data Management",
        breadcrumb: "Dashboard › Sentiment Analysis",
        appSubtitle: "Sentiment analysis using Transformers, Attention visualization, and detailed statistics.",
        configHeader: "Configuration & Input",
        configSubtitle: "Select a model and enter text to analyze for sentiment results.",
        selectModel: "Select Prediction Model:",
        modelBasic: "MLP Basic (Baseline)",
        inputLabel: "Enter sentence to analyze:",
        inputPlaceholder: "Example: I really love this product, it's amazing!",
        analyzeBtn: "Analyze Now",
        resultFrom: "Results from",
        confidenceLabel: "Confidence:",
        noResult: "NONE",
        warningLabel: "Warning:",
        warningText: "Low confidence score. Results may be inaccurate.",
        attentionTitle: "Self-Attention Map",
        attentionSubtitle: "Correlation between words in the sentence",
        xaiTitle: "Explainable AI (XAI)",
        xaiSubtitle: "Top keywords contributing to the prediction:",
        tabHistory: "History",
        tabCsv: "CSV Data",
        tabStats: "Stats & Word Cloud",
        thStt: "No.",
        thText: "Analyzed Text",
        thModel: "Model",
        thResult: "Result",
        thTime: "Timestamp",
        noHistory: "No history available.",
        clearHistory: "Clear History",
        filterByLabel: "Filter by Label:",
        allLabels: "All Labels",
        filterBySplit: "Filter by Split:",
        allSplits: "All Splits",
        filterBtn: "Filter / Reload",
        noCsvLoaded: "Data not loaded.",
        thId: "ID",
        thSplit: "Split",
        thSentence: "Sentence",
        thLabel: "Label",
        csvLoadPrompt: "Click to load data.",
        btnPrev: "Prev",
        btnNext: "Next",
        statTotal: "Total",
        chartLabel: "Sentiment Distribution (History)",
        wcHeader: "Word Cloud (Top Keywords)",
        wcSubtitle: "Visualizing the most frequent words in the raw dataset.",
        toastAnalysisSuccess: "Analysis completed successfully!",
        toastAnalysisError: "Server connection error: ",
        toastThemeLight: "Switched to Light Mode",
        toastThemeDark: "Switched to Dark Mode",
        toastLangSwitch: "Language switched to English",
        toastCsvFilter: "rows found matching criteria",
        confirmClearHistory: "Are you sure you want to clear all history?",
    }
};

let currentLang = localStorage.getItem('language') || 'vi';
let historyData = JSON.parse(localStorage.getItem('sentimentHistory') || '[]');
let csvData = [];
let csvPage = 0;
const CSV_PAGE_SIZE = 15;

// --- Internationalization ---
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    langToggle.textContent = lang === 'vi' ? '🇻🇳' : '🇺🇸';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update specific logic-based elements
    renderHistory();
    updateStats();
    if (csvData.length > 0) renderCsvPage();
}

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    showToast(translations[newLang].toastLangSwitch, 'info');
});

// --- Theme Logic ---
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    showToast(newTheme === 'light' ? translations[currentLang].toastThemeLight : translations[currentLang].toastThemeDark, 'info');
});

// --- Toast System ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Prediction ---
analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) {
        showToast(currentLang === 'vi' ? 'Vui lòng nhập nội dung' : 'Please enter text', 'warning');
        return;
    }

    loader.style.display = 'flex';
    analyzeBtn.disabled = true;
    resultSection.style.display = 'none';

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                model_type: modelSelector.value
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        displayResult(data);
        addHistoryRecord({
            text: data.text,
            model: modelSelector.options[modelSelector.selectedIndex].text,
            sentiment: data.prediction.toUpperCase(),
            confidence: data.confidence,
            time: new Date().toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US')
        });
        showToast(translations[currentLang].toastAnalysisSuccess);
    } catch (error) {
        console.error('Error:', error);
        showToast(translations[currentLang].toastAnalysisError + error.message, 'error');
    } finally {
        loader.style.display = 'none';
        analyzeBtn.disabled = false;
    }
});

function displayResult(data) {
    resultSection.style.display = 'block';
    modelUsedName.textContent = modelSelector.options[modelSelector.selectedIndex].text;

    const sentiment = data.prediction.toUpperCase();
    sentimentBadge.textContent = sentiment === 'POSITIVE' ? (currentLang === 'vi' ? 'TÍCH CỰC' : 'POSITIVE') :
        sentiment === 'NEGATIVE' ? (currentLang === 'vi' ? 'TIÊU CỰC' : 'NEGATIVE') :
            (currentLang === 'vi' ? 'TRUNG TÍNH' : 'NEUTRAL');

    sentimentBadge.className = 'sentiment-badge';
    if (sentiment === 'POSITIVE') sentimentBadge.classList.add('badge-positive');
    else if (sentiment === 'NEGATIVE') sentimentBadge.classList.add('badge-negative');
    else sentimentBadge.classList.add('badge-neutral');

    const conf = data.confidence;
    confidenceValue.textContent = (conf * 100).toFixed(1) + '%';
    confidenceWarning.style.display = conf < 0.5 ? 'block' : 'none';

    if (data.attention) {
        attentionContainer.style.display = 'block';
        renderHeatmap(data.tokens, data.attention);
    } else {
        attentionContainer.style.display = 'none';
    }

    xaiList.innerHTML = '';
    if (data.xai && data.xai.length > 0) {
        data.xai.slice(0, 5).forEach(item => {
            const span = document.createElement('span');
            span.className = 'xai-token';
            span.title = `Score: ${item.score.toFixed(3)}`;
            span.textContent = item.token;
            xaiList.appendChild(span);
        });
    } else {
        xaiList.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">${currentLang === 'vi' ? 'Không có dữ liệu.' : 'No data.'}</p>`;
    }
}

function renderHeatmap(tokens, attention) {
    heatmapWrapper.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'heatmap-container';

    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.gridTemplateColumns = `60px repeat(${tokens.length}, 40px)`;

    const empty = document.createElement('div');
    grid.appendChild(empty);
    tokens.forEach(t => {
        const h = document.createElement('div');
        h.className = 'token-label';
        h.textContent = t;
        grid.appendChild(h);
    });

    attention.forEach((row, i) => {
        const rowLabel = document.createElement('div');
        rowLabel.className = 'token-label';
        rowLabel.style.textAlign = 'right';
        rowLabel.style.paddingRight = '8px';
        rowLabel.textContent = tokens[i];
        grid.appendChild(rowLabel);

        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            const opacity = Math.min(val * 5, 1.0);
            cell.style.backgroundColor = `rgba(124, 58, 237, ${opacity})`;
            cell.title = `Attention: ${val.toFixed(4)}`;
            grid.appendChild(cell);
        });
    });

    container.appendChild(grid);
    heatmapWrapper.appendChild(container);
}

// --- CSV Logic ---
loadCsvBtn.addEventListener('click', () => {
    csvPage = 0;
    loadCsvData();
});

function loadCsvData() {
    loadCsvBtn.disabled = true;
    csvStatus.textContent = currentLang === 'vi' ? 'Đang tải...' : 'Loading...';
    csvTableBody.innerHTML = `<tr><td colspan="4" class="empty-row">${currentLang === 'vi' ? 'Đang nạp...' : 'Loading...'}</td></tr>`;

    const label = filterLabel.value;
    const split = filterSplit.value;
    const url = `http://localhost:5000/csv-data?limit=200&label=${label}&split=${split}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            csvData = data.rows;
            renderCsvPage();
            showToast(`${data.total_filtered} ${translations[currentLang].toastCsvFilter}`);
        })
        .catch(err => {
            csvTableBody.innerHTML = `<tr><td colspan="4" class="empty-row">${currentLang === 'vi' ? 'Lỗi tải dữ liệu.' : 'Load error.'}</td></tr>`;
            showToast(currentLang === 'vi' ? 'Lỗi tải CSV' : 'CSV Load Error', 'error');
        })
        .finally(() => loadCsvBtn.disabled = false);
}

function renderCsvPage() {
    const start = csvPage * CSV_PAGE_SIZE;
    const pageRows = csvData.slice(start, start + CSV_PAGE_SIZE);
    csvTableBody.innerHTML = '';

    if (!pageRows.length) {
        csvTableBody.innerHTML = `<tr><td colspan="4" class="empty-row">${translations[currentLang].noHistory}</td></tr>`;
    } else {
        pageRows.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.id}</td>
                <td><span style="font-size:0.8rem; padding:2px 6px; border-radius:4px; background:var(--panel-bg); color:var(--text-muted)">${record.split}</span></td>
                <td style="max-width:400px">${record.text}</td>
                <td><strong>${record.label_name}</strong></td>
            `;
            csvTableBody.appendChild(row);
        });
    }

    const end = Math.min(csvData.length, start + CSV_PAGE_SIZE);
    csvStatus.textContent = csvData.length ?
        (currentLang === 'vi' ? `Hiển thị ${start + 1}-${end} trong ${csvData.length}` : `Showing ${start + 1}-${end} of ${csvData.length}`) :
        translations[currentLang].noCsvLoaded;
    csvPrevBtn.disabled = csvPage === 0;
    csvNextBtn.disabled = end >= csvData.length;
}

csvPrevBtn.addEventListener('click', () => { if (csvPage > 0) { csvPage--; renderCsvPage(); } });
csvNextBtn.addEventListener('click', () => { if ((csvPage + 1) * CSV_PAGE_SIZE < csvData.length) { csvPage++; renderCsvPage(); } });

// --- History & Charts ---
function addHistoryRecord(record) {
    historyData.unshift(record);
    if (historyData.length > 50) historyData.length = 50;
    localStorage.setItem('sentimentHistory', JSON.stringify(historyData));
    renderHistory();
    updateStats();
}

function renderHistory() {
    historyTableBody.innerHTML = '';
    if (!historyData.length) {
        historyTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">${translations[currentLang].noHistory}</td></tr>`;
        return;
    }
    historyData.forEach((r, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i + 1}</td><td>${r.text}</td><td>${r.model}</td><td>${r.sentiment}</td><td>${r.time}</td>`;
        historyTableBody.appendChild(row);
    });
}

function updateStats() {
    const counts = historyData.reduce((acc, r) => {
        if (r.sentiment === 'POSITIVE') acc.p++;
        else if (r.sentiment === 'NEGATIVE') acc.n++;
        else acc.u++;
        return acc;
    }, { p: 0, u: 0, n: 0 });

    statsPositive.textContent = counts.p;
    statsNeutral.textContent = counts.u;
    statsNegative.textContent = counts.n;
    statsTotal.textContent = historyData.length;
    drawBarChart(counts);
}

function drawBarChart(counts) {
    if (!sentimentBarChart) return;
    const ctx = sentimentBarChart.getContext('2d');
    const labels = [currentLang === 'vi' ? 'Tích cực' : 'Positive', currentLang === 'vi' ? 'Trung tính' : 'Neutral', currentLang === 'vi' ? 'Tiêu cực' : 'Negative'];
    const values = [counts.p, counts.u, counts.n];
    const colors = ['#10b981', '#64748b', '#ef4444'];

    ctx.clearRect(0, 0, 800, 300);
    const max = Math.max(...values, 5);
    const barW = 60;
    const gap = 120;

    values.forEach((v, i) => {
        const h = (v / max) * 200;
        const x = 150 + i * gap;
        const y = 250 - h;

        ctx.fillStyle = colors[i];
        ctx.fillRect(x, y, barW, h);

        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main');
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px Inter';
        ctx.fillText(labels[i], x + barW / 2, 270);
        ctx.fillText(v, x + barW / 2, y - 10);
    });
}

async function loadWordCloud() {
    try {
        const res = await fetch('http://localhost:5000/wordcloud');
        const data = await res.json();
        renderWC('wcPositive', data.positive, '#10b981');
        renderWC('wcNeutral', data.neutral, '#64748b');
        renderWC('wcNegative', data.negative, '#ef4444');
    } catch (err) { console.error('WC error:', err); }
}

function renderWC(canvasId, words, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!words || words.length === 0) return;

    const maxVal = Math.max(...words.map(w => w.size));
    words.slice(0, 30).forEach((w, i) => {
        const size = 12 + (w.size / maxVal) * 24;
        ctx.font = `${size}px Inter`;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + (w.size / maxVal) * 0.4;
        const x = 20 + Math.random() * (canvas.width - 100);
        const y = 30 + Math.random() * (canvas.height - 60);
        ctx.fillText(w.text, x, y);
    });
}

function setSection(id) {
    navItems.forEach(item => item.classList.toggle('active', item.dataset.section === id));
    Object.keys(sections).forEach(k => sections[k].classList.toggle('hidden', k !== id));
}

function setTab(id) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === id));
    Object.keys(tabs).forEach(k => tabs[k].classList.toggle('hidden', k !== id));
    if (id === 'statsTab') loadWordCloud();
}

navItems.forEach(item => item.addEventListener('click', () => setSection(item.dataset.section)));
tabButtons.forEach(btn => btn.addEventListener('click', () => setTab(btn.dataset.tab)));

clearHistoryBtn.addEventListener('click', () => {
    if (confirm(translations[currentLang].confirmClearHistory)) {
        historyData = [];
        localStorage.setItem('sentimentHistory', '[]');
        renderHistory();
        updateStats();
        showToast(currentLang === 'vi' ? 'Đã xóa lịch sử' : 'History cleared');
    }
});

// --- Initialize ---
function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

    setLanguage(currentLang);
    setSection('analysisSection');
    setTab('historyTab');
}

init();
