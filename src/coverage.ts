import { ICodeCoverage } from './types'

const Coverage: ICodeCoverage = {
	highlight: async function (coverageArtifact) {
		const coverage_json = await coverageArtifact.toJson()

		coverage_json.forEach(({ filename, covered_lines, uncovered_lines }) => {
			const lineElements = document.querySelectorAll(
				`table[aria-label="Diff for: ${filename}"] > tbody > tr > td:nth-child(2)`
			)

			console.log(`${filename}, covered_lines =`, covered_lines)
			console.log(`${filename}, uncovered_lines =`, uncovered_lines)

			lineElements.forEach(lineElement => {
				const code: Element | null = lineElement.querySelector('code')
				if (code?.textContent) {
					const lineNumber = Number(code.textContent)

					covered_lines.forEach(covered_line => {
						if (covered_line === lineNumber) {
							lineElement.classList.add('covered-lines')
						}
					})

					uncovered_lines.forEach(uncovered_line => {
						if (uncovered_line === lineNumber) {
							lineElement.classList.remove('covered-lines')
							lineElement.classList.add('uncovered-lines')
						}
					})
				}
			})
		})
	}
}

export default Coverage
