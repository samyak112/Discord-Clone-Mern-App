import React, { useEffect , useState} from 'react'
import dashboardcss from '../dashboard/dashboard.module.css'
import Navbar from '../navbar/Navbar'
import Navbar_2 from '../navbar_2/Navbar_2';
import Top_nav from '../top_nav/Top_nav'
import Main from '../main/Main';
import Right_nav from '../right_nav/Right_nav';

function Dashboard() {  
  const [user_data, setuser_data] = useState({incoming_reqs:'', outgoing_reqs:'', friends:''})
  const [status, setstatus] = useState({pending_status:false , online_status:false , all_friends_status:false , blocked_staus:false})
  const [new_req, setnew_req] = useState(1)

  const new_req_recieved = (new_req_value) =>{
    setnew_req(new_req+new_req_value)
  }

  const user_relations = async() => {
    const res = await fetch('/user_relations',{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json',
            'x-auth-token' : localStorage.getItem('token'),
        },
    })
    const data = await res.json();
    
    const {incoming_reqs , outgoing_reqs , friends} = data
    console.log(data , 'this is data')
    let pending = incoming_reqs.length + outgoing_reqs.length
    let status_2 = {pending_status:false , online_status:false , all_friends_status:false , blocked_staus:false}
    // had to make an object inside because if i directly try to use setstate then it will change the values simultaneously as there are many conditions and usestate is not updated in one instant so the default value will be in it for the time being so it wont work

    if(pending != 0){
      status_2 = {...status_2 , pending_status:true}
    }
    else{
      status_2 = {...status_2 , pending_status:false}
    }

    if(friends.length != 0){
      status_2 = {...status_2 , all_friends_status:true}
    }
    else{
      status_2 = {...status_2 , all_friends_status:false}
    }

    setstatus(status_2)
    setuser_data({incoming_reqs:incoming_reqs , outgoing_reqs:outgoing_reqs , friends:friends})

   };


   useEffect(()=>{
    console.log('running user_relations from dashboard')
    user_relations()
  },[new_req])



  return (
    <div className={dashboardcss.main}>
        <div className={dashboardcss.components} id={dashboardcss.component_1}><Navbar/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_2}><Navbar_2/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_3}><Top_nav button_status={{pending:status.pending_status , all_friends : status.all_friends_status}}/>
        </div>
        <div className={dashboardcss.components} id={dashboardcss.component_4}><Main new_req_recieved = {new_req_recieved} user_relations={{
          incoming_reqs:user_data.incoming_reqs,
          outgoing_reqs:user_data.outgoing_reqs, 
          friends:user_data.friends}}/>
        </div>
        <div className={dashboardcss.components} id={dashboardcss.component_5}><Right_nav/></div>
      
    </div>
  )
}

export default Dashboard