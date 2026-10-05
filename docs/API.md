# Developing for Counterplay

Start with the live [interactive plugin guide](https://counterplay.vivotipo.com/plugin-ui), [scripting API](https://counterplay.vivotipo.com/scripting), and [Font Preview walkthrough](https://counterplay.vivotipo.com/plugin-preview).

Counterplay supplies `CounterplayUI` (React, Base UI controls and the shared theme) to plugin windows. Do not vendor another copy or fetch scripts from a CDN. `Font Preview` in this repository is a complete example.

## Manifest

`manifest.json` declares `id`, `name`, numeric `version`, `apiVersion: 1`, `permissions`, `commands`, optional `windows`, and `resources`. Each command references exactly one JavaScript `script` or declared `window`. All code/assets must be local and explicitly declared. Window entries are HTML; styles are `window` or `panel`.

Supported permissions:

| Permission | Purpose |
| --- | --- |
| `document.read` | Read the bound font document; required |
| `document.write` | Request edits; the user must grant changes separately |
| `ui.windows` | Open custom windows/panels |
| `ui.preview` | Open host-rendered preview windows from scripts |
| `storage` | Store bounded plugin JSON |
| `font.compile` | Compile font data for the plugin preview |

Scripts have a five-second execution limit. Interactive windows live until closed. Changes use the host's revision-checked, atomic API and one Undo transaction. No direct filesystem, process execution, native canvas hooks or unrestricted network API is exposed.

For development, Reload after editing installed source and enable the plugin again. Changed content invalidates previous grants. Minimum app version belongs in `community.json`; test that exact supported version before declaring it.
