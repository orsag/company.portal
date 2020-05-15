/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import TinyColor from 'tinycolor2'
import { ChromePicker } from 'react-color'
import Popover from 'components/Popover'
import Icon from 'components/icon'
import { colors } from 'variables'

// type Props = {|
// color?: string,
// 	switched?: boolean,
// 	onColor?: (color: string) => void,
// |}
//
// type State = {|
// 	open: boolean,
// |}

class IconMenu extends Component {
	container = null
	anchorOrigin = { vertical: 'bottom', horizontal: 'middle' }
	targetOrigin = { vertical: 'top', horizontal: 'middle' }

	state = {
		open: false,
	}

	isOpen() {
		return this.state.open
	}

	close() {
		this.setState({ open: false })
	}

	open() {
		this.setState({ open: true })
	}

	handleRequestClose = () => {
		this.close()
	}

	handleIconButtonClick = () => {
		if (this.state.open) {
			this.close()
		} else {
			this.open()
		}
	}

	handleChange = (color) => {
		this.props.onColor && this.props.onColor(color.hex)
	}

	bindContainer = (element) => {
		if (element) this.container = element
	}

	onMouseDown = (event) => {
		// Prevent text selection on double and multiple clicks
		// $FlowFixMe detail really exists
		if (event.nativeEvent.detail > 1) {
			event.nativeEvent.stopPropagation()
			event.nativeEvent.preventDefault()
		}
	}

	render() {
		const { open } = this.state
		const styles = getStyles(this.props, this.state)
		const iconColor = TinyColor(this.props.color).isDark() ? colors.white : colors.black

		return (
			<div ref={this.bindContainer}>
				<div onClick={this.handleIconButtonClick} css={styles.iconButton}>
					{open ? (
						// <CloseIcon size={16} color={iconColor} disabled />
						<Icon name={'IoIosCloseCircleOutline'} size={16} color={iconColor} disabled />
					) : (
						// <ColorizeIcon size={16} color={iconColor} disabled />
						<Icon name={'IoIosColorPalette'} size={16} color={iconColor} disabled />
					)}
				</div>

				<Popover
					open={open}
					anchorEl={this.container}
					onRequestClose={this.handleRequestClose}
					anchorOrigin={this.anchorOrigin}
					targetOrigin={this.targetOrigin}
					onChange={this.handleChange}
					style={styles.popover}
					arrow={'top'}
					zDepth={3}
				>
					<div onMouseDown={this.onMouseDown}>
						<ChromePicker color={this.props.color} onChange={this.handleChange} disableAlpha />
					</div>
				</Popover>
			</div>
		)
	}
}

function getStyles(props, state) {
	return {
		iconButton: {
			overflow: 'hidden',
			width: 35,
			height: 35,
			cursor: 'pointer',
			borderStyle: 'solid',
			borderRadius: '50%',
			display: 'flex',
			justifyContent: 'space-around',
			alignContent: 'center',
			alignItems: 'center',
			borderColor: props.switched ? colors.black : colors.grey200,
			borderWidth: 4,
			boxShadow: state.open ? 'inset 2px 4px 0 0 rgba(0,0,0,0.08)' : 'none',
			backgroundColor: props.color,
		},
		popover: {
			marginTop: 10,
		},
	}
}

export default IconMenu
