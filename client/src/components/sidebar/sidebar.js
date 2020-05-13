import React, { useState, useContext } from 'react'
import logo from '../../logo.svg'
import { Link } from 'react-router-dom'
import {
	IoIosHome,
	IoIosGlobe,
	IoIosDocument,
	IoIosBookmarks,
	IoLogoUsd,
	IoMdWarning,
	IoIosSettings,
	IoIosCube,
} from 'react-icons/io'
import { IconContext } from 'react-icons'
import styles from './sidebar.module.css'
import { GlobalContext } from '../../context/AppState'

const Sidebar = ({ navLinks }) => {
	const [navOpen, setNavOpen] = useState(0)
	const { toggleSidebar } = useContext(GlobalContext)

	const _toggleSidebar = () => {
		toggleSidebar()
		setNavOpen(!navOpen)
	}

	const getIcon = (icon) => {
		switch (icon) {
			case 'IoIosHome':
				return <IoIosHome />
			case 'IoIosGlobe':
				return <IoIosGlobe />
			case 'IoIosDocument':
				return <IoIosDocument />
			case 'IoIosBookmarks':
				return <IoIosBookmarks />
			case 'IoLogoUsd':
				return <IoLogoUsd />
			case 'IoMdWarning':
				return <IoMdWarning />
			case 'IoIosSettings':
				return <IoIosSettings />
			default:
				return <IoIosCube />
		}
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
								<IconContext.Provider value={{ className: styles.icon }}>{getIcon(link.icon)}</IconContext.Provider>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
