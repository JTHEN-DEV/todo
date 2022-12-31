import { useState, useEffect } from "react";

import Login from "./components/Login";
import App from "./App";
import firebase from "./firebase";

import "./App.css";

function Container() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return <div className="">{user ? <App user={user}/> : <Login />}</div>;
}

export default Container;