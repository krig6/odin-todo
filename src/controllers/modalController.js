import { showToast } from "../utils/toast.js";
import { openModal, isTitleTaken } from "../utils/helpers.js";

const listContainer = document.getElementById('list-container');
const projectContainer = document.getElementById('project-container')

const modal = document.getElementById('unified-modal');
const modalForm = document.getElementById('unified-modal-form');
const modalCancelBtn = document.getElementById('unified-modal-cancel-btn');
const titleInput = document.getElementById('unified-modal-title-input');
const addListBtn = document.getElementById('list-add-btn');
const addProjectButton = document.getElementById('project-add-btn');

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

    if (mode === 'edit') {
      if (isTitleTaken(type, value)) {
        showToast(`This title already exists.`, 'info');
        titleInput.select();
        return;
      }
      showToast(`Title renamed to "${value}".`, 'info');
      updateCallback(type, id, value);
    } else {
      if (isTitleTaken(type, value)) {
        showToast(`This title already exists.`, 'info');
        titleInput.select();
        return;
      }
      showToast(`"${value}" added successfully.`, 'success');
      addCallback(type, value);
    }
    modal.close();
    modal.dataset.mode = 'add';
    modal.dataset.id = '';
  };
};
