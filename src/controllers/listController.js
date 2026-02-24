import { createList } from "../models/list.js"

export const listController = () => {

  const addList = (lists, { title }) => [...lists, createList(title)]

  return { addList }
}
