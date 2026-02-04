export type SomaticFlags = {
  isShout: boolean;
  isExcited: boolean;
  isNoisy: boolean;
  staticLevel: number;
};

export const SHOUT_MIN_LENGTH = 12;
export const SHOUT_RATIO_THRESHOLD = 0.7;
export const SHOUT_STATIC_LEVEL = 0.8;
export const EXCITED_STATIC_LEVEL = 0.5;

export function somaticFlagsFromText(text: string): SomaticFlags {
  const raw = text ?? '';
  const letters = raw.replace(/[^A-Za-zĂÂÎȘȚăâîșț]/g, '');
  const upper = (letters.match(/[A-ZĂÂÎȘȚ]/g) ?? []).length;
  const ratio = letters.length ? upper / letters.length : 0;

  const isShout = letters.length >= SHOUT_MIN_LENGTH && ratio >= SHOUT_RATIO_THRESHOLD;
  // Treat any 3+ run of punctuation as excited, including mixed forms like "?!?".
  const isExcited = /[!?]{3,}/.test(raw);
  const isNoisy = isShout || isExcited;
  const staticLevel = isShout ? SHOUT_STATIC_LEVEL : isExcited ? EXCITED_STATIC_LEVEL : 0.0;

  return { isShout, isExcited, isNoisy, staticLevel };
}
