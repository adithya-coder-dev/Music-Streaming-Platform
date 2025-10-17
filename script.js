// --- 1. Data Structure: The Playlist (UNCHANGED) ---
const playlist = [
    {
        title: "Imagine-Dragons-Natural",
        artist: "Imagine-Dragons",
        src: "song1.mp3.mpeg",
        albumArt: "album1.png",
        categories: ["Motivation", "Rock"],
        duration: "3:09" // NEW: Hardcoded duration for track list rendering
    },
    {
        title: "HanumanKind-Run-It-Up",
        artist: "Sooraj Cheruka",
        src: "song2.mp3.mpeg",
        albumArt: "album2.png",
        categories: ["Workout", "Rap", "Electronic"],
        duration: "3:45"
    },
    {
        title: "Cradles",
        artist: "Sub-Urabn",
        src: "song3.mp3.mpeg",
        albumArt: "album3.png",
        categories: ["Acoustic"],
        duration: "3:29"
    },
    {
        title: "Idhazhin Oram",
        artist: "Anirudh Ravichander",
        src: "song4.mp3.mpeg",
        albumArt: "album4.png",
        categories: ["Heart", "love"],
        duration: "4:01"
    },
];

const allCategories = ["All", "Chill", "Heart", "Rap", "Synthwave", "Acoustic", "Electronic", "Metal", "love" , "Rock", "Motivation", "Workout"]; // NEW: Added missing categories

// --- Player State (ENHANCED with Persistence) ---
let currentSongIndex = parseInt(localStorage.getItem('lastSongIndex')) || 0; // NEW: Load last played song
let isPlaying = false;
let isShuffling = localStorage.getItem('isShuffling') === 'true'; // NEW: Load from storage
let repeatMode = localStorage.getItem('repeatMode') || 'none'; // NEW: Load from storage
let activeCategory = 'All';
let isDraggingProgressBar = false; // NEW: For smoother scrubbing
let lastVolume = 50; // NEW: For mute/unmute

// Feature: User Library/Favorites (NEW)
let userFavorites = JSON.parse(localStorage.getItem('userFavorites')) || [];


// --- 2. DOM Element Selectors (ENHANCED) ---
// ... (Authentication elements unchanged)

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i'); // NEW: Specific icon selector

// Navigation Elements (UNCHANGED)
const navHome = document.getElementById('nav-home');
const navSearch = document.getElementById('nav-search');
const navLibrary = document.getElementById('nav-library');
const contentHome = document.getElementById('content-home');
const contentSearch = document.getElementById('content-search');
const contentLibrary = document.getElementById('content-library');
const allNavItems = document.querySelectorAll('.sidebar nav ul li');
const allContentSections = [contentHome, contentSearch, contentLibrary];

// Player Elements (ENHANCED)
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
const volumeIconBtn = document.getElementById('volume-icon-btn'); // NEW: For mute/unmute
const volumeIcon = volumeIconBtn.querySelector('i'); // NEW: For mute/unmute
const miniAlbumArt = document.getElementById('mini-album-art');
const songTitleDisplay = document.querySelector('.song-info .song-title');
const artistNameDisplay = document.querySelector('.song-info .artist-name');

// Content Containers (UNCHANGED)
const categoryListContainer = document.getElementById('category-list-container');
const homeTrackList = document.getElementById('home-track-list');
const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');
const librarySongsList = document.getElementById('library-songs-list');
const genreGrid = document.getElementById('genre-grid'); // NEW: Assuming genre grid exists in HTML


// --- 3. Authentication Functions (MINOR CHANGES) ---

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

// ... (handleLogin and showLogin unchanged)

function showApp(username) {
    loginScreen.style.display = 'none';
    appContainer.style.display = 'flex';

    // ... (User display setup unchanged)
    
    // Feature: Load player state on startup
    loadSong(currentSongIndex, false); // NEW: Don't auto-play on load
    updatePlayerControlIcons();
    updateThemeIcon(localStorage.getItem('theme') === 'light-mode'); // NEW: Initialize theme

    renderCategories();
    renderHomeTrackList();
    renderGenreGrid(); // NEW: Render the genre grid on search screen load
    switchScreen(contentHome); // Ensure home screen is visible first
    setActiveNav(navHome); // Ensure home nav is active
}

// ... (handleLogout and Attach Auth Listeners unchanged)


// --- 4. Player Functions (MAJOR ENHANCEMENTS) ---

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/** Loads a song and updates the UI. */
function loadSong(songIndex, autoPlay = true) { // NEW: autoPlay parameter
    if (!playlist[songIndex]) return console.error("Song index out of bounds:", songIndex);

    currentSongIndex = songIndex;
    localStorage.setItem('lastSongIndex', currentSongIndex); // NEW: Save state
    const song = playlist[songIndex];

    audio.src = song.src;
    songTitleDisplay.textContent = song.title;
    artistNameDisplay.textContent = song.artist;
    miniAlbumArt.src = song.albumArt || "placeholder-album.png";

    // NEW: Handle missing album art
    miniAlbumArt.onerror = () => { miniAlbumArt.src = "placeholder-album.png"; };

    audio.load();
    audio.onloadedmetadata = () => {
        progressBar.max = audio.duration;
        durationDisplay.textContent = formatTime(audio.duration);
        if (autoPlay) playSong();
    };
    
    // NEW: Update UI elements that show which song is playing
    updateTrackListHighlight();
}

/** Updates the visual state of the play/pause button */
function updatePlayPauseIcon() {
    playPauseIcon.classList.toggle('fa-pause', isPlaying);
    playPauseIcon.classList.toggle('fa-play', !isPlaying);
}

function playSong() {
    audio.play().catch(error => {
        console.error("Autoplay failed:", error);
        // NEW: User must interact with the page first before autoplay is allowed.
    });
    isPlaying = true;
    updatePlayPauseIcon();
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayPauseIcon();
}

function togglePlayPause() { // NEW: Consolidated function
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    if (isShuffling) {
        // Feature: Simple shuffle logic
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex && playlist.length > 1);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
}

function prevSong() {
    // Feature: Restart song if more than 3 seconds played, otherwise go to previous
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        playSong();
        return;
    }
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
}

function handleTrackClick(e) {
    const item = e.currentTarget;
    const index = parseInt(item.dataset.index);
    if (!isNaN(index) && index !== currentSongIndex) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
    } else if (index === currentSongIndex) {
        togglePlayPause(); // NEW: Click current track to play/pause
    }
}

/** Toggles favorite state and updates UI/Storage. */
function toggleFavorite(e) {
    const trackItem = e.currentTarget.closest('.track-item');
    const index = parseInt(trackItem.dataset.index);
    const song = playlist[index];
    const songId = `${song.title}-${song.artist}`;

    const isFavourited = userFavorites.includes(songId);

    if (isFavourited) {
        userFavorites = userFavorites.filter(id => id !== songId);
    } else {
        userFavorites.push(songId);
    }
    
    localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    
    // Update the heart icon visually immediately
    const heartIcon = e.currentTarget.querySelector('i');
    heartIcon.classList.toggle('fas', !isFavourited);
    heartIcon.classList.toggle('far', isFavourited); // far = font awesome regular (outline)

    // NEW: If currently in Library view, re-render it
    if (contentLibrary.style.display === 'block') {
        renderLibrary();
    }
    
    e.stopPropagation(); // Stop click from propagating to the track item
}


// --- 5. Navigation & Theme Functions (ENHANCED) ---

function switchScreen(targetContent) {
    allContentSections.forEach(section => {
        section.style.display = 'none';
    });
    targetContent.style.display = 'block';
}

// ... (setActiveNav unchanged)

// Attach Navigation Listeners (ENHANCED: Re-render list/library on switch)
navHome.addEventListener('click', () => { switchScreen(contentHome); setActiveNav(navHome); renderHomeTrackList(); });
navSearch.addEventListener('click', () => { switchScreen(contentSearch); setActiveNav(navSearch); renderGenreGrid(); });
navLibrary.addEventListener('click', () => { switchScreen(contentLibrary); setActiveNav(navLibrary); renderLibrary(); });

function updateThemeIcon(isLight) {
    themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode'); // NEW: Persist theme
    updateThemeIcon(isLight);
}
themeToggleBtn.addEventListener('click', toggleTheme);

// NEW: Theme initialization on load
if (localStorage.getItem('theme') === 'light-mode') {
    document.body.classList.add('light-mode');
}


// --- 6. Content Rendering Functions (MAJOR ENHANCEMENTS) ---

/** Generates HTML for a track item. */
function createTrackItem(song, originalIndex) {
    const isPlayingTrack = (originalIndex === currentSongIndex);
    const isFavourited = userFavorites.includes(`${song.title}-${song.artist}`);
    const heartIconClass = isFavourited ? 'fas' : 'far';

    return `
        <div class="track-item ${isPlayingTrack ? 'playing' : ''}" data-index="${originalIndex}">
            <span class="track-number">
                ${isPlayingTrack ? (isPlaying ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-pause"></i>') : originalIndex + 1} 
            </span>
            <div class="track-details">
                <div class="track-title ${isPlayingTrack ? 'active-title' : ''}">${song.title}</div>
                <div class="track-artist">${song.artist}</div>
            </div>
            <span class="track-actions favorite-toggle">
                <i class="${heartIconClass} fa-heart"></i>
            </span>
            <span class="track-duration">${song.duration || formatTime(audio.duration)}</span>
        </div>
    `;
}

/** Updates the 'playing' class on all track lists */
function updateTrackListHighlight() {
    document.querySelectorAll('.track-item').forEach(item => {
        const index = parseInt(item.dataset.index);
        const isCurrentlyPlaying = index === currentSongIndex;
        item.classList.toggle('playing', isCurrentlyPlaying);
        
        // Update track number icon based on play state
        const trackNumberSpan = item.querySelector('.track-number');
        if (trackNumberSpan) {
            trackNumberSpan.innerHTML = isCurrentlyPlaying 
                ? (isPlaying ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-pause"></i>')
                : index + 1;
        }
    });
}


// ... (renderCategories, renderHomeTrackList, handleCategoryClick, filterPlaylist unchanged)

// Handle search input (ENHANCED: Added event listeners for new elements)
searchInput.addEventListener('input', (e) => {
    // ... (search logic unchanged)
    const query = e.target.value.trim();
    const results = filterPlaylist(query);
    
    if (query.length > 0 && results.length > 0) {
        searchResultsList.innerHTML = results.map((song) => {
            const originalIndex = playlist.findIndex(p => p.title === song.title && p.artist === song.artist);
            return createTrackItem(song, originalIndex);
        }).join('');
        
        document.querySelectorAll('#search-results-list .track-item').forEach(item => {
            item.addEventListener('click', handleTrackClick);
            item.querySelector('.favorite-toggle').addEventListener('click', toggleFavorite); // NEW: Attach favorite toggle
        });
        updateTrackListHighlight(); // NEW: Highlight current track
        
    } else if (query.length > 0) {
        searchResultsList.innerHTML = `<p style="color: var(--text-medium); padding: 10px;">No results found for "${query}"</p>`;
    } else {
        searchResultsList.innerHTML = '';
    }
});


/** Renders the genre grid. (NEW FEATURE) */
function renderGenreGrid() {
    if (!genreGrid) return;
    const colors = ['#8A2BE2', '#DC143C', '#228B22', '#FF4500', '#1E90FF', '#FFD700'];
    
    genreGrid.innerHTML = allCategories
        .filter(cat => cat !== 'All') // Don't show "All" as a specific genre card
        .map((cat, index) => {
            const color = colors[index % colors.length];
            return `
                <div class="genre-card" style="background-color: ${color};" data-genre="${cat}">
                    ${cat}
                    <span class="genre-card-art"></span>
                </div>
            `;
        }).join('');
        
    document.querySelectorAll('.genre-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const genre = e.currentTarget.dataset.genre;
            activeCategory = genre;
            // Switch to Home screen and filter
            switchScreen(contentHome);
            setActiveNav(navHome);
            renderCategories();
            renderHomeTrackList();
        });
    });
}


/** Populates the library screen with favorited songs. (ENHANCED) */
function renderLibrary() {
    const favoritedTracks = playlist.filter(song => {
        const songId = `${song.title}-${song.artist}`;
        return userFavorites.includes(songId);
    });

    if (favoritedTracks.length === 0) {
        librarySongsList.innerHTML = `<p style="color: var(--text-medium); padding: 10px;">Your library is empty. Start by loving some tracks!</p>`;
        return;
    }

    librarySongsList.innerHTML = favoritedTracks.map((song) => {
        const originalIndex = playlist.findIndex(p => p.title === song.title && p.artist === song.artist);
        return createTrackItem(song, originalIndex);
    }).join('');

    document.querySelectorAll('#library-songs-list .track-item').forEach(item => {
        item.addEventListener('click', handleTrackClick);
        item.querySelector('.favorite-toggle').addEventListener('click', toggleFavorite); // NEW: Attach favorite toggle
    });
    updateTrackListHighlight(); // NEW: Highlight current track
}


// --- 7. Final Initialization (MAJOR ENHANCEMENTS) ---

/** Updates the visual state of the shuffle and repeat buttons */
function updatePlayerControlIcons() {
    shuffleBtn.style.color = isShuffling ? 'var(--accent-color)' : 'var(--text-medium)';
    
    let repeatIconClass = 'fas fa-redo-alt'; // Default for repeat all
    if (repeatMode === 'one') repeatIconClass = 'fas fa-redo-alt fa-rotate-90'; // Assuming a custom class or rotation for repeat one
    else if (repeatMode === 'none') repeatIconClass = 'fas fa-sync-alt'; // sync is a good neutral icon

    repeatBtn.querySelector('i').className = repeatIconClass;
    repeatBtn.style.color = repeatMode !== 'none' ? 'var(--accent-color)' : 'var(--text-medium)';
}

/** Toggles the volume mute state */
function toggleMute() {
    if (audio.volume > 0) {
        lastVolume = audio.volume * 100; // Save current volume percentage
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = lastVolume / 100;
        volumeSlider.value = lastVolume;
    }
    updateVolumeIcon();
    localStorage.setItem('volume', volumeSlider.value); // Persist
}

/** Updates the volume icon based on volume level */
function updateVolumeIcon() {
    const vol = audio.volume * 100;
    let iconClass;
    if (vol === 0) iconClass = 'fas fa-volume-mute';
    else if (vol < 50) iconClass = 'fas fa-volume-down';
    else iconClass = 'fas fa-volume-up';
    volumeIcon.className = iconClass;
}


document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Feature: Load and set initial volume
    const storedVolume = parseInt(localStorage.getItem('volume')) || 70;
    volumeSlider.value = storedVolume;
    audio.volume = storedVolume / 100;
    updateVolumeIcon();


    // --- Volume Listeners (ENHANCED) ---
    volumeSlider.addEventListener('input', (e) => { 
        audio.volume = e.target.value / 100; 
        localStorage.setItem('volume', e.target.value);
        updateVolumeIcon();
    });
    volumeIconBtn.addEventListener('click', toggleMute); // NEW: Mute/unmute button
    
    // --- Player Control Listeners (ENHANCED) ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        localStorage.setItem('isShuffling', isShuffling);
        updatePlayerControlIcons();
    });
    
    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'none') repeatMode = 'all';
        else if (repeatMode === 'all') repeatMode = 'one';
        else repeatMode = 'none';
        localStorage.setItem('repeatMode', repeatMode);
        updatePlayerControlIcons();
    });

    // --- Progress Bar Listeners (ENHANCED: Scrubbing Logic) ---
    audio.addEventListener('timeupdate', () => {
        if (!isDraggingProgressBar) { // Only update if user isn't dragging
            progressBar.value = audio.currentTime;
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
        updateTrackListHighlight(); // Update icon in list
    });
    
    progressBar.addEventListener('mousedown', () => { isDraggingProgressBar = true; });
    progressBar.addEventListener('mouseup', () => { 
        isDraggingProgressBar = false; 
        audio.currentTime = progressBar.value; 
    });
    progressBar.addEventListener('change', () => { // For keyboard/mobile
        if (!isDraggingProgressBar) { // Handles cases where input changes without mousedown/mouseup
             audio.currentTime = progressBar.value; 
        }
    });

    // --- End of Song Logic (ENHANCED) ---
    audio.addEventListener('ended', () => {
        if (repeatMode === 'one') { audio.currentTime = 0; playSong(); } 
        else if (repeatMode === 'all') { nextSong(); }
        else { 
            // repeatMode === 'none'
            if (currentSongIndex < playlist.length - 1 || isShuffling) {
                nextSong();
            } else {
                pauseSong(); // Stop playback on last song
                currentSongIndex = 0; // Reset index to the first song
                loadSong(currentSongIndex, false);
            }
        }
    });

    // --- Track List Listener Attachment ---
    // This handles track-item clicks on initial render (Home).
    document.querySelectorAll('#home-track-list .track-item').forEach(item => {
        item.addEventListener('click', handleTrackClick);
        item.querySelector('.favorite-toggle').addEventListener('click', toggleFavorite);
    });
});
