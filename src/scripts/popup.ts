const form = document.querySelector('form')
form?.addEventListener('submit', async event => {
	event.preventDefault()

	const input: HTMLInputElement =
		document.querySelector('form > input') || document.createElement('input')

	await chrome.storage.local.set({ gh_token: input.value })
})
