/** @jsx jsx */

import { PureComponent } from 'react'
import { jsx } from '@emotion/core'
import memoize from 'memoize-one'
import { autoTestId } from 'utils/tests/autotest'
import EnhancedSwitch from 'components/internal/EnhancedSwitch'
import { colors } from 'variables'

// type Props = {|
// ...AutoTestProps,
// 	/**
// 	 * Checkbox is checked if true.
// 	 */
// 	checked?: boolean,
// 	/**
// 	 * The default state of our checkbox component.
// 	 * **Warning:** This cannot be used in conjunction with `checked`.
// 	 * Decide between using a controlled or uncontrolled input element and remove one of these props.
// 	 * More info: https://fb.me/react-controlled-components
// 	 */
// 	defaultChecked?: boolean,
// 	/**
// 	 * Disabled if true.
// 	 */
// 	disabled?: boolean,
// 	/**
// 	 * If true, the radio button will be rendered as inline block.
// 	 */
// 	inline?: boolean,
// 	/**
// 	 * Where the label will be placed next to the checkbox.
// 	 */
// 	labelPosition?: 'left' | 'right',
// 	value?: string | number | boolean,
// 	name?: string,
// 	label?: string,
// 	onClick?: (SyntheticMouseEvent<HTMLInputElement>) => void,
// 	/**
// 	 * Callback function that is fired when the checkbox is checked.
// 	 *
// 	 * @param {object} event `change` event targeting the underlying checkbox `input`.
// 	 * @param {boolean} isInputChecked The `checked` value of the underlying checkbox `input`.
// 	 */
// 	onCheck?: (SyntheticInputEvent<HTMLInputElement>, boolean) => void,
//
// 	/**
// 	 * If set to true, there will be minus like checkIkon
// 	 */
// 	showMinusIcon?: boolean,
// |}
//
// export type State = {|
// 	switched: boolean,
// 	isKeyboardFocused: boolean,
// 	minusIcon: boolean,
// |}

class Checkbox extends PureComponent {
	static defaultProps = {
		labelPosition: 'right',
	}

	state = {
		switched: false,
		isKeyboardFocused: false,
		minusIcon: false,
	}

	UNSAFE_componentWillMount() {
		const { checked, defaultChecked, showMinusIcon } = this.props
		if (checked || defaultChecked) {
			// default value hotfix - should be fixed in TWU-1384
			setTimeout(() => {
				this.setState({
					switched: true,
					minusIcon: showMinusIcon,
				})
			}, 0)
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { checked, showMinusIcon } = this.props
		if (checked !== nextProps.checked || showMinusIcon !== nextProps.showMinusIcon) {
			this.setState({
				switched: nextProps.checked,
				minusIcon: nextProps.showMinusIcon,
			})
		}
	}

	isControlled() {
		return this.props.hasOwnProperty('checked')
	}

	isChecked() {
		return this.refs.enhancedSwitch.isSwitched()
	}

	setChecked(newCheckedValue) {
		this.refs.enhancedSwitch.setSwitched(newCheckedValue)
	}

	handleStateChange = (newSwitched) => {
		this.setState({
			switched: newSwitched,
		})
	}

	handleCheck = (event, isInputChecked) => {
		event.stopPropagation()
		if (!this.isControlled()) {
			this.setState({
				switched: isInputChecked,
			})
		}
		this.props.onCheck && this.props.onCheck(event, isInputChecked)
	}

	handleKeyboardFocus = (event, isKeyboardFocused) => {
		this.setState({ isKeyboardFocused: isKeyboardFocused })
	}

	handleClick = (event) => {
		this.props.onClick && this.props.onClick(event)
	}

	getStyles = memoize((props, state) => {
		const { disabled, inline, label } = props
		const { switched, isKeyboardFocused, minusIcon } = state

		return {
			root: {
				display: inline ? 'inline-block' : 'block',
				lineHeight: inline ? '24px' : 'initial',
				margin: inline ? '0 20px 0 0px' : 0,
				width: 'auto',
				'&:hover .border': {
					borderColor: colors.blue,
				},
			},
			icon: {
				height: 24,
				width: 24,
				marginRight: label ? 6 : 0,
			},
			boxStyles: {
				display: 'block',
				position: 'absolute',
				opacity: switched ? 0 : 1,
				transition: 'all 150ms cubic-bezier(0.23, 1, 0.32, 1), opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 150ms',
				top: 4,
				left: 4,
				width: 16,
				height: 16,
				borderRadius: 3,
				border: `1px solid ${isKeyboardFocused || switched ? colors.blue : '#979797'}`,
				backgroundColor: isKeyboardFocused ? colors.blue100 : colors.transparent,
			},
			checkStyles: {
				position: 'absolute',
				transitionOrigin: '50% 50%',
				display: 'block',
				top: 4,
				left: 4,
				width: 16,
				height: 16,
				borderRadius: 3,
				border: `1px solid ${isKeyboardFocused || switched ? colors.blue : '#979797'}`,
				backgroundColor: colors.blue,
				borderColor: colors.blue,
				fill: switched ? colors.disabled : 'inherit',
				opacity: switched ? 1 : 0,
				transform: switched ? 'scale(1)' : 'scale(0)',
				transition: switched
					? 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
					: 'opacity 350ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 350ms',
			},
			label: {
				color: disabled ? colors.disabled : isKeyboardFocused ? colors.blue : colors.black,
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
			},
			iconCheck: {
				position: 'absolute',
				left: minusIcon ? 2 : 4,
				top: minusIcon ? 6 : 0,
				width: minusIcon ? 10 : 6,
				height: minusIcon ? '0' : 11,
				borderRight: minusIcon ? 'none' : '2px solid #fff',
				borderBottom: '2px solid #fff',
				transform: minusIcon ? 'none' : 'rotate(45deg)',
			},
		}
	})

	render() {
		const styles = this.getStyles(this.props, this.state)

		const checkboxElement = (
			<div>
				<div css={styles.boxStyles} className="border" />
				<div css={styles.checkStyles}>
					<div css={styles.iconCheck} />
				</div>
			</div>
		)

		return (
			<div css={styles.root} {...autoTestId(this.props.autoTestId)}>
				<EnhancedSwitch
					ref={'enhancedSwitch'}
					inputType={'checkbox'}
					switched={this.state.switched}
					checked={this.state.switched}
					defaultChecked={this.props.defaultChecked}
					switchElement={checkboxElement}
					iconStyle={styles.icon}
					onClick={this.handleClick}
					onSwitch={this.handleCheck}
					labelStyle={styles.label}
					onParentShouldUpdate={this.handleStateChange}
					labelPosition={this.props.labelPosition}
					onKeyboardFocus={this.handleKeyboardFocus}
					value={this.props.value}
					name={this.props.name}
					label={this.props.label}
					disabled={this.props.disabled}
				/>
			</div>
		)
	}
}

export default Checkbox
