function isAndroid() {
  return (
    window.Capacitor &&
    typeof window.Capacitor.getPlatform === "function" &&
    window.Capacitor.getPlatform() === "android"
  );
}

const todoListEl = document.getElementById("todoList");

//add todo box
function createTodoBox()
{
    const todoBox = document.createElement("div");
    todoBox.className = "box";
    todoBox.innerHTML = `
        <input type="text" name="todoTitle" id="todoTitle" placeholder="Enter todo title" class=" todo-title mb-3">
        <hr>

        <div class="todo-items"></div>

        <div class="is-flex is-justify-content-end mt-4">
            <button class="button is-small is-link mx-1 add-btn">
                Add
            </button>
            <button class="button is-small is-danger delete-box">
                Delete
            </button>
        </div>
    `;

    // Add event listener for "Add" button
    const addBtn = todoBox.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
        const todoItemsContainer = todoBox.querySelector(".todo-items");
        const newItem = document.createElement("div");
        newItem.className = "is-flex p-2 is-justify-content-between mb-2";
        newItem.innerHTML = `
            <input type="text" class=" todo-input is-small mr-2" placeholder="Todo item">
            <button class="button is-small is-danger delete-item">Remove</button>
        `;

        // Add event listener for "Delete" button of the item
        const deleteItemBtn = newItem.querySelector(".delete-item");
        deleteItemBtn.addEventListener("click", () => {
            newItem.remove();
            saveTodo();
        });

        todoItemsContainer.appendChild(newItem);
        saveTodo();
    });

    // Add event listener for "Delete Box" button
    const deleteBoxBtn = todoBox.querySelector(".delete-box");
    deleteBoxBtn.addEventListener("click", () => {
        todoBox.remove();
    });

    todoListEl.appendChild(todoBox);

    todoBox.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", saveTodo);
    });

    return todoBox;

}

function saveTodo() {
    const todoBoxes = document.querySelectorAll(".box");
    const todos = [];

    todoBoxes.forEach(box => {
        const titleInput = box.querySelector("input[name='todoTitle']");
        const title = titleInput.value.trim();

        if (title) {
            const items = [];
            const itemInputs = box.querySelectorAll(".todo-items input");

            itemInputs.forEach(input => {
                const itemText = input.value.trim();
                if (itemText) {
                    items.push(itemText);
                }
            });

            todos.push({ title, items });
        }
    });

    localStorage.setItem("keepit_todos", JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("keepit_todos")) || [];
    todos.forEach(todo => {
        const todoBox = createTodoBox();
        const titleInput = todoBox.querySelector("input[name='todoTitle']");
        titleInput.value = todo.title;

        const itemsContainer = todoBox.querySelector(".todo-items");
        todo.items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "is-flex p-2 is-justify-content-between mb-2";
            itemDiv.innerHTML = `
                <input type="text" class=" todo-items is-small mr-2" placeholder="Todo item" value="${item}">
                <button class="button is-small is-danger delete-item">Remove</button>
            `;

            // Add event listener for "Delete" button of the item
            const deleteItemBtn = itemDiv.querySelector(".delete-item");
            deleteItemBtn.addEventListener("click", () => {
                itemDiv.remove();
            });

            itemsContainer.appendChild(itemDiv);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
});