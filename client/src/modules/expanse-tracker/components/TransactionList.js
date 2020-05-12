import React, { useContext, useEffect } from 'react'
import { Transaction } from './Transaction'
import { ExpanseTrackerContext } from '../context/state'

export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(ExpanseTrackerContext)

  useEffect(() => {
    getTransactions()
    // eslint-disable-next-line
  }, [])

  console.log('TransactionList')

  return (
    <>
      <h3>History</h3>
      <ul className="list">
        {transactions.map(transaction => (<Transaction key={transaction._id} transaction={transaction} />))}
      </ul>
    </>
  )
}
