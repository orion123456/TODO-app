export function authWithEmailAndPassword(email, password) {
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
