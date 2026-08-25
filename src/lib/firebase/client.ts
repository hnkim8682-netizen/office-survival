import type { FirebaseApp } from "firebase/app";

import { firebaseConfig, isFirebaseConfigured } from "./config";

let appPromise: Promise<FirebaseApp | null> | null = null;

/**
 * Loads the Firebase SDK lazily and only in the browser, so pages that never
 * touch Firebase pay nothing for it. Returns null when env vars are absent.
 */
export function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return Promise.resolve(null);

  appPromise ??= import("firebase/app")
    .then(({ getApps, initializeApp }) => {
      const existing = getApps();
      return existing.length > 0 ? existing[0] : initializeApp({ ...firebaseConfig });
    })
    .catch(() => null);

  return appPromise;
}
