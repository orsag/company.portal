import React, { useContext } from 'react'
import { ExpanseTrackerContext } from '../context/state'
import { numberWithCommas } from '../../../utils/format'

export const Transaction = ({ transaction }) => {
	const { deleteTransaction } = useContext(ExpanseTrackerContext)

	const sign = transaction.amount < 0 ? '-' : '+'

	const amount = numberWithCommas(Math.abs(transaction.amount))

	return (
		<li className={transaction.amount < 0 ? 'minus' : 'plus'}>
			{transaction.text}{' '}
			<span>
				{sign}${amount}
			</span>
			<button onClick={() => deleteTransaction(transaction._id)} className="delete-btn">
				x
			</button>
		</li>
	)
}
