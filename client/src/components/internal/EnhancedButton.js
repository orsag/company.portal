import React, { Component } from 'react'
import PropTypes from 'prop-types'

class EnhancedButton extends Component {
	static propTypes = {
		autoFocus: PropTypes.bool,
		children: PropTypes.node,
		containerElement: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
		disabled: PropTypes.bool,
		href: PropTypes.string,
		onBlur: PropTypes.func,
		onClick: PropTypes.func,
		onFocus: PropTypes.func,
		onKeyDown: PropTypes.func,
		onKeyUp: PropTypes.func,
		style: PropTypes.object,
		tabIndex: PropTypes.number,
		type: PropTypes.string,
		name: PropTypes.string,
	}

	static defaultProps = {
		autoFocus: false,
		containerElement: 'button',
		onBlur: () => {},
		onFocus: () => {},
		onKeyDown: () => {},
		onKeyUp: () => {},
		tabIndex: 0,
		type: 'button',
	}

	componentDidMount() {
		this.props.autoFocus && this.focus()
	}

	handleBlur = (event) => {
		this.props.onBlur && this.props.onBlur(event)
	}

	handleFocus = (event) => {
		event && event.persist()
		if (!this.props.disabled) {
			this.props.onFocus && this.props.onFocus(event)
		}
	}

	handleClick = (event) => {
		if (!this.props.disabled) {
			this.props.onClick && this.props.onClick(event)
		}
	}

	focus() {
		this.button && this.button.focus()
	}

	render() {
		const {
			children,
			containerElement,
			disabled,
			href,
			onBlur, // eslint-disable-line no-unused-vars
			onClick, // eslint-disable-line no-unused-vars
			onFocus, // eslint-disable-line no-unused-vars
			onKeyUp, // eslint-disable-line no-unused-vars
			onKeyDown, // eslint-disable-line no-unused-vars
			style,
			tabIndex,
			type,
			name,
			autoWidth, // eslint-disable-line no-unused-vars
			rounded, // eslint-disable-line no-unused-vars
			autoTestId,
			...other
		} = this.props

		const mergedStyles = Object.assign(
			{
				border: 0,
				MozAppearance: 'none',
				WebkitAppearance: 'none',
				appearance: 'none',
				boxSizing: 'border-box',
				display: 'inline-block',
				cursor: disabled ? 'default' : 'pointer',
				textDecoration: 'none',
				outline: 'none',
				fontFamily: 'inherit',
				fontSize: 'inherit',
				fontWeight: 'inherit',
				position: 'relative',
				verticalAlign: href ? 'middle' : null,
				padding: 0,
				zIndex: 1,
			},
			style,
		)

		// Passing both background:none & backgroundColor can break due to object iteration order
		if (!mergedStyles.backgroundColor && !mergedStyles.background) {
			mergedStyles.background = 'none'
		}

		if (disabled && href) {
			return (
				<span {...other} style={mergedStyles}>
					{children}
				</span>
			)
		}

		const buttonProps = {
			...other,
			style: mergedStyles,
			ref: (node) => (this.button = node),
			disabled: disabled,
			href: href,
			onBlur: this.handleBlur,
			onClick: this.handleClick,
			onFocus: this.handleFocus,
			tabIndex: disabled ? -1 : tabIndex,
			name: name,
		}

		if (React.isValidElement(containerElement)) {
			return React.cloneElement(containerElement, buttonProps, this.props.children)
		}

		if (!href && containerElement === 'button') {
			buttonProps.type = type
		}

		return React.createElement(href ? 'a' : containerElement, buttonProps, this.props.children)
	}
}

export default EnhancedButton
