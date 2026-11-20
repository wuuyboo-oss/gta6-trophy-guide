// Leonida Trophy Guide — entry module: wires the checklist, roadmap,
// missable view, detail panel and export/import together. All data is
// local files; progress lives in localStorage; nothing is fetched
// from the network at run time.
import { renderChecklist } from './modules/checklistView.js';
import { hideDetail, renderDetail } from './modules/detailView.js';
import { renderMissable, renderRoadmap } from './modules/roadmapView.js';
import { gradeCounts } from './modules/trophyFilters.js';
import {
  buildExportPayload,
  loadRoadmapData,
  loadTrophyData,
  parseImportPayload,
  readEarned,
  readSettings,
  writeEarned,
  writeSettings,
} from './modules/trophyStore.js';

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const emptyEl = $('emptyNote');
const detailPanel = $('detail');
const detailBody = $('detailBody');
const ioNote = $('ioNote');

let trophies = [];
let trophiesById = new Map();
let roadmap = null;
let earned = readEarned();
let settings = readSettings();

function renderAll() {
  renderChecklist(listEl, emptyEl, trophies, settings, earned, {
    onToggle: (trophy, checked) => {
      if (checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      writeEarned(earned);
      renderAll();
    },
    onOpenGuide: (trophy) => openGuide(trophy),
  });
  renderProgress();
  if (roadmap) {
    renderRoadmap($('roadmapStages'), $('roadmapMeta'), $('roadmapNotes'), roadmap, trophiesById, earned, (trophy) => openGuide(trophy));
    renderMissable($('missableList'), $('unconfirmedList'), trophiesById, (trophy) => openGuide(trophy));
  }
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  $('progressCount').textContent = `${done} of ${total} earned`;
  $('progressFill').style.width = total ? `${Math.round((done / total) * 100)}%` : '0%';
  const counts = gradeCounts(trophies, earned);
  $('progressByGrade').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => `${counts[grade][0]}/${counts[grade][1]} ${grade}`)
    .join(' · ');
}

function openGuide(trophy) {
  renderDetail(detailPanel, detailBody, trophy, settings, earned);
}

function showView(name) {
  for (const view of ['checklist', 'roadmap', 'missable']) {
    $(`view-${view}`).hidden = view !== name;
    const tab = document.querySelector(`.tab[data-view="${view}"]`);
    tab.classList.toggle('active', view === name);
    if (view === name) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
}

function readHash() {
  const hash = location.hash.replace(/^#/, '');
  if (hash.startsWith('trophy-')) {
    const id = Number(hash.slice('trophy-'.length));
    const trophy = trophiesById.get(id);
    if (trophy) {
      showView('checklist');
      openGuide(trophy);
      return;
    }
  }
  if (['checklist', 'roadmap', 'missable'].includes(hash)) showView(hash);
  else showView('checklist');
}

function syncControls() {
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.kind === settings.kind);
  });
  $('gradeFilter').value = settings.grade;
  $('hideEarned').checked = settings.hideEarned;
  $('spoilerToggle').checked = settings.spoiler;
  $('searchBox').value = settings.search;
}

function downloadExport() {
  const payload = buildExportPayload(earned, settings);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'gta6-trophy-progress.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  ioNote.textContent = `Exported ${earned.size} earned trophies.`;
}

async function handleImport(file) {
  if (!file) return;
  try {
    const { earned: imported, unknown, settings: importedSettings } = parseImportPayload(
      await file.text(),
      trophies.map((trophy) => trophy.name),
    );
    earned = imported;
    writeEarned(earned);
    if (typeof importedSettings.spoiler === 'boolean') settings.spoiler = importedSettings.spoiler;
    if (typeof importedSettings.hideEarned === 'boolean') settings.hideEarned = importedSettings.hideEarned;
    writeSettings(settings);
    syncControls();
    renderAll();
    ioNote.textContent = unknown.length
      ? `Imported ${earned.size} earned trophies (${unknown.length} unknown names ignored).`
      : `Imported ${earned.size} earned trophies.`;
  } catch (error) {
    ioNote.textContent = 'Import failed: that file is not a trophy-progress export.';
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    location.hash = tab.dataset.view;
  });
});
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    settings.kind = chip.dataset.kind;
    writeSettings(settings);
    syncControls();
    renderAll();
  });
});
$('gradeFilter').addEventListener('change', (event) => {
  settings.grade = event.target.value;
  writeSettings(settings);
  renderAll();
});
$('hideEarned').addEventListener('change', (event) => {
  settings.hideEarned = event.target.checked;
  writeSettings(settings);
  renderAll();
});
$('spoilerToggle').addEventListener('change', (event) => {
  settings.spoiler = event.target.checked;
  writeSettings(settings);
  renderAll();
});
$('searchBox').addEventListener('input', (event) => {
  settings.search = event.target.value;
  writeSettings(settings);
  renderAll();
});
$('exportBtn').addEventListener('click', downloadExport);
$('importFile').addEventListener('change', (event) => {
  handleImport(event.target.files[0]);
  event.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!window.confirm('Clear every tick on the checklist?')) return;
  earned = new Set();
  writeEarned(earned);
  renderAll();
  ioNote.textContent = 'Checklist reset.';
});
$('detailClose').addEventListener('click', () => hideDetail(detailPanel));
window.addEventListener('hashchange', readHash);

try {
  const data = await loadTrophyData();
  trophies = data.trophies;
  trophiesById = new Map(trophies.map((trophy) => [trophy.id, trophy]));
  roadmap = await loadRoadmapData();
  syncControls();
  renderAll();
  readHash();
} catch (error) {
  listEl.replaceChildren();
  const item = document.createElement('li');
  item.textContent = 'The trophy data did not load. Check that data/trophies.json is beside this page and reload.';
  listEl.append(item);
}
