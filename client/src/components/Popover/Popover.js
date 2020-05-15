import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { autoTestId } from 'utils/tests/autotest'
import EventListener, { withOptions } from 'react-event-listener'
import PopoverAnimationVerticalSubtle from './PopoverAnimationVerticalSubtle'
import RenderToLayer from 'components/internal/RenderToLayer'
import { throttle } from 'lodash'

// type AlignType = { vertical: 'top' | 'center' | 'bottom', horizontal: 'left' | 'middle' | 'right' }
//
// type Props = {
// 	...AutoTestProps,
// 	/**
// 	 * This is the DOM element that will be used to set the position of the
// 	 * popover.
// 	 */
// 	anchorEl: any,
// 	/**
// 	 * This is the point on the anchor where the popover's
// 	 * `targetOrigin` will attach to.
// 	 * Options:
// 	 * vertical: [top, center, bottom]
// 	 * horizontal: [left, middle, right].
// 	 */
// 	anchorOrigin: AlignType,
// 	/**
// 	 * Show arrow. Values are none, top, bottom, left, right
// 	 */
// 	arrow: string,
// 	children?: any,
// 	className?: string,
// 	onRequestClose?: string => void,
// 	onMouseEnter?: () => void,
// 	onMouseLeave?: () => void,
// 	open?: boolean,
// 	/**
// 	 * If true, the popover will stretch its width to match the container.
// 	 */
// 	stretch?: boolean,
// 	style?: Object,
// 	/**
// 	 * This is the point on the popover which will attach to
// 	 * the anchor's origin.
// 	 * Options:
// 	 * vertical: [top, center, bottom]
// 	 * horizontal: [left, middle, right].
// 	 */
// 	targetOrigin: AlignType,
// 	/**
// 	 * If true, the popover will render on top of an invisible
// 	 * layer, which will prevent clicks to the underlying
// 	 * elements, and trigger an `onRequestClose('clickAway')` call.
// 	 */
// 	useLayerForClickAway: boolean,
// 	/**
// 	 * The zDepth of the popover.
// 	 */
// 	zDepth?: number,
// 	maxHeight: number,
// 	maxWidth: number,
// 	offsetX?: number,
// 	offsetY?: number,
// }
//
// export type State = {
// 	open: boolean,
// 	closing: boolean,
// 	arrow: string,
// }

class Popover extends Component {
	target = null
	reverted = false // boolean

	static defaultProps = {
		anchorOrigin: {
			vertical: 'bottom',
			horizontal: 'left',
		},
		targetOrigin: {
			vertical: 'top',
			horizontal: 'left',
		},
		useLayerForClickAway: false,
		zDepth: 1,
		arrow: 'none',
		maxHeight: 580,
		maxWidth: 580,
	}

	state = {
		open: !!this.props.open,
		closing: false,
		reverted: false,
		arrow: this.props.arrow,
	}

	handleResize = null
	handleScroll = null
	timeout = null
	anchorEl = null
	scroller = null

	constructor(props) {
		super(props)
		this.handleResize = throttle(this.setPlacement, 100)
		this.handleScroll = throttle(this.setPlacement.bind(this, true), 10, { leading: true, trailing: true })
	}

	componentDidMount() {
		this.setPlacement()
		this.target = this.getTargetParent(this.refs.root)
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.open === this.props.open) {
			return
		}

		if (nextProps.open) {
			this.timeout && clearTimeout(this.timeout)
			this.anchorEl = nextProps.anchorEl || this.props.anchorEl
			this.setState({
				open: true,
				closing: false,
			})
		} else {
			this.setState({ closing: true })
			this.timeout = setTimeout(() => {
				this.setState({
					open: false,
					closing: false,
				})
			}, 500)
		}
	}

	componentDidUpdate() {
		this.setPlacement()
	}

	componentWillUnmount() {
		this.handleResize && this.handleResize.cancel()
		this.handleScroll && this.handleScroll.cancel()

		if (this.timeout) {
			clearTimeout(this.timeout)
			this.timeout = null
		}
	}

	bindScroller = (element) => {
		this.scroller = element
	}

	renderScroller = () => {
		const style = getStyles(this.props, this.state)

		return (
			<div
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}
				style={style.scroller}
				ref={this.bindScroller}
				{...autoTestId(this.props.autoTestId)}
			>
				{this.props.children}
			</div>
		)
	}

	renderLayer = () => {
		const { style, targetOrigin, className } = this.props
		const mergedStyles = { ...getStyles(this.props, this.state).layer, ...style }

		return (
			<PopoverAnimationVerticalSubtle
				zDepth={this.props.zDepth}
				targetOrigin={targetOrigin}
				style={mergedStyles}
				className={className}
				open={this.props.open}
				arrow={this.state.arrow}
			>
				{this.renderScroller()}
			</PopoverAnimationVerticalSubtle>
		)
	}

	requestClose(reason) {
		// string
		this.props.onRequestClose && this.props.onRequestClose(reason)
	}

	componentClickAway = (event) => {
		//Event
		event.preventDefault()
		this.requestClose('clickAway')
	}

	isIOS = () => /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream

	getOffsetTop = (elem) => {
		let yPos = elem.offsetTop
		let tempEl = elem.offsetParent

		while (tempEl != null) {
			yPos += tempEl.offsetTop
			tempEl = tempEl.offsetParent
		}

		return yPos
	}

	getAnchorPosition(el) {
		if (!el) {
			el = ReactDOM.findDOMNode(this)
		}

		if (el instanceof HTMLElement) {
			const rect = el.getBoundingClientRect()
			let a = {
				top: rect.top,
				left: rect.left,
				width: el.offsetWidth,
				height: el.offsetHeight,
				right: rect.right || rect.left + el.offsetWidth,
				bottom: undefined,
				middle: undefined,
				center: undefined,
			}

			// The fixed positioning isn't respected on iOS when an input is focused.
			// We need to compute the position from the top of the page and not the viewport.
			if (this.isIOS() && document.activeElement && document.activeElement.tagName === 'INPUT') {
				a.bottom = this.getOffsetTop(el) + a.height
			} else {
				a.bottom = rect.bottom || a.top + a.height
			}
			a.middle = a.left + (a.right - a.left) / 2
			a.center = a.top + (a.bottom - a.top) / 2

			return a
		}
	}

	getTargetPosition(targetEl) {
		if (targetEl instanceof HTMLElement) {
			return {
				top: 0,
				center: targetEl.offsetHeight / 2,
				bottom: targetEl.offsetHeight,
				left: 0,
				middle: targetEl.offsetWidth / 2,
				right: targetEl.offsetWidth,
			}
		}
	}

	getRevertedAlign = (align) => {
		//string
		return align.replace('top', 'temp').replace('bottom', 'top').replace('temp', 'bottom')
	}

	getCorrectedAlign = (align) => {
		//string
		return this.reverted ? this.getRevertedAlign(align) : align
	}

	setPlacement = async (scrolling) => {
		//?boolean
		if (!this.state.open) return
		const layer = await this.refs.layer.getLayer()
		if (!layer) return

		const targetEl = layer.children[0]
		if (!targetEl) return

		const targetOrigin = {
			horizontal: this.props.targetOrigin.horizontal,
			vertical: this.getCorrectedAlign(this.props.targetOrigin.vertical),
		}

		const anchorOrigin = {
			horizontal: this.props.anchorOrigin.horizontal,
			vertical: this.getCorrectedAlign(this.props.anchorOrigin.vertical),
		}

		const anchorEl = this.props.anchorEl || this.anchorEl
		const anchor = this.getAnchorPosition(anchorEl)
		const targetWidth = anchor ? anchor.width : null

		if (this.props.stretch && targetWidth) {
			targetEl.style.width = `${targetWidth}px`
		} else {
			targetEl.style.maxWidth = `${this.props.maxWidth}px`
		}

		const target = this.getTargetPosition(targetEl)
		const offsetY = this.props.offsetY ? (this.reverted ? -1 * this.props.offsetY : this.props.offsetY) : 0

		const targetPosition = {
			top:
				anchor && target && anchor[anchorOrigin.vertical]
					? anchor[anchorOrigin.vertical] - target[targetOrigin.vertical] + offsetY
					: null,
			left:
				anchor && target && anchor[anchorOrigin.horizontal]
					? anchor[anchorOrigin.horizontal] - target[targetOrigin.horizontal] + (this.props.offsetX || 0)
					: null,
		}

		if (targetPosition.top) targetEl.style.top = `${Math.round(targetPosition.top)}px`
		if (targetPosition.left) targetEl.style.left = `${Math.round(Math.max(0, targetPosition.left))}px`

		if (!scrolling) {
			const container = this.getScrollParent(anchorEl)
			if (container instanceof HTMLElement) {
				const remainingHeight = container.scrollHeight - (container.scrollTop + window.innerHeight)
				const computedMaxHeight = Math.floor(
					window.innerHeight - (targetPosition.top || 0) - 24 + (remainingHeight || 0),
				)
				const computedMaxHeightReverted = Math.floor(
					container.scrollHeight - computedMaxHeight - 24 - 24 - (anchor ? anchor.height || 0 : 0),
				)
				const maxHeight = Math.min(this.props.maxHeight, computedMaxHeight)

				if (this.props.maxHeight > 0) {
					targetEl.style.maxHeight = `${this.props.maxHeight}px`
					if (this.scroller) this.scroller.style.maxHeight = `${this.props.maxHeight - 2}px`
				}

				if (!this.reverted && targetEl.offsetHeight > computedMaxHeight) {
					if (targetEl.offsetHeight < computedMaxHeightReverted) {
						this.reverted = true
						this.setState({ arrow: this.getCorrectedAlign(this.props.arrow) })
						this.setPlacement()
					} else {
						if (maxHeight > 0) {
							targetEl.style.maxHeight = `${maxHeight}px`
							if (this.scroller) this.scroller.style.maxHeight = `${maxHeight - 2}px`
						}
					}
				}
			}
		}
	}

	getScrollParent(node) {
		if (!node) return null
		if (node instanceof HTMLElement) {
			const overflowY = window.getComputedStyle(node).overflowY
			const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden'

			if (isScrollable && node.clientHeight > 0 && node.scrollHeight >= node.clientHeight) return node
		}
		return this.getScrollParent(node.parentNode) || document.body
	}

	getTargetParent(node) {
		if (!node) return null
		if (node instanceof HTMLElement && node.dataset.popoverTarget) return node
		return this.getTargetParent(node.parentNode) || null
	}

	render() {
		const style = getStyles(this.props, this.state)

		return (
			<div style={style.root} ref="root">
				<EventListener
					target="window"
					onScroll={withOptions(this.handleScroll, { capture: true })}
					onResize={this.handleResize}
				/>
				<RenderToLayer
					ref="layer"
					target={this.target}
					anchorEl={this.props.anchorEl}
					open={!!this.state.open}
					componentClickAway={this.componentClickAway}
					useLayerForClickAway={this.props.useLayerForClickAway}
					render={this.renderLayer}
				/>
			</div>
		)
	}
}

function getStyles(props, state) {
	const style = {
		root: {
			display: 'none',
		},
		scroller: {
			overflowY: 'auto',
			overflowX: 'hidden',
			pointerEvents: props.open || state.open || state.closing ? 'all' : 'none',
		},
		layer: {},
	}

	return style
}

export default Popover
