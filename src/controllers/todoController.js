import { createTodo } from "../models/todo.js"

export const todoController = () => {

  const addTodo = (list, {
    title,
    description,
    dueDate,
    priority,
    status }) => [...list, createTodo(title, description, dueDate, priority, status)]

  const removeTodo = (list, todoId) => list.filter(todo => todo.id !== todoId)

  const updateTodo = (list, todoId, updates) => list.map(todo => todo.id === todoId ? { ...todo, ...updates } : todo)

  const toggleTodoStatus = (list, todoId) => list.map(todo => todo.id === todoId ? { ...todo, status: todo.status === 'inProgress' ? 'completed' : 'inProgress' } : todo)

  const updatePriority = (list, todoId, newPriority) => list.map(todo => todo.id === todoId ? { ...todo, priority: newPriority } : todo)

  return { addTodo, removeTodo, updateTodo, toggleTodoStatus, updatePriority }

}
