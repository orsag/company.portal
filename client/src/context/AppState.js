import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'

// Initial state
const initialState = {
	isSidebarOpen: false,
}

// Create context
export const GlobalContext = createContext(initialState)

// Provider component
export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState)

	const value = {
		isSidebarOpen: state.isSidebarOpen,
		toggleSidebar,
	}

	// Actions
	function toggleSidebar(value) {
		dispatch({
			type: 'TOGGLE_SIDEBAR',
			payload: value || !state.isSidebarOpen,
		})
	}

	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}
