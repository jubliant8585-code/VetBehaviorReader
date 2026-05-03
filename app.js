const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1/paper/search';
const SEARCH_FIELDS = 'title,authors,year,abstract,openAccessPdf,url,citationCount';

document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('searchInput');
      const searchBtn = document.getElementById('searchBtn');
      const resultsGrid = document.getElementById('resultsGrid');
      const readerOverlay = document.getElementById('readerOverlay');
      const closeReader = document.getElementById('closeReader');

                              // Search functionality
                              searchBtn.addEventListener('click', () => performSearch(searchInput.value));
      searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch(searchInput.value);
      });

                              closeReader.addEventListener('click', () => {
                                        readerOverlay.classList.add('hidden');
                              });

                              async function performSearch(query) {
                                        if (!query) return;

          searchBtn.disabled = true;
                                        searchBtn.textContent = 'Searching...';
                                        resultsGrid.innerHTML = '<div class="loading">Fetching research data...</div>';

          try {
                        // Veterinary Behavioral Medicine context added to query if not present
                                            const enhancedQuery = query.toLowerCase().includes('animal') || query.toLowerCase().includes('dog') || query.toLowerCase().includes('vet') 
                                                ? query 
                                                              : `${query} veterinary behavioral medicine`;

                                            const response = await fetch(`${SEMANTIC_SCHOLAR_API}?query=${encodeURIComponent(enhancedQuery)}&limit=10&fields=${SEARCH_FIELDS}`);
                        const data = await response.json();

                                            if (data.data && data.data.length > 0) {
                                                              displayResults(data.data);
                                            } else {
                                                              resultsGrid.innerHTML = '<div class="empty-state"><p>No results found. Please try another keyword.</p></div>';
                                            }
          } catch (error) {
                        console.error('Search error:', error);
                        resultsGrid.innerHTML = '<div class="error">An error occurred while fetching data.</div>';
          } finally {
                        searchBtn.disabled = false;
                        searchBtn.textContent = 'Search';
          }
                              }

                              function displayResults(papers) {
                                        resultsGrid.innerHTML = '';
                                        papers.forEach(paper => {
                                                      const card = document.createElement('div');
                                                      card.className = 'paper-card';
                                                      const authors = paper.authors.map(a => a.name).slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '');

                                                                   card.innerHTML = `
                                                                                   <div class="tag">Behavioral Research</div>
                                                                                                   <h3>${paper.title}</h3>
                                                                                                                   <p class="authors">${authors} - ${paper.year || 'N/A'}</p>
                                                                                                                                   <p style="font-size: 0.8rem; color: #2d5a27; margin-top: 10px;">Citations: ${paper.citationCount || 0}</p>
                                                                                                                                               `;

                                                                   card.addEventListener('click', () => openReader(paper));
                                                      resultsGrid.appendChild(card);
                                        });
                              }

                              function openReader(paper) {
                                        document.getElementById('readerTitle').textContent = paper.title;
                                        document.getElementById('readerAuthors').textContent = paper.authors.map(a => a.name).join(', ');
                                        document.getElementById('readerYear').textContent = paper.year || 'N/A';
                                        document.getElementById('englishContent').textContent = paper.abstract || 'No abstract available for this paper.';

          const pdfBtn = document.getElementById('pdfLink');
                                        if (paper.openAccessPdf && paper.openAccessPdf.url) {
                                                      pdfBtn.href = paper.openAccessPdf.url;
                                                      pdfBtn.style.display = 'inline-block';
                                        } else {
                                                      pdfBtn.href = paper.url;
                                                      pdfBtn.textContent = 'Paper URL';
                                        }

          // AI Summarization Signal (Mock for now, explained to user)
          document.getElementById('koreanContent').innerHTML = `
                      <div class="ai-thinking">
                                      AI is ready to analyze the paper and generate a translation reflecting the medical context.<br><br>
                                                      Click the <strong>[Save to Obsidian]</strong> button to send it to your notes with an AI summary.
                                                                  </div>
                                                                          `;

          const saveBtn = document.getElementById('saveToObsidian');
                                        saveBtn.onclick = () => {
                                                      alert('AI processing and Obsidian save requested. (Agent will detect and handle this)');
                                                      console.log('REQUEST_AI_OBSIDIAN_SAVE', {
                                                                        title: paper.title,
                                                                        abstract: paper.abstract,
                                                                        url: paper.url
                                                      });
                                        };

          readerOverlay.classList.remove('hidden');
                              }
});
