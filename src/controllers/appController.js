import { renderProjects, bindSelectProject, bindProjectPanelToggle } from '../views/projectView.js';

import { projectController } from './projectController.js';

import { renderLists } from '../views/listView.js';
import { bindUnifiedModalSubmit, bindOpenModal } from '../views/modalView.js';
import { listController } from './listController.js';

import { renderTodos, bindTodoModalActions, bindToggleTodoStatus } from '../views/todoView.js';
import { todoController } from './todoController.js';

import { storageController } from '../storage/storageController.js';
import { sampleProjects } from '../sampleData.js';
import { getProjectCount } from '../utils/helpers.js'
import { bindRemoveItem } from '../views/removeBindings.js';

export const appController = () => {
  const projCntrlr = projectController();
  const listCntrlr = listController();
  const todoCntrlr = todoController();
  const storageCntrlr = storageController();

  let projects = storageCntrlr.loadProjects() || sampleProjects();
  let selectedProjectId = null;

  const getProject = (projectId) => projects.find(project => project.id === projectId);
  const getList = (project, listId) => project.lists.find(list => list.id === listId);

  const getListContext = (listId) => {
    if (!selectedProjectId) return null;
    const project = getProject(selectedProjectId);
    if (!project) return null;
    const list = getList(project, listId);
    if (!list) return null;
    return [project, list];
  };

  const renderTodosForLists = (projectLists) => {
    projectLists.forEach(list => {
      renderTodos(list.id, list.todos);
    });
  };

  const renderProjectView = (project) => {
    renderLists(project.lists);
    renderTodosForLists(project.lists);
  };

  const persistState = () => {
    storageCntrlr.saveProjects(projects);
    storageCntrlr.saveSelectedProject(selectedProjectId);
  };

  const hideProjectPanel = () => {
    const projectPanel = document.getElementById('project-panel');
    if (projectPanel) projectPanel.classList.remove('active');
  };

  const updateListViewHeader = (project) => {
    const titleEl = document.getElementById('project-title');
    if (!titleEl) return;

    titleEl.textContent = project ? project.title : 'All slacking! Add a project first.';
  };

  const init = () => {
    selectedProjectId = storageCntrlr.loadSelectedProject(selectedProjectId) || projects[0]?.id || null;
    renderProjects(projects, selectedProjectId);

    const project = getProject(selectedProjectId);
    if (project) {
      renderProjectView(project);
      updateListViewHeader(project);
    }

    bindProjectPanelToggle();
    bindOpenModal(() => getProjectCount(projects))
    bindRemoveItem(
      (id, type, todoId) => {
        if (type === 'list') {
          if (!selectedProjectId) return;
          const project = getProject(selectedProjectId);
          if (!project) return;

          project.lists = listCntrlr.removeList(project.lists, id);
          renderProjectView(project);
          storageCntrlr.saveProjects(projects);
        } else if (type === 'project') {
          projects = projCntrlr.removeProject(projects, id);
          renderProjects(projects);
          if (selectedProjectId === id && getProjectCount(projects) !== 0) {
            selectedProjectId = projects[0].id;
            const project = getProject(selectedProjectId);
            renderProjectView(project);
            updateListViewHeader(project);
            renderProjects(projects, selectedProjectId);
            storageCntrlr.saveSelectedProject(selectedProjectId)
          } else {
            selectedProjectId = null;
            renderLists([]);
            updateListViewHeader(null);
            renderProjects(projects);
          }
          storageCntrlr.saveProjects(projects);
        } else {
          const [project, list] = getListContext(id);
          if (!project || !list) return;

          list.todos = todoCntrlr.removeTodo(list.todos, todoId);
          renderTodos(id, list.todos);
          storageCntrlr.saveProjects(projects);
        }
      }
    )

    bindUnifiedModalSubmit(
      (type, title) => {
        if (type === 'list') {
          if (!selectedProjectId) return;
          const project = getProject(selectedProjectId);
          if (!project) return;
          project.lists = listCntrlr.addList(project.lists, { title: title });
          renderProjectView(project);
          persistState();
        } else {
          projects = projCntrlr.addProject(projects, { title: title });
          selectedProjectId = projects[projects.length - 1].id;
          renderProjects(projects, selectedProjectId);
          hideProjectPanel();
          const project = getProject(selectedProjectId);
          renderLists(project.lists);
          updateListViewHeader(project);
          persistState();
        }
      },
      (type, id, newTitle) => {
        if (type === 'list') {
          const project = getProject(selectedProjectId);
          if (!project) return;
          project.lists = project.lists.map(list => {
            if (list.id === id) {
              return { ...list, title: newTitle };
            }
            return list;
          });
          renderProjectView(project);
          persistState();
        } else {
          selectedProjectId = id;
          projects = projCntrlr.updateProjectTitle(projects, id, newTitle);
          renderProjects(projects, id);
          const project = getProject(selectedProjectId);
          updateListViewHeader(project);
          persistState();
        }
      }
    );

    bindSelectProject((projectId) => {
      selectedProjectId = projectId;
      renderProjects(projects, projectId);
      hideProjectPanel();
      const project = getProject(selectedProjectId);
      renderProjectView(project);
      updateListViewHeader(project);
      storageCntrlr.saveSelectedProject(selectedProjectId);
    });

    bindTodoModalActions(
      (listId, todoData) => {
        const [project, list] = getListContext(listId);
        if (!project || !list) return;

        list.todos = todoCntrlr.addTodo(list.todos, todoData);
        renderTodos(listId, list.todos);
        storageCntrlr.saveProjects(projects);
        storageCntrlr.saveSelectedProject(selectedProjectId);
      },

      (listId, todoId, updates) => {
        const [project, list] = getListContext(listId);
        if (!project || !list) return;

        list.todos = todoCntrlr.updateTodo(list.todos, todoId, updates);
        renderTodos(listId, list.todos);
        persistState();
      }
    );

    bindToggleTodoStatus((listId, todoId) => {
      const [project, list] = getListContext(listId);
      if (!project || !list) return;

      list.todos = todoCntrlr.toggleTodoStatus(list.todos, todoId);
      renderTodos(listId, list.todos);
      persistState();
    });
  };

  return { init };
};
