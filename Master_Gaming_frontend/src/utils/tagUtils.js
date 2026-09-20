export const filterTags = (tags, searchTerm = '') => {
  const normalized = searchTerm.trim().toLowerCase();

  if (!normalized) {
    return tags;
  }

  return tags.filter((tag) => tag.name.toLowerCase().includes(normalized));
};

export const sortTags = (tags, sortMode = 'popular') => {
  const cloned = [...tags];

  if (sortMode === 'alpha') {
    return cloned.sort((a, b) => a.name.localeCompare(b.name));
  }

  return cloned.sort((a, b) => {
    const countDiff = (b.count ?? 0) - (a.count ?? 0);
    return countDiff !== 0 ? countDiff : a.name.localeCompare(b.name);
  });
};
