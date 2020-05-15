/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import memoize from 'memoize-one'
import ReactDOM from 'react-dom'
import RenderToLayer from 'components/internal/RenderToLayer'
import { colors, depths } from 'variables'
import { autoTestId } from 'utils/tests/autotest'

// type AlignType =
// | 'bottom-center'
// | 'bottom-right'
// | 'bottom-left'
// | 'center-left'
// | 'center-right'
// | 'top-center'
// | 'top-left'
// | 'top-left-center'
// | 'top-right'
// | 'top-right-center'
//
// type ArrowAlignType =
// | 'bottom-center'
// | 'bottom-right'
// | 'bottom-left'
// | 'top-center'
// | 'top-left'
// | 'top-right'
// | 'center-left'
// | 'center-right'
//
// type OverflowedType = 'left' | 'right'
//
// type Props = {|
// ...AutoTestProps,
// 	label: Node,
// 	align: AlignType,
// 	arrowAlign: ArrowAlignType,
// 	children?: any,
// 	visible?: boolean,
// 	renderToLayer?: boolean,
// 	inline?: boolean,
// 	hoverable?: boolean,
// 	style?: Object,
// 	wrapperStyle?: Object,
// 	disabled?: boolean,
// 	multiLine?: boolean,
// 	id?: string,
// |}
//
// export type State = {|
// 	hovered: boolean,
// 	overflowedX: ?OverflowedType,
// |}

class Tooltip extends Component {
	timeout = null
	root = null

	static defaultProps = {
		align: 'bottom-center',
		arrowAlign: 'top-center',
		renderToLayer: true,
	}

	state = {
		hovered: false,
		overflowedX: null,
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.disabled && prevState.hovered) {
			return { hovered: false }
		}
		return null
	}

	onMouseEnter = () => {
		if (!this.props.disabled) {
			this.timeout && clearTimeout(this.timeout)
			this.setState({
				hovered: true,
			})
		}
	}

	onMouseLeave = () => {
		if (!this.props.hoverable) {
			return this.hideTooltip()
		}
		this.timeout = setTimeout(this.hideTooltip, 150)
	}

	hideTooltip = () => {
		this.setState({
			hovered: false,
		})
	}

	// AlignType
	getCorrectedAlign = (align) => {
		if (!this.state.overflowedX) return align
		let alignArray = align.split('-')

		if ('left' === this.state.overflowedX) {
			alignArray[1] = alignArray[1]
				.replace('left', 'temp')
				.replace('right', 'left')
				.replace('temp', 'right')
				.replace('center', 'left')
		} else if ('right' === this.state.overflowedX) {
			alignArray[1] = alignArray[1]
				.replace('left', 'temp')
				.replace('right', 'left')
				.replace('temp', 'right')
				.replace('center', 'right')
		}

		return alignArray.join('-')
	}

	getAlignStyle() {
		const element = ReactDOM.findDOMNode(this)
		const align = this.getCorrectedAlign(this.props.align)

		if (element && element instanceof HTMLElement) {
			const rect = element.getBoundingClientRect()

			switch (align) {
				case 'bottom-center':
					return {
						top: this.props.renderToLayer ? rect.top + element.offsetHeight : '100%',
						left: this.props.renderToLayer ? rect.left + element.offsetWidth / 2 : '50%',
						transform: 'translate(-50%, 10px)',
					}
				case 'bottom-right':
					return {
						top: this.props.renderToLayer ? rect.top + element.offsetHeight + 10 : 'calc(100% + 10px)',
						left: this.props.renderToLayer ? rect.right : '100%',
						transform: 'translate(-100%, 10px)',
					}
				case 'bottom-left':
					return {
						top: this.props.renderToLayer ? rect.top + element.offsetHeight : '100%',
						left: this.props.renderToLayer ? rect.left : '0',
						transform: 'translate(0, 10px)',
					}
				case 'center-left':
					return {
						top: this.props.renderToLayer ? rect.top + element.offsetHeight / 2 : '50%',
						left: this.props.renderToLayer ? rect.left : '100%',
						transform: 'translate(calc(-100% - 12px), -50%)',
					}
				case 'center-right':
					return {
						top: this.props.renderToLayer ? rect.top + element.offsetHeight / 2 : '50%',
						left: this.props.renderToLayer ? rect.right : '100%',
						transform: 'translate(12px, -50%)',
					}
				case 'top-center':
					return {
						top: this.props.renderToLayer ? rect.top : 0,
						left: this.props.renderToLayer ? rect.left + element.offsetWidth / 2 : '50%',
						transform: 'translate(-50%, calc(-100% - 10px))',
					}
				case 'top-left':
					return {
						top: this.props.renderToLayer ? rect.top : 0,
						left: this.props.renderToLayer ? rect.right : '100%',
						transform: 'translate(calc(-100%), calc(-100% - 10px))',
					}
				case 'top-left-center':
					return {
						top: this.props.renderToLayer ? rect.top : 0,
						left: this.props.renderToLayer ? rect.left : 0,
						transform: 'translate(calc(-100% - 12px), -50%)',
					}
				case 'top-right':
					return {
						top: this.props.renderToLayer ? rect.top : 0,
						left: this.props.renderToLayer ? rect.right : '100%',
						transform: 'translateX(12px)',
					}
				case 'top-right-center':
					return {
						top: this.props.renderToLayer ? rect.top : 0,
						left: this.props.renderToLayer ? rect.right : '100%',
						transform: 'translate(12px, -50%)',
					}
			}
		}
	}

	getArrowAlignStyle() {
		const align = this.getCorrectedAlign(this.props.arrowAlign)
		const borderReset = '6px solid transparent'

		switch (align) {
			case 'bottom-center':
				return {
					left: '50%',
					bottom: '-12px',
					transform: 'translateX(-50%) scaleX(0.75)',
					borderTopColor: colors.gray900,
					borderRightColor: borderReset,
					borderBottomColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'bottom-left':
				return {
					left: '20px',
					bottom: '-12px',
					transform: 'translateX(-50%) scaleX(0.75)',
					borderTopColor: colors.gray900,
					borderRightColor: borderReset,
					borderBottomColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'bottom-right':
				return {
					right: '20px',
					bottom: '-12px',
					transform: 'translateX(50%) scaleX(0.75)',
					borderTopColor: colors.gray900,
					borderRightColor: borderReset,
					borderBottomColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'top-center':
				return {
					left: '50%',
					top: '-12px',
					transform: 'translateX(-50%) scaleX(0.75)',
					borderBottomColor: colors.gray900,
					borderRightColor: borderReset,
					borderTopColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'top-left':
				return {
					left: '10px',
					top: '-12px',
					transform: 'translateX(-50%) scaleX(0.75)',
					borderBottomColor: colors.gray900,
					borderRightColor: borderReset,
					borderTopColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'top-right':
				return {
					right: '10px',
					top: '-12px',
					transform: 'translateX(-50%) scaleX(0.75)',
					borderBottomColor: colors.gray900,
					borderRightColor: borderReset,
					borderTopColor: borderReset,
					borderLeftColor: borderReset,
				}
			case 'center-left':
				return {
					left: '-12px',
					top: '50%',
					transform: 'translateY(-50%) scaleY(0.75)',
					borderRightColor: colors.gray900,
					borderLeftColor: borderReset,
					borderTopColor: borderReset,
					borderBottomColor: borderReset,
				}
			case 'center-right':
				return {
					right: '-12px',
					top: '50%',
					transform: 'translateY(-50%) scaleY(0.75)',
					borderLeftColor: colors.gray900,
					borderRight: borderReset,
					borderTop: borderReset,
					borderBottom: borderReset,
				}
		}
	}

	setPlacement = () => {
		if (!this.root) return null
		const rect = this.root.getBoundingClientRect()

		if (rect.left < 0) {
			this.setState({
				overflowedX: 'left',
			})
		} else if (rect.right > window.innerWidth) {
			this.setState({
				overflowedX: 'right',
			})
		}
	}

	bindRoot = (element) => {
		this.root = element
		this.setPlacement()
	}

	renderLayer = () => {
		const styles = this.getStyles(
			this.props.inline,
			this.props.visible,
			this.props.hoverable,
			this.props.multiLine,
			this.props.style,
			this.props.wrapperStyle,
			this.state.hovered,
		)
		const alignTooltipStyle = this.getAlignStyle()
		const arrowAlignStyle = this.getArrowAlignStyle()

		return (
			<div
				ref={this.bindRoot}
				onMouseEnter={this.props.hoverable ? this.onMouseEnter : null}
				onMouseLeave={this.onMouseLeave}
				css={styles.tooltip}
				style={alignTooltipStyle}
			>
				<div css={styles.labelContainer}>{this.props.label}</div>
				<div css={styles.arrow} style={arrowAlignStyle} />
			</div>
		)
	}

	isTooltipVisible = () => {
		if (this.props.disabled) return false
		if (this.props.hasOwnProperty('visible') && this.props.visible !== undefined)
			return this.props.label && this.props.visible
		return this.props.label && (this.props.visible || this.state.hovered)
	}

	getStyles = memoize((inline, visible, hoverable, multiLine, style, wrapperStyle, hovered) => {
		return {
			wrapper: {
				display: inline ? 'inline-block' : 'block',
				position: 'relative',
				...wrapperStyle,
			},
			arrow: {
				position: 'absolute',
				border: '6px solid transparent',
			},
			tooltip: {
				position: 'absolute',
				backgroundColor: colors.gray900,
				opacity: hovered || visible ? 1 : 0,
				padding: '8px 13px',
				zIndex: depths.tooltip,
				pointerEvents: hoverable ? 'all' : 'none',
				maxWidth: 640,
				...style,
			},
			labelContainer: {
				fontSize: 12,
				color: colors.white,
				lineHeight: '16px',
				textAlign: 'center',
				overflow: 'hidden',
				overflowWrap: 'break-word',
				whiteSpace: multiLine ? 'unset' : 'nowrap',
			},
		}
	})

	render() {
		const styles = this.getStyles(
			this.props.inline,
			this.props.visible,
			this.props.hoverable,
			this.props.multiLine,
			this.props.style,
			this.props.wrapperStyle,
			this.state.hovered,
		)
		return (
			<div
				onMouseEnter={this.props.label ? this.onMouseEnter : undefined}
				onMouseLeave={this.props.label ? this.onMouseLeave : undefined}
				css={styles.wrapper}
				id={this.props.id ? `tooltip-${this.props.id}` : null}
				{...autoTestId(this.props.autoTestId)}
			>
				{this.isTooltipVisible() &&
					(this.props.renderToLayer ? (
						<RenderToLayer render={this.renderLayer} open useLayerForClickAway={false} />
					) : (
						this.renderLayer()
					))}
				{this.props.children}
			</div>
		)
	}
}

export default Tooltip
