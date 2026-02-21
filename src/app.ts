import Cache from './pullrequest/cache'

const App = {
	renderUI: async function () {
		const url = new URL(window.location.href)
		const cache = await Cache.get(url.pathname)

		if (!cache?.coverage_artifact) return
	}
}

export default App
