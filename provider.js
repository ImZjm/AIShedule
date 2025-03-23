async function scheduleHtmlProvider() {

	await loadTool('AIScheduleTools')
	// await AIScheduleAlert('这是一条提示信息')

	//判断当前是否还在登录页面
	if (window.location.pathname.includes('login')){
		await AIScheduleAlert('请先登录');
		return 'do not continue'
	}

	//让用户自己输入学期
	let semester = await AISchedulePrompt({
		titleText: '请输入学期', // 标题内容，字体比较大，超过10个字不给显示的喔，也可以不传就不显示
		tipText: '例2024-2025-2(默认留空即可)\n\nPS: 课程信息来自已选课程。假期开学前, 教务系统未更新课表, 也可尝试使用本课表导入功能导入下学期课表', // 提示信息，字体稍小，支持使用``达到换行效果，具体使用效果建议真机测试，也可以不传就不显示
		defaultText: '', // 文字输入框的默认内容，不传会显示版本号，所以空内容要传个''
		validator: value => { // 校验函数，如果结果不符预期就返回字符串，会显示在屏幕上，符合就返回false
			console.log(value)
			if (value === '')
				return false

			const regex = /^\d{4}-\d{4}-[1-2]$/;
			if (!regex.test(value)) return '请输入正确的学期格式';

			const [startYear, endYear, term] = value.split(/[-]/).map(Number);
			if (startYear + 1 !== endYear) return '请输入正确的学期格式';

			return false;
		}
	});
	if (semester !== ''){
		semester = '&xnxq='+semester;
	}

	// console.log(semester);

	try {
		const timestamp = Date.now()
		const res = await fetch(`https://wids.jw.chaoxing.com/admin/xkgl/yxkccx/listYxkc?gridtype=jqgrid&_search=false&nd=${timestamp}&page.size=50&page.pn=1&sort=id&order=asc${semester}`, {
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

		//判断获得的课程是否为空
		if (ret.total == 0) {
			await AIScheduleAlert('所选学期无课程信息可导入');
			return 'do not continue';
		}
		return JSON.stringify(ret.results)
	} catch (error) {
		// console.error(error)
		await AIScheduleAlert(error.message)
		return 'do not continue'
	}

}
