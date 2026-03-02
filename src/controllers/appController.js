import '../../style/style.css'

import { renderProjects, bindAddProject, bindRemoveProject, bindSelectProject, bindUpdateProjectTitle } from "../views/projectView.js";

import { projectController } from "./projectController.js";

import { renderLists, bindAddList, bindRemoveList, bindUpdateListTitle } from "../views/listView.js";
import { listController } from "./listController.js";

import { renderTodos, bindTodoModalActions, bindRemoveTodo, bindToggleTodoStatus } from "../views/todoView.js";
import { todoController } from "./todoController.js";

export const appController = () => {
  const projCntrlr = projectController()
  const listCntrlr = listController()
  const todoCntrlr = todoController()

  let projects = []
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

  const init = () => {
    renderProjects(projects, selectedProjectId)

    bindAddProject((projectTitle) => {
      projects = projCntrlr.addProject(projects, { title: projectTitle })
      selectedProjectId = projects[projects.length - 1].id
      renderProjects(projects, selectedProjectId)

      const project = getProject(selectedProjectId)
      renderLists(project.lists)
    })

    bindRemoveProject((projectId) => {
      projects = projCntrlr.removeProject(projects, projectId)
      renderProjects(projects)

      if (selectedProjectId === projectId) {
        selectedProjectId = null
        renderLists([])
      }
    })

    bindSelectProject((projectId) => {
      selectedProjectId = projectId
      renderProjects(projects, projectId)

      const project = getProject(selectedProjectId)
      renderLists(project.lists)

      project.lists.forEach(list => {
        renderTodos(list.id, list.todos)
      })
    })

    bindUpdateProjectTitle((projectId, newTitle) => {
      selectedProjectId = projectId
      projects = projCntrlr.updateProjectTitle(projects, projectId, newTitle)
      renderProjects(projects, projectId)
    })

    bindAddList((listTitle) => {
      if (!selectedProjectId) return
      const project = getProject(selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.addList(project.lists, { title: listTitle })
      renderLists(project.lists)
    })

    bindRemoveList((listId) => {
      if (!selectedProjectId) return
      const project = getProject(selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.removeList(project.lists, listId)
      renderLists(project.lists)

      project.lists.forEach(list => {
        renderTodos(list.id, list.todos)
      })
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
    })

    bindTodoModalActions(
      (listId, todoData) => {
        const [project, list] = getListContext(listId)
        if (!project || !list) return

        list.todos = todoCntrlr.addTodo(list.todos, todoData)
        renderTodos(listId, list.todos)
      },

      (listId, todoId, updates) => {
        const [project, list] = getListContext(listId)
        if (!project || !list) return

        list.todos = todoCntrlr.updateTodo(list.todos, todoId, updates)
        renderTodos(listId, list.todos)
      }
    )

    bindRemoveTodo((listId, todoId) => {
      const [project, list] = getListContext(listId)
      if (!project || !list) return

      list.todos = todoCntrlr.removeTodo(list.todos, todoId)
      renderTodos(listId, list.todos)
    })

    bindToggleTodoStatus((listId, todoId) => {
      const [project, list] = getListContext(listId)
      if (!project || !list) return

      list.todos = todoCntrlr.toggleTodoStatus(list.todos, todoId)
      renderTodos(listId, list.todos)
    })
  }

  return { init }
}
