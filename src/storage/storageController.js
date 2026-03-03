export const storageController = () => {
  const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }

  const loadProjects = () => {
    return JSON.parse(localStorage.getItem('projects'));
  }

  return { saveProjects, loadProjects }
}
