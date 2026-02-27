export const renderTodos = (listId, todos) => {
  const todoContainer = document.querySelector(`.todo-container[data-list-id="${listId}"]`)
  if (!todoContainer) return

  todoContainer.innerHTML = ''

  todos.forEach(todo => {
    const li = document.createElement('li')
    li.dataset.id = todo.id
    li.classList.add('todo-item', `todo-item--${todo.priority}`)

    const title = document.createElement('h3')
    title.textContent = todo.title
    title.classList.add('todo-item__title')

    const description = document.createElement('p')
    description.textContent = todo.description
    description.classList.add('todo-item__description')

    const dueDate = document.createElement('time')
    const dateObj = new Date(todo.dueDate)
    dueDate.textContent = dateObj.toLocaleDateString()
    dueDate.dateTime = dateObj.toISOString()
    dueDate.classList.add('todo-item__due-date')

    const priority = document.createElement('span')
    priority.textContent = todo.priority
    priority.classList.add('todo-item__priority')

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('todo-item__delete')

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    li.append(title, description, dueDate, priority, deleteBtn)
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

export const bindUpdateTodo = (callbackFunction) => {
  const listContainer = document.querySelector(`.list-container`)
  const form = document.getElementById('todo-form')
  const todoModal = document.getElementById('todo-modal')
  let todoId = null

  const titleInput = document.getElementById('todo-input-title')
  const descriptionInput = document.getElementById('todo-input-description')
  const dueDateInput = document.getElementById('todo-input-due-date')
  const priorityInput = document.getElementById('todo-input-priority')

  if (!form || !todoModal || !listContainer) return

  listContainer.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item')
    if (!todoItem) return
    e.stopPropagation()

    todoId = todoItem.dataset.id
    document.querySelector('.todo-modal__title').textContent = 'Edit Todo'

    const li = todoItem.closest('.list-item')
    if (!li) return
    const listId = li.dataset.id
    form.dataset.listId = listId

    titleInput.value = todoItem.querySelector('.todo-item__title')?.textContent || ''
    descriptionInput.value = todoItem.querySelector('.todo-item__description')?.textContent || ''

    const existingDueDate = todoItem.querySelector('.todo-item__due-date')?.dateTime || ''
    dueDateInput.value = existingDueDate ? existingDueDate.split('T')[0] : ''

    priorityInput.value = todoItem.querySelector('.todo-item__priority')?.textContent || 'high'
    todoModal.showModal()
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const listId = form.dataset.listId
    const title = titleInput.value.trim()
    const description = descriptionInput.value.trim()
    const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : undefined
    const priority = priorityInput.value

    if (!title) return

    callbackFunction(listId, todoId, { title, description, dueDate, priority })

    form.reset()
    todoModal.close()
  })
}
