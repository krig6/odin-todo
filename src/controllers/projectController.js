import { createProject } from '../models/project.js';

export const projectController = () => {

  const addProject = (projects, { title }) => [createProject(title), ...projects];

  const removeProject = (projects, projectId) => projects.filter(project => project.id !== projectId);

  const updateProjectTitle = (projects, projectId, newProjectTitle) => projects.map(project => project.id === projectId ? { ...project, title: newProjectTitle } : project);

  return { addProject, removeProject, updateProjectTitle };
};
