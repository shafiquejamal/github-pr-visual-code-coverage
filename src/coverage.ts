import { ICodeCoverage } from './types'

const Coverage: ICodeCoverage = {
	highlight: async function (coverageArtifact) {
		const coverage_json = await coverageArtifact.toJson()

		coverage_json.forEach(({ filename, covered_lines, uncovered_lines }) => {
			const file = document.querySelector(`[data-file-path="${filename}"]`)
			if (file) {
				covered_lines.forEach(line => {
					file
						.querySelectorAll(`td[data-line-number="${line}"]`)
						.forEach(e => e.classList.add('covered-lines'))
				})
				uncovered_lines.forEach(line => {
					file.querySelectorAll(`td[data-line-number="${line}"]`).forEach(e => {
						e.classList.remove('covered-lines')
						e.classList.add('uncovered-lines')
					})
				})
			}
		})

		document.querySelectorAll('td.blob-num.blob-num-expandable').forEach(e =>
			e.addEventListener('click', () => {
				setTimeout(() => {
					this.highlight(coverageArtifact)
				}, 1000)
			})
		)
	}
}

export default Coverage
