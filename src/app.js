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
        const listItem = {
            text: input.value,
            done: false
        }
        create(listItem)
        input.value = ''
    }
    submitBtn.disabled = true
}

function create(listItem) {
    fetch('https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json', {
        method: 'POST',
        body: JSON.stringify(listItem),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            fetchListItems()
        })
        .catch(error => {
            console.log({error})
        })
}

function done(id, listItem) {
    fetch(`https://todo-list-62506-default-rtdb.firebaseio.com/listitem/${id}/done.json`, {
        method: 'PUT',
        body: JSON.stringify(listItem),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {

        })
        .catch(error => {
            console.log({error})
        })
}

function deleteItem(id) {
    fetch(`https://todo-list-62506-default-rtdb.firebaseio.com/listitem/${id}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            fetchListItems()
        })
}

function fetchListItems() {
    fetch('https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json')
        .then(response => response.json())
        .then(data => {
            listTasks.innerHTML = ''
            Object.keys(data).forEach((key) => {
                let newLi = document.createElement("li");
                let checked = `<input type="checkbox" class="checkbox" data-id="${key}" checked>`
                let notChecked = `<input type="checkbox" class="checkbox" data-id="${key}">`
                newLi.innerHTML = `
                 <label class="checkbox-block">
                    ${data[key].done ? checked : notChecked}
                    <span class="check"></span>
                    <span class="text">${data[key].text}</span>
                </label>
                <span class="close" data-id="${key}"></span>`;
                listTasks.append(newLi);
            })
        })
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains("close")) {
        deleteItem(event.target.getAttribute('data-id'))
    }
});

document.addEventListener('change', function(event) {
    if (event.target.classList.contains("checkbox")) {
        done(event.target.getAttribute('data-id'), event.target.checked)
    }
});

fetchListItems()