const API_KEY = 'cb5af9a36d95ef511ccd1280ad21d6c8';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Funzione per ottenere le serie TV popolari
async function getPopularTVShows() {
    const response = await fetch(`${API_URL}/tv/popular?api_key=${API_KEY}&language=it-IT&page=1`);
    const data = await response.json();
    return data.results;
}

// Funzione per ottenere le serie TV top-rated
async function getTopRatedTVShows() {
    const response = await fetch(`${API_URL}/tv/top_rated?api_key=${API_KEY}&language=it-IT&page=1`);
    const data = await response.json();
    return data.results;
}

// Funzione per creare le card delle serie TV
function createTVShowCard(tvShow) {
    const tvShowCard = document.createElement('div');
    tvShowCard.classList.add('tv-show-card');
    
    const tvShowImage = document.createElement('img');
    tvShowImage.src = `${IMAGE_BASE_URL}${tvShow.poster_path}`;
    tvShowImage.alt = tvShow.name;
    
    const tvShowTitle = document.createElement('p');
    tvShowTitle.textContent = tvShow.name;
    
    tvShowCard.appendChild(tvShowImage);
    tvShowCard.appendChild(tvShowTitle);
    
    // Effetto hover
    tvShowCard.addEventListener('mouseenter', () => {
        tvShowCard.style.transform = 'scale(1.1)';
        tvShowCard.style.transition = 'transform 0.3s ease';
    });

    tvShowCard.addEventListener('mouseleave', () => {
        tvShowCard.style.transform = 'scale(1)';
    });

    tvShowCard.addEventListener('click', () => {
        window.location.href = `details.html?id=${tvShow.id}`;
    });
    
    return tvShowCard;
}

// Funzione per mostrare le serie TV in una determinata sezione
async function displayTVShows(sectionId, fetchTVShowsFunction) {
    const tvShows = await fetchTVShowsFunction();
    const section = document.getElementById(sectionId).querySelector('.scroll-content');
    
    tvShows.forEach(tvShow => {
        const tvShowCard = createTVShowCard(tvShow);
        section.appendChild(tvShowCard);
    });
}

// Funzione per ottenere i dettagli della serie TV
async function getTVShowDetails(tvShowId) {
    const response = await fetch(`${API_URL}/tv/${tvShowId}?api_key=${API_KEY}&language=it-IT`);
    const data = await response.json();
    return data;
}

// Funzione per ottenere il trailer della serie TV
async function getTVShowTrailer(tvShowId) {
    // Prima proviamo a trovare un trailer in italiano
    let response = await fetch(`${API_URL}/tv/${tvShowId}/videos?api_key=${API_KEY}&language=it-IT`);
    let data = await response.json();
    let trailer = data.results.find(video => video.type === 'Trailer');

    if (!trailer) {
        // Se non trovato in italiano, cerchiamo in inglese
        response = await fetch(`${API_URL}/tv/${tvShowId}/videos?api_key=${API_KEY}&language=en-US`);
        data = await response.json();
        trailer = data.results.find(video => video.type === 'Trailer');
    }

    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
}

// Funzione per visualizzare i dettagli della serie TV
async function displayTVShowDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const tvShowId = urlParams.get('id');
    
    if (tvShowId) {
        const tvShowDetails = await getTVShowDetails(tvShowId);
        const tvShowTrailerUrl = await getTVShowTrailer(tvShowId);
        
        document.getElementById('tv-show-poster').src = `${IMAGE_BASE_URL}${tvShowDetails.poster_path}`;
        document.getElementById('tv-show-title').textContent = tvShowDetails.name;
        document.getElementById('tv-show-overview').textContent = tvShowDetails.overview;
        document.getElementById('tv-show-rating').textContent = tvShowDetails.vote_average;
        
        const trailerElement = document.getElementById('tv-show-trailer');
        if (tvShowTrailerUrl) {
            trailerElement.src = tvShowTrailerUrl;
            trailerElement.style.display = 'block';
        } else {
            trailerElement.style.display = 'none';
        }
    }
}

// Inizializzazione delle sezioni delle serie TV sulla homepage
document.addEventListener('DOMContentLoaded', () => {
    displayTVShows('top-rated', getTopRatedTVShows);
    displayTVShows('popular', getPopularTVShows);
});

// Abilita lo scrolling laterale con le frecce
document.querySelectorAll('.scroll-container').forEach(container => {
    const leftBtn = container.querySelector('.left-btn');
    const rightBtn = container.querySelector('.right-btn');
    const scrollContent = container.querySelector('.scroll-content');

    leftBtn.addEventListener('click', () => {
        scrollContent.scrollLeft -= 300;
    });

    rightBtn.addEventListener('click', () => {
        scrollContent.scrollLeft += 300;
    });
});

// Gestione del click sul pulsante "Back"
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.back-btn');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

// Funzione per gestire l'input nella pagina dei dettagli delle serie TV
if (window.location.pathname.includes('details.html')) {
    document.addEventListener('DOMContentLoaded', displayTVShowDetails);
}
