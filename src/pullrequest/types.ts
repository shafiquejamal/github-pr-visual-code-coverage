import { Endpoints } from '@octokit/types'
import { ICoverageArtifact } from '../types'

type GetBranchRefParams =
	Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['parameters']

type GetBranchRefResponse =
	Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}']['response']['data']['head']['ref']

type GetWorkflowRunsResponse =
	Endpoints['GET /repos/{owner}/{repo}/actions/runs']['response']['data']['workflow_runs']

type GetArtifactListResponse =
	Endpoints['GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts']['response']['data']['artifacts']

type GetCoverageWorkflowRunResponse = Awaited<
	Promise<GetWorkflowRunsResponse>
>[number]

type GetWorkflowRunsParams = {
	owner: string
	repo: string
	branch: Promise<GetBranchRefResponse | undefined>
}

type GetArtifactListParams = {
	owner: string
	repo: string
	run_id: Promise<
		Awaited<Promise<GetWorkflowRunsResponse>>[number]['id'] | undefined
	>
}

type GetCoverageArtifactParams = {
	owner: string
	repo: string
	artifact_list: Promise<GetArtifactListResponse | undefined>
}

export interface IPullRequest {
	owner: string

	repo: string

	pull_number: number

	branch:
		| Promise<GetBranchRefResponse | undefined>
		| IPullRequestHandlers['getBranchRef']

	workflow_runs:
		| Promise<GetWorkflowRunsResponse | undefined>
		| IPullRequestHandlers['getWorkflowRuns']

	test_framework:
		| Promise<string | undefined>
		| IPullRequestHandlers['getTestFramework']

	coverage_workflow_run:
		| Promise<Awaited<Promise<GetWorkflowRunsResponse>>[number] | undefined>
		| IPullRequestHandlers['getCoverageWorkflowRun']

	artifact_list:
		| Promise<GetArtifactListResponse | undefined>
		| IPullRequestHandlers['getArtifactList']

	coverage_artifact:
		| Promise<Array<number> | undefined>
		| IPullRequestHandlers['getCoverageArtifact']

	getBranchRef(handler: IPullRequestHandlers['getBranchRef']): IPullRequest

	getWorkflowRuns(
		handler: IPullRequestHandlers['getWorkflowRuns']
	): IPullRequest

	getCoverageWorkflowRun(
		handler: IPullRequestHandlers['getCoverageWorkflowRun']
	): IPullRequest

	getArtifactList(
		handler: IPullRequestHandlers['getArtifactList']
	): IPullRequest

	getCoverageArtifact(
		handler: IPullRequestHandlers['getCoverageArtifact']
	): IPullRequest

	getTestFramework(
		handler: IPullRequestHandlers['getTestFramework']
	): IPullRequest

	highlightCodeCoverage(
		hander: IPullRequestHandlers['highlightCodeCoverage']
	): Promise<void>
}

export interface IPullRequestHandlers {
	getBranchRef(
		params: GetBranchRefParams
	): Promise<GetBranchRefResponse | undefined>

	getWorkflowRuns(
		params: GetWorkflowRunsParams
	): Promise<GetWorkflowRunsResponse | undefined>

	getCoverageWorkflowRun(
		params: Promise<GetWorkflowRunsResponse | undefined>
	): Promise<GetCoverageWorkflowRunResponse | undefined>

	getArtifactList(
		params: GetArtifactListParams
	): Promise<GetArtifactListResponse | undefined>

	getCoverageArtifact(
		params: GetCoverageArtifactParams
	): Promise<Array<number> | undefined>

	getTestFramework(
		params: Promise<
			Awaited<Promise<GetWorkflowRunsResponse>>[number] | undefined
		>
	): Promise<string | undefined>

	highlightCodeCoverage(params: {
		test_framework: Promise<string | undefined>
		coverage_artifact: Promise<Array<number> | undefined>
	}): Promise<void>
}

export interface IPullRequestCache {
	get(key: string): Promise<
		| {
				branch: Awaited<ReturnType<IPullRequestHandlers['getBranchRef']>>
				workflow_runs: Awaited<
					ReturnType<IPullRequestHandlers['getWorkflowRuns']>
				>
				coverage_workflow_run: Awaited<
					ReturnType<IPullRequestHandlers['getCoverageWorkflowRun']>
				>
				artifact_list: Awaited<
					ReturnType<IPullRequestHandlers['getArtifactList']>
				>
				coverage_artifact: Awaited<
					ReturnType<IPullRequestHandlers['getCoverageArtifact']>
				>
				test_framework: Awaited<
					ReturnType<IPullRequestHandlers['getTestFramework']>
				>
				coverage_json: Awaited<ReturnType<ICoverageArtifact['toJson']>>
		  }
		| undefined
	>
	set(value: object): Promise<void>
}
