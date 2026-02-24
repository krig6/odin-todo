import { createProject } from "../models/project.js";

export const projectController = () => {

  const addProject = (projects, { title }) => [...projects, createProject(title)]

  const removeProject = (projects, projectId) => projects.filter(project => project.id !== projectId)

  return { addProject, removeProject }
}
