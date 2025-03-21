async function scheduleHtmlProvider() {

	await loadTool('AIScheduleTools')
	// await AIScheduleAlert('这是一条提示信息')

	const timestamp = Date.now()
	const res = await fetch(`https://wids.jw.chaoxing.com/admin/xkgl/yxkccx/listYxkc?gridtype=jqgrid&_search=false&nd=${timestamp}&page.size=50&page.pn=1&sort=id&order=asc`, {
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://wids.jw.chaoxing.com/admin/xkgl/yxkccx",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	})
	const ret = await res.json()

	return JSON.stringify(ret.results)
}
