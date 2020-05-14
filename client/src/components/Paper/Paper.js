/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import { autoTestId } from 'utils/tests/autotest'
import styles from './Paper.css'

// type Props = {|
// ...AutoTestProps,
// 	/**
// 	 * Children passed into the paper element.
// 	 */
// 	children: Node,
// 	/**
// 	 * The css class name of the root element.
// 	 */
// 	className?: string,
// 	/**
// 	 * Set to true to generate a circlular paper container.
// 	 */
// 	circle?: boolean,
// 	/**
// 	 * By default, the paper container will have a border radius.
// 	 * Set this to false to generate a container with sharp corners.
// 	 */
// 	rounded: boolean,
// 	/**
// 	 * Set to true to render thick borders.
// 	 */
// 	thick?: boolean,
// 	/**
// 	 * Override the inline-styles of the root element.
// 	 */
// 	style?: Object,
// 	/**
// 	 * Show arrow. Values are none, top, bottom, left, right
// 	 */
// 	arrow: string,
// 	/**
// 	 * This number represents the zDepth of the paper shadow.
// 	 */
// 	zDepth: number,
// 	id?: string,
// 	onClick?: () => void,
// |}

class Paper extends Component {
	static defaultProps = {
		zDepth: 1,
		rounded: true,
		arrow: 'none',
	}

	render() {
		const inlineStyle = getStyles(this.props)

		return (
			<div
				{...autoTestId(this.props.autoTestId)}
				className={`${styles.root} ${styles[this.props.arrow]} ${this.props.className || ''}`}
				onClick={this.props.onClick}
				css={inlineStyle.root}
				id={this.props.id}
			>
				{this.props.children}
			</div>
		)
	}
}

function getStyles(props) {
	const { rounded, circle, thick, zDepth } = props

	return {
		root: {
			transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
			boxShadow: `${zDepth}px ${zDepth}px 0 rgba(0, 0, 0, 0.08)`,
			borderRadius: circle ? '50%' : rounded ? '3px' : null,
			borderWidth: thick ? '2px' : '1px',
			...props.style,
		},
	}
}

export default Paper
