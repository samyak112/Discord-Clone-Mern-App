import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Main_dashboard from '../dashboard_components/main_dashboard/Main_dashboard';
import Main_chat from '../chat_components/main_chat/Main_chat';


function Main({new_req_recieved,user_relations}) {

    const {server_id} = useParams()
    
    
  return (
    <>
        {
            server_id=='@me' ||server_id==undefined?<Main_dashboard user_relations={user_relations}></Main_dashboard>:<Main_chat></Main_chat>

        }
    </>
    
  )
}

export default Main