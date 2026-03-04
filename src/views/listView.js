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
  const addListBtn = document.getElementById('list-add-btn');
  const listModal = document.getElementById('list-modal');
  const listForm = document.getElementById('list-form');
  const listInput = document.getElementById('list-title-input');
  const cancelBtn = document.getElementById('list-cancel-btn');

  if (!addListBtn || !listModal || !listForm || !listInput) return;

  addListBtn.onclick = () => {
    listInput.value = '';
    listModal.showModal();
    listInput.focus();
  };

  cancelBtn.onclick = () => listModal.close();

  listForm.onsubmit = (e) => {
    e.preventDefault();
    const value = listInput.value.trim();

    if (isListTitleTaken(value)) {
      alert('This list title already exists.');
      listInput.select();
      return;
    }

    if (value !== '') {
      callbackFunction(value);
      listModal.close();
      listInput.value = '';
    }
  };
};

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
