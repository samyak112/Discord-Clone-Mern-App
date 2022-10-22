import React, { useState } from 'react'
import maincss from '../main/main.module.css'
import SearchIcon from '@mui/icons-material/Search';
import profile_pic from '../../images/profile_pic.jpg'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Main() {
    const [idtag, setidtag] = useState('#1234')
    const chat = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Message
        </Tooltip>
      );
      
      const threedots = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          More
        </Tooltip>
      );

  return (
    <div id={maincss.main}>
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
                ONLINE-1
            </div>
        </div>

        {/* this is the layout of  users which are online at the moment */}
        <div id={maincss.online_users_wrap}>
            <div className={maincss.online_users}>
                <div className={maincss.online_comps} id={maincss.item_1_wrap}>
                    <div id={maincss.item_1}>
                        <img src={profile_pic} alt="" />
                    </div>
                </div>
                <div className={maincss.online_comps} id={maincss.item_2}>
                    <div className={maincss.item_2_comps}>Spidy</div>
                    <div className={maincss.item_2_comps} id={maincss.item_2_2}>Online</div>
                </div>
                <div className={maincss.online_comps} id={maincss.item_3}>
                    <div className={maincss.item_3_comps_wrap}>
                        <div className={maincss.item_3_comps}>
                        <OverlayTrigger
                            placement="top"
                            overlay={chat}>
                            
                            <ChatBubbleIcon></ChatBubbleIcon>

                        </OverlayTrigger>
                        </div>
                    </div>
                    <div className={maincss.item_3_comps_wrap}>
                    <div className={maincss.item_3_comps}>
                        <OverlayTrigger
                            placement="top"
                            overlay={threedots}>
                            
                            <MoreVertIcon></MoreVertIcon>

                        </OverlayTrigger>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Main