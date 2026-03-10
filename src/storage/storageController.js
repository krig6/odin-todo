export const storageController = () => {
  const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const loadProjects = () => {
    return JSON.parse(localStorage.getItem('projects'));
  };

  const saveSelectedProject = (selectedProjectId) => {
    localStorage.setItem('selectedProject', JSON.stringify(selectedProjectId));
  };

  const loadSelectedProject = () => {
    return JSON.parse(localStorage.getItem('selectedProject'));
  };

  return { saveProjects, loadProjects, saveSelectedProject, loadSelectedProject };
};
