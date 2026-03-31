# Vietnamese Phrase Studio

A small GitHub Pages-ready HTML, CSS, and JavaScript app for learning common spoken Vietnamese with editable flashcards.

## Files to upload

Upload this whole folder to your GitHub repository:

- `index.html`
- `style.css`
- `app.js`
- `data/starter-deck.json`
- `README.md`

## How to publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files and folders from this project.
3. Make sure the main page is named `index.html` in the root.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder.
7. Save.
8. Wait a minute, then open your site at:
   `[https://weiwei1467.github.io/viet-phrase-app/](https://weiwei1467.github.io/viet-phrase-app/)`

## Recommended deck format

The native format is JSON.

Example:

```json
{
  "deckName": "Broken Vietnamese Core Phrases",
  "cards": [
    {
      "id": "card-001",
      "viet": "Em mệt quá.",
      "pronunciation": "em met qua",
      "english": "I am very tired.",
      "cantonese": "我好攰。",
      "example": "Hôm nay em mệt quá.",
      "exampleMeaning": "I am very tired today.",
      "brokenCue": "Short home phrase.",
      "notes": "Useful for home conversation.",
      "tags": ["daily", "feeling"],
      "upvotes": 2,
      "downvotes": 0,
      "level": "learning"
    }
  ]
}
```

## Notes

- The app is static, so it cannot save directly back into your GitHub repository.
- Instead, edit in the browser and download updated JSON or Markdown files.
- Then re-upload those updated files to GitHub when you want to publish changes.
- The translator helper stays on the same page, but outside research links are included as optional extras.
