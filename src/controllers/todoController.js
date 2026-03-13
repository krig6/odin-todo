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

  const sortTodos = (todos, field) => {
    const priorityRank = { high: 3, medium: 2, low: 1 };

    return [...todos].sort((a, b) => {
      if (field === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (field === "priority") {
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      }
      return 0;
    });
  };

  return { addTodo, removeTodo, updateTodo, toggleTodoStatus, sortTodos };
};
