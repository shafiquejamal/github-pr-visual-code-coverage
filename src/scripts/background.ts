chrome.webNavigation.onHistoryStateUpdated.addListener(
	details => {
		// Only send message for /changes SPA route
		const url = new URL(details.url)
		console.log('background url', url)
		if (url.pathname.endsWith('/changes')) {
			chrome.tabs
				.sendMessage(details.tabId, {
					type: 'ROUTE_CHANGED'
				})
				.catch(err => {
					// Sometimes content script is not yet loaded
					console.log('Content script not found in this tab', err)
				})
		}
	},
	{ url: [{ hostContains: 'github.com', pathContains: '/pull/' }] }
)
