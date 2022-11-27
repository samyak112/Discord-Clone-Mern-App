import React from 'react'
import { useSelector } from 'react-redux'
import main_chatcss from '../main_chat/main_chat.module.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TagIcon from '@mui/icons-material/Tag';

function Main_chat() {
  const channel_id = useSelector(state => state.current_page.page_id)
  const channel_name = useSelector(state => state.current_page.page_name)
  return (
    <div className={main_chatcss.main}>
      <div id={main_chatcss.top}>
        <div id={main_chatcss.welcome_part}>
          <div id={main_chatcss.tag}> <TagIcon fontSize='large'></TagIcon></div>
          <div className={main_chatcss.welcome_comps} id={main_chatcss.welcome_comp_1}>Welcome to #{channel_name}</div>
          <div className={main_chatcss.welcome_comps} id={main_chatcss.welcome_comp_2}>This is the start of the #{channel_name} channel</div>
        </div>
        <div id={main_chatcss.chat_part}></div>
      </div>

      <div id={main_chatcss.bottom}>
        <div id={main_chatcss.message_input}>
          <AddCircleIcon htmlColor='#B9BBBE'></AddCircleIcon>
          <input type="text" placeholder={`Message #${channel_name}`} />
        </div>
      </div>
    </div>
  )
}

export default Main_chat