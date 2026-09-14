const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%";
const ALL = `${UPPER}${LOWER}${DIGITS}${SYMBOLS}`;

function randomIndex(max: number): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

function pick(chars: string): string {
  return chars[randomIndex(chars.length)];
}

function shuffle(value: string): string {
  const chars = value.split("");
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function generateTemporaryPassword(length = 12): string {
  const size = Math.max(length, 8);
  let password = pick(UPPER) + pick(LOWER) + pick(DIGITS) + pick(SYMBOLS);

  while (password.length < size) {
    password += pick(ALL);
  }

  return shuffle(password);
}
