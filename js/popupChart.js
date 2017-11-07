$(function() {
	chart = []
	var url = location.search; //获取url中"?"符后的字串
	var region = ""
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		region = decodeURI(str);
	}
	arr = region.split(",")
	mapRe = arr[0];
	mapVa = arr.splice(1,6);
	var raise = [];
	raise[0] = 0;
	for(i = 1; i < 6; i++) {
		raise.push((mapVa[i] / mapVa[i - 1]).toFixed(2) + "%")
	}
	console.log(raise)

	var popupPzh = echarts.init(document.getElementById('popupPzh'));
	function test(arr) {
		var arr1 = [];
		for(var i = 0; i < arr.length; i++) {
			arr1.push({
				coord: [i, arr[i]]
			});
		}
		return arr1;
	}
	option = {
		title: {
			text: mapRe
		},
		grid: {
			left: '15%'
		},
		tooltip: {
			trigger: 'axis'
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			name: '年份',
			data: ['2008', '2009', '2010','2011', '2012', '2013']
		}],
		yAxis: [{
			type: 'value'
		}],

		series: 
			{
				name: '支出',
				type: 'bar',
				data: mapVa,
				label: {
					normal: {
						show: true,
						position: 'inside',
					}
				},
				markPoint: {
					label: {
						normal: {
							formatter: function(param) {
								return raise[param['dataIndex']]
							}
						}
					},
					data: test(mapVa)
				}
			}
		}
		
	popupPzh.setOption(option);
})