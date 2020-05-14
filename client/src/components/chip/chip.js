/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { Component } from 'react'
import { colors } from 'variables'
import { darken } from 'utils/colorManipulator'

// export type Props = {|
// /**
//  * Override the background color of the chip.
//  */
// backgroundColor?: string,
// 	/**
// 	 * If true, chip will be rendered with border.
// 	 */
// 	border: boolean,
// 	rounded?: boolean,
// 	/**
// 	 * Used to render elements inside the Chip.
// 	 */
// 	children: any,
// 	/**
// 	 * CSS `className` of the root element.
// 	 */
// 	className?: string,
// 	/**
// 	 * Override the inline-styles of the label.
// 	 */
// 	labelStyle?: Object,
// 	/**
// 	 * Override the inline-styles of the root element.
// 	 */
// 	style?: Object,
// |}

class Chip extends Component {
	static defaultProps = {
		border: true,
	}

	render() {
		const styles = getStyles(this.props)
		const mergedOuter = Object.assign(styles.root, this.props.style)
		const mergedLabel = Object.assign(styles.label, this.props.labelStyle)

		return (
			<div className={this.props.className} css={mergedOuter}>
				<span css={mergedLabel}>{this.props.children}</span>
			</div>
		)
	}
}

function getStyles(props) {
	const backgroundColor = props.backgroundColor || colors.blue
	const borderColor = props.border ? darken(backgroundColor, 0.25) : backgroundColor

	return {
		root: {
			display: 'inline-block',
			backgroundColor: backgroundColor,
			borderRadius: props.rounded ? 9 : 3,
			border: `1px solid ${props.border ? borderColor : 'transparent'}`,
			whiteSpace: 'nowrap',
			width: 'auto',
			height: 'auto',
			lineHeight: '16px',
			overflow: 'hidden',
			textAlign: 'center',
		},
		label: {
			color: colors.white,
			fontSize: 10,
			fontWeight: 'bold',
			lineHeight: '16px',
			height: 18,
			padding: '0 7px',
			userSelect: 'none',
			whiteSpace: 'nowrap',
			textTransform: 'uppercase',
			display: 'flex',
			alignItems: 'center',
			alignContent: 'center',
			justifyContent: 'flex-start',
		},
	}
}

export default Chip
