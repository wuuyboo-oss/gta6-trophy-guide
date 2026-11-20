// detailView: the open guide for one trophy — official name, description
// and grade, the guide in our own words, and the sources it draws on.
import { isSpoilerHidden } from './trophyFilters.js';

export function renderDetail(panelEl, bodyEl, trophy, settings, earned) {
  bodyEl.replaceChildren();
  const heading = document.createElement('h2');
  const hidden = isSpoilerHidden(trophy, settings, earned);
  heading.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  const official = document.createElement('p');
  official.className = 'trophy-desc';
  official.textContent = hidden
    ? 'Spoiler-safe is on: this story trophy stays hidden until you earn it.'
    : trophy.description;
  const grade = document.createElement('p');
  grade.className = 'trophy-meta';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade grade-${trophy.grade}`;
  gradeTag.textContent = trophy.grade.charAt(0).toUpperCase() + trophy.grade.slice(1);
  grade.append(gradeTag);
  if (trophy.missable) {
    const missTag = document.createElement('span');
    missTag.className = 'tag missable';
    missTag.textContent = 'MISSABLE';
    grade.append(missTag);
  }
  if (trophy.hidden) {
    const hiddenTag = document.createElement('span');
    hiddenTag.className = 'tag hidden-flag';
    hiddenTag.textContent = 'Hidden on PS5';
    grade.append(hiddenTag);
  }
  if (typeof trophy.count === 'number') {
    const countTag = document.createElement('span');
    countTag.className = 'tag count';
    countTag.textContent = `Target: ${trophy.count.toLocaleString('en-US')}`;
    grade.append(countTag);
  }
  const guidePara = document.createElement('p');
  guidePara.className = 'guide-text';
  if (trophy.missable) {
    const warn = document.createElement('strong');
    warn.className = 'warn';
    warn.textContent = 'Missable — read this before you play Chapter 1. ';
    guidePara.append(warn);
  }
  guidePara.append(document.createTextNode(trophy.guide));
  const sources = document.createElement('p');
  sources.className = 'sources';
  const label = document.createElement('strong');
  label.textContent = 'Sources: ';
  sources.append(label, document.createTextNode(trophy.sources.join(' · ')));
  const note = document.createElement('p');
  note.className = 'sources';
  note.textContent = 'Guide written in our own words for this guide; the official name and description are quoted as PlayStation publishes them.';
  bodyEl.append(heading, official, grade, guidePara, sources, note);
  panelEl.hidden = false;
  panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function hideDetail(panelEl) {
  panelEl.hidden = true;
}
