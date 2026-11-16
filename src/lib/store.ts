// localStorage wrapper — the portal preview iframe is sandbox="allow-scripts"
// WITHOUT allow-same-origin, so bare localStorage access THROWS. All
// persistence goes through this try/catch wrapper.

const mem: Record<string, string> = {};

export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return mem[key] ?? null;
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      mem[key] = value;
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      delete mem[key];
    }
  },
};
