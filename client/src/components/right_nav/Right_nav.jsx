import React from 'react'
import rightcss from '../right_nav/right_nav.module.css'

function Right_nav() {
  return (
    <div id={rightcss.main_wrap}>
        <div id={rightcss.main}>

            <div className={rightcss.right_nav_comps} id={rightcss.item_1}>
                Active Now
            </div>

            <div className={rightcss.right_nav_comps} id={rightcss.item_2_wrap}>
                <div className={rightcss.item_2_comps} id={rightcss.item_2_1}>It's quiet for now...</div>
                <div className={rightcss.item_2_comps} id={rightcss.item_2_2}>
                When a friend starts an activity  like playing a game or hanging out on voice  we'll show it here!
                </div>
            </div>
        
    </div>
    </div>
  )
}

export default Right_nav