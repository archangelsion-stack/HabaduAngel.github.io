# Happy Birthday — GitHub-ready version

This project is now a **single-file website**. Upload `index.html` to a GitHub repository and enable **Settings → Pages → Deploy from branch → main → / (root)**.

## Quick GitHub setup

1. Create a new GitHub repository.
2. Upload `index.html` and the `images`, `audio`, and `videos` folders.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then press **Save**.
6. GitHub will give you a website URL after it finishes publishing.

## How to customize

Open `index.html` on GitHub, press the pencil/edit button, and search for:

```js
EDIT HERE
```

Everything you need to change is inside the `CONFIG` object immediately below that comment:

- `recipient`: the birthday person’s name.
- `memories`: 9 picture paths, labels, and captions.
- `videos`: 3 different full-screen mobile video paths.
- `music`: 2 MP3 paths, song titles, and artists.
- `letters`: 9 names, assigned pictures, titles, and messages.

## File names to use

Upload your media with these names, or change the paths in CONFIG:

```text
images/memory-1.jpg through images/memory-9.jpg
videos/memory-1.mp4 through videos/memory-3.mp4
audio/song-1.mp3 and audio/song-2.mp3
```

JPG, PNG, MP4, and MP3 files are supported. If a file is missing, the page shows a friendly placeholder instead of a broken layout.

## Preview on your computer

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
