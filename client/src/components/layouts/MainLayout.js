import React, { Component, useContext } from 'react'
import { GlobalContext } from 'context/AppState'
import NotificationCenter from 'components/notification-center'
import styles from './MainLayout.module.css'

const Wrapper = (props) => {
	const { isSidebarOpen } = useContext(GlobalContext)

	return <div className={isSidebarOpen ? styles.rootActive : styles.root}>{props.children}</div>
}

export default function mainLayout() {
	return (Content) => {
		return class MainLayout extends Component {
			render() {
				return (
					<Wrapper>
						<Content {...this.props} />
						<NotificationCenter />
						<div id="render-to-layer" />
					</Wrapper>
				)
			}
		}
	}
}
