import { createTodo } from '../models/todo.js';

export const todoController = () => {

  const addTodo = (todos, {
    title,
    description,
    dueDate,
    priority,
    status }) => [createTodo(title, description, dueDate, priority, status), ...todos];

  const removeTodo = (todos, todoId) => todos.filter(todo => todo.id !== todoId);

  const updateTodo = (todos, todoId, updates) => todos.map(todo => todo.id === todoId ? { ...todo, ...updates } : todo);

  const toggleTodoStatus = (todos, todoId) => todos.map(todo => todo.id === todoId ? { ...todo, status: todo.status === 'inProgress' ? 'completed' : 'inProgress' } : todo);

  return { addTodo, removeTodo, updateTodo, toggleTodoStatus };
};
