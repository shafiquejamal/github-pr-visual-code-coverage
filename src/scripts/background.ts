chrome.webNavigation.onHistoryStateUpdated.addListener(
	details => {
		// Only send message for /changes SPA route
		const url = new URL(details.url)
		if (
			url.pathname.endsWith('/changes') ||
			url.pathname.endsWith('/changes?diff=unified') ||
			url.pathname.endsWith('/changes?diff=split')
		) {
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
