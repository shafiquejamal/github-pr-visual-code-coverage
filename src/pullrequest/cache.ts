import { IPullRequestCache } from './types'

const Cache: IPullRequestCache = {
	get: async function (key: string) {
		return await chrome.storage.local.get(key).then(cache => cache[key])
	},
	set: async function (value: object): Promise<void> {
		await chrome.storage.local.set(value)
	}
}

export default Cache
