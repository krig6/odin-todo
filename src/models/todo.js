import { addDays } from 'date-fns';

export const createTodo = (title = 'Untitled', description = '', dueDate, priority = 'high', status = 'inProgress') => {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    dueDate: dueDate ?? addDays(new Date(), 1),
    priority,
    status
  };
};
