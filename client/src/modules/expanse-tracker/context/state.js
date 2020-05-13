import React, { createContext, useReducer } from 'react'
import ExpanseTrackerReducer from './reducer'
import axios from 'axios'

// Initial state
const initialState = {
	transactions: [],
	error: null,
	loading: true,
}

// Create context
export const ExpanseTrackerContext = createContext(initialState)

// Provider component
export const ExpanseTrackerProvider = ({ children }) => {
	const [state, dispatch] = useReducer(ExpanseTrackerReducer, initialState)

	// Actions
	async function getTransactions() {
		try {
			const res = await axios.get('/api/v1/transactions')

			dispatch({
				type: 'GET_TRANSACTIONS',
				payload: res.data.data,
			})
		} catch (err) {
			dispatch({
				type: 'TRANSACTION_ERROR',
				error: err.response.data.error,
			})
		}
	}

	async function deleteTransaction(id) {
		try {
			await axios.delete(`/api/v1/transactions/${id}`)

			dispatch({
				type: 'DELETE_TRANSACTION',
				payload: id,
			})
		} catch (err) {
			dispatch({
				type: 'TRANSACTION_ERROR',
				error: err.response.data.error,
			})
		}
	}

	async function addTransaction(transaction) {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		try {
			const res = await axios.post('/api/v1/transactions', transaction, config)

			dispatch({
				type: 'ADD_TRANSACTION',
				payload: res.data.data,
			})
		} catch (err) {
			dispatch({
				type: 'TRANSACTION_ERROR',
				error: err.response.data.error,
			})
		}
	}

	return (
		<ExpanseTrackerContext.Provider
			value={{
				transactions: state.transactions,
				deleteTransaction,
				addTransaction,
				getTransactions,
				error: state.error,
				loading: state.loading,
			}}
		>
			{children}
		</ExpanseTrackerContext.Provider>
	)
}
