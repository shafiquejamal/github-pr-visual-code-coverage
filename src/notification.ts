export function showToastNotification(message: string, duration = 10000) {
	const existingToast = document.querySelector('.toast-notification')
	if (existingToast) return

	const toast = document.createElement('span')
	toast.className = 'toast-notification'
	toast.textContent = message
	toast.classList.add('show')
	document.body.appendChild(toast)

	setTimeout(() => {
		toast.classList.remove('show')
		toast.classList.add('hide')
		toast.addEventListener(
			'transitionend',
			() => {
				toast.remove()
			},
			{ once: true }
		)
	}, duration)
}
