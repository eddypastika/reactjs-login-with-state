import React, {useState, useEffect, useReducer, useContext, useRef} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
        return {value: action.value, isValid: action.value.includes("@")}
    }
    if (action.type === "INPUT_BLUR") {
        return {value: state.value, isValid: state.value.includes("@")}
    }
    return {value: "", isValid: false};
};

const passwordReducer = (state, action) => {
        if (action.type === "USER_INPUT") {
            return {
                value: action.value, isValid: action.value.trim().length > 6
            }
        }
        if (action.type === "INPUT_BLUR") {
            return {value: state.value, isValid: state.value.trim().length > 6}
        }
        return {value: "", isValid: false};
    }
;

const Login = () => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);
    const authCtx = useContext(AuthContext);

    const [emailState, dispatchEmail] = useReducer(emailReducer, {value: "", isValid: null});
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: "", isValid: null});

    const {isValid: emailIsValid} = emailState;
    const {isValid: passwordIsValid} = passwordState;

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    useEffect(() => {
        const idTimeout = setTimeout(() => {
            console.log("Side effect Run!")
            setFormIsValid(
                emailIsValid && passwordIsValid
            );
        }, 500);

        return () => { // cleanup func
            console.log("cleanup!")
            clearTimeout(idTimeout);
        }

    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event) => {
        dispatchEmail({type: "USER_INPUT", value: event.target.value})
        // setFormIsValid(
        //     event.target.value.includes('@') && passwordState.isValid
        // );
    };

    const passwordChangeHandler = (event) => {
        dispatchPassword({type: "USER_INPUT", value: event.target.value})
        // setFormIsValid(
        //     emailState.isValid && event.target.value.trim().length > 6
        // );
    };

    const validateEmailHandler = () => {
        dispatchEmail({type: "INPUT_BLUR"});
    };

    const validatePasswordHandler = () => {
        dispatchEmail({type: "INPUT_BLUR"});
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            authCtx.onLogin(emailState.value, passwordState.value);
        } else if (!emailIsValid) {
            emailInputRef.current.focus();
        } else {
            passwordInputRef.current.focus();
        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    label="E-Mail"
                    isValid={emailIsValid}
                    value={emailState.value}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />
                <Input
                    ref={passwordInputRef}
                    id="password"
                    type="password"
                    label="Password"
                    isValid={passwordIsValid}
                    value={passwordState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
