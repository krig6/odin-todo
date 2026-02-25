const projectList = document.getElementById('project-list')

export const renderProjects = (projects) => {
  projectList.innerHTML = ''

  projects.forEach(project => {
    const li = document.createElement('li')
    li.textContent = project.title
    li.dataset.id = project.id
    li.classList.add('project-item')

    projectList.appendChild(li)
  })
}
