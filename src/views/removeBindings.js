import { showToast } from "../utils/toast.js";

const projectContainer = document.getElementById('project-container');
const listContainer = document.getElementById('list-container');

export const bindRemoveItem = (callbackFunction) => {
  projectContainer.addEventListener('click', (e) => {
    if (e.target.closest('.project-item__delete')) {
      e.stopPropagation();
      const li = e.target.closest('.project-item');
      const title = li.querySelector('.project-item__title').textContent
      showToast(`Project "${title}" was deleted.`, 'warning');
      const projectId = li.dataset.id;
      const type = 'project'
      callbackFunction(projectId, type);
    }
  });

  listContainer.addEventListener('click', (e) => {
    if (e.target.closest('.list-item__delete')) {
      e.stopPropagation();
      const li = e.target.closest('.list-item');
      const title = li.querySelector('.list-item__title').textContent
      showToast(`List "${title}" was deleted.`, 'warning');
      const listId = li.dataset.id;
      const type = 'list'
      callbackFunction(listId, type);
    }
  });

  listContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.todo-item__delete');
    if (!deleteBtn) return;
    e.stopPropagation();

    const todoContainer = deleteBtn.closest('.todo-container');
    const todo = deleteBtn.closest('.todo-item');
    const title = todo.querySelector('.todo-item__title').textContent

    const listId = todoContainer.dataset.listId;
    const todoId = todo.dataset.id;

    showToast(`Todo "${title}" was deleted.`, 'warning');
    const type = 'todo'
    callbackFunction(listId, type, todoId);
  })
};
