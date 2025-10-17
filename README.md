No problem\! I'll update the README to include the live demo link in the new "Links" section.

Here is the revised README:

# StreamWave Music Player 🎵

StreamWave is a modern, single-page web application (SPA) music player built using pure HTML, CSS, and JavaScript. It features a responsive design, dynamic content filtering, playback controls (play/pause, next/previous, shuffle, repeat), and a dark/light mode toggle.

-----

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
| **4. Player Functions** | Logic for `loadSong`, `playSong`, `nextSong`, etc., interacting with the `<audio>` element. |
| **6. Content Rendering** | Functions for displaying the track lists, handling category clicks, and search filtering. |

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

-----

## 🔗 Links

  - **Live Demo** - [https://adithya-coder-dev.github.io/Music-Streaming-Platform/](https://adithya-coder-dev.github.io/Music-Streaming-Platform/)

-----

## 🛠 Built With

  * **HTML5**
  * **CSS3**
  * **JavaScript (ES6+)**
  * **Font Awesome** (for icons)
