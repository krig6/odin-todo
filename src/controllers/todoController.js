import { createTodo } from "../models/todo.js"

export const todoController = () => {

  const addTodo = ({
    title,
    description,
    dueDate,
    priority,
    status }) => createTodo(title, description, dueDate, priority, status)

  const removeTodo = (list, todoId) => list.filter(todo => todo.id !== todoId)

  return { addTodo, removeTodo }

}
