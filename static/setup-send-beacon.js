function get_session_data_from_cookie() {
	const cookies = document.cookie.split(';');
	const session_cookie = cookies.find((cookie) =>
		cookie.trim().startsWith('session-data='),
	);
	return session_cookie
		? JSON.parse(decodeURIComponent(session_cookie.split('=')[1]))
		: null;
}

window.addEventListener('beforeunload', () => {
	const session_data = get_session_data_from_cookie();
	if (session_data) {
		navigator.sendBeacon(
			'/session-end',
			JSON.stringify(session_data),
		);
	}
});
