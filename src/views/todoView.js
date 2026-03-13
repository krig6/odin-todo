import { showToast } from "../utils/toast.js";
import { isTitleTaken } from "../utils/helpers.js";

export const renderTodos = (listId, todos) => {
  const todoContainer = document.querySelector(`.todo-container[data-list-id="${listId}"]`);
  if (!todoContainer) return;

  todoContainer.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.classList.add('todo-item', `todo-item--${todo.priority}`);
    li.dataset.status = todo.status === 'completed' ? 'completed' : 'inprogress'


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDateObj = new Date(todo.dueDate);
    dueDateObj.setHours(0, 0, 0, 0);

    if (today >= dueDateObj && li.dataset.status !== 'completed') {
      li.classList.add('todo-item--overdue');
    }

    const title = document.createElement('span');
    title.textContent = todo.title;
    title.classList.add('todo-item__title');

    const description = document.createElement('p');
    description.textContent = todo.description;
    description.classList.add('todo-item__description');

    const dueDate = document.createElement('time');
    const dateObj = new Date(todo.dueDate);
    dueDate.textContent = dateObj.toLocaleDateString();
    dueDate.dateTime = dateObj.toISOString();
    dueDate.classList.add('todo-item__due-date');

    const priority = document.createElement('span');
    priority.textContent = todo.priority;
    priority.classList.add('todo-item__priority');

    const todoHeader = document.createElement('div');
    todoHeader.classList.add('todo-header');

    const statusBtn = document.createElement('button');
    statusBtn.classList.add('todo-item__status', 'has-tooltip');
    statusBtn.dataset.tooltip = todo.status === 'completed' ? 'Completed' : 'In Progress';

    const statusIcon = document.createElement('i');
    const isCompleted = todo.status === 'inProgress' ? false : true;
    statusIcon.classList.add(isCompleted ? 'bx-check-circle' : 'bx-clock-dashed-half');
    statusBtn.appendChild(statusIcon);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('todo-item__delete', 'has-tooltip');
    deleteBtn.dataset.tooltip = 'Delete'

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('bx', 'bx-x');
    deleteBtn.appendChild(deleteIcon);

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('todo-item__controls');
    controlsContainer.append(statusBtn, deleteBtn);

    todoHeader.append(title, controlsContainer);

    li.append(todoHeader, description, dueDate, priority);
    todoContainer.appendChild(li);
  });
};

export const bindTodoModalActions = (addCallback, updateCallback) => {
  const listContainer = document.getElementById('list-container');
  const form = document.getElementById('todo-form');
  const todoModal = document.getElementById('todo-modal');

  const titleInput = document.getElementById('todo-input-title');
  const descriptionInput = document.getElementById('todo-input-description');
  const dueDateInput = document.getElementById('todo-input-due-date');
  const priorityInput = document.getElementById('todo-input-priority');
  const cancelBtn = document.getElementById('todo-cancel-btn');

  let currentMode = 'add';
  let todoId = null;

  if (!listContainer || !form || !todoModal) return;

  listContainer.addEventListener('click', (e) => {
    e.stopPropagation();

    const addBtn = e.target.closest('.list-item__add-todo');
    const todoItem = e.target.closest('.todo-item');

    if (addBtn) {
      document.querySelector('.todo-modal__title').textContent = 'Add Todo';

      currentMode = 'add';
      todoId = null;

      const li = addBtn.closest('.list-item');
      if (!li) return;
      form.dataset.listId = li.dataset.id;
      form.reset();
      todoModal.showModal();
      titleInput.focus();
    } else if (todoItem) {
      if (e.target.closest('button')) return;
      document.querySelector('.todo-modal__title').textContent = 'Edit Todo';

      currentMode = 'edit';
      todoId = todoItem.dataset.id;

      const li = todoItem.closest('.list-item');
      if (!li) return;
      form.dataset.listId = li.dataset.id;

      titleInput.value = todoItem.querySelector('.todo-item__title')?.textContent || '';
      descriptionInput.value = todoItem.querySelector('.todo-item__description')?.textContent || '';
      const existingDueDate = todoItem.querySelector('.todo-item__due-date')?.dateTime || '';
      dueDateInput.value = existingDueDate ? existingDueDate.split('T')[0] : '';
      priorityInput.value = todoItem.querySelector('.todo-item__priority')?.textContent;

      todoModal.showModal();
      titleInput.focus();
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      todoModal.close();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const listId = form.dataset.listId;
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : undefined;
    const priority = priorityInput.value;

    if (!title) return;

    const existingTitles = Array.from(
      document.querySelectorAll('.todo-item__title')
    ).map(span => span.textContent.trim().toLowerCase())

    let titlesToCheck = existingTitles

    if (isTitleTaken(titlesToCheck, title)) {
      showToast(`This title already exists.`, 'info');
      titleInput.select();
      return;
    }

    if (currentMode === 'add') {
      showToast(`Todo "${title}" added successfully.`, 'success');
      addCallback(listId, { title, description, dueDate, priority });
    } else if (currentMode === 'edit') {
      showToast(`Todo "${title}" updated.`, 'info');
      updateCallback(listId, todoId, { title, description, dueDate, priority });
    }

    form.reset();
    todoModal.close();
  });
};

export const bindToggleTodoStatus = (callbackFunction) => {
  const listContainer = document.getElementById('list-container');
  if (!listContainer) return;

  listContainer.addEventListener('click', (e) => {
    const statusBtn = e.target.closest('.todo-item__status');
    if (!statusBtn) return;

    e.stopPropagation();

    const todoContainer = statusBtn.closest('.todo-container');
    const todo = statusBtn.closest('.todo-item');

    const listId = todoContainer.dataset.listId;
    const todoId = todo.dataset.id;

    callbackFunction(listId, todoId);
  });
};
