const S2_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search";
const S2_PAPER_FIELDS = "title,authors,year,abstract,citationCount,url,venue";

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    fetchFeaturedPaper();
    
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });

    document.querySelector('.close-overlay').addEventListener('click', closeReader);
});

// 추천 논문 가져오기 (High Citation)
async function fetchFeaturedPaper() {
    const slot = document.getElementById('featured-card-slot');
    try {
        const query = 'veterinary behavior medicine';
        const response = await fetch(`${S2_API_URL}?query=${encodeURIComponent(query)}&limit=20&fields=${S2_PAPER_FIELDS}`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // 인용수 순으로 정렬 후 상위 10개 중 랜덤 선택
            const topPapers = data.data.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0)).slice(0, 10);
            const randomPaper = topPapers[Math.floor(Math.random() * topPapers.length)];
            
            slot.innerHTML = `
                <div class="featured-card" onclick='openReader(${JSON.stringify(randomPaper).replace(/'/g, "&apos;")})'>
                    <div class="card-badge">TOP CITED</div>
                    <h3>${randomPaper.title}</h3>
                    <div class="card-meta">
                        <span>📅 ${randomPaper.year || 'N/A'}</span>
                        <span>📚 ${randomPaper.venue || 'Research Paper'}</span>
                        <span>🔥 Citations: ${randomPaper.citationCount || 0}</span>
                    </div>
                    <p class="excerpt">${randomPaper.abstract ? randomPaper.abstract.substring(0, 180) + '...' : '초록 정보가 없습니다.'}</p>
                    <div class="card-footer">클릭하여 상세 분석 보기 →</div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Featured Fetch Error:", error);
        slot.innerHTML = "<p class='error'>추천 연구를 불러오지 못했습니다.</p>";
    }
}

// 검색 수행
async function performSearch(query) {
    if (!query) return;
    
    const container = document.getElementById('results-container');
    container.innerHTML = '<div class="loader">검색 중...</div>';

    try {
        const fullQuery = `${query} veterinary behavioral medicine`;
        const response = await fetch(`${S2_API_URL}?query=${encodeURIComponent(fullQuery)}&limit=12&fields=${S2_PAPER_FIELDS}`);
        const data = await response.json();

        container.innerHTML = '';
        if (data.data && data.data.length > 0) {
            data.data.forEach(paper => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <h3>${paper.title}</h3>
                    <div class="card-meta">
                        <span>${paper.year || ''}</span> • <span>${paper.citationCount || 0} citations</span>
                    </div>
                `;
                card.onclick = () => openReader(paper);
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="error">데이터를 가져오는 중 오류가 발생했습니다.</p>';
    }
}

function openReader(paper) {
    const overlay = document.getElementById('reader-overlay');
    const body = document.getElementById('reader-body');
    
    body.innerHTML = `
        <div class="reader-header">
            <span class="badge">Analysis Mode</span>
            <h2>${paper.title}</h2>
            <div class="author-list">${paper.authors ? paper.authors.map(a => a.name).join(', ') : 'Unknown Authors'}</div>
        </div>
        <div class="reader-content">
            <div class="ai-summary-box">
                <h4>✨ AI Insight Summary</h4>
                <p>본 논문은 ${paper.year}년 ${paper.venue || '학술지'}에 발표되었으며, 총 ${paper.citationCount}회 인용되었습니다.</p>
                <p class="abstract-text">${paper.abstract || '추출된 초록이 없습니다.'}</p>
            </div>
            <div class="action-buttons">
                <a href="${paper.url}" target="_blank" class="btn-primary">원문 보기 (S2)</a>
                <button onclick="saveToObsidian(${JSON.stringify(paper).replace(/'/g, "&apos;")})" class="btn-secondary">Obsidian에 저장</button>
            </div>
        </div>
    `;
    
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReader() {
    document.getElementById('reader-overlay').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function saveToObsidian(paper) {
    const noteContent = `---
title: "${paper.title}"
year: ${paper.year}
citations: ${paper.citationCount}
url: ${paper.url}
tags: #vet-behavior #research
---

# ${paper.title}

## Abstract
${paper.abstract || 'N/A'}

## Clinical Significance
(AI 분석 내용을 여기에 추가할 예정입니다)
`;
    console.log("Saving to Obsidian:", noteContent);
    alert("Obsidian 저장용 데이터가 콘솔에 생성되었습니다. (다음 단계에서 자동화를 진행합니다!)");
}
