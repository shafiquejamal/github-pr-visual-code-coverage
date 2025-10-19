import JSZip from 'jszip'
import Cache from '../pullrequest/cache'
import { ICoverageArtifact, RustTestCoverageJsonFile } from '../types'

export class RustTestCoverageArtifact implements ICoverageArtifact {
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

		const coverage_json: RustTestCoverageJsonFile = JSON.parse(jsonString)

		return coverage_json.data[0].files.map(file => {
			const repository = file.filename.split('/').at(4)
			const root_path = `/home/runner/work/${repository}/${repository}/`

			const filename = file.filename.replace(root_path, '')

			const covered_lines = file.segments
				.filter(segment => segment[2] >= 1)
				.map(([line]) => line)

			const uncovered_lines = file.segments
				.filter(
					segment => segment[2] === 0 && !covered_lines.includes(segment[0])
				)
				.map(([line]) => line)

			return {
				filename,
				covered_lines,
				uncovered_lines
			}
		})
	}
}
