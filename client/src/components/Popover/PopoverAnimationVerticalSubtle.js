import React, { Component } from 'react'
import PropTypes from 'prop-types'
import propTypes from 'utils/propTypes'
import Paper from '../Paper'
import { depths } from 'variables'

class PopoverAnimationVerticalSubtle extends Component {
	static propTypes = {
		children: PropTypes.node,
		arrow: PropTypes.string,
		className: PropTypes.string,
		open: PropTypes.bool.isRequired,
		style: PropTypes.object,
		targetOrigin: propTypes.origin.isRequired,
		zDepth: propTypes.zDepth,
	}

	static defaultProps = {
		style: {},
		zDepth: 1,
	}

	state = {
		open: false,
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ open: true })
		}, 50)
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			open: nextProps.open,
		})
	}

	render() {
		const styles = getStyles(this.props, this.state)

		return (
			<Paper
				arrow={this.props.arrow}
				zDepth={this.props.zDepth}
				className={this.props.className}
				style={{ ...styles.root, ...this.props.style }}
			>
				{this.props.children}
			</Paper>
		)
	}
}

function getStyles(props, state) {
	const { open } = state

	return {
		root: {
			position: 'fixed',
			zIndex: depths.popover,
			opacity: open ? 1 : 0,
			transform: open ? 'scaleY(1) translateY(0)' : 'scaleY(0.9) translateY(-10px)',
			transformOrigin: 'top center',
			transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1), opacity 450ms cubic-bezier(0.23, 1, 0.32, 1)',
			maxHeight: '100%',
		},
	}
}

export default PopoverAnimationVerticalSubtle
