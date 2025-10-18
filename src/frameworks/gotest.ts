import JSZip from 'jszip'
import Cache from '../pullrequest/cache'
import { ICoverageArtifact, GoTestCoverageJsonFile } from '../types'

export class GoTestCoverageArtifact implements ICoverageArtifact {
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

		const coverage_json: GoTestCoverageJsonFile = JSON.parse(jsonString)

		return coverage_json.map(code => {
			const repository = code.file.split('/').at(4)
			const root_path = `/home/runner/work/${repository}/${repository}/`

			const filename = code.file.replace(root_path, '')

			const covered_lines = code.statements
				.filter(({ reached }) => reached == 1)
				.map(({ lines }) => lines)
				.flat()

			const uncovered_lines = code.statements
				.filter(({ reached }) => reached == 0)
				.map(({ lines }) => lines)
				.flat()

			return {
				filename,
				covered_lines,
				uncovered_lines
			}
		})
	}
}
