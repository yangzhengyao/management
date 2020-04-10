let settingOpition = []; //编辑中列表

export function f0(a) {
	console.log("f0")
}

export function testFunc() {
	console.log("222_common")
}

//格式化日期
export function formatDate(dateArg) {
	const date = new Date(dateArg);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const formatMonth = month < 10 ? `0${month}` : month;
	const formatDay = day < 10 ? `0${day}` : day;

	return `${year}-${formatMonth}-${formatDay}`
}

export function formatDatemmss(dateArg) {
	const date = new Date(dateArg);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const formatMonth = month < 10 ? `0${month}` : month;
	const formatDay = day < 10 ? `0${day}` : day;
	const formatHour = hours < 10 ? `0${hours}` : hours;
	const formatMinute = minutes < 10 ? `0${minutes}` : minutes;
	const formatSecond = seconds < 10 ? `0${seconds}` : seconds;

	return `${year}-${formatMonth}-${formatDay} ${formatHour}:${formatMinute}:${formatSecond}`
}
// 二进制流文件导出
export function exportExcel(response, fileName, _this) {
	// 创建 Blob 对象 ,
	var blob = new Blob([response.data])
	new Promise(function(resolve, reject) {
		let reader = new FileReader()
		reader.readAsText(blob, 'utf-8');
		// 该事件在读取操作完成时触发
		reader.onload = function() {
			resolve(this.result)
		}
	}).then(res => {
		// console.log(res)
		if ('{' === res.substr(0, 1)) {
			// {"repCode":"1069","repMsg":"权限校验失败"}  这种返回
			var transferData = JSON.parse(res);
			_this.$Message.error(transferData.repMsg);
		} else {
			if (!response) {
				return
			}
			// 获取响应头信息
			let headers = response.headers
			if ('msSaveOrOpenBlob' in navigator) {
				// IE msSaveOrOpenBlob提供保存和打开按钮
				window.navigator.msSaveOrOpenBlob(new Blob([response.data], {
					type: headers['content-type']
				}), fileName)
			} else {
				// 创建URL
				let url = window.URL.createObjectURL(new Blob([response.data], {
					type: headers['content-type']
				}))

				// 插入一个a标签，隐藏，设置href属性，触发点击方法
				let link = document.createElement('a')
				link.style.display = 'none'
				link.href = url
				link.setAttribute('download', fileName)
				document.body.appendChild(link)
				link.click()

				//下载完成后
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			}
		}
	})
}
// 深度克隆
export function deepClone(obj) {
	var result;
	var oClass = isClass(obj);
	if (oClass === "Object") {
		result = {};
	} else if (oClass === "Array") {
		result = [];
	} else {
		return obj;
	}
	for (var key in obj) {
		var copy = obj[key];
		if (isClass(copy) == "Object") {
			result[key] = arguments.callee(copy); //递归调用
		} else if (isClass(copy) == "Array") {
			result[key] = arguments.callee(copy);
		} else {
			result[key] = obj[key];
		}
	}
	return result;
}
// 判断对象的数据类型
export function isClass(o) {
	if (o === null)
		return "Null";
	if (o === undefined)
		return "Undefined";
	return Object.prototype.toString.call(o).slice(8, -1);
}
//hh:mm 下拉框数据
export function getTimeList() {
	let arr = [];
	arr = [
		{
			value: "00:00",
			label: "00:00"
		},
		{
			value: "00:30",
			label: "00:30"
		},
		{
			value: "01:00",
			label: "01:00"
		},
		{
			value: "01:30",
			label: "01:30"
		},
		{
			value: "02:00",
			label: "02:00"
		},
		{
			value: "02:30",
			label: "02:30"
		},
		{
			value: "03:00",
			label: "03:00"
		},
		{
			value: "03:30",
			label: "03:30"
		},
		{
			value: "04:00",
			label: "04:00"
		},
		{
			value: "04:30",
			label: "04:30"
		},
		{
			value: "05:00",
			label: "05:00"
		},
		{
			value: "05:30",
			label: "05:30"
		},
		{
			value: "06:00",
			label: "06:00"
		},
		{
			value: "06:30",
			label: "06:30"
		},
		{
			value: "07:00",
			label: "07:00"
		},
		{
			value: "07:30",
			label: "07:30"
		},
		{
			value: "08:00",
			label: "08:00"
		},
		{
			value: "08:30",
			label: "08:30"
		},
		{
			value: "09:00",
			label: "09:00"
		},
		{
			value: "09:30",
			label: "09:30"
		},
		{
			value: "10:00",
			label: "10:00"
		},
		{
			value: "10:30",
			label: "10:30"
		},
		{
			value: "11:00",
			label: "11:00"
		},
		{
			value: "11:30",
			label: "11:30"
		},
		{
			value: "12:00",
			label: "12:00"
		},
		{
			value: "12:30",
			label: "12:30"
		},
		{
			value: "13:00",
			label: "13:00"
		},
		{
			value: "13:30",
			label: "13:30"
		},
		{
			value: "14:00",
			label: "14:00"
		},
		{
			value: "14:30",
			label: "14:30"
		},
		{
			value: "15:00",
			label: "15:00"
		},
		{
			value: "15:30",
			label: "15:30"
		},
		{
			value: "16:00",
			label: "16:00"
		},
		{
			value: "16:30",
			label: "16:30"
		},
		{
			value: "17:00",
			label: "17:00"
		},
		{
			value: "17:30",
			label: "17:30"
		},
		{
			value: "18:00",
			label: "18:00"
		},
		{
			value: "18:30",
			label: "18:30"
		},
		{
			value: "19:00",
			label: "19:00"
		},
		{
			value: "19:30",
			label: "19:30"
		},
		{
			value: "20:00",
			label: "20:00"
		},
		{
			value: "20:30",
			label: "20:30"
		},
		{
			value: "21:00",
			label: "21:00"
		},
		{
			value: "21:30",
			label: "21:30"
		},
		{
			value: "22:00",
			label: "22:00"
		},
		{
			value: "22:30",
			label: "22:30"
		},
		{
			value: "23:00",
			label: "23:00"
		},
	]
	return arr;
}

//解析url
export function parseUrlParam(url) {
  var pattern = /(\w+)=(\w+)/ig;
  var parames = {};
  url.replace(pattern, function(a, b, c){
    parames[b] = c;
  });
  return parames;
}

//简要内容获取
export function filterSummary(data) {
  let val = '';
  if(val&&val.length<=200){
  	val=data;
  }else{
  	val=data.substring(0,200)
  }
  return val;
}

export default {
	testFunc,
	f0,
	formatDate,
	formatDatemmss,
	exportExcel,
	deepClone,
	isClass,
	getTimeList,
  parseUrlParam,
  filterSummary
}
