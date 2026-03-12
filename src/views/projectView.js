import { showToast } from "../utils/toast.js";

const projectList = document.getElementById('project-container');

export const renderProjects = (projects, selectedId) => {
  const fragment = document.createDocumentFragment();

  projectList.innerHTML = '';
  projects.forEach(project => {
    const li = document.createElement('li');
    li.dataset.id = project.id;
    li.classList.add('project-item');

    const titleSpan = document.createElement('span');
    titleSpan.textContent = project.title;
    titleSpan.classList.add('project-item__title');

    const editTitleBtn = document.createElement('button');
    editTitleBtn.classList.add('project-item__edit', 'has-tooltip');
    editTitleBtn.dataset.tooltip = 'Edit Title'
    editTitleBtn.type = 'button';

    const editIcon = document.createElement('i');
    editIcon.classList.add('bx', 'bx-edit');
    editTitleBtn.appendChild(editIcon);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('project-item__delete', 'has-tooltip');
    deleteBtn.dataset.tooltip = 'Delete'
    deleteBtn.type = 'button';

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('bx', 'bx-x');
    deleteBtn.appendChild(deleteIcon);

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('project-item__controls');
    controlsContainer.append(editTitleBtn, deleteBtn);

    li.append(titleSpan, controlsContainer);

    if (project.id === selectedId) {
      li.classList.add('project-item--selected');
    }
    fragment.appendChild(li);
  });
  projectList.appendChild(fragment);
};

export const bindRemoveProject = (callbackFunction) => {
  projectList.addEventListener('click', (e) => {
    if (e.target.closest('.project-item__delete')) {
      e.stopPropagation();
      const li = e.target.closest('.project-item');
      const title = li.querySelector('.project-item__title').textContent
      showToast(`Project "${title}" was deleted.`, 'warning');
      const projectId = li.dataset.id;
      callbackFunction(projectId);
    }
  });
};

export const bindSelectProject = (callbackFunction) => {
  projectList.addEventListener('click', (e) => {
    const li = e.target.closest('.project-item');
    if (!li) return;

    if (e.target.closest('.project-item__edit')) return;
    if (e.target.closest('.project-item__delete')) return;

    if (e.detail > 1) return;
    const projectId = li.dataset.id;
    callbackFunction(projectId);
  });
};

export const bindProjectPanelToggle = () => {
  const panel = document.getElementById('project-panel');
  const openBtn = document.getElementById('project-panel-open-btn');
  const closeBtn = document.getElementById('project-panel-close-btn');

  if (!panel || !openBtn) return;

  const openPanel = () => panel.classList.add('active');
  const closePanel = () => panel.classList.remove('active');
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
  }
};
