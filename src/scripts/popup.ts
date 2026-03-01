const form = document.querySelector('form.popup-options')

form?.addEventListener('click', async event => {
	event.preventDefault()

	if (event.target instanceof HTMLElement && event.target.textContent) {
		switch (event.target.textContent) {
			case 'credentials':
				chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
					chrome.tabs.create({
						url: chrome.runtime.getURL('credentials.html'),
						index: tab.index + 1
					})
				})
				break
			case 'customization':
				console.log('customization button')
				break
			case 'clear cache':
				chrome.tabs.query(
					{ active: true, currentWindow: true },
					async ([tab]) => {
						if (!tab?.url) return

						const url = new URL(tab.url)
						if (
							!url.pathname.endsWith('/changes') ||
							!url.pathname.endsWith('/changes?diff=unified') ||
							!url.pathname.endsWith('/changes?diff=split')
						)
							return
						if (tab?.id) {
							await chrome.storage.local.remove(url.pathname)
							await chrome.tabs.reload(tab.id, { bypassCache: false })
						}

						// close popup options
						window.close()
					}
				)
				break
			default:
				return
		}
	}
})
