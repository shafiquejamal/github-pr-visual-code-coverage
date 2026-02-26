document.addEventListener('DOMContentLoaded', async () => {
	function maskInputValue(value: string, visibleChar: number = 5) {
		const visiblePart = value.slice(-5)
		const maskedPart = '•'.repeat(Math.max(0, value.length - visibleChar))
		const credsInputPreview = document.querySelector('span.creds-input-preview')
		if (credsInputPreview) {
			if (visibleChar !== 0) {
				credsInputPreview.textContent = maskedPart + visiblePart
			} else {
				credsInputPreview.textContent = maskedPart
			}
		}
	}

	function updatedTimeAgo(timestamp: number): string {
		const now = Date.now()
		const diff = now - timestamp

		const seconds = Math.floor(diff / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)
		const months = Math.floor(days / 30)

		if (seconds < 60)
			return `updated ${seconds} sec${seconds !== 1 ? 's' : ''} ago`
		if (minutes < 60)
			return `updated ${minutes} min${minutes !== 1 ? 's' : ''} ago`
		if (hours < 24) return `updated ${hours} hr${hours !== 1 ? 's' : ''} ago`
		if (days < 30) return `updated ${days} day${days !== 1 ? 's' : ''} ago`
		return `updated ${months} month${months !== 1 ? 's' : ''} ago`
	}

	const toggleEyeButton: HTMLButtonElement | null = document.querySelector(
		'button.toggle-token-btn'
	)
	const credsInputField: HTMLInputElement | null = document.querySelector(
		'input[name="gh-token-classic-input"]'
	)

	const token: string | undefined = await chrome.storage.local
		.get('gh_token')
		.then(data => data['gh_token'])

	if (token && credsInputField) {
		maskInputValue(token)
		credsInputField.value = token
	}

	toggleEyeButton?.addEventListener('click', event => {
		event.preventDefault()
		const show = toggleEyeButton.getAttribute('data-show-creds') === 'true'
		toggleEyeButton.setAttribute('data-show-creds', (!show).toString())
		credsInputField?.setAttribute('data-transparent-text', (!!show).toString())
	})

	credsInputField?.addEventListener('input', event => {
		if (event.target instanceof HTMLInputElement) {
			const value = event.target.value
			maskInputValue(value)
		}
	})

	const updateTokenBtn: HTMLButtonElement | null = document.querySelector(
		'button.update-token-btn'
	)

	credsInputField?.addEventListener('input', async event => {
		if (event.target instanceof HTMLInputElement) {
			if (updateTokenBtn) {
				const value = event.target.value
				updateTokenBtn.disabled = value === '' || value === token
			}
		}
	})

	credsInputField?.addEventListener('input', async () => {
		if (updateTokenBtn) {
			if (
				(credsInputField.value === '' && token === undefined) ||
				(credsInputField.value !== '' && token === undefined)
			) {
				updateTokenBtn.textContent = 'add'
			} else if (credsInputField.value === token) {
				chrome.storage.local.get(['gh_token_updated_at'], result => {
					updateTokenBtn.textContent = updatedTimeAgo(
						result.gh_token_updated_at
					)
				})
			} else {
				updateTokenBtn.textContent = 'update'
			}
		}
	})

	const tokenInputForm: HTMLFormElement | null = document.querySelector(
		'.main-content.right form'
	)

	tokenInputForm?.addEventListener('submit', () => {
		if (credsInputField?.value) {
			chrome.storage.local.set({
				gh_token: credsInputField.value,
				gh_token_updated_at: Date.now(),
				gh_token_status: 'unknown'
			})
		}
	})

	if (credsInputField && updateTokenBtn) {
		if (
			(credsInputField.value === '' && token === undefined) ||
			(credsInputField.value !== '' && token === undefined)
		) {
			updateTokenBtn.textContent = 'add'
		} else if (credsInputField.value === token) {
			chrome.storage.local.get(['gh_token_updated_at'], result => {
				if (result.gh_token_updated_at) {
					updateTokenBtn.textContent = updatedTimeAgo(
						result.gh_token_updated_at
					)
				} else {
					chrome.storage.local.set({ gh_token_updated_at: Date.now() }, () => {
						chrome.storage.local.get(['gh_token_updated_at'], result => {
							updateTokenBtn.textContent = updatedTimeAgo(
								result.gh_token_updated_at
							)
						})
					})
				}
			})
		} else {
			updateTokenBtn.textContent = 'update'
		}
	}

	const fullyMaskedTokenCheckbox = document.querySelector(
		'label input#fully-masked-token-checkbox'
	)

	fullyMaskedTokenCheckbox?.addEventListener('change', event => {
		const target = event.target as HTMLInputElement
		if (credsInputField) {
			target.checked
				? maskInputValue(credsInputField.value, 0)
				: maskInputValue(credsInputField.value)
		}
	})

	fullyMaskedTokenCheckbox?.addEventListener('change', () => {
		if (updateTokenBtn) {
			chrome.storage.local.get(['gh_token_updated_at'], result => {
				updateTokenBtn.textContent = updatedTimeAgo(result.gh_token_updated_at)
			})
		}
	})

	const tokenStatusElement = document.querySelector('span.token-status')
	if (token && tokenStatusElement) {
		const tokenStatus: string | undefined = await chrome.storage.local
			.get('gh_token_status')
			.then(data => data['gh_token_status'])

		if (tokenStatus) {
			switch (tokenStatus) {
				case 'good':
					tokenStatusElement.textContent = 'token status - good'
					tokenStatusElement.classList.add('good')
					tokenStatusElement.classList.remove('bad')
					tokenStatusElement.classList.remove('unknown')
					break
				case 'bad':
					tokenStatusElement.textContent = 'token status - bad'
					tokenStatusElement.classList.add('bad')
					tokenStatusElement.classList.remove('good')
					tokenStatusElement.classList.remove('unknown')
					break
				case 'unknown':
					tokenStatusElement.textContent = 'token status - unknown'
					tokenStatusElement.classList.add('unknown')
					tokenStatusElement.classList.remove('good')
					tokenStatusElement.classList.remove('bad')
					break
				default:
					console.log('src/scripts/credentials.ts tokenStatus', tokenStatus)
			}
		}
	}
})
