export default (state, action) => {
	switch (action.type) {
		case 'TOGGLE_SIDEBAR':
			return {
				...state,
				isSidebarOpen: action.payload,
			}
		default:
			return state
	}
}
