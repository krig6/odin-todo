const listContainer = document.getElementById('list-container')

export const renderLists = (lists) => {
  const fragment = document.createDocumentFragment()

  listContainer.innerHTML = ''
  lists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.id = list.id
    li.classList.add('list-item')

    const listHeader = document.createElement('div')
    listHeader.classList.add('list-header')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = list.title
    titleSpan.classList.add('list-item__title')

    const editTitleBtn = document.createElement('button')
    editTitleBtn.classList.add('list-item__edit')
    editTitleBtn.type = 'button'

    const editIcon = document.createElement('i')
    editIcon.classList.add('bx', 'bx-edit')
    editTitleBtn.appendChild(editIcon)

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('list-item__delete')
    deleteBtn.type = 'button'

    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bx', 'bx-x')
    deleteBtn.appendChild(deleteIcon)

    const controlsContainer = document.createElement('div')
    controlsContainer.classList.add('list-item__controls')
    controlsContainer.append(editTitleBtn, deleteBtn)

    const todoContainer = document.createElement('ul')
    todoContainer.classList.add('todo-container')
    todoContainer.dataset.listId = list.id

    const addTodoBtn = document.createElement('button')
    addTodoBtn.classList.add('list-item__add-todo')

    const addTodoIcon = document.createElement('i')
    addTodoIcon.classList.add('bx', 'bx-plus')

    const addTodoBtnTextNode = document.createTextNode("Add Todo")

    addTodoBtn.append(addTodoIcon, addTodoBtnTextNode)

    listHeader.append(titleSpan, controlsContainer)

    li.append(listHeader, todoContainer, addTodoBtn)
    fragment.appendChild(li)
  })
  listContainer.appendChild(fragment)
}

export const bindOpenListModal = (callbackFunction) => {
  const listModal = document.getElementById('list-modal');
  const listInput = document.getElementById('list-title-input');
  const addListBtn = document.getElementById('list-add-btn');

  if (!listModal || !listInput || !addListBtn) return;

  addListBtn.onclick = () => callbackFunction(listModal, listInput)

  listContainer.addEventListener('click', (e) => {
    if (e.target.closest('.list-item__edit')) {
      const editTitleBtn = e.target.closest('.list-item__edit')
      const listItem = editTitleBtn.closest('.list-item')
      const title = listItem.querySelector('.list-item__title').textContent
      listModal.dataset.id = listItem.dataset.id
      listModal.dataset.mode = 'edit'
      callbackFunction(listModal, listInput, title)
    }
  })
};

export const bindListFormSubmit = (addCallback, updateCallback) => {
  const cancelBtn = document.getElementById('list-cancel-btn');
  const listModal = document.getElementById('list-modal');
  const listForm = document.getElementById('list-form');
  const listInput = document.getElementById('list-title-input');

  cancelBtn.onclick = () => {
    listInput.value = ''
    listModal.close();
    listModal.dataset.id = ''
    listModal.dataset.mode = 'add'
  }

  if (!listModal || !listForm || !listInput) return

  listForm.onsubmit = (e) => {
    e.preventDefault();

    const value = listInput.value.trim();
    if (!value) return

    const mode = listModal.dataset.mode
    const listId = listModal.dataset.id

    if (mode === 'edit') {
      if (isListTitleTaken(value)) {
        alert('This list title already exists.');
        listInput.select();
        return;
      }
      updateCallback(listId, value);
    } else {
      if (isListTitleTaken(value)) {
        alert('This list title already exists.');
        listInput.select();
        return;
      }
      addCallback(value);
    }
    listModal.close()
    listModal.value = ''
    listModal.dataset.mode = 'add'
    listModal.dataset.id = ''
  };
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

// export const bindUpdateListTitle = (callbackFunction) => {
//   const form = docu
//   listContainer.addEventListener('click', (e) => {
//     if (e.target.closest('.list-item__edit')) {
//       const editTitleBtn = e.target.closest('.list-item__edit')
//       if (!editTitleBtn) return
//       e.stopPropagation()
//
//
//     }
//   })
// }

const isListTitleTaken = (title, currentSpan = null) => {
  const existingTitle = Array.from(document.querySelectorAll('.list-item__title'))
    .filter(span => span !== currentSpan)
    .map(span => span.textContent.trim().toLowerCase())

  return existingTitle.includes(title.trim().toLowerCase())
}
