export const createProject = (title = 'New Project', lists = []) => {
  return {
    id: crypto.randomUUID(),
    title,
    lists
  };
};
