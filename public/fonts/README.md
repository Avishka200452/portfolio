# Custom Fonts Setup

Place your font files in this directory:

## Required Font Files

### BROGETTA (Display/Name heading font)
- `BROGETTA-Regular.ttf` (or .otf / .woff / .woff2)

### Selcouth (Body headings & paragraphs font)  
- `Selcouth.ttf` (or .otf / .woff / .woff2)

## Where to Download
- **BROGETTA**: https://www.dafont.com/brogetta.font (Free for personal use)
- **Selcouth**: Search "Selcouth font" on fontmeme.com or actionfonts.com (Free for personal use)

## After Adding Files
The `@font-face` declarations in `app/globals.css` will automatically pick them up.
If your file extensions differ from `.ttf`, update the `url()` paths in globals.css accordingly.
