import type { UploadTranslations } from "../types";

export const pl: UploadTranslations = {
  attachFile: "Załącz plik",
  dropHere: "Upuść pliki tutaj lub kliknij, aby wybrać",
  browse: "Przeglądaj",
  converting: "Konwertowanie",
  queued: "W kolejce",
  uploading: "Przesyłanie",
  paused: "Wstrzymano",
  offlinePaused: "Wstrzymano (offline)",
  completed: "Zakończono",
  failed: "Niepowodzenie",
  canceled: "Anulowano",
  pause: "Wstrzymaj",
  resume: "Wznów",
  retry: "Ponów",
  remove: "Usuń",
  clear: "Wyczyść",
  replace: "Zastąp",
  currentFile: "Bieżący plik",
  offlineNotice:
    "Brak połączenia z internetem. Przesyłanie zostało wstrzymane i wznowi się automatycznie po przywróceniu połączenia.",
  onlineResuming: "Połączenie przywrócone, wznawianie przesyłania...",
  fileTooLarge: (maxMB: number) =>
    `Plik jest zbyt duży. Maksymalny dozwolony rozmiar to ${maxMB}MB.`,
  fileTypeNotAllowed: "Ten typ pliku jest niedozwolony.",
  maxSizeLabel: (size: string) => `Maksymalny rozmiar pliku: ${size}`,
};
