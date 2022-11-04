import './style.css'

const form = document.querySelector('.form')
const input = document.querySelector('.input')
const submitBtn = document.querySelector('.submit-btn')
const listTasks = document.querySelector('.list-tasks')

form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => {
    if (input.value.length >= 3) {
        submitBtn.disabled = false
    } else {
        submitBtn.disabled = true
    }
})

function submitFormHandler(event) {
    event.preventDefault()
    if (input.value.length >= 3) {
        const listItem = input.value
        create(listItem)
        input.value = ''
    }
    submitBtn.disabled = true
}

function create(listItem) {
    fetch('https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json', {
        method: 'POST',
        body: listItem,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            getListItems()
        })
}

function getListItems() {
    fetch('https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json')
        .then(response => response.json())
        .then(data => {
            listTasks.innerHTML = ''
            Object.values(data).forEach((item) => {
                let newLi = document.createElement("li");
                newLi.innerHTML = `
                 <label>
                    <input type="checkbox">
                    <span class="text">${item}</span>
                    <span class="close">x</span>
                </label>`;
                listTasks.append(newLi);
            })
        })
}
getListItems()