import { createList } from "../models/list.js"

export const listController = () => {

  const addList = (lists, { title }) => [...lists, createList(title)]

  const removeList = (lists, listId) => lists.filter(list => list.id !== listId)

  return { addList, removeList }
}
