export async function getAuthToken(): Promise<string> {
	return await chrome.storage.local
		.get('gh_token')
		.then(data => data['gh_token'])
}
