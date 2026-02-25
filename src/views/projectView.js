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

export const bindAddProject = (callbackFunction) => {
  const form = document.getElementById('add-project-form')
  const title = document.getElementById('project-input')

  if (!form || !title) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = title.value.trim()

    if (value !== '') {
      callbackFunction(value)
      title.value = ''
    }
  })
}
