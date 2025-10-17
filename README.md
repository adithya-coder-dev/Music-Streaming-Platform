I'd be happy to create a README for your project\! Since you've built a **login-free music player** application, this README is structured to help users and developers quickly understand, set up, and use your code.

Here is the README:

# StreamWave Music Player 🎵

StreamWave is a modern, single-page web application (SPA) music player built using pure HTML, CSS, and JavaScript. It features a responsive design, dynamic content filtering, playback controls (play/pause, next/previous, shuffle, repeat), and a dark/light mode toggle.

## ✨ Features

  * **Login-Free Experience:** The application loads immediately; no authentication required.
  * **Full Playback Controls:** Includes play, pause, next, previous, shuffle, and three-mode repeat (`none`, `all`, `one`).
  * **Dynamic Category Filtering:** Browse tracks by categories defined in the playlist data.
  * **Search Functionality:** Filter songs by title, artist, or category instantly.
  * **Theme Toggle:** Switch between **Dark Mode** and **Light Mode**.
  * **Component-Based Structure:** Clear separation of concerns in HTML, CSS, and JS.

-----

## 🚀 Getting Started

To run this project locally, simply follow these steps.

### 1\. Prerequisites

You only need a modern web browser (Chrome, Firefox, Edge, etc.).

### 2\. File Structure

Ensure your project directory contains the following files:

```
streamwave/
├── index.html        (The main structure)
├── style.css         (The styling)
├── script.js         (The application logic)
├── song1.mp3.mpeg    (Your audio files)
├── song2.mp3.mpeg
├── ...
├── album1.png        (Your album art images)
├── album2.png
└── ...
```

### 3\. Running the App

1.  Place the `index.html`, `style.css`, and `script.js` files, along with all the audio and image assets (as listed above), into a single folder.
2.  Open the **`index.html`** file directly in your web browser.

The player should load instantly in **Guest Mode** and be fully functional.

-----

## 💻 Code Structure

### `script.js` Overview

The JavaScript file is divided into clear sections:

| Section | Description |
| :--- | :--- |
| **1. Data Structure** | Defines the main `playlist` array and global state variables. |
| **2. DOM Element Selectors**| Caches all necessary HTML elements. |
| **3. Initialization** | The `initializeApp()` function runs on load, setting up the UI and initial player state. |
| **4. Player Functions** | Logic for `loadSong`, `playSong`, `nextSong`, etc., interacting with the `<audio>` element. |
| **5. Navigation & Theme** | Logic for screen switching and the `toggleTheme` function. |
| **6. Content Rendering** | Functions for displaying the track lists, handling category clicks, and search filtering. |
| **7. Final Initialization** | Attaches all event listeners for the player, navigation, and input fields. |

### Adding New Songs

To add a new song, simply update the `playlist` array in `script.js` with a new object:

```javascript
const playlist = [
    // ... existing songs ...
    {
        title: "New-Track-Title",
        artist: "New Artist Name",
        src: "new_song_file.mp3", // Make sure this file exists!
        albumArt: "new_album.png", // Make sure this image exists!
        categories: ["New", "Category"] 
    },
];
```

Make sure to also update the `allCategories` array if you introduce new categories.

-----

## 🛠 Built With

  * **HTML5**
  * **CSS3**
  * **JavaScript (ES6+)**
  * **Font Awesome** (for icons)

## 🤝 Contributors
* Adithya.M
* Mari muthu.K
* Abiahek raj.R


