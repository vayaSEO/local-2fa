# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Unified `Add Account` flow with URL autofill + manual fallback.
- Import from local QR image files (`Import from QR Image`), PNG only.
- Keyboard shortcuts: `Ctrl+X` (Delete account), `Cmd+R` (Reload), `Cmd+I` (Autofill).
- Expanded test coverage: `parseOtpauthUrl` edge cases (protocol, hostname,
  invalid secret, missing issuer, out-of-range digits/period/algorithm, length
  caps) and `parseGoogleMigrationUrl` edge cases (HOTP filtered, missing
  secret, wrong protocol, missing data, oversize URL). 19 tests total.

### Changed

- QR decoding rewritten: replaced `zbarimg` (external binary via
  `child_process`) with pure JS `qr` + `pngjs`. PNG only by design.
- `Add Account` action order: `Save Account` is now primary (Enter submits),
  `Autofill` is secondary.
- `package.json`: `categories` set to `["Productivity"]`, added
  `platforms: ["macOS"]`, removed `version` field (managed by Raycast Store),
  command titles end with a period, extension `title` is `Local 2FA Codes`.
- Simplified command surface and naming for better Raycast UX.
- Documentation restructured into user-facing and maintainer-facing files.

### Removed

- `src/import-otpauth.tsx` (dead code, never wired as a command).
- External dependency on `zbarimg` / `brew install zbar`.
- `child_process` / `execFile` usage from image import path.

### Security

- **KDF hardened**: PBKDF2-SHA256 iterations bumped from `210_000` to `600_000`
  (OWASP 2023 recommendation). New writes use payload `version: 2`. Existing
  `version: 1` vaults are still decrypted transparently with the legacy
  iteration count — no migration step required for users.
- **Write race protection**: `upsertAccount` and `deleteAccount` are now
  serialized through an in-process promise mutex to prevent concurrent-write
  races that could drop accounts.
- **Corruption guard**: `decryptAccounts` throws explicitly if the decrypted
  JSON is not an array, instead of silently overwriting the vault with empty
  data on next save.
- **Derived-key cache**: PBKDF2 result is cached per `(password, salt, iter)`
  tuple to avoid re-deriving on every storage op (no plaintext password kept
  beyond the existing Raycast preference).
- Input caps to prevent DoS via crafted payloads:
  - `decodeBase32`: 1024-char input cap.
  - `parseOtpauthUrl`: 1024-char raw label cap; 256-char cap on issuer/account.
  - `parseGoogleMigrationUrl`: 64 KB URL cap, 64 KB decoded payload cap,
    100 000 protobuf iterations cap, 1000 accounts cap.
- `storage.ts`: AES-256-GCM failures (wrong password or tampered ciphertext)
  surface a single generic error instead of leaking raw crypto errors.

### Fixed

- `Clipboard.copy` now uses `concealed: true` so codes are not retained by
  clipboard history tools.
- `LICENSE` copyright holder corrected to `David Sitjes`.
- `parseLabel`: catches `URIError` on malformed percent-encoded labels and
  surfaces a clear error instead of crashing.
- `parseOtpauthUrl`: validates the base32 secret eagerly (side-effect
  `decodeBase32` call) so import errors are caught before persisting.
- `google-migration`: stricter algorithm enum mapping (rejects unknown values)
  and requires explicit `type` field in OTP messages.

### Dependencies

- `@raycast/api` ^1.104.19, `@raycast/utils` ^2.2.5.
- Migrated to `@raycast/eslint-config@^2.1.1` with ESLint 9 flat config
  (`eslint.config.js`). Removed legacy `.eslintrc.json`. Resolves 6 transitive
  `minimatch` ReDoS advisories.
- `@types/react` ^19.2.15, `@types/node` ^22.19.19 (peer-dep alignment).
- `pngjs` ^7.0.0, `qr` ^0.6.0.

## [1.0.0] - 2026-05-17

### Added

- Initial public release.
- TOTP generation (RFC 6238) with `SHA1`, `SHA256`, `SHA512`.
- Local encrypted storage using `AES-256-GCM`.
- Key derivation with `PBKDF2-SHA256` (210,000 iterations).
- `otpauth://` import support.
- Google Authenticator migration (`otpauth-migration://`) support.
- Unit tests for TOTP vectors and migration parser.
- Security policy and threat model in `SECURITY.md`.
