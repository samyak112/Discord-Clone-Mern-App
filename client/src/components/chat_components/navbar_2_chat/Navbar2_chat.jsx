import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import navbar2_chatcss from '../navbar_2_chat/navbar2_chatcss.module.css'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Server_details from '../server_details/Server_details';
import { useDispatch, useSelector } from 'react-redux';
import { change_page_id , server_members , change_page_name} from '../../../Redux/current_page';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';
import Modal from 'react-bootstrap/Modal';


function Navbar2_chat() {
  const url = process.env.REACT_APP_URL

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false)
    setcategory_creation_progress({text:'Create Category' , disabled:false})
  };
  const handleShow = () => setShow(true);

  const {server_id} = useParams()
  const [show_options, setshow_options] = useState('none')
  const [server_details, setserver_details] = useState([])
  const page_id = useSelector(state => state.current_page.page_id)
  const server_role = useSelector(state => state.current_page.role)
  const dispatch = useDispatch()
  const option_state = useSelector(state => state.selected_option.updated_options)
  const [new_category_name, setnew_category_name] = useState('')
  const [category_creation_progress, setcategory_creation_progress] = useState({text:'Create Category' , disabled:false})

  const [new_req, setnew_req] = useState(1)
  const new_req_recieved = (new_req_value) =>{
    setnew_req(new_req+new_req_value)
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
    <div>
      <div className={navbar2_chatcss.options_wrap} style={{display:show_options}}>
            <div className={navbar2_chatcss.options}>
              <div className={navbar2_chatcss.options_comps}>Invite People</div>
              <div className={navbar2_chatcss.options_comps}><PersonAddIcon fontSize='small'></PersonAddIcon></div>
            </div>
            <div className={navbar2_chatcss.options} onClick={handleShow}>
              <div className={navbar2_chatcss.options_comps}>Create Category</div>
              <div className={navbar2_chatcss.options_comps}><CreateNewFolderIcon fontSize='small'></CreateNewFolderIcon></div>
            </div>
            
            {
              server_role=='author'?
              <div className={navbar2_chatcss.options} style={{color:'#e7625f'}}>
                <div className={navbar2_chatcss.options_comps}>Delete Server</div>
                <div className={navbar2_chatcss.options_comps}><DeleteForeverIcon fontSize='small'></DeleteForeverIcon></div>
              </div>:
              <div className={navbar2_chatcss.options} style={{color:'#e7625f'}}>
                <div className={navbar2_chatcss.options_comps}>Leave Server</div>
                <div className={navbar2_chatcss.options_comps}><LogoutIcon fontSize='small'></LogoutIcon></div>
              </div>
            }
          </div>
      <div className={navbar2_chatcss.server_name} onClick={change_options_visibility}>
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
        server_details.categories.map((elem,key)=>{
          return(
            <>
            <Server_details new_req_recieved = {new_req_recieved} elem={elem}></Server_details>
            </>
          )
        })
        
      }

      <Modal show={show} centered onHide={handleClose} id={navbar2_chatcss.modal_main_wrap}>
        <div className={navbar2_chatcss.modal_main}>

          {/* Header */}
          <div className={navbar2_chatcss.modal_comps} id={navbar2_chatcss.modal_header}>
              <div id={navbar2_chatcss.primary_heading} className={navbar2_chatcss.header_comps}>Create Category</div>
          </div>

          {/* Enter channel Name */}
          <div className={navbar2_chatcss.modal_comps} id={navbar2_chatcss.channel_name}>
            <div>CATEGORY NAME</div>
            <div className={navbar2_chatcss.input_div}>
              <input type="text" value={new_category_name} onChange={(e)=>{setnew_category_name(e.target.value)}} placeholder='new-channel' />
            </div>
          </div>

          {/* Buttons */}
          <div className={navbar2_chatcss.modal_comps} id={navbar2_chatcss.modal_buttons}>
            <div>
              <button className={navbar2_chatcss.buttons} id={navbar2_chatcss.cancel_button} disabled={category_creation_progress.disabled} onClick={handleClose}>Cancel</button>
            </div>
            <div >
              <button className={navbar2_chatcss.buttons} disabled={category_creation_progress.disabled} onClick={()=>{create_category(); setcategory_creation_progress({...category_creation_progress ,text:'Creating' , disabled:true})}} id={navbar2_chatcss.create_button}>{category_creation_progress.text}</button>
            </div>
          </div>
        </div>
      </Modal>
      
    </div>
  )
}

export default Navbar2_chat