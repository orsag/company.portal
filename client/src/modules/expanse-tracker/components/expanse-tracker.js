import React from 'react'
import { Header } from './Header'
import { Balance } from './Balance'
import { IncomeExpenses } from './IncomeExpenses'
import { TransactionList } from './TransactionList'
import { AddTransaction } from './AddTransaction'
import { ExpanseTrackerProvider } from '../context/state'
import './expanse-tracker.css'

const ExpanseTracker = () => {
	return (
		<ExpanseTrackerProvider>
			<div className="counter_root">
				<Header />
				<div className="container">
					<Balance />
					<IncomeExpenses />
					<TransactionList />
					<AddTransaction />
				</div>
			</div>
		</ExpanseTrackerProvider>
	)
}

export default ExpanseTracker
