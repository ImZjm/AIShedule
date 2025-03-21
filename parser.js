function scheduleHtmlParser(jsonStr) {
	//最终的课表数据
	let courseInfos = [];

	//将jsonStr转换为json对象
	let jsonData = JSON.parse(jsonStr);
	jsonData.forEach(item => {
		// console.log(item);
		courses = item.sksjdd.split(';').map(course => course.trim()).filter(course => course !== '');

		const regex = /^第([\d,-]+)周\s+(星期[一二三四五六日])\s+(\d+-\d+)节【(.+?)】$/;

		//遍历每门课的上课时间地点 '第2-15周 星期一 3-4节【T11临湖轩A4049】;\n第2-7,9,11,13,15周 星期三 5-6节【T11临湖轩A4049】;'
		const parsedCourses = courses.map(course => {
			const match = course.match(regex);
			if (match) {
				const [_, weeksStr, dayStr, sectionsStr, position] = match;

				// 解析周次、节次和星期几
				const weeks = parseRange(weeksStr);
				const day = mapDayOfWeek(dayStr);
				const sections = parseRange(sectionsStr);

				return {
					name: item.kcmc,
					position,
					teacher: item.rkjs,
					weeks,
					day,
					sections,
				};
			}
		});

		//将格式化好的数组添加到目标数组中
		courseInfos.push(...parsedCourses);
	});

	// console.log(courseInfos);
	return courseInfos.filter(course => course != null)
}

// 将范围字符串（如 "2-5" 或 "2-9,12-16"）转换为数组
function parseRange(rangeStr) {
	const result = [];
	const parts = rangeStr.split(','); // 按逗号分割多个范围
	for (const part of parts) {
		if (part.includes('-')) {
			const [start, end] = part.split('-').map(Number);
			for (let i = start; i <= end; i++) {
				result.push(i);
			}
		} else {
			result.push(Number(part)); // 单个数字
		}
	}
	return result
}

// 将星期几映射为数字
function mapDayOfWeek(dayStr) {
	const days = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7 };
	const dayMatch = dayStr.match(/星期([一二三四五六日])/);
	return dayMatch ? days[dayMatch[1]] : null
}

