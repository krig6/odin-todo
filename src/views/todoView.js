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

    li.appendChild(titleSpan)
    todoContainer.appendChild(li)
  })
}
