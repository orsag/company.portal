import React, { Component } from 'react'
import NotificationCenter from './NotificationCenter'

export default function mainLayout() {
	return (Content) => {
		return class MainLayout extends Component {
			render() {
				return (
					<div>
						<Content {...this.props} />
						<NotificationCenter />
						<div id="render-to-layer" />
					</div>
				)
			}
		}
	}
}
