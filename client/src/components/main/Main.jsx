import React, { useEffect, useState } from 'react'
import maincss from '../main/main.module.css'
import SearchIcon from '@mui/icons-material/Search';
// import profile_pic from '../../images/profile_pic.jpg'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector} from 'react-redux'
import online_wumpus from '../../images/online.svg'
import friends_wumpus from '../../images/friends_2.svg'
import pending_wumpus from '../../images/pending.svg'
import blocked_wumpus from '../../images/blocked.svg'
import add_friend_wumpus from '../../images/friends_2.svg'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';


function Main({new_req_recieved,user_relations}) {
    const option_check = useSelector(state => state.selected_option.value)
    const option_name_check = useSelector(state => state.selected_option.option_name)
    const option_status = useSelector(state => state.selected_option.status)
    const option_text = useSelector(state => state.selected_option.text)

    const [button_state, setbutton_state] = useState(true)
    const [option_data, setoption_data] = useState([{username:'' , tag:'' , profile_pic:'' , status:''}])
    const [input, setinput] = useState('')
    let images_arr = [online_wumpus , friends_wumpus , pending_wumpus , blocked_wumpus , add_friend_wumpus]
    const [image, setimage] = useState(images_arr[0])
    const [alert, setalert] = useState({style:'none' , message:'none'})

    const{incoming_reqs , outgoing_reqs , friends} = user_relations
    let pending_reqs = [...incoming_reqs , ...outgoing_reqs]

    useEffect(()=>{
        if(option_check==2){
            setoption_data(pending_reqs)
        }
        else if(option_check==1){
            setoption_data(friends)
        }
        console.log('this is the latest use effect',pending_reqs)
    },[user_relations,option_check])

    // console.log(option_data , 'this is option data')

    const button_clicked = async(message,friend_data) => {
        console.log('this button is running')
    
              const res = await fetch('/process_req',{
                  method:'POST',
                  headers:{
                      'Content-Type' : 'application/json',
                      'x-auth-token' : localStorage.getItem('token'),
                  },
                  body:JSON.stringify({
                      friend_data:friend_data,message:message
                  }),
                  
              })
              const data = await res.json();
              console.log(data)

              if(data.status == 200 || data.status == 404){
                new_req_recieved(1)
                console.log('this is running')
                // this is to update props and send the value back to parent element to update some states
              }
    
            //   if(data.status === 404 || data.status === 201 || data.status === 202 || data.status === 203){
            //     setalert({style:'flex' , message:data.message})
            //   }

            //   if(data.status == 201 || data.status == 203){
            //     new_req_recieved(1)
            //     // this is to update props and send the value back to parent element to update some states
            //   }
       };

    function buttons(message,Icon,friend_data){
        return(
        <div className={maincss.item_3_comps_wrap} onClick={()=>{button_clicked(message,friend_data)}}>
            <div className={maincss.item_3_comps}>
            <OverlayTrigger
                placement="top"
                overlay={tooltips(message)}>
                    {<Icon/>}
            </OverlayTrigger>
            </div>
        </div>
        )
    }

    const add_friend = async(e) => {
        e.preventDefault();
    
              const res = await fetch('/add_friend',{
                  method:'POST',
                  headers:{
                      'Content-Type' : 'application/json',
                      'x-auth-token' : localStorage.getItem('token'),
                  },
                  body:JSON.stringify({
                      friend:input
                  }),
                  
              })
              const data = await res.json();
    
              if(data.status === 404 || data.status === 201 || data.status === 202 || data.status === 203){
                setalert({style:'flex' , message:data.message})
              }

              if(data.status == 201 || data.status == 203){
                new_req_recieved(1)
                // this is to update props and send the value back to parent element to update some states
              }
       };

    useEffect(()=>{
        if(input.length>=1){
            setbutton_state(false)
        }
        else{
            setbutton_state(true)
        }
    },[input])


    function handle_input(e){
        setinput(e.target.value)
        setalert({...alert , style:'none'})
        let current_key = e.nativeEvent.data;
        let input_size = input.length;
        // if(/[0-9]/.test(e.nativeEvent.data)==true && e.nativeEvent.data!=null){
            if(input[input_size-1]=='#' &&  /[0-9]/.test(current_key)==false && current_key!=null){
                // i had to add this null condition because for some reason whenever i try to press backspace with only the regex and specifically the regex for lowercase letters , the conidition was getting true for even backspace
                setinput(input)
            }
            else if((input[input_size-5]=='#' &&  /[a-zA-z0-9]/.test(current_key)==true  && current_key!=null) || (input[input_size-5]=='#' && /[^a-zA-z0-9]/.test(current_key)==true && current_key!=null)){
                setinput(input)
            }
    }

    useEffect(()=>{
        setimage(images_arr[option_check])
    },[option_check])
    
    const tooltips = (value,props) => (
        <Tooltip id="button-tooltip" {...props}>
          {value}
        </Tooltip>
      );
    
  return (
    <>
    {
        option_status==false? 
        <>
        {
            option_check==4?
            <>
                <div className={maincss.add_friend_wrap}>
                    <div className={maincss.add_friend}>
                        <div id={maincss.add_friend_1} className={maincss.add_friend_comps}>ADD FRIEND</div>
                        <div id={maincss.add_friend_2} className={maincss.add_friend_comps}>You can add a friend with their Discord Tag. It's cAsE-sEnSitIvE!</div>
                        <div id={maincss.add_friend_3} className={maincss.add_friend_comps}>
                            <input 
                            onChange={handle_input} 
                            value={input} type="text" placeholder='Enter a Username#0000' />
                            <button onClick={add_friend} disabled={button_state} id={maincss.add_friend_3_button}>Send Friend Request</button>
                        </div>
                        {/* this will work when i put display flex instead of display none for this */}
                        <div id={maincss.friend_req_response} style={{ display: alert.style }}>
                            {alert.message}
                        </div>
                    </div>
                    <div className={maincss.add_friend_image}>
                        <div className={maincss.offline_image}>
                            <img src={image} alt="" />
                            {option_text}
                        </div>
                    </div>
                </div>
            </>
            :
            <div className={maincss.main} style={{ display: 'flex' }}>
                <div className={maincss.offline_image}>
                    <img src={image} alt="" />
                    {option_text}
                </div>
            </div>
        }
        
        </>
        :
        <div className={maincss.main}>
        {/* search bar */}
        <div id={maincss.search_wrap}>
            <div id={maincss.search}>
                <input type="text" placeholder='Search' />
                <div id={maincss.search_icon}>
                    <SearchIcon fontSize='medium'></SearchIcon>
                </div>
            </div>
        </div>

        <div id={maincss.online_users_count_wrap}>
            <div id={maincss.online_users_count}>
                {option_name_check}-{option_data.length}
            </div>
        </div>

        {/* this is the layout of  users which are in the selected option at the moment */}

        {
            option_data.map((elem)=>{
            return(
                <div id={maincss.online_users_wrap}>
                <div className={maincss.online_users}>
                    <div className={maincss.online_comps} id={maincss.item_1_wrap}>
                        <div id={maincss.item_1}>
                            <img src={elem.profile_pic} alt="" />
                        </div>
                    </div>
                    <div className={maincss.item_2_main}>
                        <div className={maincss.online_comps} id={maincss.item_2}>
                            <div className={maincss.item_2_comps}>{elem.username}</div>
                            <div className={maincss.item_2_comps} id={maincss.item_2_2}>Online</div>
                        </div>
                        <div className={maincss.online_comps} id={maincss.item_2_3}>
                            <div className={maincss.item_2_comps} id={maincss.item_2_3_1}>#{elem.tag}</div>
                        </div>
                    </div>
                    <div className={maincss.online_comps} id={maincss.item_3}>
                        {
                            option_check==2?
                            <>{
                                elem.status=='incoming'?
                                <>
                                    {buttons('Accept',DoneIcon,elem)}
                                    {buttons("Ignore",CloseIcon,elem)}
                                </>:
                                <>
                                    {buttons("Cancel",CloseIcon,elem)}
                                </>
                            }
                            </>:
                            <>{
                                option_check==3?
                                <>
                                    {buttons("Unblock",PersonRemoveIcon,elem)}
                                </>:
                                <>
                                    {buttons("Message" ,ChatBubbleIcon,elem)}
                                    {buttons("More" , MoreVertIcon,elem)}
                                </>
                            }
                            </>
                        }
                    </div>
                </div>
            </div>
            )
            })
        }
    </div>
    }
    </>
    
  )
}

export default Main