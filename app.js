const papers = [
      {
                    id: 1,
                    title: "\uAC15\uC544\uC9C0\uC758 \uBD84\uB9AC \uBD88\uC548 \uAD00\uB9AC\uC5D0 \uB300\uD55C \uCD5C\uC2E0 \uC9C0\uCE68",
                    authors: "Dr. Karen Overall",
                    year: "2023",
                    originalAbstract: "A comprehensive review of pharmacological and behavioral interventions for canine separation anxiety.",
                    medicalSummary: "\uC774 \uC530\uAD6C\uB294 \uBD84\uB9AC \uBD88\uC548\uC744 \uACAA\uB294 \uAC15\uC544\uC9C0\uB97C \uC704\uD55C \uC57D\uBB3C \uCE21\uB8CC\uC640 \uD589\uB3D9 \uAD50\uC124\uC758 \uACB0\uD569 \uC694\uBC95\uC744 \uAC15\uC870\uD569\uB2C8\uB2E4.",
                    pdfLink: "#"
      },
      {
                    id: 2,
                    title: "\uACE0\uC591\uC774\uC758 \uD558\uBD80 \uC694\uB85C \uC9C8\uD658(FLUTD)\uACFC \uD589\uB3D9\uD559\uC801 \uC694\uC778",
                    authors: "Dr. Danielle Gunn-Moore",
                    year: "2022",
                    originalAbstract: "Investigation into the correlation between environmental stress and the recurrence of idiopathic cystitis.",
                    medicalSummary: "\uACE0\uC591\uC774\uC758 \uD2B9\uBC20\uC131 \uBC29\uAD11\uC5FC\uC774 \uD658\uACBD\uC801 \uC2A4\uD2B8\uB808\uC2A4\uC640 \uBC00\uC911\uD55C \uAD00\uB828\uC774 \uC774\uC74C\uC744 \uBC1D\uD788\uACE0 \uC774\uC2B5\uB2C8\uB2E4.",
                    pdfLink: "#"
      }
      ];
function createPaperCard(paper) {
          const card = document.createElement('div');
          card.className = 'paper-card';
          card.innerHTML = `
                  <div class="card-tag">Research Paper</div>
                          <h3 class="card-title">${paper.title}</h3>
                                  <p class="card-authors">${paper.authors}</p>
                                          <div class="card-footer">
                                                      <span class="card-year">${paper.year}</span>
                                                                  <button class="read-btn" onclick="openReader(${paper.id})">Read Summary</button>
                                                                          </div>
                                                                              `;
          return card;
}
function openReader(id) {
          const paper = papers.find(p => p.id === id);
          if (!paper) return;
          document.getElementById('readerTitle').innerText = paper.title;
          document.getElementById('readerAuthors').innerText = paper.authors;
          document.getElementById('readerYear').innerText = paper.year;
          document.getElementById('englishContent').innerText = paper.originalAbstract;
          document.getElementById('koreanContent').innerText = paper.medicalSummary;
          document.getElementById('pdfLink').href = paper.pdfLink;
          document.getElementById('readerOverlay').classList.remove('hidden');
          document.body.style.overflow = 'hidden';
}
function closeReader() {
          document.getElementById('readerOverlay').classList.add('hidden');
          document.body.style.overflow = 'auto';
}
document.getElementById('closeReader').addEventListener('click', closeReader);
document.getElementById('searchBtn').addEventListener('click', () => {
          const query = document.getElementById('searchInput').value.toLowerCase();
          const resultsGrid = document.getElementById('resultsGrid');
          resultsGrid.innerHTML = '';
          const filtered = papers.filter(p => 
                                                 p.title.toLowerCase().includes(query) || 
                                                 p.authors.toLowerCase().includes(query) ||
                        p.medicalSummary.toLowerCase().includes(query)
                                             );
          if (filtered.length === 0) {
                        resultsGrid.innerHTML = '<div class="empty-state"><p>\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.</p></div>';
          } else {
                        filtered.forEach(p => {
                                          resultsGrid.appendChild(createPaperCard(p));
                        });
          }
});
window.addEventListener('DOMContentLoaded', () => {
          const resultsGrid = document.getElementById('resultsGrid');
          papers.forEach(p => {
                        resultsGrid.appendChild(createPaperCard(p));
          });
});
