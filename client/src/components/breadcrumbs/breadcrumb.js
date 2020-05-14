/** @jsx jsx */

import { Component } from 'react'
import memoize from 'memoize-one'
import { jsx } from '@emotion/core'
import { colors } from 'variables'

// type Props = {|
// small?: boolean,
// 	children: string,
// 	value?: void | string | number,
// 	section?: boolean,
// 	onClick?: (void | string | number) => void,
// |}

class Breadcrumb extends Component {
	handleClick = () => {
		this.props.onClick && this.props.onClick(this.props.value)
	}

	getStyles = memoize((small, section, onClick) => {
		return {
			root: {
				fontSize: small ? 14 : section ? 32 : 24,
				lineHeight: small ? '24px' : '35px',
				height: small ? 24 : 35,
				padding: '3px 0',
				color: colors.black,
				cursor: onClick ? 'pointer' : 'default',
				pointerEvents: onClick ? 'all' : 'none',
				verticalAlign: 'baseline',
				position: 'relative',
				'&:hover': {
					color: colors.blue,
				},
			},
		}
	})

	render() {
		const styles = this.getStyles(this.props.small, this.props.section, this.props.onClick)

		return (
			<span onClick={this.handleClick} css={styles.root}>
				{this.props.children}
			</span>
		)
	}
}

export default Breadcrumb
