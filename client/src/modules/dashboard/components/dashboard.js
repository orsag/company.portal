import React, { useState } from 'react'
import Avatar from 'components/avatar'
import Icon from 'components/icon'
import Button from 'components/button'
import { Breadcrumbs, Breadcrumb } from 'components/breadcrumbs'
import Checkbox from 'components/checkbox'
import Chip from 'components/chip'
import CircularProgress from 'components/circular-progress'
import avatarImage from 'assets/foto.jpg'
import { colors } from 'variables'
import styles from './dashboard.module.css'

const Dashboard = () => {
	const [isChecked, setIsChecked] = useState(false)
	const COLORS = [colors.blue, colors.orange, colors.red, colors.purple, colors.greenPrinting, colors.black]

	const fakeOnClick = () => {
		// do nothing
	}

	const onCheck = (event, value) => {
		setIsChecked(value)
	}

	return (
		<div className={styles.root}>
			<h1>Dashboard</h1>
			<div className={styles.section}>
				<h4>Avatar</h4>
				<Avatar size={42} src={avatarImage} />
				<Avatar
					size={48}
					borderColor={'red'}
					borderWidth={2}
					backgroundColor={'orange'}
					hoverColor={'green'}
					src={avatarImage}
				/>
				<Avatar
					size={56}
					hoverColor={'pink'}
					borderColor={'red'}
					backgroundColor={'orange'}
					borderWidth={1}
					icon={<Icon name={'IoIosSettings'} />}
				/>
				<Avatar size={64} color={'black'} icon={<Icon name={'IoIosSettings'} size={26} />} />
			</div>
			<div className={styles.section}>
				<h4>Breadcrumbs</h4>
				<Breadcrumbs>
					<Breadcrumb section>Nastavenia</Breadcrumb>
					<Breadcrumb>Level1</Breadcrumb>
					<Breadcrumb>Level2</Breadcrumb>
					<Breadcrumb>Level3</Breadcrumb>
				</Breadcrumbs>
			</div>

			<div className={styles.section}>
				<h4>Button</h4>
				<Button transparent onClick={fakeOnClick} labelText={'Transparentny'} />
				<Button primary onClick={fakeOnClick} labelText={'Uložiť'} />
				<Button secondary onClick={fakeOnClick} labelText={'Uložiť'} />
				<Button tertiary onClick={fakeOnClick} labelText={'Uložiť'} />

				<Button primary onClick={fakeOnClick} labelText={'Uložiť'} disabled />
				<Button secondary onClick={fakeOnClick} labelText={'Uložiť'} disabled />
				<Button tertiary onClick={fakeOnClick} labelText={'Uložiť'} disabled />
			</div>

			<div className={styles.section}>
				<h4>Checkbox</h4>
				<Checkbox label={'Testovaci checkbox'} checked={isChecked} onCheck={onCheck} />
				<Checkbox disabled label={'Testovaci checkbox'} checked={isChecked} onCheck={onCheck} />
			</div>

			<div className={styles.section}>
				<Chip labelStyle={styles.chipLabel} className={styles.chip} backgroundColor={colors.green}>
					{1000}
				</Chip>
			</div>

			<div className={styles.section}>
				<div className={styles.loadingBar}>
					<CircularProgress />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.colors}>
					{/*{COLORS.map((color) => this.renderColorSwitch(color))}*/}
					{/*<ColorPicker*/}
					{/*	color={this.getUserColor()}*/}
					{/*	onColor={this.handleColorSwitch}*/}
					{/*	switched={!this.isDefaultColor(this.state.color)}*/}
					{/*/>*/}
				</div>
			</div>
		</div>
	)
}

export default Dashboard
