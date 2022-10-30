import React, { useEffect } from 'react'
import topnavcss from '../top_nav/top_nav.module.css'
import friends_icon from '../../images/friends.svg'
import InboxIcon from '@mui/icons-material/Inbox';
import HelpIcon from '@mui/icons-material/Help';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector, useDispatch } from 'react-redux'
import { change_option,change_option_name,option_status,option_text,option_data } from '../../Redux/options_slice';

function Top_nav({button_status}) {
  
  const dispatch = useDispatch();

  const {pending , all_friends} = button_status

  function change_option_value(option_number,option_name,status,text){
    dispatch(change_option(option_number))
    dispatch(change_option_name(option_name))
    dispatch(option_status(status))
    dispatch(option_text(text))
  }

  const tooltips = (value,props) => (
    <Tooltip id="button-tooltip" {...props}>
      {value}
    </Tooltip>
  );
  
  return (
    <div id={topnavcss.main}>
        <div className={topnavcss.top_nav_comps} id={topnavcss.left_part_wrap}>
          <div id={topnavcss.left_part}>
            <img className={topnavcss.top_nav_images} src={friends_icon} alt="" />
            Friends
          </div>
        </div>
        <div className={topnavcss.right_nav_comps} id={topnavcss.middle_part}>
          <div className={topnavcss.middle_part_comps}  id={topnavcss.middle_part_item_1} onClick={()=>{
            change_option_value(0,'ONLINE',false,"No one's around to play with Wumpus.")}}>
              Online
          </div>
          <div className={topnavcss.middle_part_comps}  id={topnavcss.middle_part_item_2} onClick={()=>{
            change_option_value(1,'ALL FRIENDS',all_friends,"Wumpus is waiting on friends. You don't have to, though!")}}>
              All
          </div>
          <div className={topnavcss.middle_part_comps}  id={topnavcss.middle_part_item_3} onClick={()=>{
            change_option_value(2,'PENDING',pending,"There are no pending friend requests. Here's Wumpus for now.")}}>
              Pending
          </div>
          <div className={topnavcss.middle_part_comps}  id={topnavcss.middle_part_item_4} onClick={()=>{
            change_option_value(3,'BLOCKED',false,"You can't unblock the Wumpus.")}}>
              Blocked
          </div>
          <div className={topnavcss.middle_part_comps}  id={topnavcss.middle_part_item_5} onClick={()=>{
            change_option_value(4,'ADD FRIENDS',false,"Wumpus is waiting on friends. You don't have to, though!")}}>
              Add Friend
           </div>
        </div>
        <div className={topnavcss.top_nav_comps} id={topnavcss.right_part}>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={tooltips('Trying')}>
                <ChatBubbleIcon></ChatBubbleIcon>
              </OverlayTrigger>
          </div>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={tooltips('Inbox')}>
                <InboxIcon></InboxIcon>
              </OverlayTrigger>
          </div>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={tooltips('Help')}>
                <HelpIcon></HelpIcon>
              </OverlayTrigger>
          </div>
        </div>
    </div>
  )
}

export default Top_nav