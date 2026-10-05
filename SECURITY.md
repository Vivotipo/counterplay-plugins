# Security policy

Report suspected vulnerabilities privately through [GitHub private vulnerability reporting](https://github.com/Vivotipo/counterplay-plugins/security/advisories/new). Do not include credentials or working exploit payloads in public issues.

Defense consists of source-only bundles, bounded host APIs, content-bound permission grants, blocked plugin network navigation, independent font-edit grants, protected-branch human review, manifest/syntax/source-policy checks, CodeQL, and ClamAV. No automated scanner guarantees the absence of malware. Runtime compatibility still requires manual tests in Counterplay.

CI uses pinned action commits, read-only PR credentials, trusted base-branch validation tools, and no dependency installation or execution from submitted plugins. Only a successful workflow on main can publish the catalog. The catalog's trust root is this GitHub repository over HTTPS; package hashes detect corruption and substitution relative to that catalog, not compromise of the repository or its maintainers. Packages are not independently code-signed.

Repository administrators must keep required review and status checks enabled, review workflow changes carefully, use strong account security, and maintain scanner updates. Main requires one code-owner approval and all three checks; catalog writes are restricted to GitHub Actions. See CONTRIBUTING.md for incident removal limitations.
