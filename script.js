// --- 1. Data Structure: The Playlist ---
const playlist = [
    {
        title: "Imagine-Dragons-Natural",
        artist: "Imagine-Dragons",
        src: "song1.mp3.mpeg",
        albumArt: "album1.png",
        categories: ["Motivation", "Rock"] 
    },
    {
        title: "HanumanKind-Run-It-Up",
        artist: "Sooraj Cheruka",
        src: "song2.mp3.mpeg",
        albumArt: "album2.png",
        categories: ["Workout", "Rap", "Electronic"] 
    },
    {
        title: "Cradles",
        artist: "Sub-Urabn",
        src: "song3.mp3.mpeg",
        albumArt: "album3.png",
        categories: ["Acoustic"] 
    },
    {
        title: "Idhazhin Oram",
        artist: "Anirudh Ravichander",
        src: "song4.mp3.mpeg",
        albumArt: "album4.png",
        categories: ["Heart", "love"] 
    },
];

const allCategories = ["All", "Chill", "Heart", "Rap", "Synthwave", "Acoustic", "Electronic", "Metal", "love" , "Rock"];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffling = false;
let repeatMode = 'none'; 
let activeCategory = 'All'; 

// --- 2. DOM Element Selectors ---
// Application Elements
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');

// User Display Elements
const displayUsername = document.getElementById('display-username');
const greetingUsername = document.getElementById('greeting-username');

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Navigation Elements
const navHome = document.getElementById('nav-home');
const navSearch = document.getElementById('nav-search');
const navLibrary = document.getElementById('nav-library');
const contentHome = document.getElementById('content-home');
const contentSearch = document.getElementById('content-search');
const contentLibrary = document.getElementById('content-library');
const allNavItems = document.querySelectorAll('.sidebar nav ul li');
const allContentSections = [contentHome, contentSearch, contentLibrary];

// Player Elements
const audio = document.getElementById('music-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const miniAlbumArt = document.getElementById('mini-album-art');
const songTitleDisplay = document.querySelector('.song-info .song-title');
const artistNameDisplay = document.querySelector('.song-info .artist-name');

// Content Containers
const categoryListContainer = document.getElementById('category-list-container');
const homeTrackList = document.getElementById('home-track-list');
const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');
const librarySongsList = document.getElementById('library-songs-list');


// --- 3. Authentication Functions ---

const SIMULATED_CREDENTIALS = {
    email: "user@example.com",
    password: "password",
    username: "Demo User"
};

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        showApp(userData.username);
    } else {
        showLogin();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email === SIMULATED_CREDENTIALS.email && password === SIMULATED_CREDENTIALS.password) {
        const userData = { username: SIMULATED_CREDENTIALS.username };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        loginError.style.display = 'none';
        showApp(SIMULATED_CREDENTIALS.username);
    } else {
        loginError.textContent = "Invalid email or password.";
        loginError.style.display = 'block';
    }
}

function showApp(username) {
    loginScreen.style.display = 'none';
    appContainer.style.display = 'flex'; 
    
    displayUsername.innerHTML = `<i class="fas fa-user-circle"></i> ${username}`;
    greetingUsername.textContent = username;
    
    loadSong(currentSongIndex);
    renderCategories();
    renderHomeTrackList();
    renderLibrary();
}

function showLogin() {
    appContainer.style.display = 'none';
    loginScreen.style.display = 'flex';
    audio.pause();
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showLogin();
}

// Attach Auth Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);


// --- 4. Player Functions ---

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function loadSong(songIndex) {
    const song = playlist[songIndex];

    audio.src = song.src;
    songTitleDisplay.textContent = song.title;
    artistNameDisplay.textContent = song.artist;
    miniAlbumArt.src = song.albumArt || "placeholder-album.png"; 

    audio.load();
    audio.onloadedmetadata = () => {
        progressBar.max = audio.duration;
        durationDisplay.textContent = formatTime(audio.duration);
        if (isPlaying) playSong();
    };
}

function playSong() {
    audio.play();
    isPlaying = true;
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
}

function nextSong() {
    if (isShuffling) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
    playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
}

function handleTrackClick(e) {
    const item = e.currentTarget;
    const index = parseInt(item.dataset.index);
    if (!isNaN(index)) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
    }
}


// --- 5. Navigation & Theme Functions ---

function switchScreen(targetContent) {
    allContentSections.forEach(section => {
        section.style.display = 'none';
    });
    targetContent.style.display = 'block';
}

function setActiveNav(targetNav) {
    allNavItems.forEach(item => {
        item.classList.remove('active');
    });
    targetNav.classList.add('active');
}

navHome.addEventListener('click', () => { switchScreen(contentHome); setActiveNav(navHome); });
navSearch.addEventListener('click', () => { switchScreen(contentSearch); setActiveNav(navSearch); });
navLibrary.addEventListener('click', () => { switchScreen(contentLibrary); setActiveNav(navLibrary); renderLibrary(); });

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggleBtn.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
}
themeToggleBtn.addEventListener('click', toggleTheme);


// --- 6. Content Rendering Functions (Categories, Search, Library) ---

/** Generates HTML for a track item. */
function createTrackItem(song, index) {
    // Get duration from loaded metadata if available, otherwise use placeholder
    const duration = audio.duration ? formatTime(audio.duration) : '0:00'; 
    
    return `
        <div class="track-item" data-index="${index}">
            <span class="track-number"><i class="fas fa-play"></i></span>
            <div class="track-details">
                <div class="track-title">${song.title}</div>
                <div class="track-artist">${song.artist}</div>
            </div>
            <span class="track-duration">${duration}</span>
        </div>
    `;
}

/** Renders the list of categories. */
function renderCategories() {
    if (!categoryListContainer) return;

    categoryListContainer.innerHTML = allCategories.map(cat => `
        <button class="category-btn ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');

    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', handleCategoryClick);
    });
}

/** Filters tracks based on the active category and renders the list. */
function renderHomeTrackList() {
    const filteredTracks = playlist.filter(song => {
        if (activeCategory === 'All') {
            return true;
        }
        return song.categories.includes(activeCategory);
    });

    homeTrackList.innerHTML = filteredTracks.map((song, index) => {
        // Find the original index for playback
        const originalIndex = playlist.findIndex(p => p.title === song.title && p.artist === song.artist);
        return createTrackItem(song, originalIndex);
    }).join('');

    document.querySelectorAll('#home-track-list .track-item').forEach(item => {
        item.addEventListener('click', handleTrackClick);
    });
}

function handleCategoryClick(e) {
    const newCategory = e.currentTarget.dataset.category;
    activeCategory = newCategory;
    renderCategories(); 
    renderHomeTrackList();
}


// Simple Search Filter
function filterPlaylist(query) {
    const q = query.toLowerCase();
    return playlist.filter(song => 
        song.title.toLowerCase().includes(q) || 
        song.artist.toLowerCase().includes(q) ||
        song.categories.some(cat => cat.toLowerCase().includes(q))
    );
}

// Handle search input
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const results = filterPlaylist(query);
    
    if (query.length > 0 && results.length > 0) {
        searchResultsList.innerHTML = results.map((song, index) => {
            const originalIndex = playlist.findIndex(p => p.title === song.title && p.artist === song.artist);
            return createTrackItem(song, originalIndex);
        }).join('');
        
        document.querySelectorAll('#search-results-list .track-item').forEach(item => {
            item.addEventListener('click', handleTrackClick);
        });

    } else if (query.length > 0) {
        searchResultsList.innerHTML = `<p style="color: var(--text-medium); padding: 10px;">No results found for "${query}"</p>`;
    } else {
        searchResultsList.innerHTML = '';
    }
});

/** Populates the library screen. (Simulated) */
function renderLibrary() {
    // For MVP, the library is the entire playlist
    librarySongsList.innerHTML = playlist.map((song, index) => {
        return createTrackItem(song, index);
    }).join('');

    document.querySelectorAll('#library-songs-list .track-item').forEach(item => {
        item.addEventListener('click', handleTrackClick);
    });
}


// --- 7. Final Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Set initial volume
    volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value / 100; });
    audio.volume = volumeSlider.value / 100;

    // Player Listeners
    playPauseBtn.addEventListener('click', () => { if (isPlaying) pauseSong(); else playSong(); });
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.style.color = isShuffling ? 'var(--accent-color)' : 'var(--text-medium)';
    });
    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'none') repeatMode = 'all';
        else if (repeatMode === 'all') repeatMode = 'one';
        else repeatMode = 'none';
        repeatBtn.style.color = repeatMode !== 'none' ? 'var(--accent-color)' : 'var(--text-medium)';
    });

    audio.addEventListener('timeupdate', () => {
        progressBar.value = audio.currentTime;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });
    progressBar.addEventListener('input', () => { audio.currentTime = progressBar.value; });
    
    audio.addEventListener('ended', () => {
        if (repeatMode === 'one') { audio.currentTime = 0; playSong(); } 
        else { nextSong(); }
    });
    
    // Set initial theme icon
    toggleTheme();
});
