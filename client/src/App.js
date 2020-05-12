import React from 'react';
import { Sidebar } from './components/common/Sidebar'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import PageRenderer from './page-renderer'
import { GlobalProvider } from './context/GlobalState';
import './App.css';

function App() {  
  const navLinks = [
    {
      text: 'Dashboard',
      path: '/',
      icon: 'ion-ios-home'
    },
    {
      text: 'Documents',
      path: '/documents',
      icon: 'ion-ios-analytics'
    },
    {
      text: 'Address Book',
      path: '/adressbook',
    },
    {
      text: 'Cash Registers',
      path: '/cashregisters',
    },
    {
      text: 'Features',
      path: '/features',
    },
    {
      text: 'Settings',
      path: '/settings',
    },
  ]

  return (
    <Router>
      <GlobalProvider>
        <Sidebar navLinks={ navLinks } />
        <Switch>
            <Route path="/:page" component={PageRenderer} />
            <Route exact path="/" component={Dashboard} />
            {/* <Route path="/dashboard" render={() => <Redirect to="/" />} /> */}
            <Route component={() => 404} />

            {/* <Route exact path="/" component={Dashboard} /> */}
            {/* <Route path="/dashboard" render={() => <Redirect to="/" />} /> */}
            {/* <Route path="/documents" component={Dashboard} /> */}
        </Switch>
      </GlobalProvider>
    </Router>
  );
}

export default App;
