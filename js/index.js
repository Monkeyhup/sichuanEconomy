$(function() {
	var value_0 = [];   //地图所用变量
	var value_1 = [];   //柱状图所用变量
	var value_2 = [];   //饼图所用变量
	node = '';
	nodeSon = '';
	fatherId = 0;
	var indexYear = 0;

	//异步请求
	$.ajaxSetup({
		async: false
	});

	//选项栏切换更换图片
	$("#switcher-report >a").click(function() {
		var $this = $(this);
		var index = $this.index();
		$("#switcher-report >a").each(function() {
			var i = $(this).index();
			$(this).css("background-image", "url(img/" + (i + 1) + ".png)");
		});
		$this.css("background-image", "url(img/checked-" + (index + 1) + ".png)");
	});

	//财政按键，若选择财政按键，类中的flag为1
	$("#economy").click(function() {
		$("#pieChart").addClass("hidden");   //在切换财政与统计时，清除饼图
		$("#barChart").addClass("hidden");   //在切换财政与统计时，清除饼图
		$("#sichuanMap").addClass("hidden");
		$("#sichuanMap").removeClass("hidden");//在切换财政与统计时，消除地图后重新绘制
		$("#shut").addClass('hidden');         //隐藏返回上级按钮
		myDataConfig.setFlag("1");
		node = '';
		nodeSon = '';
		$.jstree.destroy();                  		 //消除指标树
		$("div[id^=jsPanel]").remove();      		 //消除jspanel
		drawFirstMap();                      		 //画初始地图
		drawJsPanel("四川");                 		 //画初始四川面板
		var eco = ajax("ser/allCity.json"); 		 //将json文件读取
		var catalog = getIden("ser/allCity.json");   //获取一级指标
		myDataConfig.setJson(eco);
		myDataConfig.setIden(catalog);
		$(function() {
			drawJsTree("allCity", 2, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1)])
		});
	});

	//统计按键
	$("#statistic").click(function() {
		$("#pieChart").addClass("hidden");
		$("#barChart").addClass("hidden");
		$("#sichuanMap").addClass("hidden");
		$("#sichuanMap").removeClass("hidden");
		$("#shut").addClass('hidden');
		myDataConfig.setFlag("2");

		node = '';
		nodeSon = '';
		$.jstree.destroy();
		$("div[id^=jsPanel]").remove();
		drawFirstMap();
		drawJsPanel("四川");
		var sta = ajax("data/allCity.json");
		var catalog = getIden("data/allCity.json");
		myDataConfig.setJson(sta);
		myDataConfig.setIden(catalog);
		$(function() {
			drawJsTree("allCity", 5, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1), Object.keys(myDataConfig.getJson()[2]).slice(1), Object.keys(myDataConfig.getJson()[3]).slice(1), Object.keys(myDataConfig.getJson()[4]).slice(1)])
		})
	});

	$("#poorItem").click(function() {
		window.location.href = "poorItem.html";
	});

	drawFirstMap();  //画初始四川地图

	//读取JSON文件
	function ajax(url) {
		var arr = [];
		var po;
		$.ajax({
			async: false,
			method: "GET",
			dataType: 'json',
			url: url,
			success: function(re) {
				po = re;
				for(var obj in po) {
					arr.push(po[obj]);
				}
				return arr
			}
		});
		return arr
	}

	//获得指标
	function getIden(url) {
		var arr = [];
		$.ajax({
			async: false,
			method: "GET",
			dataType: 'json',
			url: url,
			success: function(re) {
				arr = Object.keys(re)
			}
		});
		return arr
	}

	//获取绘制地图数据
	function getMapData(fileName, idens, sonIdens) {
		var result = {
			"value": [],
			"city": []
		};
		$.ajax({
			type: "get",
			url: fileName,
			async: false,
			success: function(data) {

				myDataConfig.setData(data);
				console.log(myDataConfig.getData());
				for(var year = 0; year < 6; year++) {
					yearValue = [];
					cityName = [];
					var sortedData = data[idens][sonIdens].sort(function(a, b) {
						return b.value[year] - a.value[year]
					});
					for(var city in sortedData) {
						rank = parseInt(city) + 1;
						inc = (sortedData[city].value[year] / sortedData[city].value[year - 1] - 1).toFixed(4)
						if(year == 0) {
							yearValue.push([sortedData[city].value[year], rank, 0]);
						} else {
							yearValue.push([sortedData[city].value[year], rank, inc * 100 + "%"]);
						}
						cityName.push(sortedData[city].name)
					}
					result['value'].push(yearValue);
					result['city'].push(cityName)
				}
				return result
			}
		});
		return result
	}

	//获取某一指标数据
	function getChartData(fileName, idens, sonIdens) {
		var arr = [];
		$.ajax({
			async: false,
			method: "GET",
			dataType: 'json',
			url: fileName,
			success: function(re) {
				arr = re[idens][sonIdens];
				return arr
			}
		});
		return arr
	}

	//获取绘制柱状图数据
	function getBarData(fileName, idens, sonIdens) {
		var result = {
			"value": [],
			"city": []
		};
		$.ajax({
			type: "GET",
			url: fileName,
			async: false,
			success: function(data) {
				for(var year = 0; year < 6; year++) {
					yearValue = [];
					cityName = [];
					var sortedData = data[idens][sonIdens].sort(function(a, b) {
						return b.value[year] - a.value[year]
					});
					for(var city in sortedData) {
						yearValue.push(sortedData[city].value[year]);
						cityName.push(sortedData[city].name)
					}
					result["value"].push(yearValue);
					result["city"].push(cityName);
				}
				return result
			}
		})
		return result
	}

	//获取绘制饼图数据
	function getPieData(fileName, idensName) {
		var result = {
			"value": [],
			"idens": []
		};
		$.ajax({
			type: "get",
			url: fileName,
			async: false,
			success: function(data) {
				for(var year = 0; year < 6; year++) {
					var yearValue = [];
					var idens = [];
					for(var sonIdens in data[idensName]) {
						if(sonIdens != "father") {
							var cityValue = 0;
							for(var city in data[idensName][sonIdens]) {
								cityValue += data[idensName][sonIdens][city].value[year]
							}
							yearValue.push(cityValue.toFixed(2));
							idens.push(sonIdens);
						}
					}
					result.value.push(yearValue);
					result.idens.push(idens);
				}
				return result
			}
		});
		return result
	}

	//绘制面板
	function drawJsPanel(title) {   //面板标题
		$.jsPanel({
			contentAjax: './frame.html',  //打开的网页
			contentOverflow: 'auto',
			headerLogo: "img/marker.png",  //标题前的图标
			headerTitle: title,
			resizeit: {                   //面板大小
				minWidth: 40,
				minHeight: 40,
				maxWidth: false,
				maxHeight: false,

				disable: false,
				disableui: false
			},
			resizable: {
				disabled: false
			},
			position: {    //面板位置
				my: 'left',
				at: 'left',
				offsetX: '2%',
				offsetY: '27%'
			},
			headerControls: {   //头部控制
				controls: 'closeonly',

			},
			panelSize: {
				width: function() {
					return $(window).width() / 1920 * 335
				},
				height: function() {
					return $(window).height() / 100 * 65
				},
			},
			theme: 'lightblue',
			callback: function() {
				this.content.css({
					"background-color": "rgba(2, 59, 106, 0.8)",
					"border-bottom-right-radius": "10px",
					"border-bottom-left-radius": "10px",
				});
				this.header.css({
					"background-color": "rgba(2, 59, 106, 0.8)",
					"border-top-left-radius": "10px",
					"border-top-right-radius": "10px",
					"hight": "10px"
				});
			},
		});
	}

	//最大值函数
	function max(arr) {
		var max = arr[0];
		var len = arr.length;
		for(var i = 0; i < len; i++) {
			if(arr[i] > max) {
				max = arr[i];
			}
		}
		return max;
	}

	//绘制四川省指标树
	//形参：{文件名称，二级指标数量，一级指标名称，二级指标名称}
	function drawJsTree(fileName, num, text, aChild) {
		$('#popu_jstree').jstree({
				"core": {
					"themes": {
						"variant": "large",
						// "responsive":true,
						"icons": false
					},
					'data': getNode(num, text, aChild)   //加载子指标
				},
				"plugins": ["types"]
			})
			.bind("select_node.jstree", function(obj, e) {   //绑定选择事件
				$("#barChart").removeClass("hidden");
				$("#pieChart").removeClass("hidden");
				value_0.length = 0;
				value_1.length = 0;
				value_2.length = 0;
				node.length = 0;
				nodeSon.length = 0;
				node = e.node.parent;
				nodeSon = e.node.text;
				if(myDataConfig.getFlag() == "1") {
					if(node == '#') {
						value_0 = getMapData("ser/" + fileName + ".json", nodeSon, "father");
						value_1 = getBarData("ser/" + fileName + ".json", nodeSon, 'father');
						value_2 = getPieData("ser/" + fileName + ".json", nodeSon, 'father');
						fatherId = parseInt(Object.keys(myDataConfig.getData()).indexOf(nodeSon));
					} else {
						fatherId = parseInt(node.split("_")[1]);
						node = $('#' + node + '_anchor').text();
						value_0 = getMapData("ser/" + fileName + ".json", node, nodeSon);
						value_1 = getBarData("ser/" + fileName + ".json", node, nodeSon);
						value_2 = getPieData("ser/" + fileName + ".json", node, nodeSon)
					}
				} else {
					if(node == '#') {
						value_0 = getMapData("data/" + fileName + ".json", nodeSon, "father");
						value_1 = getBarData("data/" + fileName + ".json", nodeSon, 'father');
						value_2 = getPieData("data/" + fileName + ".json", nodeSon, 'father');
						fatherId = parseInt(Object.keys(myDataConfig.getData()).indexOf(nodeSon))
					} else {
						fatherId = parseInt(node.split("_")[1]);
						node = $('#' + node + '_anchor').text();
						value_0 = getMapData("data/" + fileName + ".json", node, nodeSon);
						value_1 = getBarData("data/" + fileName + ".json", node, nodeSon);
						value_2 = getPieData("data/" + fileName + ".json", node, nodeSon)
					}
				}
				drawMapPic(value_0.city, value_0.value, max(value_1.value[0]));   //绘制所选指标的四川地图
				drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);  //绘制所选指标的柱状图
				drawPiePic(nodeSon, value_2.idens[0], value_2.value[0])          //绘制所选指标的饼图
			})
			.bind('ready.jstree', function(obj) {//绑定默认展开事件
				if(node != "" && nodeSon != "") {
					if(node == '#') {
						$('#popu_jstree').jstree().select_node(obj.currentTarget.childNodes[0].childNodes[fatherId])
					} else {
						$('#popu_jstree').jstree().open_node(obj.currentTarget.childNodes[0].childNodes[fatherId].children[1]);
						$('#popu_jstree').jstree().select_node(obj.currentTarget.childNodes[0].childNodes[fatherId].children[2].childNodes[Object.keys(myDataConfig.getJson()[fatherId]).indexOf(nodeSon) - 1])
					}
				}
			});
	};

	//绘制地级市指标树
	//形参：{文件名称，绘制地区的名称，二级指标数量，一级指标名称，二级指标名称}
	function drawTree(fileName, city, num, text, aChild) {
		console.log(fileName, city, num, text, aChild)
		$('#popu_jstree').jstree({
				"core": {
					"animation": 0,
					"check_callback": true,
					"themes": {
						"variant": "large",
						// "responsive":true,
						"icons": false
					},
					'data': getNode(num, text, aChild)
				},
			})
			.bind("select_node.jstree", function(obj, e) {
				$("#barChart").removeClass("hidden");
				$("#pieChart").removeClass("hidden");
				value_0.length = 0;
				value_1.length = 0;
				value_2.length = 0;
				node.length = 0;
				nodeSon.length = 0;
				node = e.node.parent;
				nodeSon = e.node.text;
				if(myDataConfig.getFlag() == "1") {
					if(node == '#') {
						value_0 = getMapData("ser/" + fileName + ".json", nodeSon, "father");
						value_1 = getBarData("ser/" + fileName + ".json", nodeSon, 'father');
						value_2 = getPieData("ser/" + fileName + ".json", nodeSon, 'father');
						fatherId = parseInt(Object.keys(myDataConfig.getData()).indexOf(nodeSon));
					} else {
						fatherId = parseInt(node.split("_")[1]);
						node = $('#' + node + '_anchor').text();
						value_0 = getMapData("ser/" + fileName + ".json", node, nodeSon);
						value_1 = getBarData("ser/" + fileName + ".json", node, nodeSon);
						value_2 = getPieData("ser/" + fileName + ".json", node, nodeSon)
					}
				} else {
					if(node == '#') {
						value_0 = getMapData("data/" + fileName + ".json", nodeSon, "father");
						value_1 = getBarData("data/" + fileName + ".json", nodeSon, 'father');
						value_2 = getPieData("data/" + fileName + ".json", nodeSon, 'father');
						fatherId = parseInt(Object.keys(myDataConfig.getData()).indexOf(nodeSon))

					} else {
						fatherId = parseInt(node.split("_")[1]);
						node = $('#' + node + '_anchor').text();
						value_0 = getMapData("data/" + fileName + ".json", node, nodeSon);
						value_1 = getBarData("data/" + fileName + ".json", node, nodeSon);
						value_2 = getPieData("data/" + fileName + ".json", node, nodeSon)
					}
				}
				drawMap(city, value_0.city, value_0.value, max(value_1.value[0]));
				drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
				drawPiePic(nodeSon, value_2.idens[0], value_2.value[0])
			})
			.bind('ready.jstree', function(obj) {
				if(node == '#') {
					$('#popu_jstree').jstree().select_node(obj.currentTarget.childNodes[0].childNodes[fatherId])
				} else {
					$('#popu_jstree').jstree().open_node(obj.currentTarget.childNodes[0].childNodes[fatherId].children[1])
					$('#popu_jstree').jstree().select_node(obj.currentTarget.childNodes[0].childNodes[fatherId].children[2].childNodes[Object.keys(myDataConfig.getJson()[fatherId]).indexOf(nodeSon) - 1])
				}
			});
	};

	//动态加载树节点函数
	//形参：{一级指标数量，一级指标，二级指标}
	function getNode(num, text, aChild) {
		var nodeArr = [];
		for(var n = 0; n < num; n++) {
			nodeArr.push({
				'id': 'node_' + n,
				'text': text[n],
				'state': {
					'opened': false,
					'selected': false
				},
				'children': aChild[n]
			})
		}
		return nodeArr;
	};

	//动态绘制地图data
	function getSeries(mapName, series) {
		var Arr = []
		for(var k = 0; k < 6; k++) {
			Arr.push({
				series: {
					data: (function() {
						var mapRes = [];
						for(var i = 0; i < mapName[0].length; i++) {
							mapRes.push({
								name: mapName[k][i],
								value: series[k][i][0],
							});
						}
						return mapRes;
					})()
				}
			})
		}
		return Arr
	}

	//柱状图tooltip
	function setBarLabel() {
		if(node.indexOf("指") > 0 || nodeSon.indexOf("指") > 0) {
			return '{b}<br />{a}:{c}'
		} else if(node.indexOf("人员") > 0 || nodeSon.indexOf("人员") > 0) {
			return '{b}<br />{a}:{c}{万人}'
		} else {
			return '{b}<br />{a}:{c}{万元}'
		}
	}
	//绘制柱状图
	//形参：{标题，所选指标的名称，X轴内容，所选数据内容}
	function drawBarPic(bTitle, bName, bX, bData) {
		var barChart = echarts.init(document.getElementById('bBody'));
		var option = {
			title: {
				text: bTitle,
				textStyle: {
					color: '#FFFFFF',
					fontWeight: 'normal'
				},
				top: '0.5%',
				left: 'center'
			},
			color: ['#E0FFFF'],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: setBarLabel()
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: bX,
				axisTick: {
					alignWithLabel: true
				}
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: bName,
				type: 'bar',
				barWidth: '60%',
				data: bData
			}]
		};
		barChart.setOption(option);
	};

	//绘制饼图
	//形参：{标题，图例，数据}
	function drawPiePic(pTitle, pLegend, pData) {
		var pieChart = echarts.init(document.getElementById('pBody'));
		var option = {
			title: {
				text: pTitle,
				x: 'center',
				textStyle: {
					color: '#FFFFFF',
					fontWeight: 'normal'
				},
				top: '0.5%'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'horizontal',
				bottom: '1%',
				data: pLegend,
				textStyle: {
					color: '#3B3B3B'
				}
			},
			series: [{
				type: 'pie',
				radius: '50%',
				center: ['50%', '40%'],
				label: {
					normal: {
						textStyle: {
							color: '#3B3B3B'
						}
					}
				},
				labelLine: {
					normal: {
						lineStyle: {
							color: 'rgb(84,211,254)'
						}
					}
				},
				data: (function() {
					var res = [];
					var len = 0;
					for(var i = 0, size = pData.length; i < size; i++) {
						res.push({
							name: pLegend[i],
							value: pData[i]
						});
					}
					return res;
				})(),
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		pieChart.setOption(option);
	}

	//绘制初始地图
	function drawFirstMap() {
		var mapChart = echarts.init(document.getElementById('sichuanMap'));
		var option = {
			series: [{
				type: 'map',
				map: 'sichuan',
				label: {
					normal: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#4ad3ff'
					}
				}
			}, ]
		}
		mapChart.setOption(option);
	};

	//绘制地级市地图
	//形参：{所选的是哪个地区，地区名称，地区数据，色温图的最大值}
	function drawMap(city, mapName, series, maxVisual) {
		var mapChart = echarts.init(document.getElementById('sichuanMap'));
		var option = {
			baseOption: {
				timeline: {
					axisType: 'category',
					data: ['2008', '2009', '2010', '2011', '2012', '2013'],
					controlStyle: {
						showPlayBtn: false
					}
				},
				visualMap: {    //色温图
					min: 0,
					max: maxVisual,
					left: 'left',
					top: 'bottom',
					text: ['High', 'Low'],
					inRange: {
						color: ['#e0ffff', '#006edd']
					},
					calculable: true
				},
				tooltip: {    //浮框
					show: true,
					formatter: function(params) {
						if(node.indexOf("指") > 0 || nodeSon.indexOf("指") > 0) {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]

						} else if(node.indexOf("人员") > 0 || nodeSon.indexOf("人员") > 0) {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + "万人" + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]
						} else {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + "万元" + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]
						}
					}
				},
				series: [{
					itemStyle: {
						normal: {
							areaColor: '#4ad3ff'
						}
					},
					label: {
						normal: {
							show: true
						}
					},
					type: 'map',
					map: city,
					roam: true
				}]
			},
			options: getSeries(mapName, series)
		};
		mapChart.setOption(option);
		mapChart.on('click', function(params) {    //地图单击事件
			if(params.name[0] == 2) {         		//若单击的是时间轴，则在单击每个年份后重新绘制柱状图与饼图
				switch(params.name) {
					case '2008':
						drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
						drawPiePic(nodeSon, value_2.idens[0], value_2.value[0]);
						indexYear = 0;
						break;
					case '2009':
						drawBarPic(nodeSon, nodeSon, value_1.city[1], value_1.value[1]);
						drawPiePic(nodeSon, value_2.idens[1], value_2.value[1]);
						indexYear = 1;
						break;
					case '2010':
						drawBarPic(nodeSon, nodeSon, value_1.city[2], value_1.value[2]);
						drawPiePic(nodeSon, value_2.idens[2], value_2.value[2]);
						indexYear = 2;
						break;
					case '2011':
						drawBarPic(nodeSon, nodeSon, value_1.city[3], value_1.value[3]);
						drawPiePic(nodeSon, value_2.idens[3], value_2.value[3]);
						indexYear = 3;
						break;
					case '2012':
						drawBarPic(nodeSon, nodeSon, value_1.city[4], value_1.value[4]);
						drawPiePic(nodeSon, value_2.idens[4], value_2.value[4]);
						indexYear = 4;
						break;
					case '2013':
						drawBarPic(nodeSon, nodeSon, value_1.city[5], value_1.value[5]);
						drawPiePic(nodeSon, value_2.idens[5], value_2.value[5]);
						indexYear = 5;
						break;
				}
			} else {  																			//若单击的是地区，则绘制弹窗
				if(myDataConfig.getFlag() == "1") {												//若flag是1，则读取ser文件夹下的文件
					if(node == '#') {
						popup = getChartData("ser/" + myDataConfig.getPop() + ".json", nodeSon, "father")
					} else {
						popup = getChartData("ser/" + myDataConfig.getPop() + ".json", node, nodeSon)
					}
					for(var k = 0; k < popup.length; k++) {
						if(popup[k].name == params.name) {
							layer.open({
								type: 2,
								title: false,
								area: ['430px', '350px'],
								closeBtn: 1, //不显示关闭按钮
								shade: [0],
								time: 500000, //2秒后自动关闭
								anim: 0,
								content: ['popup.html?' + params.name + "," + popup[k].value, 'no']
							});
						}
					}
				} else {
					if(node == '#') {
						popup = getChartData("data/" + myDataConfig.getPop() + ".json", nodeSon, "father")
					} else {
						popup = getChartData("data/" + myDataConfig.getPop() + ".json", node, nodeSon)
					}

					for(var k = 0; k < popup.length; k++) {
						if(popup[k].name == params.name) {
							layer.open({
								type: 2,
								title: false,
								area: ['430px', '350px'],
								closeBtn: 1, //不显示关闭按钮
								shade: [0],
								time: 500000, //2秒后自动关闭
								anim: 0,
								content: ['popup.html?' + params.name + "," + popup[k].value, 'no']
							});
						}
					}
				}

			}
		})
	}

	//绘制四川省地图
	//形参：{地区名称，地区数据，色温图的最大值}
	function drawMapPic(mapName, series, maxVisual) {
		var mapChart = echarts.init(document.getElementById('sichuanMap'));
		var option = {
			baseOption: {
				timeline: {
					axisType: 'category',
					data: ['2008', '2009', '2010', '2011', '2012', '2013'],
					controlStyle: {
						showPlayBtn: false
					}
				},
				visualMap: {
					min: 0,
					max: maxVisual,
					left: 'left',
					top: 'bottom',
					text: ['High', 'Low'],
					inRange: {
						color: ['#e0ffff', '#006edd']
					},
					calculable: true
				},
				tooltip: {
					show: true,
					formatter: function(params) {
						if(node.indexOf("指") > 0 || nodeSon.indexOf("指") > 0) {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]

						} else if(node.indexOf("人员") > 0 || nodeSon.indexOf("人员") > 0) {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + "万人" + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]
						} else {
							return params.name + '<br/>' + nodeSon + ":" + params.data.value + "万元" + '<br/>' + '位次:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][1] + '&nbsp;&nbsp;&nbsp' + '增幅:' + value_0.value[indexYear][value_0.city[indexYear].indexOf(params.name)][2]
						}
					}
				},
				series: [{
					itemStyle: {
						normal: {
							areaColor: '#4ad3ff'
						}
					},
					label: {
						normal: {
							show: true
						}
					},
					type: 'map',
					map: 'sichuan',
					roam: true,
				}]
			},
			options: getSeries(mapName, series)
		};
		mapChart.setOption(option);
		var TimeFn = null;
		mapChart.on('click', function(params) {
			clearTimeout(TimeFn)
			TimeFn = setTimeout(function() {
				if(params.name[0] == 2) {    										//若单击的是时间轴，则在单击每个年份后重新绘制柱状图与饼图
					switch(params.name) {
						case '2008':
							drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
							drawPiePic(nodeSon, value_2.idens[0], value_2.value[0]);
							indexYear = 0;
							break;
						case '2009':
							drawBarPic(nodeSon, nodeSon, value_1.city[1], value_1.value[1]);
							drawPiePic(nodeSon, value_2.idens[1], value_2.value[1]);
							indexYear = 1;
							break;
						case '2010':
							drawBarPic(nodeSon, nodeSon, value_1.city[2], value_1.value[2]);
							drawPiePic(nodeSon, value_2.idens[2], value_2.value[2]);
							indexYear = 2;
							break;
						case '2011':
							drawBarPic(nodeSon, nodeSon, value_1.city[3], value_1.value[3]);
							drawPiePic(nodeSon, value_2.idens[3], value_2.value[3]);
							indexYear = 3;
							break;
						case '2012':
							drawBarPic(nodeSon, nodeSon, value_1.city[4], value_1.value[4]);
							drawPiePic(nodeSon, value_2.idens[4], value_2.value[4]);
							indexYear = 4;
							break;
						case '2013':
							drawBarPic(nodeSon, nodeSon, value_1.city[5], value_1.value[5]);
							drawPiePic(nodeSon, value_2.idens[5], value_2.value[5]);
							indexYear = 5;
							break;
					}
				} else {
					if(myDataConfig.getFlag() == "1") {
						if(node == '#') {
							popup = getChartData("ser/allCity.json", nodeSon, "father");				//获取所选指标的响应数据
						} else {
							popup = getChartData("ser/allCity.json", node, nodeSon)
						}
						for(var k = 0; k < popup.length; k++) {
							if(popup[k].name == params.name) {
								layer.open({
									type: 2,
									title: false,
									area: ['430px', '350px'],
									closeBtn: 1, //不显示关闭按钮
									shade: [0],
									time: 500000, //50秒后自动关闭
									anim: 0,
									content: ['popup.html?' + params.name + "," + popup[k].value, 'no']
								});
							}
						}
					} else {
						if(node == '#') {
							popup = getChartData("data/allCity.json", nodeSon, "father")
						} else {
							popup = getChartData("data/allCity.json", node, nodeSon)
						}
						for(var k = 0; k < popup.length; k++) {
							if(popup[k].name == params.name) {
								layer.open({
									type: 2,
									title: false,
									area: ['430px', '350px'],
									closeBtn: 1, //不显示关闭按钮
									shade: [0],
									time: 500000, //50秒后自动关闭
									anim: 0,
									content: ['popup.html?' + params.name + "," + popup[k].value, 'no']
								});
							}
						}
					}

				}
			}, 300);
		});
		mapChart.on('dblclick', function(params) {								//地图的双击事件
			myDataConfig.setPop(params.name);
			clearTimeout(TimeFn);
			$("#shut").removeClass('hidden');
			mapChart.dispose();
			value_0.length = 0;
			value_1.length = 0;
			value_2.length = 0;
			if(myDataConfig.getFlag() == "1") {
				if(node == '#') {
					value_0 = getMapData("ser/" + params.name + ".json", nodeSon, "father");
					value_1 = getBarData("ser/" + params.name + ".json", nodeSon, 'father');
					value_2 = getPieData("ser/" + params.name + ".json", nodeSon, 'father')
				} else {
					value_0 = getMapData("ser/" + params.name + ".json", node, nodeSon);
					value_1 = getBarData("ser/" + params.name + ".json", node, nodeSon);
					value_2 = getPieData("ser/" + params.name + ".json", node, nodeSon)
				}
			} else {
				if(node == '#') {
					value_0 = getMapData("data/" + params.name + ".json", nodeSon, "father");
					value_1 = getBarData("data/" + params.name + ".json", nodeSon, 'father');
					value_2 = getPieData("data/" + params.name + ".json", nodeSon, 'father')
				} else {
					value_0 = getMapData("data/" + params.name + ".json", node, nodeSon);
					value_1 = getBarData("data/" + params.name + ".json", node, nodeSon);
					value_2 = getPieData("data/" + params.name + ".json", node, nodeSon)
				}
			}
			drawMap(params.name, value_0.city, value_0.value, max(value_1.value[0]));
			drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
			drawPiePic(nodeSon, value_2.idens[0], value_2.value[0]);
			$(".jsPanel-title")[0].innerHTML = params.name;									//面板标题
			$.jstree.destroy();                                                             //销毁树内容
			if(myDataConfig.getFlag() == "1") {
				$(function() {
					drawTree(params.name, params.name, 2, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1)])
				});
			} else {
				$(function() {
					drawTree(params.name, params.name, 5, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1), Object.keys(myDataConfig.getJson()[2]).slice(1), Object.keys(myDataConfig.getJson()[3]).slice(1), Object.keys(myDataConfig.getJson()[4]).slice(1)])
				});
			}

		})
	}

	//返回按钮
	$("#shut").click(function() {
		if(myDataConfig.getFlag() == '1') {
			$("#shut").addClass('hidden');
			$("#sichuanMap").addClass("hidden");
			$("#sichuanMap").removeClass("hidden");
			value_0.length = 0;
			value_1.length = 0;
			value_2.length = 0;
			if(node == '#') {
				value_0 = getMapData("ser/allCity.json", nodeSon, "father");
				value_1 = getBarData("ser/allCity.json", nodeSon, 'father');
				value_2 = getPieData("ser/allCity.json", nodeSon, 'father')
			} else {
				value_0 = getMapData("ser/allCity.json", node, nodeSon);
				value_1 = getBarData("ser/allCity.json", node, nodeSon);
				value_2 = getPieData("ser/allCity.json", node, nodeSon)
			}

			drawMapPic(value_0.city, value_0.value, max(value_1.value[0]));
			drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
			drawPiePic(nodeSon, value_2.idens[0], value_2.value[0]);
			$(".jsPanel-title")[0].innerHTML = '四川';
			$.jstree.destroy();
			$(function() {
				drawJsTree("allCity", 2, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1)])
			});
		} else {
			$("#shut").addClass('hidden');
			$("#sichuanMap").addClass("hidden");
			$("#sichuanMap").removeClass("hidden");
			value_0.length = 0;
			value_1.length = 0;
			value_2.length = 0;
			if(node == '#') {
				value_0 = getMapData("data/allCity.json", nodeSon, "father");
				value_1 = getBarData("data/allCity.json", nodeSon, 'father');
				value_2 = getPieData("data/allCity.json", nodeSon, 'father')
			} else {
				value_0 = getMapData("data/allCity.json", node, nodeSon);
				value_1 = getBarData("data/allCity.json", node, nodeSon);
				value_2 = getPieData("data/allCity.json", node, nodeSon)
			}

			drawMapPic(value_0.city, value_0.value, max(value_1.value[0]));
			drawBarPic(nodeSon, nodeSon, value_1.city[0], value_1.value[0]);
			drawPiePic(nodeSon, value_2.idens[0], value_2.value[0]);
			$(".jsPanel-title")[0].innerHTML = '四川';
			$.jstree.destroy();
			$(function() {
				drawJsTree("allCity", 5, myDataConfig.getIden(), [Object.keys(myDataConfig.getJson()[0]).slice(1), Object.keys(myDataConfig.getJson()[1]).slice(1), Object.keys(myDataConfig.getJson()[2]).slice(1), Object.keys(myDataConfig.getJson()[3]).slice(1), Object.keys(myDataConfig.getJson()[4]).slice(1)])
			});
		}

	})
})