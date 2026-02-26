const listContainer = document.getElementById('list-container')

export const renderLists = (lists) => {
  listContainer.innerHTML = ''

  lists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.id = list.id
    li.classList.add('list-item')

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('list-item__delete')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    const todoContainer = document.createElement('ul')
    todoContainer.classList.add('todo-container')
    todoContainer.dataset.listId = list.id

    const addTodoBtn = document.createElement('button')
    addTodoBtn.textContent = '+ Add Todo'
    addTodoBtn.classList.add('list-item__add-todo')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = list.title
    titleSpan.classList.add('list-item__title')

    li.append(titleSpan, deleteBtn, todoContainer, addTodoBtn)
    listContainer.appendChild(li)
  })

}

export const bindAddList = (callbackFunction) => {
  const form = document.getElementById('add-list-form')
  const title = document.getElementById('list-input')

  if (!form || !title) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = title.value.trim()

    if (isListTitleTaken(value)) {
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

export const bindRemoveList = (callbackFunction) => {
  listContainer.addEventListener('click', (e) => {
    if (e.target.closest('.list-item__delete')) {
      e.stopPropagation()
      const li = e.target.closest('.list-item')
      const listId = li.dataset.id
      callbackFunction(listId)
    }
  })
}

export const bindUpdateListTitle = (callbackFunction) => {
  listContainer.addEventListener('dblclick', (e) => {
    const li = e.target.closest('.list-item')
    if (!li) return

    const listId = li.dataset.id
    const titleSpan = li.querySelector('.list-item__title')
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
        if (isListTitleTaken(newTitle, titleSpan)) {
          alert('Another list with this title already exists.')
          input.focus()
          isEditing = true
          return
        }
        callbackFunction(listId, newTitle)
      }

      if (input.parentNode) {
        const newTitleSpan = document.createElement('span')
        newTitleSpan.classList.add('list-item__title')
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

const isListTitleTaken = (title, currentSpan = null) => {
  const existingTitle = Array.from(document.querySelectorAll('.list-item__title'))
    .filter(span => span !== currentSpan)
    .map(span => span.textContent.trim().toLowerCase())

  return existingTitle.includes(title.trim().toLowerCase())
}
