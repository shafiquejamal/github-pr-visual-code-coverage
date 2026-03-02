document.addEventListener('DOMContentLoaded', async () => {
	const dataCache = await chrome.storage.local.get(null)
	if (dataCache) {
		const pullRequests = Object.entries(dataCache).filter(
			([key, value]) =>
				key.endsWith('/changes') &&
				typeof value === 'object' &&
				Object.keys(value).length > 0
		)

		const tableBody = document.querySelector(
			'div.main-content.right table tbody'
		)

		if (pullRequests.length === 0) {
			const tableRow = document.createElement('tr')
			const tableData = document.createElement('td')
			tableData.colSpan = 3
			tableData.classList.add('no-cache')
			tableData.textContent = 'no cached results to display'
			tableRow.appendChild(tableData)
			tableBody?.appendChild(tableRow)
			return
		}

		pullRequests.forEach(([pathname, value]) => {
			const branch = value.branch
			const artifact = value.coverage_artifact ? 'found' : 'not found'
			const tableRow = document.createElement('tr')
			const tableData = {
				pathname: document.createElement('td'),
				branch: document.createElement('td'),
				artifact: document.createElement('td')
			}

			tableData.pathname.classList.add('pathname')

			tableData.pathname.textContent = pathname
			tableData.branch.textContent = branch
			tableData.artifact.textContent = artifact

			tableRow.appendChild(tableData.pathname)
			tableRow.appendChild(tableData.branch)
			tableRow.appendChild(tableData.artifact)

			tableBody?.appendChild(tableRow)
		})
	}
})
