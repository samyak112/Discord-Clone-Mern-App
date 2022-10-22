import React from 'react'
import dashboardcss from '../dashboard/dashboard.module.css'
import Navbar from '../navbar/Navbar'
import Navbar_2 from '../navbar_2/Navbar_2';
import Top_nav from '../top_nav/Top_nav'
import Main from '../main/Main';
import Right_nav from '../right_nav/Right_nav';


function Dashboard() {

  return (
    <div className={dashboardcss.main}>
        <div className={dashboardcss.components} id={dashboardcss.component_1}><Navbar/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_2}><Navbar_2/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_3}><Top_nav/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_4}><Main/></div>
        <div className={dashboardcss.components} id={dashboardcss.component_5}><Right_nav/></div>
      
    </div>
  )
}

export default Dashboard