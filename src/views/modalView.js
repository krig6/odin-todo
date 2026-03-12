import { showToast } from "../utils/toast.js";
import { isTitleTaken } from "../utils/helpers.js";

const listContainer = document.getElementById('list-container');
const projectContainer = document.getElementById('project-container')

const modal = document.getElementById('unified-modal');
const modalForm = document.getElementById('unified-modal-form');
const modalCancelBtn = document.getElementById('unified-modal-cancel-btn');
const titleInput = document.getElementById('unified-modal-title-input');
const addListBtn = document.getElementById('list-add-btn');
const addProjectButton = document.getElementById('project-add-btn');

const openModal = (type, mode, modal, titleInput, newTitle) => {
  modal.dataset.type = type
  modal.dataset.mode = mode
  titleInput.placeholder = type === 'list' ? 'New List...' : 'New Project...'
  document.getElementById('unified-modal-title').textContent = type === 'list' ? 'Add List' : 'Add Project'
  titleInput.value = newTitle || '';
  titleInput.focus();
  modal.showModal();
}

export const bindOpenModal = (getProjectCount) => {
  if (!modal || !titleInput) return;
  [addListBtn, addProjectButton].forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn === addListBtn ? 'list' : 'project'
      if (type === 'list' && getProjectCount() === 0) {
        showToast('You must create a project before adding a list.', 'info');
        return;
      }
      openModal(type, 'add', modal, titleInput)
    })
  })

  listContainer.addEventListener('click', (e) => {
    if (e.target.closest('.list-item__edit')) {
      const listItem = e.target.closest('.list-item__edit')?.closest('.list-item');
      const newTitle = listItem.querySelector('.list-item__title').textContent;
      modal.dataset.id = listItem.dataset.id;
      openModal('list', 'edit', modal, titleInput, newTitle)
    }
  });

  projectContainer.addEventListener('click', (e) => {
    if (e.target.closest('.project-item__edit')) {
      const projectItem = e.target.closest('.project-item__edit')?.closest('.project-item')
      const newTitle = projectItem.querySelector('.project-item__title').textContent;
      modal.dataset.id = projectItem.dataset.id;
      openModal('project', 'edit', modal, titleInput, newTitle)
    }
  });
};

export const bindUnifiedModalSubmit = (addCallback, updateCallback) => {
  if (!modal || !modalForm || !titleInput || !modalCancelBtn) return;

  modalCancelBtn.onclick = () => {
    titleInput.value = '';
    modal.close();
    modal.dataset.id = '';
    modal.dataset.mode = 'add';
  };

  modalForm.onsubmit = (e) => {
    e.preventDefault();

    const value = titleInput.value.trim();
    if (!value) return;

    const mode = modal.dataset.mode;
    const type = modal.dataset.type;
    const id = modal.dataset.id;

    const existingTitles = Array.from(
      document.querySelectorAll(
        type === 'list'
          ? '.list-item__title'
          : '.project-item__title'
      )
    ).map(span => span.textContent.trim().toLowerCase())

    let titlesToCheck = existingTitles

    if (mode === 'edit') {
      const currentTitle = document.querySelector(
        type === 'list'
          ? `.list-item[data-id="${id}"] .list-item__title`
          : `.project-item[data-id="${id}"] .project-item__title`
      )?.textContent.trim().toLowerCase();

      if (currentTitle) {
        titlesToCheck = existingTitles.filter(title => title !== currentTitle);
      }
    }

    if (isTitleTaken(titlesToCheck, value)) {
      showToast(`This title already exists.`, 'info');
      titleInput.select();
      return;
    }

    if (mode === 'edit') {
      showToast(`Title renamed to "${value}".`, 'info');
      updateCallback(type, id, value);
    } else {
      showToast(`"${value}" added successfully.`, 'success');
      addCallback(type, value);
    }
    modal.close();
    modal.dataset.mode = 'add';
    modal.dataset.id = '';
  };
};
