import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import valid_css from '../navbar_2_chat_valid/valid_navbar.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Server_details from '../server_details/Server_details';
import { useDispatch, useSelector } from 'react-redux';
import { change_page_id , server_members , change_page_name} from '../../../Redux/current_page';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';
import Modal from 'react-bootstrap/Modal';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


function Navbar2_chat_valid() {
  const url = process.env.REACT_APP_URL

   // user details from redux
   const username = useSelector(state => state.user_info.username)
   const tag = useSelector(state => state.user_info.tag)
   const profile_pic = useSelector(state => state.user_info.profile_pic)
   const id = useSelector(state => state.user_info.id)
 
   const front_end_url = process.env.REACT_APP_front_end_url
 
   // add channel modal states
   const [show, setShow] = useState(false);
   const handleClose = () => {
     setShow(false)
     setcategory_creation_progress({text:'Create Category' , disabled:false})
   };
   const handleShow = () => setShow(true);
 
   // invite people modal
   const [inviteshow, setinviteshow] = useState(false);
   const handle_inviteClose = () => setinviteshow(false);
   const handle_inviteShow = () => setinviteshow(true);
 
 
   const {server_id} = useParams()
 
   // this use state is triggered when we delete a server and we set it to false so that user goes back to dashboard and it value is updated by socket for other members in the server and with the fetch request to update it for the author
   // const [server_exists, setserver_exists] = useState(true)
 
   const [show_options, setshow_options] = useState('none')
   const [server_details, setserver_details] = useState([])
   const page_id = useSelector(state => state.current_page.page_id)
   const server_role = useSelector(state => state.current_page.role)
   const dispatch = useDispatch()
   const option_state = useSelector(state => state.selected_option.updated_options)
   const [new_category_name, setnew_category_name] = useState('')
   const [category_creation_progress, setcategory_creation_progress] = useState({text:'Create Category' , disabled:false})
   const [invite_link, setinvite_link] = useState('')
 
   const [new_req, setnew_req] = useState(1)
   const new_req_recieved = (new_req_value) =>{
     setnew_req(new_req+new_req_value)
   }
   
   const create_invite_link = async()=>{
     const res = await fetch(`${url}/create_invite_link`,{
       method:'POST',
       headers:{
           'Content-Type' : 'application/json',
           'x-auth-token' : localStorage.getItem('token'),
       },
         body:JSON.stringify({
           inviter_name:username , inviter_id:id , server_name:server_details.server_name , server_id:server_id , server_pic:server_details.server_pic
       }),
   })
   const data = await res.json();
   if(data.status==200){
     setinvite_link(`${front_end_url}/invite/${data.invite_code}`)
   }
   }
 
   const delete_server = async()=>{
     const res = await fetch(`${url}/delete_server`,{
       method:'POST',
       headers:{
           'Content-Type' : 'application/json',
           'x-auth-token' : localStorage.getItem('token'),
       },
         body:JSON.stringify({
           server_id
       }),
   })
   const data = await res.json();
   if(data.status==200){
     console.log('server deleted')
   }
   }
 
   const leave_server = async()=>{
     const res = await fetch(`${url}/leave_server`,{
       method:'POST',
       headers:{
           'Content-Type' : 'application/json',
           'x-auth-token' : localStorage.getItem('token'),
       },
         body:JSON.stringify({
           server_id
       }),
   })
   const data = await res.json();
   }
 
 
   function change_options_visibility(){
     if(show_options=='none'){
       setshow_options('block')
     }
     else{
       setshow_options('none')
     }
   }
 
   const server_info = async() => {
     
     const res = await fetch(`${url}/server_info`,{
         method:'POST',
         headers:{
             'Content-Type' : 'application/json',
             'x-auth-token' : localStorage.getItem('token'),
         },
         body:JSON.stringify({
           server_id
         }),
         
     })
     const data = await res.json();
     setserver_details(data[0])
     
     dispatch(change_page_name(data[0].categories[0].channels[0].channel_name))
     dispatch(change_page_id(data[0].categories[0].channels[0]._id))
     dispatch(server_members(data[0].users))
   };
 
   const create_category = async() => {
     
   const res = await fetch(`${url}/add_new_category`,{
       method:'POST',
       headers:{
           'Content-Type' : 'application/json',
           'x-auth-token' : localStorage.getItem('token'),
       },
       body:JSON.stringify({
         category_name:new_category_name , server_id:server_id
       }),
       
   })
   const data = await res.json();
   if(data.status==200){
     server_info()
     handleClose()
   }
   };
 
   useEffect(()=>{
     server_info()
   },[server_id , new_req])  


  return (
    <>
      
      <div className={valid_css.options_wrap} style={{display:show_options}}>
            <div className={valid_css.options} onClick={()=>{ 
              if(invite_link.length==0){create_invite_link();}  setinviteshow(true)
              }}>
              <div className={valid_css.options_comps}>Invite People</div>
              <div className={valid_css.options_comps}><PersonAddIcon fontSize='small'></PersonAddIcon></div>
            </div>
            <div className={valid_css.options} onClick={handleShow}>
              <div className={valid_css.options_comps}>Create Category</div>
              <div className={valid_css.options_comps}><CreateNewFolderIcon fontSize='small'></CreateNewFolderIcon></div>
            </div>
            
            {
              server_role=='author'?
              <div className={valid_css.options} onClick={delete_server}  style={{color:'#e7625f'}}>
                <div className={valid_css.options_comps}>Delete Server</div>
                <div className={valid_css.options_comps}><DeleteForeverIcon fontSize='small'></DeleteForeverIcon></div>
              </div>:
              <div className={valid_css.options} style={{color:'#e7625f'}}>
                
                <div className={valid_css.options_comps}>Leave Server</div>
                <div className={valid_css.options_comps}><LogoutIcon fontSize='small'></LogoutIcon></div>
              </div>
            }
          </div>
      <div className={`${valid_css.server_name} ${valid_css.nav_2_parts}`} onClick={change_options_visibility}>
          {server_details.server_name}
          {
            show_options=='none'?
            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
            :
            <CloseIcon fontSize='small'></CloseIcon>
          }
      </div>
      {
        server_details.length==0?
        <></>
        :
        <div className={`${valid_css.category_info} ${valid_css.nav_2_parts}`}>
          {
            server_details.categories.map((elem,key)=>{
              return(
                <>
                <Server_details new_req_recieved = {new_req_recieved} elem={elem}></Server_details>
                </>
              )
            })
          }
            
        </div>
        
        
      }

      {/* Create new channel modal */}
      <Modal show={show} centered onHide={handleClose} id={valid_css.modal_main_wrap}>
        <div className={valid_css.modal_main}>

          {/* Header */}
          <div className={valid_css.modal_comps} id={valid_css.modal_header}>
              <div id={valid_css.primary_heading} className={valid_css.header_comps}>Create Category</div>
          </div>

          {/* Enter channel Name */}
          <div className={valid_css.modal_comps} id={valid_css.channel_name}>
            <div>CATEGORY NAME</div>
            <div className={valid_css.input_div}>
              <input type="text" value={new_category_name} onChange={(e)=>{setnew_category_name(e.target.value)}} placeholder='new-channel' />
            </div>
          </div>

          {/* Buttons */}
          <div className={valid_css.modal_comps} id={valid_css.modal_buttons}>
            <div>
              <button className={valid_css.buttons} id={valid_css.cancel_button} disabled={category_creation_progress.disabled} onClick={handleClose}>Cancel</button>
            </div>
            <div >
              <button className={valid_css.buttons} disabled={category_creation_progress.disabled} onClick={()=>{create_category(); setcategory_creation_progress({...category_creation_progress ,text:'Creating' , disabled:true})}} id={valid_css.create_button}>{category_creation_progress.text}</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* invite people modal */}
      <Modal
          show={inviteshow}
          onHide={handle_inviteClose}
          backdrop="static"
          keyboard={false}
          centered
          id={valid_css.invite_modal}
        >
          <div className={`${valid_css.invite_modal_main} ${valid_css.modal_main} `}>
            <CloseIcon id={valid_css.close_button} onClick={handle_inviteClose}></CloseIcon>
            <div className={valid_css.invite_modal_comps} id={valid_css.invite_top_part}>
              Invite friends to {server_details.server_name}
            </div>
            <div className={valid_css.invite_modal_comps} id={valid_css.invite_bottom_part}>
              SEND A SERVER INVITE LINK TO A FRIEND
              <div id={valid_css.invite_link_wrap}>
                <div id={valid_css.invite_link_value}>
                  {
                    invite_link.length==0?
                    <Typography component="div" key={'caption'} variant={'caption'}>
                      <Skeleton />
                    </Typography>
                    
                  :
                  invite_link

                  }
                  
                </div>
                <div id={valid_css.copy_button_wrap}>
                  <button id={valid_css.copy_button}>Copy</button>
                </div>
              </div>
            </div>

          </div>
        </Modal>
    </>
  )
}

export default Navbar2_chat_valid