import { useState } from 'react'

const demoUrl = 'https://api.steampowered.com/ISteamWebAPIUtil/GetServerInfo/v1/'

export default function CORS() {
	const [result, setResult] = useState('')
	const [loading, setLoading] = useState(false)

	async function callApi() {
		setLoading(true)
		setResult('')

		try {
			const response = await fetch(demoUrl)
			setResult(`Request succeeded with status ${response.status}.`)
		} catch (error) {
			setResult(error instanceof Error ? error.message : String(error))
		} finally {
			setLoading(false)
		}
	}

	return (
		<main style={{ maxWidth: 720, margin: '0 auto', padding: 32, textAlign: 'left' }}>
			<h1 style={{ fontSize: 36 }}>Browser CORS demo</h1>
			<p>
				This page tries to fetch the Steam Web API. Its response does not allow this
				page's origin, so the browser should block it.
			</p>
			<pre style={{ overflowX: 'auto', padding: 16, background: '#f4f3ec' }}>
				<code>{`fetch('${demoUrl}')`}</code>
			</pre>
			<button type="button" onClick={callApi} disabled={loading}>
				{loading ? 'Calling...' : 'Call demo API'}
			</button>
			{result && (
				<p role="status" style={{ marginTop: 16 }}>
					Result: <code>{result}</code>
					<br />
					Check the browser console for the CORS error details.
				</p>
			)}
		</main>
	)
}
