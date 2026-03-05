import { renderProjects, bindRemoveProject, bindSelectProject, bindProjectModalActions, bindProjectPanelToggle } from "../views/projectView.js";

import { projectController } from "./projectController.js";

import { renderLists, bindOpenListModal, bindRemoveList, bindUpdateListTitle, bindListFormSubmit } from "../views/listView.js";
import { listController } from "./listController.js";

import { renderTodos, bindTodoModalActions, bindRemoveTodo, bindToggleTodoStatus } from "../views/todoView.js";
import { todoController } from "./todoController.js";

import { storageController } from "../storage/storageController.js"

export const appController = () => {
  const projCntrlr = projectController()
  const listCntrlr = listController()
  const todoCntrlr = todoController()
  const storageCntrlr = storageController()

  let projects = storageCntrlr.loadProjects() || []
  let selectedProjectId = null

  const getProject = (projectId) => projects.find(project => project.id === projectId)
  const getList = (project, listId) => project.lists.find(list => list.id === listId)

  const getListContext = (listId) => {
    if (!selectedProjectId) return null
    const project = getProject(selectedProjectId)
    if (!project) return null
    const list = getList(project, listId)
    if (!list) return null
    return [project, list]
  }

  const renderTodosForLists = (projectLists) => {
    projectLists.forEach(list => {
      renderTodos(list.id, list.todos)
    })
  }

  const renderProjectView = (project) => {
    renderLists(project.lists)
    renderTodosForLists(project.lists)
  }

  const persistState = () => {
    storageCntrlr.saveProjects(projects)
    storageCntrlr.saveSelectedProject(selectedProjectId)
  }

  const hideProjectPanel = () => {
    const projectPanel = document.getElementById('project-panel')
    if (projectPanel) projectPanel.classList.remove('active')
  }

  const updateListViewHeader = (project) => {
    const titleEl = document.getElementById('project-title');
    if (titleEl && project) {
      titleEl.textContent = project.title;
    }
  };

  const getProjectCount = () => projects.length

  const init = () => {
    selectedProjectId = storageCntrlr.loadSelectedProject(selectedProjectId)
    renderProjects(projects, selectedProjectId)

    const project = getProject(selectedProjectId)
    if (project) {
      renderProjectView(project)
      updateListViewHeader(project)
    }

    bindProjectPanelToggle()

    bindProjectModalActions(
      (projectTitle) => {
        projects = projCntrlr.addProject(projects, { title: projectTitle })
        selectedProjectId = projects[projects.length - 1].id
        renderProjects(projects, selectedProjectId)

        hideProjectPanel()

        const project = getProject(selectedProjectId)
        renderLists(project.lists)
        updateListViewHeader(project)
        persistState()
      },
      (projectId, newTitle) => {
        selectedProjectId = projectId
        projects = projCntrlr.updateProjectTitle(projects, projectId, newTitle)
        renderProjects(projects, projectId)
        const project = getProject(selectedProjectId)
        updateListViewHeader(project)
        persistState()
      }
    )

    bindRemoveProject((projectId) => {
      projects = projCntrlr.removeProject(projects, projectId)
      renderProjects(projects)

      if (selectedProjectId === projectId) {
        selectedProjectId = null
        renderLists([])
      }

      storageCntrlr.saveProjects(projects)
    })

    bindSelectProject((projectId) => {
      selectedProjectId = projectId
      renderProjects(projects, projectId)
      hideProjectPanel()
      const project = getProject(selectedProjectId)
      renderProjectView(project)
      updateListViewHeader(project)
      storageCntrlr.saveSelectedProject(selectedProjectId)
    })

    bindOpenListModal((listModal, listInput) => {
      if (getProjectCount() === 0) return
      listInput.value = ''
      listModal.showModal()
      listInput.focus()
    })

    bindListFormSubmit((listTitle) => {
      if (!selectedProjectId) return
      const project = getProject(selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.addList(project.lists, { title: listTitle })
      renderProjectView(project)
      persistState()
    })

    bindRemoveList((listId) => {
      if (!selectedProjectId) return
      const project = getProject(selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.removeList(project.lists, listId)
      renderProjectView(project)
      storageCntrlr.saveProjects(projects)
    })

    bindUpdateListTitle((listId, newTitle) => {
      const project = getProject(selectedProjectId)
      if (!project) return

      project.lists = project.lists.map(list => {
        if (list.id === listId) {
          return { ...list, title: newTitle }
        }
        return list
      })
      renderLists(project.lists)
      persistState()
    })

    bindTodoModalActions(
      (listId, todoData) => {
        const [project, list] = getListContext(listId)
        if (!project || !list) return

        list.todos = todoCntrlr.addTodo(list.todos, todoData)
        renderTodos(listId, list.todos)
        storageCntrlr.saveProjects(projects)
        storageCntrlr.saveSelectedProject(selectedProjectId)
      },

      (listId, todoId, updates) => {
        const [project, list] = getListContext(listId)
        if (!project || !list) return

        list.todos = todoCntrlr.updateTodo(list.todos, todoId, updates)
        renderTodos(listId, list.todos)
        persistState()
      }
    )

    bindRemoveTodo((listId, todoId) => {
      const [project, list] = getListContext(listId)
      if (!project || !list) return

      list.todos = todoCntrlr.removeTodo(list.todos, todoId)
      renderTodos(listId, list.todos)
      storageCntrlr.saveProjects(projects)
    })

    bindToggleTodoStatus((listId, todoId) => {
      const [project, list] = getListContext(listId)
      if (!project || !list) return

      list.todos = todoCntrlr.toggleTodoStatus(list.todos, todoId)
      renderTodos(listId, list.todos)
      persistState()
    })
  }

  return { init }
}
