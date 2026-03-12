export const getProjectCount = (projects) => projects.length;

export const openModal = (type, mode, modal, titleInput, newTitle) => {
  modal.dataset.type = type
  modal.dataset.mode = mode
  titleInput.placeholder = type === 'list' ? 'New List...' : 'New Project...'
  document.getElementById('unified-modal-title').textContent = type === 'list' ? 'Add List' : 'Add Project'
  titleInput.value = newTitle || '';
  titleInput.focus();
  modal.showModal();
}

export const isTitleTaken = (type, title) => {
  const existingListTitles =
    Array.from(document.querySelectorAll('.list-item__title'))
      .map(span => span.textContent.trim().toLowerCase());
  const existingProjectTitles =
    Array.from(document.querySelectorAll('.project-item__title'))
      .map(span => span.textContent.trim().toLowerCase());

  if (type === 'list') {
    return existingListTitles.includes(title.trim().toLowerCase());
  } else {
    return existingProjectTitles.includes(title.trim().toLowerCase());
  }
};
