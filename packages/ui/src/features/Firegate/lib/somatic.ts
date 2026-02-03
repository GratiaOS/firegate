export type SomaticFlags = {
  isShout: boolean;
  isExcited: boolean;
  isNoisy: boolean;
  staticLevel: number;
};

export function somaticFlagsFromText(text: string): SomaticFlags {
  const raw = text ?? '';
  const letters = raw.replace(/[^A-Za-zĂÂÎȘȚăâîșț]/g, '');
  const upper = (letters.match(/[A-ZĂÂÎȘȚ]/g) ?? []).length;
  const ratio = letters.length ? upper / letters.length : 0;

  const isShout = letters.length >= 12 && ratio >= 0.7;
  const isExcited = /[!?]{3,}/.test(raw);
  const isNoisy = isShout || isExcited;
  const staticLevel = isShout ? 0.8 : isExcited ? 0.5 : 0.0;

  return { isShout, isExcited, isNoisy, staticLevel };
}
