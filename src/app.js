import './style.css'

const form = document.querySelector('.form')
const input = document.querySelector('.input')
const submitBtn = document.querySelector('.submit-btn')
const listTasks = document.querySelector('.list-tasks')
const modalForm = document.querySelector('.modal-form')
const error = document.querySelector('.error')
const authorizationModal = document.querySelector('.authorization-modal')
const deleteModal = document.querySelector('.delete-modal')
const deleteBtnYes = document.querySelector('.delete-btn-yes')
const deleteBtnNo = document.querySelector('.delete-btn-no')

let elementRemoved

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

function editItem(id, listItem) {
    fetch(`https://todo-list-62506-default-rtdb.firebaseio.com/listitem/${id}/text.json`, {
        method: 'PUT',
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

function fetchListItems() {
    fetch(`https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json`)
        .then(response => response.json())
        .then(data => {
            getListItems(data)
        })
}

function fetchListItemsToken(token) {
    if (token) {
        fetch(`https://todo-list-62506-default-rtdb.firebaseio.com/listitem.json?auth=${token}`)
            .then(response => response.json())
            .then(data => {
                getListItems(data)
            })
    } else {
        error.innerHTML = 'Не правильный Email или пароль'
    }
}

function getListItems(data) {
    listTasks.innerHTML = ''
    Object.keys(data).forEach((key) => {
        let newLi = document.createElement("li");
        newLi.innerHTML = `
                 <label class="checkbox-block">
                    <input type="checkbox" 
                    class="checkbox" 
                    data-id="${key}" 
                    ${data[key].done ? 'checked' : ''}>
                    <span class="check"></span>
                    <span class="text">${data[key].text}</span>
                </label>
                <span class="edit-block"></span>
                <span class="edit" data-id="${key}"></span>
                <span class="close" data-id="${key}"></span>`;
        listTasks.append(newLi);
    })
    authorizationModal.classList.remove('active')

}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains("close")) {
        elementRemoved = event.target.getAttribute('data-id')
        deleteModal.classList.add('active')
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains("edit")) {
        let editBlock = event.target.closest('li').querySelector('.edit-block')
        let inputText = event.target.closest('li').querySelector('.text').innerText
        editBlock.innerHTML = `
        <input type="text" class="input-edit" value="${inputText}">
        <span class="save"></span>`
        event.target.closest('li').querySelector('.text').style.display = 'none'
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains("save")) {
        let inputValue = event.target.closest('li').querySelector('.input-edit').value
        editItem(event.target.closest('li').querySelector('.checkbox').getAttribute('data-id'), inputValue)
    }
});

document.addEventListener('change', function(event) {
    if (event.target.classList.contains("checkbox")) {
        done(event.target.getAttribute('data-id'), event.target.checked)
    }
});

deleteBtnNo.addEventListener('click', function () {
    deleteModal.classList.remove('active')
})

deleteBtnYes.addEventListener('click', function () {
    deleteItem(elementRemoved)
    deleteModal.classList.remove('active')
})

modalForm.addEventListener('submit', submitFormHandlerModal)
function submitFormHandlerModal(event) {
    event.preventDefault()
    const email = document.querySelector('.email').value
    const password = document.querySelector('.password').value
    authWithEmailAndPassword(email, password)
        .then(token => fetchListItemsToken(token))
        .catch(error => console.log(error))
}

function authWithEmailAndPassword(email, password) {
    const apiKey = "AIzaSyDFoQCvbHY-_joFzkFhZ4L2R_Xb6usp2dU"
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.idToken)
        .catch(error => console.log(error))
}