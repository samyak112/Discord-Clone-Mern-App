import React from 'react'
import navbarcss from '../navbar/navbar.module.css'
import discord_logo from '../../images/discord_logo_2.svg'
import discord_logo_2 from '../../images/discord_logo_3.png'
import AddIcon from '@mui/icons-material/Add';

import { useState } from 'react'

function Navbar() {

  const [selected, setselected] = useState('transparent')
  
  return (
    <div className={navbarcss.main}>
      <div className={navbarcss.main_wrap}>
        <div>
          <div className={`${navbarcss.list_items} ${navbarcss.dms}`} >
              <div className={`${navbarcss.left}`}>
                {/* this selected class is to specify which list item is selected using a css style which is written in it and the clas "left" is a wrap for this class */}
                <div className={navbarcss.selected}></div>
              </div>
              <div className={`${navbarcss.middle}`} id={navbarcss.direct_message}>
                <img src={discord_logo} alt="" />
              </div>
              <div className={`${navbarcss.right}`}></div>
          </div>
          <div className={`${navbarcss.list_items} ${navbarcss.dms}`}>
              <div className={`${navbarcss.left}`}>
                <div className={navbarcss.selected}></div>
              </div>
              <div className={`${navbarcss.middle}`}>
                <img src={discord_logo_2} alt="" />
              </div>
              <div className={`${navbarcss.right}`}></div>
          </div>
          <div className={`${navbarcss.list_items} ${navbarcss.dms}`}>
              <div className={`${navbarcss.left}`}>
                <div className={navbarcss.selected}></div>
              </div>
              <div className={`${navbarcss.middle}`}>
                <img src={discord_logo_2} alt="" />
              </div>
              <div className={`${navbarcss.right}`}></div>
          </div>
        </div>
       
        {/* servers from here */}
        <div>
            <div className={`${navbarcss.list_items} ${navbarcss.servers}`}>
            <div className={`${navbarcss.left}`}>
              <div className={navbarcss.selected}></div>
            </div>
              <div className={`${navbarcss.middle}  ${navbarcss.server_middle}`}>
                SJ
              </div>
            <div className={`${navbarcss.right}`}></div>
            </div>
            <div className={`${navbarcss.list_items} ${navbarcss.servers}`}>
            <div className={`${navbarcss.left}`}>
              <div className={navbarcss.selected}></div>
            </div>
            <div className={`${navbarcss.middle}  ${navbarcss.server_middle}`}>
              SJ
            </div>
            <div className={`${navbarcss.right}`}></div>
          </div> 
        </div>
        {/* Add new server */}
        <div className={`${navbarcss.list_items}`}>
            <div className={`${navbarcss.left}`}></div>
            <div className={`${navbarcss.middle}  ${navbarcss.server_middle}`} id={navbarcss.plus}>
              <AddIcon fontSize='large'/>
            </div>
            <div className={`${navbarcss.right}`}></div>
        </div>       
      </div>
    </div>
  )
}

export default Navbar