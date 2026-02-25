const form = document.querySelector('form.popup-options')

form?.addEventListener('click', async event => {
	event.preventDefault()

	if (event.target instanceof HTMLElement && event.target.textContent) {
		switch (event.target.textContent) {
			case 'credentials':
				chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
					const index = tabs[0].index + 1

					chrome.tabs.create({
						url: chrome.runtime.getURL('credentials.html'),
						index
					})
				})
				break
			case 'customization':
				console.log('customization button')
				break
			case 'clear cache':
				console.log('clear cache button')
				break
			default:
				return
		}
	}
})
