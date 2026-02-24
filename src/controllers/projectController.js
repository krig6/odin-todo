import { createProject } from "../models/project.js";

export const projectController = () => {

  const addProject = (projects, { title }) => [...projects, createProject(title)]

  return { addProject }
}
