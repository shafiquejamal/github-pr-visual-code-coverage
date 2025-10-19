import JSZip from 'jszip'
import Cache from '../pullrequest/cache'
import { ICoverageArtifact, JestCoverageJsonFile } from '../types'

export class JestCoverageArtifact implements ICoverageArtifact {
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

		const jsonString =
			(await zip.file('coverage-final.json')?.async('string')) ?? ''

		const coverage_json: JestCoverageJsonFile = JSON.parse(jsonString)

		const files = Object.keys(coverage_json)

		const code_coverage = files.map(absolute_path => {
			const repository = absolute_path.split('/').at(4)
			const root_path = `/home/runner/work/${repository}/${repository}/`
			const relative_path = absolute_path.replace(root_path, '')

			const statements = coverage_json[absolute_path].s
			const statementMap = coverage_json[absolute_path].statementMap

			const getCoveredStatements =
				(statements: (typeof coverage_json)[string]['s']) =>
				(statement: keyof typeof statements) =>
					statements[statement] >= 1

			const getUncoveredStatements =
				(statements: (typeof coverage_json)[string]['s']) =>
				(statement: keyof typeof statements) =>
					statements[statement] == 0

			const getLineRange =
				(statementMap: (typeof coverage_json)[string]['statementMap']) =>
				(statement: keyof (typeof coverage_json)[string]['statementMap']) => {
					const start = statementMap[statement].start.line
					const end = statementMap[statement].end.line
					return new Array(end - start + 1).fill(0).map((_, idx) => start + idx)
				}

			const covered_lines = Object.keys(statements)
				.map(Number)
				.filter(getCoveredStatements(statements))
				.flatMap(getLineRange(statementMap))
				.filter((line, idx, self) => self.indexOf(line) === idx)

			const uncovered_lines = Object.keys(statements)
				.map(Number)
				.filter(getUncoveredStatements(statements))
				.flatMap(getLineRange(statementMap))
				.filter((line, idx, self) => self.indexOf(line) === idx)

			return {
				filename: relative_path,
				covered_lines,
				uncovered_lines
			}
		})

		return code_coverage
	}
}
