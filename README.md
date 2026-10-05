# Counterplay Community Plugins

Open-source plugins for [Counterplay](https://counterplay.vivotipo.com), maintained by Vivotipo and the community. Fork this repository, build a plugin, and open a pull request. After maintainer approval, merge, and successful publication checks, your plugin appears in Counterplay for everyone to install.

## Install a plugin

In a Counterplay build with Community Plugins, open **Settings → Plugins → Browse Community Plugins…**, then click **Install**. You can also use **Plugins → Community Plugins…**. Open a font and run the plugin from the **Plugins** menu.

Install enables the reviewed plugin. Font changes always need the separate **Allow font changes** switch in Settings. **Update** installs newer reviewed versions; locally modified copies must be removed manually first. Remove plugins in Settings; saved plugin data is retained. Refresh the community window to discover new releases.

The first plugin is [Font Preview](plugins/font-preview.counterplayplugin): an editable sample-text library with live compiled-font preview, OpenType controls, and persistent settings. It is read-only with respect to your font.

## Create and contribute

1. [Fork this repository](https://github.com/Vivotipo/counterplay-plugins/fork) and clone your fork.
2. Use **Settings → Plugins → Create Plugin…** in Counterplay. Choose Window, Floating Panel, or Script Command. Edit and test the installed source; Reload and enable it again after changes.
3. Copy the finished `.counterplayplugin` folder into `plugins/` in your fork. Include a README, MIT `LICENSE`, and `community.json` describing author and minimum Counterplay version.
4. Run `python3 scripts/catalog.py .` (Python 3.9+ and Node.js 20+). The checker parses JavaScript but never runs plugin code.
5. Commit to a branch and [open a pull request](https://github.com/Vivotipo/counterplay-plugins/compare). Add screenshots and your actual test results. Respond to automated checks and maintainer review.
6. Once merged, the publishing workflow validates and scans the merged commit, then updates the public catalog. No manual registry entry or separate upload is needed.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the complete workflow and review criteria, [the API guide](docs/API.md) for development, and [SECURITY.md](SECURITY.md) for security and reporting.

## Repository layout

- `plugins/<name>.counterplayplugin/`: readable source, manifest, community metadata, README, license.
- `scripts/`: standard-library validation and deterministic catalog packaging.
- `.github/`: compatibility checks, CodeQL, ClamAV, contribution template, code owners.
- `catalog` branch: generated `catalog.json` and content-addressed JSON packages. Do not submit generated files in pull requests.

## Licensing

Repository tools and contributed plugins use the [MIT license](LICENSE). By submitting a contribution you confirm that you can license it under MIT. Counterplay itself is a separate product and is not included in this repository.
