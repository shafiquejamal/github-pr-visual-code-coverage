import Handlers from './handlers'
import { IPullRequest } from './types'

const url = new URL(window.location.href)
const resources = url.pathname.split('/')

const PullRequest: IPullRequest = {
	owner: String(resources?.at(1)),

	repo: String(resources?.at(2)),

	pull_number: Number(resources?.at(4)),

	branch: Handlers.getBranchRef,

	workflow_runs: Handlers.getWorkflowRuns,

	coverage_workflow_run: Handlers.getCoverageWorkflowRun,

	coverage_artifact: Handlers.getCoverageArtifact,

	test_framework: Handlers.getTestFramework,

	artifact_list: Handlers.getArtifactList,

	getBranchRef: function (handler) {
		if (this.branch instanceof Promise) return this

		const { owner, repo, pull_number } = this
		this.branch = handler({ owner, repo, pull_number }).then().catch()
		return this
	},

	getWorkflowRuns: function (handler) {
		if (this.branch instanceof Promise) {
			const { owner, repo, branch } = this
			this.workflow_runs = handler({ owner, repo, branch })
				.then(runs => runs)
				.catch(() => undefined)
			return this
		}

		const { owner, repo, pull_number } = this
		const branch = this.branch({ owner, repo, pull_number })
			.then(ref => ref)
			.catch(() => undefined)

		this.workflow_runs = handler({ owner, repo, branch }).then(runs => runs)
		return this
	},

	getCoverageWorkflowRun: function (handler) {
		if (this.workflow_runs instanceof Promise) {
			this.coverage_workflow_run = handler(this.workflow_runs)
			return this
		}

		if (this.branch instanceof Promise) {
			const { owner, repo, branch } = this
			const workflow_runs = this.workflow_runs({ owner, repo, branch })
			this.coverage_workflow_run = handler(workflow_runs)
			return this
		}

		const { owner, repo, pull_number } = this
		const branch = this.branch({ owner, repo, pull_number })
		const workflow_runs = this.workflow_runs({ owner, repo, branch })
		this.coverage_workflow_run = handler(workflow_runs)

		return this
	},

	getArtifactList: function (handler) {
		if (this.coverage_workflow_run instanceof Promise) {
			const { owner, repo } = this
			const run_id = this.coverage_workflow_run.then(run => run?.id)
			this.artifact_list = handler({ owner, repo, run_id })
		}

		return this
	},

	getCoverageArtifact: function (handler): IPullRequest {
		if (this.artifact_list instanceof Promise) {
			const { owner, repo, artifact_list } = this
			this.coverage_artifact = handler({ owner, repo, artifact_list })
		}

		return this
	},

	getTestFramework: function (handler): IPullRequest {
		if (this.coverage_workflow_run instanceof Promise) {
			this.test_framework = handler(this.coverage_workflow_run)
		}

		return this
	},

	highlightCodeCoverage: async function (handler) {
		if (
			this.test_framework instanceof Promise &&
			this.coverage_artifact instanceof Promise
		) {
			const { test_framework, coverage_artifact } = this
			await handler({ test_framework, coverage_artifact })
		}
	}
}

export default PullRequest
