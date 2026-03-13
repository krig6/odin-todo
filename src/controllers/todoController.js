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

    const inProgress = todos.filter(todo => todo.status !== 'completed');
    const completed = todos.filter(todo => todo.status === 'completed');

    let sorted = [];

    if (field === "dueDate") {
      sorted = inProgress.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (field === "priority") {
      sorted = inProgress.sort((a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0));
    } else {
      sorted = [...inProgress];
    }

    return [...sorted, ...completed];
  };

  return { addTodo, removeTodo, updateTodo, toggleTodoStatus, sortTodos };
};
