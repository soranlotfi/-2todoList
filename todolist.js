const todoInput = document.querySelector(".todo-input")
const todoForm = document.querySelector(".todo-form")
const todoList = document.querySelector(".todolist")
const selectFilters = document.querySelector(".filter-todos")
const editModalContainer = document.querySelector(".edit-modal-container")
const editSubmitBtn = document.querySelector(".edit-submit")
const cancelEditBtn = document.querySelector(".cancel-submit")
let modalEditInput = document.querySelector(".modal-edit-input")
let filterValue = "all"

todoForm.addEventListener("submit", addNewTodo)
selectFilters.addEventListener("change", (e) => {
    filterValue = e.target.value
    filterTodos()
})
document.addEventListener("DOMContentLoaded", (e) => {
    const todos = getAllTodos()
    createTodos(todos)
})
editSubmitBtn.addEventListener("click", editTodo)
cancelEditBtn.addEventListener("click", closeEditModal)
function addNewTodo(e) {
    e.preventDefault()
    if (!todoInput.value) return null
    const newTodo = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        title: todoInput.value,
        isCompleted: false
    }
    let todos = saveTodo(newTodo)
    createTodos(todos)
    filterTodos()
}
function createTodos(todos) {
    //     render todos in dom
    let result = ""
    todos.forEach((todo) => {
        result += `<li class="todo">
          <p class="todo__title">${todo.title}</p>
          <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
          <button data-todo-id="${todo.id}" onclick="checkTodo(${todo.id})" class="todo__check" ><i class="${todo.isCompleted ? "far fa-check-square" : "far fa-square"}"></i></button>
          <button data-todo-id="${todo.id}" onclick="removeTodo(${todo.id})" class="todo__remove"><i class=" far fa-trash-alt"></i></button>
          <button data-todo-id="${todo.id}" onclick="handleEditTodo(${todo.id})" class="todo__edit"><i class=" far fa-edit"></i></button>
        </li>`
    })
    todoList.innerHTML = result
    todoInput.value = ""
}

function filterTodos() {
    let filteredTodos;
    let savedTodos = getAllTodos()
    switch (filterValue) {
        case "all": {
            filteredTodos = savedTodos;
            break;
        }
        case "completed" : {
            filteredTodos = savedTodos.filter(todo => todo.isCompleted)
            break;
        }
        case "uncompleted" : {
            filteredTodos = savedTodos.filter(todo => !todo.isCompleted)
            break;
        }
    }
    createTodos(filteredTodos)
}

function removeTodo(id) {
    let todos = getAllTodos()
    todos = todos.filter(todo => todo.id !== id)
    saveAllTodos(todos)
    filterTodos()
}

function checkTodo(id) {
    let todos = getAllTodos()
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.isCompleted = !todo.isCompleted
            return todo
        }
        return todo
    })
    createTodos(todos)
    saveAllTodos(todos)
    filterTodos()
}

function getAllTodos() {
    return JSON.parse(localStorage.getItem("todos")) || []
}

function saveTodo(todo) {
    const savedTodos = getAllTodos()
    savedTodos.push(todo)
    localStorage.setItem("todos", JSON.stringify(savedTodos))
    return savedTodos
}

function saveAllTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos))
}

function handleEditTodo(id) {
    editSubmitBtn.setAttribute("id", id)
    let todo = getAllTodos().find(todo => todo.id === id)
    modalEditInput.value = todo.title
    openEditModal()
}

function openEditModal() {
    editModalContainer.style.transform = "scale(1)"

}

function closeEditModal() {
    editModalContainer.style.transform = "scale(0)"
    modalEditInput.value = ""
}

function editTodo() {
    let todoId = Number(editSubmitBtn.getAttribute("id"))
    let savedTodos = getAllTodos()
    let todosAfterEdit = savedTodos.map(todo => {
        if (todo.id === todoId) {
            todo.title = modalEditInput.value
            return todo
        }
        return todo
    })
    saveAllTodos(todosAfterEdit)
    closeEditModal()
    filterTodos()
}