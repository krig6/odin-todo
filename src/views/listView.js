import { showToast } from "../utils/toast.js";

const listContainer = document.getElementById('list-container');

export const renderLists = (lists) => {
  const fragment = document.createDocumentFragment();

  listContainer.innerHTML = '';
  lists.forEach(list => {
    const li = document.createElement('li');
    li.dataset.id = list.id;
    li.classList.add('list-item');

    const listHeader = document.createElement('div');
    listHeader.classList.add('list-header');

    const titleSpan = document.createElement('span');
    titleSpan.textContent = list.title;
    titleSpan.classList.add('list-item__title');

    const editTitleBtn = document.createElement('button');
    editTitleBtn.classList.add('list-item__edit', 'has-tooltip');
    editTitleBtn.dataset.tooltip = 'Edit Title'
    editTitleBtn.type = 'button';

    const editIcon = document.createElement('i');
    editIcon.classList.add('bx', 'bx-edit');
    editTitleBtn.appendChild(editIcon);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('list-item__delete', 'has-tooltip');
    deleteBtn.dataset.tooltip = 'Delete'
    deleteBtn.type = 'button';

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('bx', 'bx-x');
    deleteBtn.appendChild(deleteIcon);

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('list-item__controls');
    controlsContainer.append(editTitleBtn, deleteBtn);

    const todoContainer = document.createElement('ul');
    todoContainer.classList.add('todo-container');
    todoContainer.dataset.listId = list.id;

    const addTodoBtn = document.createElement('button');
    addTodoBtn.classList.add('list-item__add-todo');

    const addTodoIcon = document.createElement('i');
    addTodoIcon.classList.add('bx', 'bx-plus');

    const addTodoBtnTextNode = document.createTextNode('Add Todo');

    addTodoBtn.append(addTodoIcon, addTodoBtnTextNode);

    listHeader.append(titleSpan, controlsContainer);

    li.append(listHeader, addTodoBtn, todoContainer);
    fragment.appendChild(li);
  });
  listContainer.appendChild(fragment);
};

export const bindRemoveList = (callbackFunction) => {
  listContainer.addEventListener('click', (e) => {
    if (e.target.closest('.list-item__delete')) {
      e.stopPropagation();
      const li = e.target.closest('.list-item');
      const title = li.querySelector('.list-item__title').textContent
      showToast(`List "${title}" was deleted.`, 'warning');
      const listId = li.dataset.id;
      callbackFunction(listId);
    }
  });
};

