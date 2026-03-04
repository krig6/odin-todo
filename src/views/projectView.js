const projectList = document.getElementById('project-list')

export const renderProjects = (projects, selectedId) => {
  const fragment = document.createDocumentFragment()

  projectList.innerHTML = ''
  projects.forEach(project => {
    const li = document.createElement('li')
    li.dataset.id = project.id
    li.classList.add('project-item')

    const titleBtn = document.createElement('button')
    titleBtn.textContent = project.title
    titleBtn.classList.add('project-item__title')
    titleBtn.type = 'button'

    const editTitleBtn = document.createElement('button')
    editTitleBtn.classList.add('project-item__edit')
    editTitleBtn.type = 'button'

    const editIcon = document.createElement('i')
    editIcon.classList.add('bx', 'bx-edit')
    editTitleBtn.appendChild(editIcon)

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('project-item__delete')
    deleteBtn.type = 'button'

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    li.append(titleBtn, editTitleBtn, deleteBtn)

    if (project.id === selectedId) {
      li.classList.add('project-item--selected')
    }
    fragment.appendChild(li)
  })
  projectList.appendChild(fragment)
}

export const bindAddProject = (callbackFunction) => {
  const form = document.getElementById('add-project-form')
  const title = document.getElementById('project-input')

  if (!form || !title) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = title.value.trim()

    if (isProjectTitleTaken(value)) {
      alert('This project title already exists.')
      title.select()
      return
    }

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
        if (isProjectTitleTaken(newTitle, titleSpan)) {
          alert('Another project with this title already exists.')
          input.focus()
          isEditing = true
          return
        }
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
      finishedEditing(false)
    })
  })
}

const isProjectTitleTaken = (title, currentSpan = null) => {
  const existingTitle = Array.from(document.querySelectorAll('.project-item__title'))
    .filter(span => span !== currentSpan)
    .map(span => span.textContent.trim().toLowerCase())

  return existingTitle.includes(title.trim().toLowerCase())
}

export const bindProjectPanelToggle = () => {
  const panel = document.getElementById('project-panel')
  const openBtn = document.getElementById('project-panel-open-btn')
  const closeBtn = document.getElementById('project-panel-close-btn')

  if (!panel || !openBtn) return

  const openPanel = () => panel.classList.add('active')
  const closePanel = () => panel.classList.remove('active')
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    openPanel()
  })

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      closePanel()
    })
  }
}
