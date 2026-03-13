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

    const todoActionsContainer = document.createElement('div')
    todoActionsContainer.classList.add('todo-actions')

    const addTodoBtn = document.createElement('button');
    addTodoBtn.classList.add('list-item__add-todo');

    const addTodoIcon = document.createElement('i');
    addTodoIcon.classList.add('bx', 'bx-plus');

    const addTodoBtnTextNode = document.createTextNode('Add Todo');

    addTodoBtn.append(addTodoIcon, addTodoBtnTextNode);

    todoActionsContainer.append(renderSortDropdown(list.id), addTodoBtn)

    listHeader.append(titleSpan, controlsContainer);

    li.append(listHeader, todoActionsContainer, todoContainer);
    fragment.appendChild(li);
  });
  listContainer.appendChild(fragment);
};

const renderSortDropdown = (listId) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("sort-dropdown");

  wrapper.innerHTML = `
    <button class="sort-btn" data-list-id="${listId}">
      <i class='bx bx-arrow-up-down'></i>
    </button>
    <div class="sort-options">
      <div class="option" data-sort="dueDate">Due Date</div>
      <div class="option" data-sort="priority">Priority</div>
    </div>
  `;
  return wrapper;
}

export const bindSortDropdownToggle = () => {
  listContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.sort-btn');
    if (!button) return;

    const dropdown = button.closest('.sort-dropdown');
    const options = dropdown.querySelector('.sort-options');

    document.querySelectorAll('.sort-options').forEach(opt => {
      if (opt !== options) opt.classList.remove('show');
    });

    options.classList.toggle('show');
  });
};

export const bindSortSelection = (callbackFunction) => {
  listContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.option');
    if (!option || !option.dataset.sort) return;

    const dropdown = e.target.closest('.sort-dropdown');
    const listId = dropdown.querySelector('.sort-btn').dataset.listId;
    const field = option.dataset.sort;

    dropdown.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    callbackFunction(listId, field);

    dropdown.querySelector('.sort-options').classList.remove('show');
  });
};
