import { showToastNotification } from './notification'
import { ICodeCoverage } from './types'

const Coverage: ICodeCoverage = {
	highlight: async function (coverageArtifact) {
		const coverage_json = await coverageArtifact.toJson()

		const lineNumberElementCheck = document.querySelector(
			`table > tbody > tr > td[data-line-number][data-diff-side="right"]`
		)

		if (!lineNumberElementCheck) {
			showToastNotification(
				'Highlighting is broken - please update your HTML queries.'
			)
		}

		type Customization = {
			covered: {
				thickness: number
				color: string
			}
			uncovered: {
				thickness: number
				color: string
			}
		}

		const customization: Customization | undefined = await new Promise(
			resolve => {
				chrome.storage.local.get(['customization'], data => {
					resolve(data.customization)
				})
			}
		)

		if (customization) {
			// covered - update highlights
			document.documentElement.style.setProperty(
				'--covered-lines-color',
				customization.covered.color
			)
			document.documentElement.style.setProperty(
				'--covered-highlight-thickness',
				`${customization.covered.thickness}px`
			)

			// uncovered - update highlights
			document.documentElement.style.setProperty(
				'--uncovered-lines-color',
				customization.uncovered.color
			)
			document.documentElement.style.setProperty(
				'--uncovered-highlight-thickness',
				`${customization.uncovered.thickness}px`
			)
		}

		chrome.storage.onChanged.addListener((changes, area) => {
			if (area === 'local' && changes.customization) {
				const customization: Customization = changes.customization.newValue
				console.log(customization)

				// covered - update highlights
				document.documentElement.style.setProperty(
					'--covered-lines-color',
					customization.covered.color
				)
				document.documentElement.style.setProperty(
					'--covered-highlight-thickness',
					`${customization.covered.thickness}px`
				)

				// uncovered - update highlights
				document.documentElement.style.setProperty(
					'--uncovered-lines-color',
					customization.uncovered.color
				)
				document.documentElement.style.setProperty(
					'--uncovered-highlight-thickness',
					`${customization.uncovered.thickness}px`
				)
			}
		})

		coverage_json.forEach(({ filename, covered_lines, uncovered_lines }) => {
			function highlightLine(className: string) {
				return function (lineNumber: Number) {
					const lineNumberElement = document.querySelector(
						`table[aria-label="Diff for: ${filename}"] > tbody > tr > td[data-line-number="${lineNumber}"][data-diff-side="right"]`
					)
					if (lineNumberElement && lineNumberElement.textContent) {
						if (Number(lineNumberElement.textContent.trim()) === lineNumber) {
							lineNumberElement.classList.add(className)
						}
					}
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
