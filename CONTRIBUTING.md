# Contributing plugins

## Before you start

Check existing plugins and issues. A plugin should have a clear purpose for font designers and use Counterplay's built-in UI components. Use editable JavaScript, HTML and CSS; the repository does not accept native binaries, dependency installers, minified bundles, telemetry, arbitrary network access, or dynamic executable downloads.

## Fork, develop, test, submit

```sh
git clone https://github.com/YOUR-ACCOUNT/counterplay-plugins.git
cd counterplay-plugins
git switch -c add-my-plugin
```

Create a plugin in **Counterplay → Settings → Plugins → Create Plugin…**. The app installs and enables a working starter. The bundled CLI is also available through **Copy Terminal Setup**:

```sh
counterplay plugin new my-tool
counterplay plugin validate my-tool.counterplayplugin
```

Copy your finished bundle into `plugins/my-tool.counterplayplugin/`. Choose a globally unique manifest ID and keep it stable. Folder names use lowercase letters, digits and hyphens. The manifest's `version` is numeric `major.minor.patch`; increase it whenever changing an existing plugin, including its documentation or community metadata.

Add `community.json`:

```json
{"author":"Your name or GitHub handle","minimumAppVersion":"1.0.0"}
```

Provide `README.md` covering purpose, setup, each command, required permissions, data storage, limitations, and testing. Include an MIT `LICENSE` with the correct attribution. Only declared resources and these three documentation/metadata files are accepted. Keep images/fonts small; each asset is at most 2 MB and the whole plugin at most 16 MB.

Test the actual installed plugin with a disposable font. Exercise each control, no selected glyph, an empty font, a large font, closing the document, reopening the plugin, and saved settings. Editing plugins must demonstrate one-step Undo, permission refusal, and handling stale revisions. A static checker cannot prove these runtime behaviors.

```sh
python3 scripts/catalog.py .
git add plugins/my-tool.counterplayplugin
git commit -m "Add My Tool plugin"
git push -u origin add-my-plugin
```

Open a pull request against `Vivotipo/counterplay-plugins:main`. Complete the PR template with app/macOS versions and screenshots or a recording. Keep unrelated changes out of the PR.

## Checks and review

Required checks validate API v1 manifests, IDs, paths, permissions, references, file and package limits, syntax, version bumps, readable source policy and common secret patterns. CodeQL's extended JavaScript security queries check code; any reported result blocks that job. ClamAV scans plugin files with updated malware signatures; scanner errors also fail the job. The trusted base-branch validator is used for PRs, so a submission cannot weaken its own checks. Candidate plugin scripts are never executed by CI, and PR jobs do not receive publication credentials.

A code owner reviews functionality, permission necessity, privacy, storage, licensing, UI behavior, obfuscation, and the supplied runtime evidence. Reviewers must inspect every changed executable asset and infrastructure change; successful scans alone are not approval. Changed commits dismiss previous approvals. Resolve conversations and checks before merging. Maintainers must recruit a second reviewer for their own contributions; GitHub does not permit self-approval.

## After merge

The merged `main` commit is validated and scanned again. Only after all three jobs pass does the publication job write `catalog.json` and SHA-256-addressed packages to the `catalog` branch. Existing package files are retained to support clients that loaded an earlier catalog. Refresh Community Plugins to see the release. A failed publication leaves the previous catalog available; inspect Actions, fix the cause, and rerun on current main.

Counterplay checks transport status, size, SHA-256, metadata, exact declared file set, paths and host compatibility before installing. Installing or updating does not grant font-edit permission. Modified local plugins are protected from community updates.

To remove an unsafe plugin from discovery, submit a PR removing its folder. After publication it disappears from the current catalog. Already installed copies are not remotely disabled, and old content-addressed downloads are retained; for an urgent incident, owners must also remove affected published packages and notify users through an appropriate product channel.
