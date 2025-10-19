chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
	if (changeInfo.url && changeInfo.url.endsWith('/files')) {
		await chrome.scripting
			.executeScript({
				target: { tabId },
				files: ['scripts/content.js']
			})
			.then(data => console.log(data))
			.catch(err => console.log(err))
	}
})
