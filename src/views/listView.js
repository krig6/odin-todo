const listContainer = document.getElementById('list-container')

export const renderLists = (lists) => {
  listContainer.innerHTML = ''

  lists.forEach(list => {
    const li = document.createElement('li')
    li.dataset.id = list.id
    li.classList.add('list-item')

    const titleSpan = document.createElement('span')
    titleSpan.textContent = list.title
    titleSpan.classList.add('list-item__title')

    li.append(titleSpan)
    listContainer.appendChild(li)
  })

}

export const bindAddList = (callbackFunction) => {
  const form = document.getElementById('add-list-form')
  const title = document.getElementById('list-input')

  if (!form || !title) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const value = title.value.trim()

    if (value !== '') {
      callbackFunction(value)
      title.value = ''
    }
  })
}
