import JSZip from 'jszip'
import Cache from '../pullrequest/cache'
import { ICoverageArtifact, PytestCoverageJsonFile } from '../types'

export class PytestCoverageArtifact implements ICoverageArtifact {
	coverage_artifact: Array<number>

	constructor(coverage_artifact: Array<number>) {
		this.coverage_artifact = coverage_artifact
	}
	async toJson() {
		const url = new URL(window.location.href)
		const cache = await Cache.get(url.pathname)

		if (cache?.coverage_json) return cache.coverage_json

		const buffer = new Uint8Array(this.coverage_artifact).buffer
		const zip = await JSZip.loadAsync(buffer)

		const jsonString = (await zip.file('coverage.json')?.async('string')) ?? ''

		const coverage_json: PytestCoverageJsonFile = JSON.parse(jsonString)

		const code_coverage = Object.keys(coverage_json.files).map(filename => {
			const covered_lines = coverage_json.files[filename].executed_lines
			const uncovered_lines = coverage_json.files[filename].missing_lines
			return {
				filename,
				covered_lines,
				uncovered_lines
			}
		})

		return code_coverage
	}
}
