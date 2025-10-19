import Cache from './cache'
import Coverage from '../coverage'
import { Octokit } from '@octokit/rest'
import { getAuthToken } from './credential'
import { IPullRequestHandlers } from './types'
import { JestCoverageArtifact } from '../frameworks/jest'
import { PytestCoverageArtifact } from '../frameworks/pytest'
import { GoTestCoverageArtifact } from '../frameworks/gotest'
import { RustTestCoverageArtifact } from '../frameworks/rustest'

const url = new URL(window.location.href)

const Handlers: IPullRequestHandlers = {
	getBranchRef: async function ({ owner, repo, pull_number }) {
		const cache = await Cache.get(url.pathname)
		if (cache?.branch) return cache.branch

		const octokit = new Octokit({ auth: await getAuthToken() })
		const branch = await octokit.pulls
			.get({ owner, repo, pull_number })
			.then(response => response.data)
			.then(data => data.head.ref)
			.catch(err => {
				console.log(err)
				return undefined
			})

		const updatedCache = { ...cache, branch }
		await Cache.set({ [url.pathname]: updatedCache })

		return branch
	},

	getWorkflowRuns: async function ({ owner, repo, branch: branchRef }) {
		const branch = await branchRef
		if (!branch) return undefined

		const cache = await Cache.get(url.pathname)
		if (cache?.workflow_runs) return cache.workflow_runs

		const octokit = new Octokit({ auth: await getAuthToken() })
		const workflow_runs = await octokit.rest.actions
			.listWorkflowRunsForRepo({ owner, repo, branch })
			.then(response => response.data.workflow_runs)
			.catch(err => {
				console.log(err)
				return undefined
			})

		const updatedCache = { ...cache, workflow_runs }
		await Cache.set({ [url.pathname]: updatedCache })

		return workflow_runs
	},

	getCoverageWorkflowRun: async function (workflow_runs) {
		const workflowRuns = await workflow_runs
		if (!workflowRuns) return undefined

		const cache = await Cache.get(url.pathname)
		if (cache?.coverage_workflow_run) return cache.coverage_workflow_run

		const coverage_workflow_run =
			workflowRuns
				.filter(
					run =>
						run.name == 'Test Package' ||
						run.name == 'Jest' ||
						run.name == 'Pytest' ||
						run.name == 'GoTest' ||
						run.name == 'RustTest'
				)
				.at(0) ?? undefined

		const updatedCache = { ...cache, coverage_workflow_run }
		await Cache.set({ [url.pathname]: updatedCache })
		return coverage_workflow_run
	},

	getArtifactList: async function ({ owner, repo, run_id: runId }) {
		const run_id = await runId
		if (!run_id) return undefined

		const cache = await Cache.get(url.pathname)
		if (cache?.artifact_list) return cache.artifact_list

		const octokit = new Octokit({ auth: await getAuthToken() })
		const artifact_list = await octokit.rest.actions
			.listWorkflowRunArtifacts({
				owner,
				repo,
				run_id
			})
			.then(response => response.data.artifacts)
			.catch(() => undefined)

		const updatedCache = { ...cache, artifact_list }
		await Cache.set({ [url.pathname]: updatedCache })

		return artifact_list
	},

	getCoverageArtifact: async function ({ owner, repo, artifact_list }) {
		const artifactList = await artifact_list.then(list => list)
		if (!artifactList) return undefined

		const cache = await Cache.get(url.pathname)
		if (cache?.coverage_artifact) return cache.coverage_artifact

		const artifact = artifactList
			.filter(artifact => artifact.name === 'coverage.json')
			?.at(0)

		if (!artifact) return undefined

		const octokit = new Octokit({ auth: await getAuthToken() })
		const coverage_artifact = await octokit.rest.actions
			.downloadArtifact({
				owner,
				repo,
				artifact_id: artifact.id,
				archive_format: 'zip'
			})
			.then(response => response.data)
			// @ts-expect-error this should be fine
			.then(buffer => new Uint8Array(buffer))
			.then(uint8 => Array.from(uint8))
			.catch(() => undefined)

		const updatedCache = { ...cache, coverage_artifact }
		await Cache.set({ [url.pathname]: updatedCache })
		return coverage_artifact
	},

	getTestFramework: async function (workflowRun) {
		if (!workflowRun) return undefined

		const cache = await Cache.get(url.pathname)
		if (cache?.test_framework) return cache.test_framework

		const workflow_run = await workflowRun
		const test_framework = workflow_run?.name ?? undefined

		const updatedCache = { ...cache, test_framework }
		await Cache.set({ [url.pathname]: updatedCache })

		return test_framework
	},

	highlightCodeCoverage: async function ({
		test_framework: framework,
		coverage_artifact: artifact
	}): Promise<void> {
		const test_framework = await framework
		const coverage_artifact = await artifact

		if (!test_framework) return
		if (!coverage_artifact) return

		switch (test_framework) {
			case 'Jest':
			case 'Test Package':
				await Coverage.highlight(new JestCoverageArtifact(coverage_artifact))
				break

			case 'Pytest':
				await Coverage.highlight(new PytestCoverageArtifact(coverage_artifact))
				break

			case 'RustTest':
				await Coverage.highlight(
					new RustTestCoverageArtifact(coverage_artifact)
				)
				break

			case 'GoTest':
				await Coverage.highlight(new GoTestCoverageArtifact(coverage_artifact))
				break
		}
	}
}
export default Handlers
