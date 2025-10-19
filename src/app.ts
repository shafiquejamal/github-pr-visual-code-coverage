import Cache from './pullrequest/cache'

function toggleCoverageUI(visible: boolean) {
	if (!visible) {
		document
			.querySelectorAll('td[data-line-number]')
			.forEach(line => line.classList.add('hide'))
	} else {
		document
			.querySelectorAll('td[data-line-number]')
			.forEach(line => line.classList.remove('hide'))
	}
}

const App = {
	renderUI: async function () {
		const url = new URL(window.location.href)
		const cache = await Cache.get(url.pathname)

		if (!cache?.coverage_artifact) return

		const showCoverage: boolean =
			(await chrome.storage.local
				.get('show_coverage')
				.then(value => value['show_coverage'])) ?? true

		toggleCoverageUI(showCoverage)

		const toggleButton = document.createElement('button')
		toggleButton.dataset.showCoverage = String(showCoverage == true)
		toggleButton.textContent = `coverage: ${showCoverage == true ? 'hide' : 'show'}`
		toggleButton.classList.add('toggle-coverage')
		document.body.appendChild(toggleButton)

		const button = document.querySelector('button.toggle-coverage')
		button?.addEventListener('click', async () => {
			const showCoverage: boolean =
				(await chrome.storage.local
					.get('show_coverage')
					.then(value => value['show_coverage'])) ?? true
			await chrome.storage.local.set({ show_coverage: !showCoverage })
			button?.setAttribute('data-show-coverage', String(!showCoverage))
			button.textContent = `coverage: ${!showCoverage ? 'hide' : 'show'}`

			toggleCoverageUI(!showCoverage)
		})
	}
}

export default App
