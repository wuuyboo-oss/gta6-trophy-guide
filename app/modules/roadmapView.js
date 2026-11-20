// roadmapView: renders the platinum roadmap stages, the ground rules,
// the missable-trophy cards and the still-unconfirmed list.
export function renderRoadmap(stagesEl, metaEl, notesEl, roadmap, trophiesById, earned, onOpenGuide) {
  metaEl.textContent = `Difficulty ${roadmap.difficulty} · ${roadmap.estimate} · ${roadmap.online} online trophies — everything is earned offline, in one playthrough.`;
  stagesEl.replaceChildren();
  for (const stage of roadmap.stages) {
    const item = document.createElement('li');
    item.className = 'stage';
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const goal = document.createElement('p');
    goal.className = 'stage-goal';
    goal.textContent = stage.goal;
    const steps = document.createElement('ol');
    for (const step of stage.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.append(li);
    }
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    for (const id of stage.trophies) {
      const trophy = trophiesById.get(id);
      if (!trophy) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `tag${earned.has(trophy.name) ? ' done' : ''}`;
      chip.textContent = `${earned.has(trophy.name) ? '✓ ' : ''}${trophy.name} (${trophy.grade})`;
      chip.addEventListener('click', () => onOpenGuide(trophy));
      chips.append(chip);
    }
    item.append(heading, goal, steps, chips);
    stagesEl.append(item);
  }
  notesEl.replaceChildren();
  for (const note of roadmap.notes) {
    const li = document.createElement('li');
    li.textContent = note;
    notesEl.append(li);
  }
}

const UNCONFIRMED_IDS = [44, 45, 49, 50, 51];

export function renderMissable(missableEl, unconfirmedEl, trophiesById, onOpenGuide) {
  missableEl.replaceChildren();
  const missable = [...trophiesById.values()].filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const heading = document.createElement('h3');
    heading.textContent = `${trophy.name} — the only missable trophy`;
    const desc = document.createElement('p');
    desc.textContent = trophy.description;
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    const sources = document.createElement('p');
    sources.textContent = `Sources: ${trophy.sources.join(' · ')}`;
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'guide-btn';
    openBtn.textContent = 'Open full guide';
    openBtn.addEventListener('click', () => onOpenGuide(trophy));
    card.append(heading, desc, guide, sources, openBtn);
    missableEl.append(card);
  }
  const safe = document.createElement('p');
  safe.textContent = 'Every other trophy can be earned in free roam after the story, so there is nothing else to miss. Keep a manual save at the start and end of each chapter as a safety net.';
  missableEl.append(safe);

  unconfirmedEl.replaceChildren();
  for (const id of UNCONFIRMED_IDS) {
    const trophy = trophiesById.get(id);
    if (!trophy) continue;
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = trophy.name;
    li.append(strong, document.createTextNode(` — ${trophy.description} `));
    const note = document.createElement('em');
    note.textContent = id === 51
      ? 'Reported as a melee drive-by knocking over bowling pins, but the precise method is still being confirmed.'
      : 'Method still unconfirmed in PowerPyx, KeenGamer and gamemapa.';
    li.append(note);
    unconfirmedEl.append(li);
  }
}
