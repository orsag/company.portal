import React from 'react'
import { IconContext } from 'react-icons'
import PropTypes from 'prop-types'
import {
	IoIosHome,
	IoIosGlobe,
	IoIosDocument,
	IoIosBookmarks,
	IoLogoUsd,
	IoMdWarning,
	IoIosSettings,
	IoIosCube,
} from 'react-icons/io'

const Icon = (props) => {
	// eslint-disable-next-line
	const getIcon = (icon) => {
		switch (icon) {
			case 'IoIosHome':
				return <IoIosHome />
			case 'IoIosGlobe':
				return <IoIosGlobe />
			case 'IoIosDocument':
				return <IoIosDocument />
			case 'IoIosBookmarks':
				return <IoIosBookmarks />
			case 'IoLogoUsd':
				return <IoLogoUsd />
			case 'IoMdWarning':
				return <IoMdWarning />
			case 'IoIosSettings':
				return <IoIosSettings />
			default:
				return <IoIosCube />
		}
	}

	const mergeStyles = {
		color: props.color, // hex value string
		size: props.size, // '24px'
		className: props.className, // from CSS file
		style: props.style, // overrides color, size
		title: props.title, // description
	}

	return <IconContext.Provider value={mergeStyles}>{getIcon(props.name)}</IconContext.Provider>
}

Icon.propTypes = {
	name: PropTypes.string,
	color: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	size: PropTypes.string,
	title: PropTypes.string,
}

export default Icon
