import { createList } from '../models/list.js';

export const listController = () => {

  const addList = (lists, { title }) => [...lists, createList(title)];

  const removeList = (lists, listId) => lists.filter(list => list.id !== listId);

  const updateListTitle = (lists, listId, newListTitle) => lists.map(list => list.id === listId ? { ...list, title: newListTitle } : list);

  return { addList, removeList, updateListTitle };
};
