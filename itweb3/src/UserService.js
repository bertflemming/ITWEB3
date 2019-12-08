export const userService = {
    login,
    logout,
    register,
    isLoggedIn,
    getHighScores,
    getToken
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password: password })
    };

    return fetch('api/user/login', requestOptions)
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

    return fetch('api/user/register', requestOptions).then(handleResponse);
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
    }).catch( e => {
        return {message: e};
    });
}

function getUser(){
  let user = localStorage.getItem('user');
  return JSON.parse(user);
}

function getToken(){
    const user = getUser();
    if(user){
        console.log(user.token);
        return user.token;
    }   
}

function isLoggedIn(){
    const token = getToken();
    if(token){
        let payload = token.split('.')[1];
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