export const getProjectCount = (projects) => projects.length;

export const isTitleTaken = (items, title) => {
  return items.includes(title.trim().toLowerCase());
};
