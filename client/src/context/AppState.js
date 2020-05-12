import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

// Initial state
const initialState = {
  isSidebarOpen: false,
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function toggleSidebar(value) {
    dispatch({
      type: 'TOGGLE_SIDEBAR',
      payload: value || !state.isSidebarOpen,
    })
  }

  return (<GlobalContext.Provider value={{
    transactions: state.transactions,
    isSidebarOpen: state.isSidebarOpen,
    toggleSidebar,
  }}>
    {children}
  </GlobalContext.Provider>);
}