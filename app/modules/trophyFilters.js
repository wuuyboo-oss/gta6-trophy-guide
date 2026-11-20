// trophyFilters: which trophies the checklist shows, and what the
// spoiler setting hides. A story trophy stays hidden by name and
// description until it is earned while spoiler-safe is on.
export function isSpoilerHidden(trophy, settings, earned) {
  return settings.spoiler && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function spoilerName(trophy) {
  return 'Hidden story trophy';
}

export function spoilerDescription() {
  return 'Hidden until earned — turn spoiler-safe off, or tick it off, to reveal it.';
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kind === kind;
}

export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function visibleTrophies(trophies, settings, earned) {
  return trophies.filter((trophy) => {
    if (!trophyMatchesKind(trophy, settings.kind)) return false;
    if (settings.grade !== 'all' && trophy.grade !== settings.grade) return false;
    if (settings.hideEarned && earned.has(trophy.name)) return false;
    if (!trophyMatchesSearch(trophy, settings.search)) return false;
    return true;
  });
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    counts[trophy.grade][1] += 1;
    if (earned.has(trophy.name)) counts[trophy.grade][0] += 1;
  }
  return counts;
}
