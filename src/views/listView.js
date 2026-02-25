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


    const titleSpan = document.createElement('span')
    titleSpan.textContent = list.title
    titleSpan.classList.add('list-item__title')

    li.append(titleSpan, deleteBtn)
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
