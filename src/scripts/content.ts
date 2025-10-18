import App from '../app'
import PullRequest from '../pullrequest'
import Handlers from '../pullrequest/handlers'
;(async () => {
	await PullRequest.getBranchRef(Handlers.getBranchRef)
		.getWorkflowRuns(Handlers.getWorkflowRuns)
		.getCoverageWorkflowRun(Handlers.getCoverageWorkflowRun)
		.getArtifactList(Handlers.getArtifactList)
		.getCoverageArtifact(Handlers.getCoverageArtifact)
		.getTestFramework(Handlers.getTestFramework)
		.highlightCodeCoverage(Handlers.highlightCodeCoverage)

	await App.renderUI()
})()
