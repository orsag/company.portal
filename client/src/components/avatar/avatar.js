import React from 'react'
import PropTypes from 'prop-types'

const Avatar = (props) => {
	const styles = getStyles(this.props)

	if (props.src) {
		return <img style={Object.assign(styles.root, props.style)} src={props.src} className={props.className} />
	} else {
		return (
			<div style={Object.assign(styles.root, this.props.style)} className={props.className}>
				{this.props.icon &&
					React.cloneElement(props.icon, {
						color: styles.icon.color,
						hoverColor: props.hoverColor,
						style: Object.assign(styles.icon),
					})}
				{props.placeholder}
			</div>
		)
	}
}

function getStyles(props) {
	const { backgroundColor, borderColor, borderWidth, color, size } = props
	const iconSize = Math.round((size * 0.65) / 2) * 2

	const styles = {
		root: {
			color: color || '#fff',
			backgroundColor: backgroundColor || '#d3d3d3',
			border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none',
			userSelect: 'none',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: size / 2,
			borderRadius: '50%',
			height: size,
			width: size,
		},
		icon: {
			color: color || '#fff',
			width: iconSize,
			height: iconSize,
			fontSize: iconSize,
			margin: (size - iconSize) / 2,
		},
	}

	return styles
}

Avatar.propTypes = {
	backgroundColor: PropTypes.string,
	borderColor: PropTypes.string,
	borderWidth: PropTypes.number,
	size: PropTypes.number,
	color: PropTypes.string,
	hoverColor: PropTypes.string,
	src: PropTypes.string,
	placeholder: PropTypes.string,
	icon: PropTypes.element,
	style: PropTypes.object,
}

export default Avatar
