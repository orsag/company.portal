import { Component } from 'react'
import { unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from 'react-dom'
import { isDescendant } from 'utils/dom'
import PropTypes from 'prop-types'
import { depths } from 'variables'

// heavily inspired by https://github.com/Khan/react-components/blob/master/js/layered-component-mixin.jsx
class RenderToLayer extends Component {
	static propTypes = {
		zIndex: PropTypes.number,
		componentClickAway: PropTypes.func,
		open: PropTypes.bool.isRequired,
		render: PropTypes.func.isRequired,
		useLayerForClickAway: PropTypes.bool,
		target: PropTypes.any, // eslint-disable-line
		anchorEl: PropTypes.any, // eslint-disable-line
	}

	static defaultProps = {
		useLayerForClickAway: true,
	}

	componentDidMount() {
		this.renderLayer()
	}

	componentDidUpdate() {
		this.renderLayer()
	}

	componentWillUnmount() {
		this.unrenderLayer()
	}

	onClickAway = (event) => {
		if (
			this.props.anchorEl &&
			(isDescendant(this.props.anchorEl, event.target) || this.props.anchorEl === event.target)
		) {
			return
		}

		if (!this.props.componentClickAway) {
			return
		}

		if (!this.props.open) {
			return
		}

		const el = this.layer
		if ((event.target !== el && event.target === window) || !isDescendant(el, event.target)) {
			this.props.componentClickAway(event)
		}
	}

	getLayer() {
		return this.layer
	}

	unrenderLayer() {
		if (!this.layer) return

		if (this.props.useLayerForClickAway) {
			this.layer.style.position = 'relative'
			this.layer.removeEventListener('mousedown', this.onClickAway)
		} else {
			window.removeEventListener('mousedown', this.onClickAway)
		}

		unmountComponentAtNode(this.layer)
		const target = this.props.target || document.getElementById('render-to-layer')
		target.contains(this.layer) && target.removeChild(this.layer)
		this.layer = null
	}

	/**
	 * By calling this method in componentDidMount() and
	 * componentDidUpdate(), you're effectively creating a "wormhole" that
	 * funnels React's hierarchical updates through to a DOM node on an
	 * entirely different part of the page.
	 */
	renderLayer() {
		const target = this.props.target || document.getElementById('render-to-layer')
		if (!this.props.open && target) return this.unrenderLayer()
		if (target) {
			if (this.props.open) {
				if (!this.layer) {
					this.layer = document.createElement('div')
					target.appendChild(this.layer)
					this.layer.style.position = this.props.target ? 'absolute' : 'fixed'
					this.layer.style.top = 0
					this.layer.style.bottom = 0
					this.layer.style.left = 0
					this.layer.style.right = 0
					this.layer.style.zIndex = (this.props.zIndex != null && this.props.zIndex) || depths.layer

					if (this.props.useLayerForClickAway) {
						this.layer.addEventListener('mousedown', this.onClickAway)
						this.layer.style.pointerEvents = 'all'
					} else {
						this.layer.style.pointerEvents = 'none'
						setTimeout(() => {
							window.addEventListener('mousedown', this.onClickAway)
						}, 0)
					}
				}

				const layerElement = this.props.render()
				this.layerElement = unstable_renderSubtreeIntoContainer(this, layerElement, this.layer)
			} else {
				this.unrenderLayer()
			}
		}
	}

	render() {
		return null
	}
}

export default RenderToLayer
