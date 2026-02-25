const projectList = document.getElementById('project-list')

export const renderProjects = (projects) => {
  projectList.innerHTML = ''

  projects.forEach(project => {
    const li = document.createElement('li')
    li.textContent = project.title
    li.dataset.id = project.id
    li.classList.add('project-item')

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('project-item__delete')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    li.appendChild(deleteBtn)

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

export const bindRemoveProject = (callbackFunction) => {
  projectList.addEventListener('click', (e) => {
    if (e.target.closest('.project-item__delete')) {
      e.stopPropagation()
      const li = e.target.closest('.project-item')
      const projectId = li.dataset.id
      callbackFunction(projectId)
    }
  })
}
