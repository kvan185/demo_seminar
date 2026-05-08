const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const sentimentBadge = document.getElementById('sentimentBadge');
const confidenceValue = document.getElementById('confidenceValue');
const heatmapWrapper = document.getElementById('heatmapWrapper');
const loader = document.getElementById('loader');

analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    // Show loading
    loader.style.display = 'flex';
    analyzeBtn.disabled = true;
    resultSection.style.display = 'none';

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        displayResult(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi khi kết nối với máy chủ: ' + error.message);
    } finally {
        loader.style.display = 'none';
        analyzeBtn.disabled = false;
    }
});

function displayResult(data) {
    resultSection.style.display = 'block';
    
    // Set sentiment badge
    const sentiment = data.prediction.toUpperCase();
    sentimentBadge.textContent = sentiment;
    sentimentBadge.className = 'sentiment-badge'; // Reset classes
    
    if (sentiment === 'POSITIVE') sentimentBadge.classList.add('badge-positive');
    else if (sentiment === 'NEGATIVE') sentimentBadge.classList.add('badge-negative');
    else sentimentBadge.classList.add('badge-neutral');

    // Set confidence
    confidenceValue.textContent = (data.confidence * 100).toFixed(1) + '%';

    // Generate heatmap
    renderHeatmap(data.tokens, data.attention);
}

function renderHeatmap(tokens, attention) {
    heatmapWrapper.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'heatmap-container';
    
    // Token labels (top)
    const topLabels = document.createElement('div');
    topLabels.className = 'token-labels';
    topLabels.style.paddingLeft = '60px'; // Space for row labels
    
    tokens.forEach(token => {
        const span = document.createElement('div');
        span.className = 'token-label';
        span.textContent = token;
        topLabels.appendChild(span);
    });
    
    container.appendChild(topLabels);
    
    // Grid rows
    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.gridTemplateColumns = `60px repeat(${tokens.length}, 40px)`;

    attention.forEach((row, i) => {
        // Row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'token-label';
        rowLabel.style.width = '60px';
        rowLabel.style.textAlign = 'right';
        rowLabel.style.paddingRight = '10px';
        rowLabel.style.lineHeight = '40px';
        rowLabel.textContent = tokens[i];
        grid.appendChild(rowLabel);

        // Cells
        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Color mapping based on intensity
            // Using HSL: 200 is primary blue, saturation fixed at 80%, lightness depends on attention
            // Higher attention = lighter/more vivid blue
            const opacity = Math.min(val * 5, 1.0); // Amplify for visibility
            cell.style.backgroundColor = `rgba(56, 189, 248, ${opacity})`;
            
            // Text color based on background intensity
            cell.style.color = opacity > 0.6 ? '#0f172a' : '#f1f5f9';
            cell.title = val.toFixed(4);
            
            grid.appendChild(cell);
        });
    });

    container.appendChild(grid);
    heatmapWrapper.appendChild(container);
}
