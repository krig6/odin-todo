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
