# Font Preview

A custom Counterplay window with 85 individual sample texts in one flat list. Click any text to preview it immediately. Edit its name/text, add your own entries, duplicate samples or remove them with Undo removal. The library and size save on this Mac and survive reopening.

Install with one click from **Settings → Plugins → Browse Community Plugins… → Font Preview → Install**. Open a font and choose **Plugins → Font Preview → Open Font Preview**. No font-edit permission is needed. The header holds Master and Texts; the footer holds size, line height, tracking, Features and Refresh. The status row above the specimen reports save success or errors.

Rendering uses the invoking font's compiled outlines and HarfBuzz, includes unsaved font edits and wraps to the window width. Missing characters are counted by a strict background proof; the editable browser surface may show fallback for unsupported characters. Color layers and `/glyphName` tokens are not rendered. Texts do not alter font data or its saved proof.

The plugin owns all UI in `index.html`, `style.css`, `preview.js` and `samples.js`. It uses the general `ui.windows` bridge with `document.read`, `font.compile` and `storage`; the host does not impose this layout or workflow. Saved library schema version 1 uses key `text-library`, with up to 500 records, subject to the host's 1 MB quota. Errors preserve saved data.

Validate from this community repository:

```sh
python3 scripts/catalog.py .
```

Developer guides: [Font Preview](https://counterplay.vivotipo.com/plugin-preview) and [interactive plugins](https://counterplay.vivotipo.com/plugin-ui). Distributed under the included MIT license.

## Preview controls

**Texts** opens the 85-entry library in a popover; picking a text closes it. Click the specimen itself to edit in place with the compiled font. Click outside or press Escape to finish editing. The same compiled-font text surface stays visible, with no renderer swap. Default line height is 1.15× and tracking is 0 em. Rename, duplicate, add and remove samples inside Texts. The footer holds the 8–300 pt slider, precise size field, line-height slider (0.8–3×), tracking slider (−0.1–0.5 em), Features and Refresh. Spacing, feature overrides, language, direction, size and texts persist on this Mac.

This plugin uses the host-provided `CounterplayUI` React/Base UI components. Its stylesheet defines only layout and specimen typography. The shared theme provides controls, Apple colors, focus states and light/dark appearance automatically. Requires a host with Counterplay UI v1.
