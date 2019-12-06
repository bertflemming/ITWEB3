export const userService = {
    login,
    logout,
    register,
    isLoggedIn,
    getHighScores
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch('/user/login', requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('/user/register', requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function getUser(){
  let user = localStorage.getItem('user');
  return user;
}

function isLoggedIn(){
    const user = getUser();
    if(user)
        if(user.token){
            let payload = user.token.split('.')[1];
            payload = window.atob(payload);
            let user = JSON.parse(payload);
            return (user.exp > Date.now() / 1000);
        }
    return false;
}

function getHighScores(){
  console.log("Called get highscores")
  return [1, 2, 3, 4, 5];
}