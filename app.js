const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1/paper/search';
const SEARCH_FIELDS = 'title,authors,year,abstract,openAccessPdf,url,citationCount';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsGrid = document.getElementById('resultsGrid');
    const readerOverlay = document.getElementById('readerOverlay');
    const closeReader = document.getElementById('closeReader');

    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(searchInput.value); });
    closeReader.addEventListener('click', () => { readerOverlay.classList.add('hidden'); document.body.style.overflow = 'auto'; });

    fetchFeaturedPaper();

    async function fetchFeaturedPaper() {
        const featuredSection = document.getElementById('featuredSection');
        const container = document.getElementById('featuredCardContainer');
        try {
            const response = await fetch(`${SEMANTIC_SCHOLAR_API}?query=veterinary+behavioral+medicine&limit=30&fields=${SEARCH_FIELDS}`);
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const validPapers = data.data.filter(p => p.citationCount > 5);
                const randomPaper = validPapers[Math.floor(Math.random() * validPapers.length)] || data.data[0];
                renderFeaturedCard(randomPaper, container);
                featuredSection.classList.remove('hidden');
            }
        } catch (error) { console.error('Featured error:', error); }
    }

    function renderFeaturedCard(paper, container) {
        const authors = paper.authors ? paper.authors.map(a => a.name).slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '') : 'Unknown';
        container.innerHTML = `
            <div class="featured-card">
                <div class="featured-info">
                    <h3>${paper.title}</h3>
                    <p class="authors">${authors} • ${paper.year || 'N/A'}</p>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">${paper.abstract || ''}</p>
                </div>
                <div class="featured-stats">
                    <span class="stat-value">${paper.citationCount || 0}</span>
                    <span class="stat-label">Citations</span>
                </div>
            </div>`;
        container.querySelector('.featured-card').addEventListener('click', () => openReader(paper));
    }

    async function performSearch(query) {
        if (!query.trim()) return;
        searchBtn.textContent = 'Searching...';
        try {
            const response = await fetch(`${SEMANTIC_SCHOLAR_API}?query=${encodeURIComponent(query + " veterinary behavioral")}&limit=12&fields=${SEARCH_FIELDS}`);
            const data = await response.json();
            displayResults(data.data || []);
        } catch (error) { console.error(error); }
        finally { searchBtn.textContent = '검색하기'; }
    }

    function displayResults(papers) {
        resultsGrid.innerHTML = papers.map(paper => `
            <div class="paper-card" onclick='openReader(${JSON.stringify(paper).replace(/'/g, "&apos;")})'>
                <div class="tag">Research</div>
                <h3>${paper.title}</h3>
                <p>${paper.year || ''}</p>
            </div>`).join('');
    }

    window.openReader = (paper) => {
        document.getElementById('readerTitle').textContent = paper.title;
        document.getElementById('englishContent').textContent = paper.abstract || 'No abstract';
        readerOverlay.classList.remove('hidden');
    };
});
