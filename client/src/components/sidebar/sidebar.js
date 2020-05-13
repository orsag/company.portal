import React, { useState, useContext } from 'react'
import logo from '../../logo.svg'
import { Link } from 'react-router-dom'
import Icon from '../icon'
import styles from './sidebar.module.css'
import { GlobalContext } from '../../context/AppState'

const Sidebar = ({ navLinks }) => {
	const [navOpen, setNavOpen] = useState(0)
	const { toggleSidebar } = useContext(GlobalContext)

	const _toggleSidebar = () => {
		toggleSidebar()
		setNavOpen(!navOpen)
	}

	return (
		<div className={navOpen ? styles.rootActive : styles.root}>
			<figure className={styles.logo} onClick={_toggleSidebar}>
				<img src={logo} height="40px" width="40px" alt="logo" />
			</figure>
			<div className={styles.row} />
			<div className={styles.navLinks}>
				<ul>
					{navLinks.map((link, index) => (
						<li key={index}>
							<Link to={link.path}>
								{link.text}
								<Icon name={link.icon} className={styles.icon} />
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
