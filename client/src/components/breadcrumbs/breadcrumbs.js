/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { Component } from 'react'
import Icon from 'components/icon'

// type Props = {|
// 	children: Array<React$Element<typeof Breadcrumb>>,
// 	small?: boolean,
// |}

class Breadcrumbs extends Component {
	render() {
		const styles = getStyles(this.props)

		let children = []
		React.Children.forEach(this.props.children, (item, index) => {
			if (item) {
				index &&
					children.push(
						<Icon
							name="IoIosArrowForward"
							size={this.props.small ? 16 : 20}
							key={`arrow-${index}`}
							color={'#636363'}
							hoverColor={'#636363'}
							style={styles.arrow}
						/>,
					)
				children.push(
					React.cloneElement(item, {
						small: this.props.small,
						key: index,
					}),
				)
			}
		})

		return <div css={styles.root}>{children}</div>
	}
}

function getStyles(props) {
	const { small } = props

	return {
		root: {
			padding: small ? '15px 0 0 0 25px' : '12px 0',
			lineHeight: small ? '24px' : '35px',
		},
		arrow: {
			verticalAlign: small ? 'middle' : 'baseline',
			margin: small ? 0 : '0 10px -3px 14px',
		},
	}
}

export default Breadcrumbs
