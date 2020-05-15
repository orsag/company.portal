/** @jsx jsx */

import { PureComponent } from 'react'
import { jsx } from '@emotion/core'
import memoize from 'memoize-one'
import { colors } from 'variables'

const THICKNESS = 3.5

// type Props = {|
// 	size: number,
// |}

function getArcLength(fraction, props) {
	return fraction * Math.PI * (props.size - THICKNESS)
}

class CircularProgress extends PureComponent {
	static defaultProps = {
		size: 40,
	}

	rotateWrapperTimer = null
	scalePathTimer = null

	componentDidMount() {
		this.scalePath(this.refs.path)
		this.rotateWrapper(this.refs.wrapper)
	}

	componentWillUnmount() {
		this.scalePathTimer && clearTimeout(this.scalePathTimer)
		this.rotateWrapperTimer && clearTimeout(this.rotateWrapperTimer)
	}

	scalePath(path, step = 0) {
		step %= 3

		if (step === 0) {
			path.style.strokeDasharray = `${getArcLength(0, this.props)}, ${getArcLength(1, this.props)}`
			path.style.strokeDashoffset = 0
			path.style.transitionDuration = '0ms'
		} else if (step === 1) {
			path.style.strokeDasharray = `${getArcLength(0.7, this.props)}, ${getArcLength(1, this.props)}`
			path.style.strokeDashoffset = getArcLength(-0.3, this.props)
			path.style.transitionDuration = '750ms'
		} else {
			path.style.strokeDasharray = `${getArcLength(0.7, this.props)}, ${getArcLength(1, this.props)}`
			path.style.strokeDashoffset = getArcLength(-1, this.props)
			path.style.transitionDuration = '850ms'
		}

		this.scalePathTimer = setTimeout(() => this.scalePath(path, step + 1), step ? 750 : 250)
	}

	rotateWrapper(wrapper) {
		wrapper.style.transform = 'rotate(0deg)'
		wrapper.style.transitionDuration = '0ms'

		setTimeout(() => {
			wrapper.style.transform = 'rotate(1800deg)'
			wrapper.style.transitionDuration = '10s'
			wrapper.style.transitionTimingFunction = 'linear'
		}, 50)

		this.rotateWrapperTimer = setTimeout(() => this.rotateWrapper(wrapper), 10050)
	}

	getStyles = memoize((size) => {
		return {
			root: {
				position: 'relative',
				display: 'inline-block',
				width: size,
				height: size,
			},
			wrapper: {
				width: size,
				height: size,
				display: 'inline-block',
				transition: 'transform 20s linear',
				transitionTimingFunction: 'linear',
			},
			svg: {
				width: size,
				height: size,
				position: 'relative',
			},
			path: {
				stroke: colors.blue,
				strokeLinecap: 'round',
				transition: 'all 1500ms ease-in-out',
				strokeDasharray: 'initial',
			},
		}
	})

	render() {
		const { size } = this.props
		const styles = this.getStyles(size)

		return (
			<div css={styles.root}>
				<div ref="wrapper" css={styles.wrapper}>
					<svg viewBox={`0 0 ${size} ${size}`} css={styles.svg}>
						<circle
							ref="path"
							css={styles.path}
							cx={size / 2}
							cy={size / 2}
							r={(size - THICKNESS) / 2}
							fill="none"
							strokeWidth={THICKNESS}
							strokeMiterlimit="20"
						/>
					</svg>
				</div>
			</div>
		)
	}
}

export default CircularProgress
