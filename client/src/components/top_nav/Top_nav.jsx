import React from 'react'
import topnavcss from '../top_nav/top_nav.module.css'
import friends_icon from '../../images/friends.svg'
import InboxIcon from '@mui/icons-material/Inbox';
import HelpIcon from '@mui/icons-material/Help';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Right_nav() {

  const dm = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      New Group DM
    </Tooltip>
  );

  const inbox = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Inbox
    </Tooltip>
  );

  
  const help = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Help
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
          <div className={topnavcss.middle_part_comps} id={topnavcss.middle_part_item_1}>Online</div>
          <div className={topnavcss.middle_part_comps} id={topnavcss.middle_part_item_2}>All</div>
          <div className={topnavcss.middle_part_comps} id={topnavcss.middle_part_item_3}>Pending</div>
          <div className={topnavcss.middle_part_comps} id={topnavcss.middle_part_item_4}>Blocked</div>
          <div className={topnavcss.middle_part_comps} id={topnavcss.middle_part_item_5}>Add Friend</div>
        </div>
        <div className={topnavcss.top_nav_comps} id={topnavcss.right_part}>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={dm}>
                <ChatBubbleIcon></ChatBubbleIcon>
              </OverlayTrigger>
          </div>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={inbox}>
                <InboxIcon></InboxIcon>
              </OverlayTrigger>
          </div>
          <div className={topnavcss.right_part_icons}>
              <OverlayTrigger
                placement="bottom"
                overlay={help}>
                <HelpIcon></HelpIcon>
              </OverlayTrigger>
          </div>
        </div>
    </div>
  )
}

export default Right_nav