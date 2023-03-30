import React, { useState, createContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Nav from './Nav'
import Register from './Register'
import Login from './Login'
import Myprofile from './Myprofile'

export const store = createContext();

const App = () => {
  const [token, setToken] = useState(null);
  return (
    <div>
      <store.Provider value={[token, setToken]}>
        <Router>
          <Nav />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/myprofile' component={Myprofile} />
          </Switch>
        </Router>
      </store.Provider>     
    </div>
  )
}

export default App
