/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Master Password - Local master password used to derive the AES-256-GCM encryption key. Minimum 10 characters; 15+ recommended. No recovery if forgotten. */
  "masterPassword": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `list-codes` command */
  export type ListCodes = ExtensionPreferences & {}
  /** Preferences accessible in the `add-secret` command */
  export type AddSecret = ExtensionPreferences & {}
  /** Preferences accessible in the `import-google-migration` command */
  export type ImportGoogleMigration = ExtensionPreferences & {}
  /** Preferences accessible in the `import-from-qr-image` command */
  export type ImportFromQrImage = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `list-codes` command */
  export type ListCodes = {}
  /** Arguments passed to the `add-secret` command */
  export type AddSecret = {}
  /** Arguments passed to the `import-google-migration` command */
  export type ImportGoogleMigration = {}
  /** Arguments passed to the `import-from-qr-image` command */
  export type ImportFromQrImage = {}
}

