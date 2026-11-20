// trophyStore: loads the trophy and roadmap data and keeps the reader's
// progress and settings in localStorage. Nothing leaves the browser.
export const EARNED_KEY = 'leonida-trophies-earned-v1';
export const SETTINGS_KEY = 'leonida-trophies-settings-v1';

export async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('trophies.json did not load');
  return response.json();
}

export async function loadRoadmapData() {
  const response = await fetch('data/roadmap.json');
  if (!response.ok) throw new Error('roadmap.json did not load');
  return response.json();
}

export function readEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((name) => typeof name === 'string') : []);
  } catch {
    return new Set();
  }
}

export function writeEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}

export function readSettings() {
  const defaults = { spoiler: false, hideEarned: false, kind: 'all', grade: 'all', search: '' };
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    return { ...defaults, ...(raw && typeof raw === 'object' ? raw : {}) };
  } catch {
    return defaults;
  }
}

export function writeSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Build the export file: earned names plus the reader's settings.
export function buildExportPayload(earned, settings) {
  return {
    app: 'Leonida Trophy Guide',
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
    settings: { spoiler: settings.spoiler, hideEarned: settings.hideEarned },
  };
}

// Read an imported file back into an earned set. Unknown names are ignored
// and reported so a file from another guide cannot corrupt the checklist.
export function parseImportPayload(text, knownNames) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('no earned list in file');
  const known = new Set(knownNames);
  const earned = new Set();
  const unknown = [];
  for (const name of names) {
    if (typeof name !== 'string') continue;
    if (known.has(name)) earned.add(name);
    else unknown.push(name);
  }
  const settings = parsed && typeof parsed === 'object' && parsed.settings && typeof parsed.settings === 'object'
    ? parsed.settings
    : {};
  return { earned, unknown, settings };
}
