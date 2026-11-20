// checklistView: renders the trophy checklist rows — checkbox, official
// name, official description, grade and kind tags, and a guide button.
import { isSpoilerHidden, spoilerDescription, spoilerName, visibleTrophies } from './trophyFilters.js';

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  if (kind === 'story') return 'Story';
  if (kind === 'missable') return 'Missable';
  if (kind === 'collectibles') return 'Collectibles';
  if (kind === 'activities') return 'Activities';
  return 'Platinum';
}

export function renderChecklist(listEl, emptyEl, trophies, settings, earned, callbacks) {
  const shown = visibleTrophies(trophies, settings, earned);
  listEl.replaceChildren();
  emptyEl.hidden = shown.length > 0;
  for (const trophy of shown) {
    const item = document.createElement('li');
    const done = earned.has(trophy.name);
    item.className = `trophy grade-${trophy.grade}${done ? ' earned' : ''}`;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = done;
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => callbacks.onToggle(trophy, box.checked));

    const body = document.createElement('div');
    const hidden = isSpoilerHidden(trophy, settings, earned);
    const name = document.createElement('p');
    name.className = 'trophy-name';
    const dot = document.createElement('span');
    dot.className = 'grade-dot';
    dot.setAttribute('aria-hidden', 'true');
    name.append(dot, document.createTextNode(hidden ? spoilerName(trophy) : trophy.name));
    const desc = document.createElement('p');
    desc.className = `trophy-desc${hidden ? ' spoilered' : ''}`;
    desc.textContent = hidden ? spoilerDescription() : trophy.description;
    const meta = document.createElement('p');
    meta.className = 'trophy-meta';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag grade grade-${trophy.grade}`;
    gradeTag.textContent = gradeLabel(trophy.grade);
    meta.append(gradeTag);
    if (trophy.kind !== 'platinum') {
      const kindTag = document.createElement('span');
      kindTag.className = 'tag';
      kindTag.textContent = kindLabel(trophy.kind);
      meta.append(kindTag);
    }
    if (trophy.hidden) {
      const hiddenTag = document.createElement('span');
      hiddenTag.className = 'tag hidden-flag';
      hiddenTag.textContent = 'Hidden on PS5';
      meta.append(hiddenTag);
    }
    if (trophy.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag missable';
      missTag.textContent = 'MISSABLE — read the guide first';
      meta.append(missTag);
    }
    if (typeof trophy.count === 'number') {
      const countTag = document.createElement('span');
      countTag.className = 'tag count';
      countTag.textContent = `Count: ${trophy.count.toLocaleString('en-US')}`;
      meta.append(countTag);
    }
    body.append(name, desc, meta);

    const actions = document.createElement('div');
    actions.className = 'trophy-actions';
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = 'guide-btn';
    guideBtn.textContent = 'Read guide';
    guideBtn.addEventListener('click', () => callbacks.onOpenGuide(trophy));
    actions.append(guideBtn);

    item.append(box, body, actions);
    listEl.append(item);
  }
}
