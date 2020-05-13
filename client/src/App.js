import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Sidebar } from './components/sidebar'
import ExpanseTracker from './modules/expanse-tracker/components/expanse-tracker'
import Dashboard from './modules/dashboard/components/dashboard'
import AddressBook from './modules/address-book/components/address-book'
import CashRegisterList from './modules/cash-register/components/cash-register-list'
import Documents from './modules/document/components/documents'
import Features from './modules/features/components/features'
import Settings from './modules/settings/components/settings'
import mainLayout from './components/layouts/MainLayout'
import { GlobalProvider } from './context/AppState'
import { navigationLinks } from './navigation-links'
import './App.css'

function App() {
  const ExpanseTrackerComponent = mainLayout()(ExpanseTracker)
  const DashboardComponent = mainLayout()(Dashboard)
  const AddressBookComponent = mainLayout()(AddressBook)
  const CashRegisterListComponent = mainLayout()(CashRegisterList)
  const DocumentsComponent = mainLayout()(Documents)
  const FeaturesComponent = mainLayout()(Features)
  const SettingsComponent = mainLayout()(Settings)

  return (
    <Router>
      <GlobalProvider>
        <Sidebar navLinks={navigationLinks} />
        <Switch>
          <Route exact path="/" component={DashboardComponent} />
          <Route exact path="/tracker" component={ExpanseTrackerComponent} />
          <Route exact path="/documents" component={DocumentsComponent} />
          <Route exact path="/cashregisters" component={CashRegisterListComponent} />
          <Route exact path="/adressbook" component={AddressBookComponent} />
          <Route exact path="/features" component={FeaturesComponent} />
          <Route exact path="/settings" component={SettingsComponent} />
          <Route component={() => 404} />
        </Switch>
      </GlobalProvider>
    </Router>
  );
}

export default App
