import { createProject } from "./models/project.js";
import { createList } from "./models/list.js"
import { createTodo } from "./models/todo.js"
import { addDays } from 'date-fns';

export const sampleProjects = () => {
  return [
    createProject('Learning & Development', [
      createList('JavaScript Practice', [
        createTodo('Complete Odin Project JS exercises', '', addDays(new Date(), 2), 'high'),
        createTodo('Implement Caesar Cipher', '', addDays(new Date(), 3), 'medium'),
        createTodo('Practice DOM manipulation', '', addDays(new Date(), 1), 'medium'),
        createTodo('Build a small utility library', '', addDays(new Date(), 4), 'low')
      ]),
      createList('React Basics', [
        createTodo('Set up project structure', '', addDays(new Date(), 1), 'high'),
        createTodo('Create reusable components', '', addDays(new Date(), 2), 'medium'),
        createTodo('Implement state management', '', addDays(new Date(), 3), 'medium'),
        createTodo('Practice props drilling and lifting state', '', addDays(new Date(), 4), 'medium'),
        createTodo('Experiment with useEffect hooks', '', addDays(new Date(), 5), 'medium')
      ]),
      createList('CSS & Layouts', [
        createTodo('Practice Flexbox layouts', '', addDays(new Date(), 1), 'medium'),
        createTodo('Build responsive grid', '', addDays(new Date(), 2), 'medium'),
        createTodo('Experiment with animations', '', addDays(new Date(), 3), 'low')
      ]),
      createList('Reading & Learning', [
        createTodo('Read "You Don’t Know JS" chapters 1-3', '', addDays(new Date(), 2), 'high'),
        createTodo('Watch modern JS tutorials', '', addDays(new Date(), 3), 'medium'),
        createTodo('Take notes on ES6 features', '', addDays(new Date(), 4), 'medium')
      ])
    ]),

    createProject('Work Projects', [
      createList('Client Website', [
        createTodo('Set up meeting with client', 'Discuss requirements', addDays(new Date(), 1), 'high'),
        createTodo('Draft homepage design', '', addDays(new Date(), 3), 'medium'),
        createTodo('Review brand assets', '', addDays(new Date(), 2), 'low')
      ]),
      createList('Marketing Campaign', [
        createTodo('Brainstorm ideas', '', addDays(new Date(), 1), 'high'),
        createTodo('Create ad copy', '', addDays(new Date(), 4), 'medium'),
        createTodo('Schedule social posts', '', addDays(new Date(), 5), 'medium')
      ]),
      createList('Internal Tools', [
        createTodo('Update project tracker', '', addDays(new Date(), 1), 'low'),
        createTodo('Refactor reporting script', '', addDays(new Date(), 2), 'medium'),
        createTodo('Test dashboard notifications', '', addDays(new Date(), 3), 'high')
      ])
    ])
  ];
};
