// export type AutoTestProps = {|
// autoTestId?: string,
// |}

export function autoTestId(id, suffix) {
	return id ? { 'data-autotest-id': id + (suffix ? `-${suffix}` : '') } : {}
}

//(autoTestId?: string, suffix?: string)
export function passAutoTestId(autoTestId, suffix) {
	if (autoTestId) {
		return { autoTestId: autoTestId + (suffix ? `-${suffix}` : '') }
	}
}
