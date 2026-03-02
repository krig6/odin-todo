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

  const init = () => {
    renderProjects(projects, selectedProjectId)

    bindAddProject((projectTitle) => {
      projects = projCntrlr.addProject(projects, { title: projectTitle })
      selectedProjectId = projects[projects.length - 1].id
      renderProjects(projects, selectedProjectId)

      const project = projects.find(project => project.id === selectedProjectId)
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
      const project = projects.find(project => project.id === projectId)
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

      const project = projects.find(project => project.id === selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.addList(project.lists, { title: listTitle })
      renderLists(project.lists)
    })

    bindRemoveList((listId) => {
      if (!selectedProjectId) return

      const project = projects.find(project => project.id === selectedProjectId)
      if (!project) return

      project.lists = listCntrlr.removeList(project.lists, listId)
      renderLists(project.lists)
      project.lists.forEach(list => {
        renderTodos(list.id, list.todos)
      })
    })

    bindUpdateListTitle((listId, newTitle) => {
      const currentProject = projects.find(project => project.id === selectedProjectId)
      if (!currentProject) return

      currentProject.lists = currentProject.lists.map(list => {
        if (list.id === listId) {
          return { ...list, title: newTitle }
        }
        return list
      })

      renderLists(currentProject.lists)
    })

    bindTodoModalActions(
      (listId, todoData) => {
        if (!selectedProjectId) return

        const project = projects.find(project => project.id === selectedProjectId)
        if (!project) return

        const list = project.lists.find(list => list.id === listId)
        if (!list) return

        list.todos = todoCntrlr.addTodo(list.todos, todoData)

        renderTodos(listId, list.todos)
      },

      (listId, todoId, updates) => {
        if (!selectedProjectId) return

        const project = projects.find(project => project.id === selectedProjectId)
        if (!project) return

        const list = project.lists.find(list => list.id === listId)
        if (!list) return

        list.todos = todoCntrlr.updateTodo(list.todos, todoId, updates)
        renderTodos(listId, list.todos)
      }
    )

    bindRemoveTodo((listId, todoId) => {
      if (!selectedProjectId) return

      const project = projects.find(project => project.id === selectedProjectId)
      if (!project) return

      const list = project.lists.find(list => list.id === listId)
      if (!list) return

      list.todos = todoCntrlr.removeTodo(list.todos, todoId)

      renderTodos(listId, list.todos)
    })

    bindToggleTodoStatus((listId, todoId) => {
      if (!selectedProjectId) return

      const project = projects.find(project => project.id === selectedProjectId)
      if (!project) return

      const list = project.lists.find(list => list.id === listId)
      if (!list) return

      list.todos = todoCntrlr.toggleTodoStatus(list.todos, todoId)

      renderTodos(listId, list.todos)
    })
  }

  return { init }
}
