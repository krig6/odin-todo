export const createList = (title = 'New List', todos = []) => {
  return {
    id: crypto.randomUUID(),
    title,
    todos
  }
}
