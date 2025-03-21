/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({
	providerRes,
	parserRes
} = {}) {
	// 支持异步操作 推荐await写法

	//获取总周数
	let totalWeek = 0;
	const weekCountRes = await fetch("https://wids.jw.chaoxing.com/admin/getCurrentPkZc", {
		"headers": {
			"accept": "*/*",
			"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://wids.jw.chaoxing.com/admin",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});
	const weeks = await weekCountRes.json();
	totalWeek = weeks.data.length;

	//获取开学时间
	let startSemester = "";
	const semesterRes = await fetch("https://wids.jw.chaoxing.com/admin/getXqByZc", {
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://wids.jw.chaoxing.com/admin",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": "zc=1",
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
	const semesterJson = await semesterRes.json();
	// console.log(semesterJson);
	const semesterNo1Day = semesterJson.data[0].date;
	const currentYear = new Date().getFullYear();
	const [month, day] = semesterNo1Day.split("-").map(Number);
	const currentDate = new Date(currentYear, month - 1, day);
	startSemester = String(currentDate.getTime());

	//获取每节课的上下课时间
	let sections = [];
	const sectionsRes = await fetch("https://wids.jw.chaoxing.com/admin/getXsdSykb", {
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://wids.jw.chaoxing.com/admin",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": "type=2",
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
	const sectionsJson = await sectionsRes.json();
	// console.log(sectionsJson);
	sectionsTimer = sectionsJson.data.jcKcxx;
	sectionsTimer.forEach(item => {
		sections.push({
			section: item.jc,
			startTime: item.kssj,
			endTime: item.jssj
		});
	});
	sections = sections.filter(sec => sec != null);

	// 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
	return {
		totalWeek, // 总周数：[1, 30]之间的整数
		startSemester, // 开学时间：时间戳，13位长度字符串，推荐用代码生成
		startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
		showWeekend: true, // 是否显示周末
		forenoon: 4, // 上午课程节数：[1, 10]之间的整数
		afternoon: 4, // 下午课程节数：[0, 10]之间的整数
		night: 4, // 晚间课程节数：[0, 10]之间的整数
		sections,
	}
	// PS: 夏令时什么的还是让用户在夏令时的时候重新导入一遍吧，在这个函数里边适配吧！奥里给！————不愿意透露姓名的嘤某人
}