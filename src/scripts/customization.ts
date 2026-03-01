type Customization = {
	covered: {
		thickness: number
		color: string
	}
	uncovered: {
		thickness: number
		color: string
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	let customization: Customization | undefined = await new Promise(resolve => {
		chrome.storage.local.get(['customization'], data => {
			resolve(data.customization)
		})
	})

	if (!customization) {
		function getPropertyValue(variable: string) {
			return getComputedStyle(document.documentElement).getPropertyValue(
				variable
			)
		}

		customization = {
			covered: {
				color: getPropertyValue('--covered-lines-color').trim() || '#2ecc71',
				thickness:
					parseInt(
						getPropertyValue('--covered-highlight-thickness')
							.trim()
							.replace('px', '')
					) || 5
			},
			uncovered: {
				color: getPropertyValue('--uncovered-lines-color').trim() || '#f55353',
				thickness:
					parseInt(
						getPropertyValue('--uncovered-highlight-thickness')
							.trim()
							.replace('px', '')
					) || 5
			}
		}

		return chrome.storage.local.set({ customization })
	}

	const covered = {
		formInput: document.querySelector('form.covered-lines') as HTMLFormElement,
		colorInput: document.querySelector(
			'form.covered-lines input.color'
		) as HTMLInputElement,
		thicknessInput: document.querySelector(
			'form.covered-lines input.thickness'
		) as HTMLInputElement
	}

	const uncovered = {
		formInput: document.querySelector(
			'form.uncovered-lines'
		) as HTMLFormElement,
		colorInput: document.querySelector(
			'form.uncovered-lines input.color'
		) as HTMLInputElement,
		thicknessInput: document.querySelector(
			'form.uncovered-lines input.thickness'
		) as HTMLInputElement
	}

	if (covered.colorInput && covered.thicknessInput) {
		covered.colorInput.value = customization.covered.color
		covered.thicknessInput.value = `${customization.covered.thickness}`

		document.documentElement.style.setProperty(
			'--covered-lines-color',
			customization.covered.color
		)
		document.documentElement.style.setProperty(
			'--covered-highlight-thickness',
			`${customization.covered.thickness}px`
		)
	}

	if (uncovered.colorInput && uncovered.thicknessInput) {
		uncovered.colorInput.value = customization.uncovered.color
		uncovered.thicknessInput.value = `${customization.uncovered.thickness}`

		document.documentElement.style.setProperty(
			'--uncovered-lines-color',
			customization.uncovered.color
		)
		document.documentElement.style.setProperty(
			'--uncovered-highlight-thickness',
			`${customization.uncovered.thickness}px`
		)
	}

	covered.formInput?.addEventListener('submit', async event => {
		event.preventDefault()
		const colorInput = covered.colorInput
		const thicknessInput = covered.thicknessInput
		if (colorInput?.value && thicknessInput?.value) {
			const color = colorInput.value.trim()
			const thickness = thicknessInput.value.trim().replace('px', '')
			const customization: Customization | undefined = await new Promise(
				resolve => {
					chrome.storage.local.get(['customization'], data => {
						resolve(data.customization)
					})
				}
			)

			chrome.storage.local.set({
				customization: {
					...customization,
					covered: {
						color,
						thickness
					}
				}
			})

			document.documentElement.style.setProperty('--covered-lines-color', color)
			document.documentElement.style.setProperty(
				'--covered-highlight-thickness',
				`${thickness}px`
			)
		}
	})

	uncovered.formInput?.addEventListener('submit', async event => {
		event.preventDefault()
		const colorInput = uncovered.colorInput
		const thicknessInput = uncovered.thicknessInput
		if (colorInput?.value && thicknessInput?.value) {
			const color = colorInput.value.trim()
			const thickness = thicknessInput.value.trim().replace('px', '')
			const customization: Customization | undefined = await new Promise(
				resolve => {
					chrome.storage.local.get(['customization'], data => {
						resolve(data.customization)
					})
				}
			)

			chrome.storage.local.set({
				customization: {
					...customization,
					uncovered: {
						color,
						thickness
					}
				}
			})

			document.documentElement.style.setProperty(
				'--uncovered-lines-color',
				color
			)
			document.documentElement.style.setProperty(
				'--uncovered-highlight-thickness',
				`${thickness}px`
			)
		}
	})
})
