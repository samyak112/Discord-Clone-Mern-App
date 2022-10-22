import Login from './components/Login/Login';
import Register from './components/Register/Register'
import Dashboard from './components/dashboard/Dashboard'
import Auth from './components/auth/Auth'
import {
	BrowserRouter as Router,
	Route,
	Routes,
  } from "react-router-dom";

function App() {
  return (
    <div>
        <Router>
          <Routes>
            <Route exact path="/" 
                element={
                <Auth>
                  <Login/>
                </Auth>}>
            </Route>
            <Route exact path="/register" element={<Register/>}></Route>
            <Route exact path="/channels/@me" 
                element={
                <Auth>
                  <Dashboard/>
                </Auth>}>
            </Route>
          </Routes>
        </Router>
          
        
        
      
    </div>
  );
}

export default App;
