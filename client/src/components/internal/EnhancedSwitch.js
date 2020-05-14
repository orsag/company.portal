import React, { Component } from 'react'
import { autoTestId } from 'utils/tests/autotest'
import keycode from 'keycode'
import warning from 'warning'
import PropTypes from 'prop-types'
import EventListener from 'react-event-listener'
import Paper from 'components/Paper'
import { colors } from 'variables'

function getStyles(props) {
	return {
		root: {
			cursor: props.disabled ? 'not-allowed' : 'pointer',
			position: 'relative',
			overflow: 'visible',
			display: 'table',
			height: 'auto',
			width: props.autoWidth ? 'auto' : '100%',
			transition: 'all 200ms ease-in-out',
		},
		input: {
			position: 'absolute',
			cursor: 'inherit',
			pointerEvents: 'all',
			opacity: 0,
			width: '100%',
			height: '100%',
			zIndex: 2,
			left: 0,
			boxSizing: 'border-box',
			padding: 0,
			margin: 0,
		},
		labelInside: {
			color: colors.white,
			fontSize: 10,
			fontWeight: 'bold',
			lineHeight: '20px',
			paddingLeft: props.switched ? 12 : 30,
			paddingRight: props.switched ? 30 : 12,
			textTransform: 'uppercase',
			transition: 'all 200ms ease-in-out',
		},
		controls: {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'center',
			alignContent: 'center',
		},
		label: {
			float: 'left',
			position: 'relative',
			display: 'block',
			width: 'calc(100% - 60px)',
			lineHeight: '24px',
		},
		wrap: {
			transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
			position: 'relative',
			display: 'block',
			flexShrink: 0,
			width: 60 - 16,
			marginRight: props.labelPosition === 'right' ? 16 : 0,
			marginLeft: props.labelPosition === 'left' ? 16 : 0,
		},
	}
}

class EnhancedSwitch extends Component {
	static propTypes = {
		checked: PropTypes.bool,
		className: PropTypes.string,
		defaultChecked: PropTypes.bool,
		disabled: PropTypes.bool,
		iconStyle: PropTypes.object,
		inputStyle: PropTypes.object,
		inputType: PropTypes.string.isRequired,
		label: PropTypes.node,
		labelPosition: PropTypes.oneOf(['left', 'right']),
		labelStyle: PropTypes.object,
		name: PropTypes.string,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		onKeyboardFocus: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
		onParentShouldUpdate: PropTypes.func,
		onClick: PropTypes.func,
		onSwitch: PropTypes.func,
		style: PropTypes.object,
		switchElement: PropTypes.element.isRequired,
		switched: PropTypes.bool.isRequired,
		thumbStyle: PropTypes.object,
		trackStyle: PropTypes.object,
		value: PropTypes.any, // eslint-disable-line
	}

	state = {
		isKeyboardFocused: false,
	}

	UNSAFE_componentWillMount() {
		this.UNSAFE_componentWillReceiveProps(this.props)
	}

	componentDidMount() {
		const inputNode = this.refs.checkbox
		if ((!this.props.switched || inputNode.checked !== this.props.switched) && this.props.onParentShouldUpdate) {
			this.props.onParentShouldUpdate(inputNode.checked)
		}
		if (this.state.isKeyboardFocused) {
			this.props.onKeyboardFocus && this.props.onKeyboardFocus(null, true)
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const hasCheckedProp = nextProps.hasOwnProperty('checked')
		const hasNewDefaultProp =
			nextProps.hasOwnProperty('defaultChecked') && nextProps.defaultChecked !== this.props.defaultChecked

		if (hasCheckedProp || hasNewDefaultProp) {
			const switched = nextProps.checked || nextProps.defaultChecked || false

			this.setState({
				switched: switched,
			})

			if (this.props.onParentShouldUpdate && switched !== this.props.switched) {
				this.props.onParentShouldUpdate(switched)
			}
		}

		if (nextProps.disabled && this.state.isKeyboardFocused) {
			this.setState({ isKeyboardFocused: false })
			nextProps.onKeyboardFocus && nextProps.onKeyboardFocus(null, false)
		}
	}

	isSwitched() {
		return this.refs.checkbox.checked
	}

	// no callback here because there is no event
	setSwitched(newSwitchedValue) {
		if (!this.props.hasOwnProperty('checked') || this.props.checked === false) {
			if (this.props.onParentShouldUpdate) {
				this.props.onParentShouldUpdate(newSwitchedValue)
			}
			this.refs.checkbox.checked = newSwitchedValue
		} else {
			warning(false, 'Material-UI: Cannot call set method while checked is defined as a property.')
		}
	}

	getValue() {
		return this.refs.checkbox.value
	}

	handleChange = (event) => {
		this.tabPressed = false
		const isInputChecked = this.refs.checkbox.checked

		if (!this.props.hasOwnProperty('checked') && this.props.onParentShouldUpdate) {
			this.props.onParentShouldUpdate(isInputChecked)
		}

		this.props.onSwitch && this.props.onSwitch(event, isInputChecked)
	}

	// Checkbox inputs only use SPACE to change their state. Using ENTER will
	// update the ui but not the input.
	handleKeyDown = (event) => {
		event.stopPropagation()
		const code = keycode(event)

		if (code === 'tab') {
			this.tabPressed = true
		}
		if (keycode(event) === 'esc' && this.state.isKeyboardFocused) {
			this.removeKeyboardFocus(event)
		}
		if (this.state.isKeyboardFocused && code === 'space') {
			this.handleChange(event)
		}
	}

	handleKeyUp = (event) => {
		event.stopPropagation()
		if (this.state.isKeyboardFocused && keycode(event) === 'space') {
			this.handleChange(event)
		}
	}

	handleBlur = (event) => {
		this.cancelFocusTimeout()
		this.removeKeyboardFocus(event)
		this.props.onBlur && this.props.onBlur(event)
	}

	handleFocus = (event) => {
		// setTimeout is needed becuase the focus event fires first
		// Wait so that we can capture if this was a keyboard focus
		// or touch focus
		this.focusTimeout = setTimeout(() => {
			if (this.tabPressed) {
				this.setKeyboardFocus(event)
			} else {
				this.removeKeyboardFocus(event)
			}
		}, 150)

		this.props.onFocus && this.props.onFocus(event)
	}

	cancelFocusTimeout() {
		if (this.focusTimeout) {
			clearTimeout(this.focusTimeout)
			this.focusTimeout = null
		}
	}

	removeKeyboardFocus(event) {
		if (this.state.isKeyboardFocused) {
			this.setState({ isKeyboardFocused: false })
			this.props.onKeyboardFocus && this.props.onKeyboardFocus(event, false)
		}
	}

	setKeyboardFocus(event) {
		if (!this.state.isKeyboardFocused) {
			this.setState({ isKeyboardFocused: true })
			this.props.onKeyboardFocus && this.props.onKeyboardFocus(event, true)
		}
	}

	handleClick = (event) => {
		this.props.onClick && this.props.onClick(event)
	}

	handleMouseEnter = () => {
		this.props.onMouseEnter && this.props.onMouseEnter()
	}

	handleMouseLeave = () => {
		this.props.onMouseLeave && this.props.onMouseLeave()
	}

	render() {
		const {
			name,
			value,
			iconStyle,
			inputStyle,
			inputType,
			label,
			labelStyle,
			labelPosition,
			disabled,
			className,
			style,
			switchElement,
			thumbStyle,
			labelInside,
			labelInsideChecked,
			trackStyle,
		} = this.props

		const styles = getStyles(this.props)
		const wrapStyles = Object.assign(styles.wrap, iconStyle)

		if (thumbStyle) {
			wrapStyles.marginLeft /= 2
			wrapStyles.marginRight /= 2
		}

		const labelElement = label && <label style={Object.assign(styles.label, labelStyle)}>{label}</label>

		const inputElement = (
			<input
				defaultChecked={this.props.defaultChecked}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				onClick={this.props.onClick}
				ref="checkbox"
				type={inputType}
				style={Object.assign(styles.input, inputStyle)}
				name={name}
				value={value || undefined}
				disabled={disabled}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				onChange={this.handleChange}
				checked={this.state.switched}
			/>
		)

		// If toggle component (indicated by whether the style includes thumb) manually lay out
		// elements in order to nest ripple elements
		const switchOrThumbElement = !thumbStyle ? (
			<div style={wrapStyles}>{switchElement}</div>
		) : (
			<div style={wrapStyles}>
				<div style={Object.assign({}, trackStyle)}>
					{labelInside && (
						<div style={styles.labelInside}>
							{labelInsideChecked && this.props.switched ? labelInsideChecked : labelInside}
						</div>
					)}
				</div>
				<Paper style={thumbStyle} zDepth={3} thick circle>
					{' '}
				</Paper>
			</div>
		)

		const elementsInOrder =
			labelPosition === 'right' ? (
				<div style={styles.controls}>
					{switchOrThumbElement}
					{labelElement}
				</div>
			) : (
				<div style={styles.controls}>
					{labelElement}
					{switchOrThumbElement}
				</div>
			)

		return (
			<div
				ref="root"
				className={className}
				style={Object.assign(styles.root, style)}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={this.handleClick}
				{...autoTestId(this.props.autoTestId)}
			>
				<EventListener target="window" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} />
				{inputElement}
				{elementsInOrder}
			</div>
		)
	}
}

export default EnhancedSwitch
