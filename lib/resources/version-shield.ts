export const escape = (s: string) => s
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&apos;')

export const template = (environment: string = "Unknown", version: string = "-") => {
	const subject = escape(environment)
	const status = escape(version)
	const widths = [(subject.length * 6.5) + 10, (status.length * 6.5) + 10]
	return `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink" width="${widths[0]+widths[1]}" height="20" role="img" aria-label="${subject}: ${status}">
			<title>${subject}: ${status}</title>
			<linearGradient id="s" x2="0" y2="100%">
					<stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
					<stop offset="1" stop-opacity=".1"/>
			</linearGradient>
			<clipPath id="r">
					<rect width="${widths[0]+widths[1]}" height="20" rx="3" fill="#fff"/>
			</clipPath>
			<g clip-path="url(#r)">
					<rect width="${widths[0]}" height="20" fill="#555"/>
					<rect x="${widths[0]}" width="${widths[1]}" height="20" fill="#007ec6"/>
					<rect width="${widths[0]+widths[1]}" height="20" fill="url(#s)"/>
			</g>
			<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
					<text aria-hidden="true" x="${(widths[0]/2)*10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(widths[0]-10)*10}">${subject}</text>
					<text x="${(widths[0]/2)*10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(widths[0]-10)*10}">${subject}</text>
					<text aria-hidden="true" x="${(widths[0]+widths[1]/2)*10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(widths[1]-10)*10}">${status}</text>
					<text x="${(widths[0]+widths[1]/2)*10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(widths[1]-10)*10}">${status}</text>
			</g>
		</svg>
	`
}
