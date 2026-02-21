import { ICodeCoverage } from './types'

const Coverage: ICodeCoverage = {
	highlight: async function (coverageArtifact) {
		const coverage_json = await coverageArtifact.toJson()

		coverage_json.forEach(({ filename, covered_lines, uncovered_lines }) => {
			function highlightLine(className: string) {
				return function (lineNumber: Number) {
					document
						.querySelectorAll(
							`table[aria-label="Diff for: ${filename}"] > tbody > tr > td[data-line-number="${lineNumber}"]`
						)
						.forEach(element => {
							if (Number(element?.textContent) === lineNumber) {
								element.classList.add(className)
							}
						})
				}
			}

			function applyHighlights() {
				covered_lines.forEach(highlightLine('covered-lines'))
				uncovered_lines.forEach(highlightLine('uncovered-lines'))
			}

			const diffList = document.querySelector(
				'[data-testid="progressive-diffs-list"]'
			)

			if (diffList) {
				let timeout: number
				const observer = new MutationObserver(() => {
					applyHighlights()
					clearTimeout(timeout)
					timeout = window.setTimeout(() => applyHighlights(), 50)
				})

				// Watch for dynamically added lines
				observer.observe(diffList, {
					childList: true,
					subtree: true
				})
			}

			applyHighlights()
		})
	}
}

export default Coverage
