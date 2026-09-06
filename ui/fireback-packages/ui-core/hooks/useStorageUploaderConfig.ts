import { useMemo } from "react";
import { useAuthentication } from "@fireback/auth-client";
import { BUILD_VARIABLES } from "./build-variables";
import { useLocale } from "./useLocale";
import type { UploaderConfig, UploaderLocale } from "@fireback/resumable-uploader";

// resumable-uploader only ships its own translations for a subset of this app's
// KNOWN_LOCALES (see localeStore.ts) - anything else (ar/de/ua/ru, ...) falls back
// to its English default rather than a missing/half-translated set.
const SUPPORTED_UPLOADER_LOCALES: UploaderLocale[] = ["en", "fa", "pl"];

function toUploaderLocale(locale: string): UploaderLocale | undefined {
  return SUPPORTED_UPLOADER_LOCALES.includes(locale as UploaderLocale)
    ? (locale as UploaderLocale)
    : undefined;
}

function storageBaseUrl(): string {
  // Same trim-trailing-slash-then-add-leading-slash idiom used everywhere
  // else a REMOTE_SERVICE base gets concatenated with a path (see
  // checkSessionViaWhoami.ts, ReactiveSearch.tsx) - REMOTE_SERVICE ends in
  // a slash in dev ("http://localhost:4500/") but not in prod ("/"), so
  // naive concatenation produces a double slash Gin 404s on.
  return (BUILD_VARIABLES.REMOTE_SERVICE || "").replace(/\/$/, "");
}

/**
 * Absolute URL for a completed upload's raw bytes, given its tus upload id -
 * matches the storage module's `GET /storage/downloads/:id/raw` route (see
 * modules/storage/README.md §6). Returns null for a not-yet-uploaded/empty
 * value so callers can conditionally render without an extra null check.
 */
export function storageDownloadUrl(
  id: string | null | undefined,
): string | null {
  if (!id) return null;
  return `${storageBaseUrl()}/storage/downloads/${id}/raw`;
}

/**
 * Ready-to-use <UploaderConfigProvider> config wired to this app's own
 * storage module mount (`/storage/files`, registered via
 * `storage.StorageModuleSetup` in cmd/fireback/main.go), tagging every
 * upload with the current session's auth token + workspace the same way
 * every other authenticated request in the app does - matching what
 * storage's own `defaultAuthenticate` (Webserver.go) expects: the
 * `Authorization` header plus `Workspace-id`. Reusable by any feature that
 * needs a resumable file/image upload field (user photo, workspace logo,
 * ...) without re-deriving this wiring each time.
 */
export function useStorageUploaderConfig(
  overrides?: Partial<UploaderConfig>,
): UploaderConfig {
  const { token, selectedWorkspace } = useAuthentication();
  const { locale } = useLocale();

  return useMemo(
    () => ({
      endpoint: `${storageBaseUrl()}/storage/files`,
      // Function form (not a static object) - re-evaluated before every
      // request, so a token refreshed mid-upload is still picked up (see
      // resumable-uploader/README.md "Configuring the tus endpoint").
      headers: () => ({
        authorization: token || "",
        "workspace-id": selectedWorkspace?.workspaceId || "",
      }),
      getThumbnailUrl: (id: string) => storageDownloadUrl(id) || "",
      // Without this, UploaderConfigProvider defaults to its own English
      // translations regardless of what the user actually has the rest of
      // the app set to (see InterfaceSettings.tsx's language switcher) -
      // this is what makes the uploader's buttons/labels follow it too.
      locale: toUploaderLocale(locale),
      ...overrides,
    }),
    [token, selectedWorkspace?.workspaceId, locale, overrides],
  );
}
