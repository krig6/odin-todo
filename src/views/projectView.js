const projectList = document.getElementById('project-list')

export const renderProjects = (projects, selectedId) => {
  projectList.innerHTML = ''

  projects.forEach(project => {
    const li = document.createElement('li')
    li.dataset.id = project.id
    li.classList.add('project-item')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = project.title
    titleSpan.classList.add('project-item__title')

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('project-item__delete')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    li.append(titleSpan, deleteBtn)

    if (project.id === selectedId) {
      li.classList.add('project-item__selected')
    } else {
      li.classList.remove('project-item__selected')
    }

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

export const bindSelectProject = (callbackFunction) => {
  projectList.addEventListener('click', (e) => {
    const li = e.target.closest('.project-item')
    if (!li) return
    if (e.target.closest('.project-item__delete')) return

    if (e.detail > 1) return
    const projectId = li.dataset.id
    callbackFunction(projectId)
  })
}

export const bindUpdateProjectTitle = (callbackFunction) => {
  projectList.addEventListener('dblclick', (e) => {
    const li = e.target.closest('.project-item')
    if (!li) return

    const projectId = li.dataset.id
    const titleSpan = li.querySelector('.project-item__title')
    if (!titleSpan) return

    const currentTitle = titleSpan.textContent
    const input = document.createElement('input')
    titleSpan.replaceWith(input)
    input.type = 'text'
    input.value = currentTitle
    input.focus()
    input.select()

    let isEditing = true

    const finishedEditing = (save) => {
      if (!isEditing) return
      isEditing = false

      const newTitle = input.value.trim()
      if (save && newTitle !== '' && newTitle !== currentTitle) {
        callbackFunction(projectId, newTitle)
      }
      if (input.parentNode) {
        const newTitleSpan = document.createElement('span')
        newTitleSpan.classList.add('project-item__title')
        newTitleSpan.textContent = save && newTitle !== '' ? newTitle : currentTitle
        input.replaceWith(newTitleSpan)
      }
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        finishedEditing(true)
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        finishedEditing(false)
      }
    })

    input.addEventListener('blur', () => {
      finishedEditing(true)
    })
  })
}
