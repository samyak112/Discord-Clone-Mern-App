import { useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../Redux/counterSlice'
import Login from '../Login/Login';
import Dashboard from '../dashboard/Dashboard'
import { useState } from 'react';


const Auth = (props) => {
    const Navigate = useNavigate();
    // reading data from redux store
    const auth_check = useSelector(state => state.isauthorized.value)
    const dispatch = useDispatch();


    const private_routes = async() =>{
        const res = await fetch('/verify_route',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
                'x-auth-token':localStorage.getItem('token')
            }
        })
        const data = await res.json();
        
        if(data.status == 201){
            {dispatch(increment())}
        }
        else{
            {dispatch(decrement())}
        }

    }

    // made a use effect here so that whenever this file is invoked through app.js then this function must runs otherwise it will have the default values in it
    
    useEffect(()=>{
        private_routes()
    })


    if (auth_check == true) {
        if(props.children.type.name == 'Login'){
            Navigate('/channels/@me')
            return <Dashboard/>
        }
        else{
            return props.children
        }
       
    } 

    else {
        // Navigate('/')
        return <Login/>
        }
}

export default Auth