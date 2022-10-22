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
        console.log('is this even running?')
        const data = await res.json();
        
        if(data.status == 201){
            {dispatch(increment())}
            console.log('came here')
        }
        else{
            {dispatch(decrement())}
            console.log('naah came here')
        }

    }

    // made a use effect here so that whenever this file is invoked through app.js then this function must runs otherwise it will have the default values in it
    
    useEffect(()=>{
        private_routes()
    })

    console.log(auth_check,'this is checking one')

    if (auth_check == true) {
        if(props.children.type.name == 'Login'){
            console.log('nayi condition me')
            Navigate('/channels/@me')
            return <Dashboard/>
        }
        else{
            console.log('i also came here')
            return props.children
        }
       
    } 

    else {
        console.log('ok not authorized pip pip')
        // Navigate('/')
        return <Login/>
        }
}

export default Auth