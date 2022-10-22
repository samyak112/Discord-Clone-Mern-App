import React from 'react'
import nav2css from '../navbar_2/navbar2.module.css'
import person_icon from '../../images/friends.svg'
import AddIcon from '@mui/icons-material/Add';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import discord_logo from '../../images/discord_logo_3.png'
import offline_icon from '../../images/offline_status.svg'
import SettingsIcon from '@mui/icons-material/Settings';
import HeadsetIcon from '@mui/icons-material/Headset';
import MicOffIcon from '@mui/icons-material/MicOff';

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Create DM
  </Tooltip>
);

const settings = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    User Settings
  </Tooltip>
);

const headset = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Deafen
  </Tooltip>
);

const mic = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Unmute
  </Tooltip>
);




function Navbar_2() {
  return (
    <div className={nav2css.main}>
      <div>

      <div className={nav2css.search_wrap}>
        <div className={nav2css.search}>
          Find or start a conversation
        </div>
      </div>
      <div className={nav2css.friends_wrap}>
        <div className={nav2css.friends}>
            <img className={nav2css.friends_icon} src={person_icon} alt="" />
            Friends
        </div>
      </div>
      <div className={nav2css.heading}>
        <div className={nav2css.heading_components} id={nav2css.text} >DIRECT MESSAGES</div>
        <div className={nav2css.heading_components} id={nav2css.plus}>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip}>
            
          <AddIcon fontSize='small'></AddIcon>
          </OverlayTrigger>
        </div>
      </div>
      {/* this area shows any dm which you have done to anyone in past time whether friend or not */}
      <div className={nav2css.friend_details_wrap}>
        <div className={nav2css.friend_details}>
          <div className={nav2css.friend_details_comps} id={nav2css.profile_wrap}>
            <div className={nav2css.profile_pic}>
              <img src={discord_logo} alt="" />
              <div className={nav2css.online_status}>
                <img src={offline_icon} className={nav2css.offline_icon} alt="" />
                {/* <TripOriginIcon className={nav2css.offline_icon}></TripOriginIcon> */}
              </div>
            </div>
          </div>
          <div className={`${nav2css.friend_details_comps} ${nav2css.name}`}>spidy</div>
        </div>
      </div>
      <div className={nav2css.friend_details_wrap}>
        <div className={nav2css.friend_details}>
          <div className={nav2css.friend_details_comps} id={nav2css.profile_wrap}>
            <div className={nav2css.profile_pic}>
              <img src={discord_logo} alt="" />
              <div className={nav2css.online_status}>
                <img src={offline_icon} className={nav2css.offline_icon} alt="" />
              </div>
            </div>
          </div>
          <div className={`${nav2css.friend_details_comps} ${nav2css.name}`} >spidy</div>
        </div>
      </div>
      </div>
      {/* this div above is here just to seprate above part with the lower part using a grid */}
      <div id={nav2css.footer}>
        <div id={nav2css.profile} className={nav2css.footer_comps}>
          <img src={discord_logo} alt="" />
        </div>
        <div id={nav2css.profile_name_wrap} className={nav2css.footer_comps}>
          <div id={nav2css.profile_name} className={nav2css.profile_name_comps}>Spidy</div>
          <div id={nav2css.tag} className={nav2css.profile_name_comps}>#9106</div>
        </div>
        <div id={nav2css.profile_options} className={nav2css.footer_comps}>
          <div className={nav2css.icons}>
            {/* mic tooltip and icon */}

            <OverlayTrigger
              placement="top"
              overlay={mic}>
              
              <MicOffIcon></MicOffIcon>

            </OverlayTrigger>
          </div>
          <div className={nav2css.icons}>
            {/* headset tooltip and icon */}
            <OverlayTrigger
              placement="top"
              overlay={headset}>
              
              <HeadsetIcon></HeadsetIcon>


            </OverlayTrigger>
          </div>
          <div className={nav2css.icons}>
            {/* settings tooltip and icon */}
            <OverlayTrigger
              placement="top"
              overlay={settings}>
              
              <SettingsIcon></SettingsIcon>


            </OverlayTrigger>
          </div>
          

        

        
        </div>
      </div>
      
    </div>
  )
}

export default Navbar_2