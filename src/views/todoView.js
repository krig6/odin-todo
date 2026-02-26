export const renderTodos = (listId, todos) => {
  const todoContainer = document.querySelector(`.todo-container[data-list-id="${listId}"]`)
  if (!todoContainer) return

  todoContainer.innerHTML = ''

  todos.forEach(todo => {
    const li = document.createElement('li')
    li.dataset.id = todo.id
    li.classList.add('todo-item', `todo-item--${todo.priority}`)

    const titleSpan = document.createElement('span')
    titleSpan.textContent = todo.title
    titleSpan.classList.add('todo-item__title')

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('todo-item__delete')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    li.append(titleSpan, deleteBtn)
    todoContainer.appendChild(li)
  })
}

export const bindAddTodo = (callbackFunction) => {
  const listContainer = document.querySelector(`.list-container`)
  const form = document.getElementById('todo-form')
  const todoModal = document.getElementById('todo-modal')

  const titleInput = document.getElementById('todo-input-title')
  const descriptionInput = document.getElementById('todo-input-description')
  const dueDateInput = document.getElementById('todo-input-due-date')
  const priorityInput = document.getElementById('todo-input-priority')

  if (!form || !todoModal || !listContainer) return

  listContainer.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.list-item__add-todo')
    if (!addBtn) return
    e.stopPropagation()

    const li = addBtn.closest('.list-item')
    if (!li) return
    const listId = li.dataset.id

    form.dataset.listId = listId
    todoModal.show()
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const listId = form.dataset.listId
    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()
    const dueDate = dueDateInput.value
    const priority = priorityInput.value

    if (!title) return

    callbackFunction(listId, { title, description, dueDate, priority })

    form.reset()
    todoModal.close()
  })
}

export const bindRemoveTodo = (callbackFunction) => {
  const listContainer = document.querySelector(`.list-container`)
  if (!listContainer) return
  listContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.todo-item__delete')
    if (!deleteBtn) return
    e.stopPropagation()

    const todoContainer = deleteBtn.closest('.todo-container')
    const todo = deleteBtn.closest('.todo-item')

    if (!todo || !todoContainer) return

    const listId = todoContainer.dataset.listId
    const todoId = todo.dataset.id

    callbackFunction(listId, todoId)
  })
}
