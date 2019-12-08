import React from 'react';
import {userService} from './UserService';

class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
        props.setLoggedIn();

    }

    render() {
        userService.logout();
        return (
            <div>
                <p>You have been logged out</p>
            </div>
        );
    }
}

export default LogoutPage;