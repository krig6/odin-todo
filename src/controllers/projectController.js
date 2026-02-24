import { createProject } from "../models/project.js";

export const projectController = () => {

  const addProject = (projects, { title }) => [...projects, createProject(title)]

  const removeProject = (projects, projectId) => projects.filter(project => project.id !== projectId)

  const updateProject = (projects, projectId, updates) => projects.map(project => project.id === projectId ? { ...project, ...updates } : project)

  return { addProject, removeProject, updateProject }
}
