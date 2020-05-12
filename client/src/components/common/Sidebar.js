import React, {useState,useContext} from 'react'
import logo from '../../logo.svg'
import { Link } from 'react-router-dom'
import './Sidebar.css'
import { GlobalContext } from '../../context/GlobalState'

export const Sidebar = ({ navLinks }) => {
  const [ navOpen, setNavOpen ] = useState(0)
  const { sidebarOpen, toggleSidebar } = useContext(GlobalContext)

  const _toggleSidebar = () => {
    toggleSidebar()
    setNavOpen(!navOpen)
  }

  return (
    <div className={navOpen ? `sideabar__root active` : `sideabar__root`}>
      <figure className="sidebar__logo" onClick={_toggleSidebar}>
        <img src={ logo } height="40px" width="40px" alt="toolbar-logo" />
      </figure>
      <div className="sidebar__row"></div>
      <div className="sidebar__navLinks">
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>
                { link.text }
                <i className={ link.icon } />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
