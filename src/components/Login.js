import { signInWithGoogle } from "../firebase";

import { useEffect } from "react";

import "../App.css";

const Login = () => {

    useEffect(() => {
        signInWithGoogle();
    }, [])

    return (
        <div>
            <button className="button" onClick={signInWithGoogle}>
                <i className="fab fa-google"></i>Sign in with google
            </button>
        </div>
    );
};

export default Login;