import { showToast } from "../utils/toast.js";

const projectList = document.getElementById('project-list');

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

export const bindProjectModalActions = (addCallback, updateCallback) => {
  const form = document.getElementById('project-form');
  const title = document.getElementById('project-title-input');
  const projectModal = document.getElementById('project-modal');
  const addProjectButton = document.getElementById('project-add-btn');
  const cancelButton = document.getElementById('project-cancel-btn');
  const projectModalTitle = document.getElementById('project-modal-title');

  if (!form || !title || !projectModal || !addProjectButton || !projectModalTitle) return;

  let currentMode = 'add';

  addProjectButton.addEventListener('click', () => {
    currentMode = 'add';
    projectModalTitle.textContent = 'Add Project';
    form.reset();
    projectModal.showModal();
    delete form.dataset.id;
  });

  projectList.addEventListener('click', (e) => {
    if (e.target.closest('.project-item__edit')) {
      const editTitleButton = e.target.closest('.project-item__edit');
      if (!editTitleButton) return;
      e.stopPropagation();

      currentMode = 'edit';
      const projectItem = editTitleButton.closest('.project-item');
      form.dataset.id = projectItem.dataset.id;
      title.value = projectItem.querySelector('.project-item__title')?.textContent || '';
      projectModalTitle.textContent = 'Edit Project Title';
      title.select();
      projectModal.showModal();
    }
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      projectModal.close();
      title.value = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = title.value.trim();

    if (isProjectTitleTaken(value)) {
      showToast('This project title already exists.', 'warning');
      title.select();
      return;
    }

    if (currentMode === 'add') {
      showToast(`Project "${value}" added successfully.`, 'success');
      addCallback(value);
      title.value = '';
      projectModal.close();
    } else if (currentMode === 'edit') {
      const projectId = form.dataset.id;
      showToast(`Project renamed to "${value}".`, 'info');
      updateCallback(projectId, value);
      projectModal.close();
    }
  });
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

const isProjectTitleTaken = (title, currentSpan = null) => {
  const existingTitle = Array.from(document.querySelectorAll('.project-item__title'))
    .filter(span => span !== currentSpan)
    .map(span => span.textContent.trim().toLowerCase());

  return existingTitle.includes(title.trim().toLowerCase());
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
