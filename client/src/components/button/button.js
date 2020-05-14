import React, { Component } from 'react'
import EnhancedButton from 'components/internal/EnhancedButton'
import { colors } from 'variables'

// type Props = {|
// 	/**
// 	 * True to display higher button (applicable to default button only)
// 	 */
// 	tall?: boolean,
// 	disabled?: boolean,
// 	/**
// 	 * If true, the button will take up the full width of its container.
// 	 */
// 	fullWidth?: boolean,
// 	/**
// 	 * The label to be displayed within the button.
// 	 */
// 	labelText: string,
// 	/**
// 	 * True to set wider padding
// 	 */
// 	wide?: boolean,
// 	/**
// 	 * HTML Button typ attribute
// 	 */
// 	type?: string,
// 	/**
// 	 * Simulates outside label with marginTop so button is on same level as input with outside label
// 	 */
// 	simulateOutsideLabel?: boolean,
// 	primary?: boolean,
// 	secondary?: boolean,
// 	tertiary?: boolean,
// 	danger?: boolean,
// 	transparent?: boolean,
// 	name?: string,
// 	href?: ?string,
// 	labelColor?: string,
// 	onClick?: () => any,
// |}
//
// type State = {|
// 	hovered: boolean,
// |}

class Button extends Component {
	state = {
		hovered: false,
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		nextProps.disabled &&
			this.setState({
				hovered: false,
			})
	}

	handleMouseLeave = () => {
		this.setState({
			hovered: false,
		})
	}

	handleMouseEnter = () => {
		this.setState({
			hovered: true,
		})
	}

	handleClick = () => {
		this.props.href && window.open(this.props.href)
		this.props.onClick && this.props.onClick()
	}

	render() {
		const styles = getStyles(this.props, this.state)

		return (
			<EnhancedButton
				onClick={this.handleClick}
				onMouseLeave={this.handleMouseLeave}
				onMouseEnter={this.handleMouseEnter}
				type={this.props.type}
				disabled={this.props.disabled}
				style={styles.root}
				name={this.props.name}
			>
				<span style={styles.label}>{this.props.labelText}</span>
			</EnhancedButton>
		)
	}
}

function getStyles(props, state) {
	const {
		primary,
		secondary,
		tertiary,
		danger,
		transparent,
		disabled,
		fullWidth,
		tall,
		wide,
		simulateOutsideLabel,
	} = props

	const inFocus = state.hovered && !disabled
	const buttonHeight = tall ? 50 : 40
	const zDepth = disabled ? 0 : 3

	const defaultStyle = {
		root: {
			display: 'inline-block',
			transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
			minWidth: fullWidth ? '100%' : 0,
			borderRadius: buttonHeight / 2,
			borderStyle: 'solid',
			borderWidth: 1,
			borderColor: colors.orange600,
			backgroundColor: inFocus ? colors.orange400 : colors.orange,
			overflow: 'hidden',
			height: buttonHeight,
			lineHeight: `${buttonHeight - 2}px`,
			padding: 0,
			opacity: disabled ? 0.4 : 1,
			boxShadow: `${zDepth}px ${zDepth}px 0 ${colors.blackFaded8}`,
			textAlign: 'center',
			userSelect: 'none',
			pointerEvents: disabled ? 'none' : 'all',
		},
		label: {
			position: 'relative',
			verticalAlign: 'middle',
			whiteSpace: 'nowrap',
			opacity: 1,
			fontSize: 14,
			letterSpacing: 0,
			textTransform: 'uppercase',
			fontWeight: 'bold',
			margin: 0,
			userSelect: 'none',
			paddingLeft: wide ? 40 : 25,
			paddingRight: wide ? 40 : 25,
			color: props.labelColor || colors.white,
		},
	}

	const primaryStyle = {
		root: {
			...defaultStyle.root,
			height: 42,
			lineHeight: '40px',
			borderRadius: 3,
			backgroundColor: inFocus ? colors.blueFaded80 : colors.blue,
			borderColor: '#057E93',
			margin: wide ? '0 8px' : 0,
			marginTop: simulateOutsideLabel ? 25 : 0,
			padding: wide ? '0 20px' : 0,
		},
		label: {
			...defaultStyle.label,
			paddingLeft: 16,
			paddingRight: 16,
			fontWeight: 'normal',
		},
	}

	const secondaryStyle = {
		root: {
			...defaultStyle.root,
			height: 42,
			lineHeight: '40px',
			borderRadius: 3,
			backgroundColor: inFocus ? colors.blackFaded3 : colors.transparent,
			borderColor: colors.gray400,
			boxShadow: 'none',
			margin: wide ? '0 8px' : 0,
			marginTop: simulateOutsideLabel ? 25 : 0,
			padding: wide ? '0 20px' : 0,
		},
		label: {
			...defaultStyle.label,
			color: props.labelColor || colors.black,
			paddingLeft: 16,
			paddingRight: 16,
			fontWeight: 'normal',
		},
	}
	const tertiaryStyle = {
		root: {
			...defaultStyle.root,
			height: 32,
			lineHeight: '30px',
			borderRadius: 3,
			backgroundColor: inFocus ? colors.gray200 : colors.white,
			borderColor: colors.blue,
			margin: wide ? '0 8px' : 0,
			marginTop: simulateOutsideLabel ? 25 : 0,
			padding: wide ? '0 20px' : 0,
		},
		label: {
			...defaultStyle.label,
			color: props.labelColor || colors.black,
			fontSize: 12,
		},
	}
	const dangerStyle = {
		root: {
			...defaultStyle.root,
			height: 42,
			lineHeight: '40px',
			borderRadius: 3,
			backgroundColor: inFocus ? colors.red600 : colors.red,
			borderColor: colors.red600,
			margin: wide ? '0 8px' : 0,
			marginTop: simulateOutsideLabel ? 25 : 0,
			padding: wide ? '0 20px' : 0,
		},
		label: {
			...defaultStyle.label,
			paddingLeft: 16,
			paddingRight: 16,
			fontWeight: 'normal',
		},
	}
	const transparentStyle = {
		root: {
			...defaultStyle.root,
			height: 32,
			lineHeight: '30px',
			borderRadius: 2,
			borderWidth: 0,
			backgroundColor: colors.transparent,
			boxShadow: 'none',
			margin: wide ? '0 8px' : 0,
			marginTop: simulateOutsideLabel ? 25 : 0,
			padding: wide ? '0 20px' : 0,
		},
		label: {
			...defaultStyle.label,
			color: props.labelColor || colors.black,
			paddingLeft: 24,
			paddingRight: 24,
			textTransform: 'none',
			textDecoration: inFocus ? 'underline' : 'none',
			fontWeight: 'normal',
		},
	}

	return primary
		? primaryStyle
		: secondary
		? secondaryStyle
		: tertiary
		? tertiaryStyle
		: danger
		? dangerStyle
		: transparent
		? transparentStyle
		: defaultStyle
}

export default Button
