const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const readerOverlay = document.getElementById('readerOverlay');
const readerTitle = document.getElementById('readerTitle');
const englishContent = document.getElementById('englishContent');
const koreanContent = document.getElementById('koreanContent');
const closeReader = document.getElementById('closeReader');
const pdfLink = document.getElementById('pdfLink');
const saveToObsidian = document.getElementById('saveToObsidian');

const researchData = [
      {
                    id: 1,
                    title: "Dog Behavioral Development",
                    authors: "Karen Overall",
                    year: 2021,
                    abstract: "Behavioral development in domestic dogs.",
                    summary: "Dog behavior summary.",
                    pdf: "#"
      },
      {
                    id: 2,
                    title: "Feline Anxiety",
                    authors: "John Smith",
                    year: 2022,
                    abstract: "Anxiety in cats.",
                    summary: "Cat anxiety summary.",
                    pdf: "#"
      }
      ];

function displayResults(data) {
          resultsGrid.innerHTML = '';
          data.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'result-card';
                        card.innerHTML = `<h3>${item.title}</h3><p>${item.authors}</p><button onclick="openReader(${item.id})">Read</button>`;
                        resultsGrid.appendChild(card);
          });
}

window.openReader = (id) => {
          const item = researchData.find(d => d.id === id);
          if (!item) return;
          readerTitle.textContent = item.title;
          englishContent.textContent = item.abstract;
          koreanContent.textContent = item.summary;
          pdfLink.href = item.pdf;
          readerOverlay.classList.remove('hidden');
};

closeReader.onclick = () => readerOverlay.classList.add('hidden');

searchBtn.onclick = () => {
          const term = searchInput.value.toLowerCase();
          const filtered = researchData.filter(d => d.title.toLowerCase().includes(term));
          displayResults(filtered);
};

displayResults(researchData);
