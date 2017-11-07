var catalog = [];
var data = [];
var poun = [];
var ccc = ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'];
var poorJsonUrl = "data/poorItem.json";
var node;
myDataConfig = new dataConfig();
var child1;
$(function() {
	//扶贫专项单击事件
	$("#poorItem").click(function(){
		$("#item_cover").fadeIn(600);
		$("#item_map").hide();
		$("#item_pie").hide();
	});

	//drawJsTree(child1);
	function ajax(url) {
		$.ajax({
			async: false,
			method: "GET",
			dataType: 'json',
			url: url,
			success: function(re) {
				myDataConfig.setJson(re);
				poun = re;
				for(var obj in poun) {
					catalog.push(poun[obj]);
				};
			}
		});
	};

	function drawJsPanel(title) {
		$.jsPanel({
			contentAjax: './framePoor.html',
			contentOverflow: 'auto',
			headerTitle: title,
			/*resizeit: {
			 minWidth: 200,
			 maxWidth: 800,
			 minHeight: 200,
			 maxHeight: 400
			 },*/
			position: {
				offsetX: -660,
				offsetY: 30
			},
			headerControls: {
				controls: 'show'
			},
			contentSize: {
				width: 550,
				height: 400
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
					"border-top-right-radius": "10px"
				});
			},
		});
	};
	function drawJsTree(child1) {
		$('#popu_jstree').jstree({
			"core": {
				"animation": 0,
				"check_callback": true,
				"themes": {
					"stripes": true
				},
				'data': [{
					'id': 'node_1',
					'text': '贫困舆情',
					'state': {
						'opened': false,
						'selected': false
					}
				},
				{
					'id': 'node_2',
					'text': '财政投入',
					'state': {
						'opened': false,
						'selected': false
					},
					'children': child1
				},
				{
					'id': 'node_3',
					'text': '扶贫效果',
					'state': {
						'opened': false,
						'selected': false
					}
				}]
			},
			"plugins": ["wholerow", "checkbox"]
		});
	};

	function drawFirstMapPic() {
		var mapChart = echarts.init(document.getElementById('sichuanMap'));
		var option = {
			series: [{
				type: 'map',
				map: 'sichuan'
			}]
		}
		mapChart.setOption(option);
	};

	$('#popu_jstree').bind("after_open.jstree", function(obj, e) {
		console.log('after');
	});

	$('#popu_jstree').bind("select_node.jstree", function(obj, e) {
		node = e.node.text;
		if(node=='第一批财政专项扶贫资金'){
			drawMapAndPie();
		}
	});

	var pieChart,sichaunChart;//饼图，地图
	function drawMapAndPie(){
		var colorList = [
			'#C23531', '#FFFF00', '#1874CD',
			'#DAA520', '#000000','#C0C0C0',
			'#458B00', '#F94F11','#37648B',
			'#83B900', '#6E7074','#61A0A8','#BDB76B','#F5DEB3'
		];
		var originalData = [
			{value: 254689, name: '第一批定向财力转移支付扶贫资金'},
			{value: 36231.5, name: '大小凉山彝区“十项扶贫工程”建设资金'},

			{value: 520, name: '以工代赈资金项目管理费'},
			{value: 4000, name: '省级以工代赈资金'},
			{value: 6144, name: '少数民族发展资金'},
			{value: 640, name: '国有贫困农场扶贫资金'},

			{value: 3874, name: '扶贫项目管理费'},
			{value: 800, name: '农村残疾人扶贫资金'},
			{value: 30000, name: '大小凉山彝区财政专项扶贫资金'},
			{value: 2000, name: '国有贫困林场扶贫资金'},
			{value: 25480, name: '以工代赈资金'},
			{value: 5000, name: '贫困村贫困户产业扶持周转金'},
			{value: 10000, name: '摩梭家园建设暨摩梭文化保护资金'},
			{value: 4000, name: '支持不发达地区发展资金'}
		];
		var data = [];
		var legendData = [];

		echarts.util.each(originalData, function (item, index) {
			item.itemStyle = {
				normal: {color: colorList[index]}
			};
		});
		data.length = 0;
		legendData.length = 0;
		echarts.util.each(originalData, function (item, index) {
			data.push({
				value: item.value,
				name: item.name,
				itemStyle: {
					normal: {color: item.itemStyle.normal.color}
				}
			});
			legendData.push(item.name);
		});
		pieChart = echarts.init(document.getElementById('pieChart'));
		pieChart.setOption({
			legend: {
				top:'3%',
				itemGap:1,
				show:true,
				data: legendData,
				textStyle:{
					color:'#D7EDFD',
					fontSize:20,
					fontFamily:'STKaiti'
				},
				formatter: function (name) {
					return name.replace(/\n/g, ' + ');
				}
			},
			title: {
				show:true,
				bottom: '17%',
				left: '16%',
				text: '2016年第一批财政专项扶贫资金',
				textStyle: {
					fontSize: 20,
					color: '#D7EDFD'
				}
			},
			tooltip: {
				formatter:'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#ff6f0b"></span>{a}<br/>{b}:{c}(万元)'
			},
			series: [{
				radius : ['20%', '65%'],
				//center:[180,330],
				center:['50%','55%'],
				name: '第一批财政专项扶贫资金',
				type: 'pie',
				selectedMode: 'single',
				selectedOffset: 6,
				clockwise: true,
				label: {
					normal: {
						show:false,
						textStyle: {
							fontSize: 1,
							color: '#333'
						}
					}
				},
				labelLine: {
					normal: {
						lineStyle: {
							color: '#777'
						}
					}
				},
				itemStyle:{
					normal:{
						shadowBlur: 30,
						shadowColor: 'rgba(0, 0, 0, 0.4)',
					}
				},
				data: data
			}]
		});

		sichaunChart = echarts.init(document.getElementById('sichuanMap'));
		sichaunChart.setOption({
			visualMap: {
				min: 0,
				max: 150018.5,
				roam: true,
				left: '10%',
				bottom: '60px',
				text: ['High', 'Low'],
				inRange: {
					color: ['#e0ffff','#3ECAFF', '#00A0DA']
				},
				calculable: true
			},
			tooltip: {
				show: true
			},
			itemStyle:{
				normal:{
					shadowColor: 'rgba(0, 0, 0, 0.2)',
					shadowBlur: 30
				}

			},
			geo: {
				//right:'5px',
				roam: true,
				label: {
					normal: {
						show: true,
						textStyle: {
							color: 'rgba(0,0,0,0.4)'
						}
					}
				},
				itemStyle: {
					normal: {
						shadowBlur: 50,
						shadowColor: 'rgba(0, 0, 0, 0.4)',
						borderColor: 'rgba(0, 0, 0, 0.2)'

					},
					emphasis: {
						areaColor: null,
						shadowOffsetX: 0,
						shadowOffsetY: 0,
						shadowBlur: 20,
						borderWidth: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			},
			tooltip: {
				formatter:'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#3ECAFF"></span>{a}<br/>{b}:{c}(万元)'
			},
			series: [{
				name: '第一批财政专项扶贫资金',
				type: 'map',
				roam: false,
				map: 'sichuan',
				label: {
					normal: {
						show: true
					}
				},
				data: [{
					name: '成都市',
					value: '0'
				},
					{
						name: '绵阳市',
						value: '9757'
					},
					{
						name: '自贡市',
						value: '3605'
					},
					{
						name: '攀枝花市',
						value: '1458'
					},
					{
						name: '泸州市',
						value: '13786'
					},
					{
						name: '德阳市',
						value: '1703'
					},
					{
						name: '广元市',
						value: '21611'
					},
					{
						name: '遂宁市',
						value: '5133'
					},
					{
						name: '内江市',
						value: '5639'
					},
					{
						name: '乐山市',
						value: '22901'
					},
					{
						name: '资阳市',
						value: '5468'
					},
					{
						name: '宜宾市',
						value: '15350'
					},
					{
						name: '南充市',
						value: '26565'
					},
					{
						name: '达州市',
						value: '25553'
					},
					{
						name: '雅安市',
						value: '1713'
					},
					{
						name: '阿坝藏族羌族自治州',
						value: '14857'
					},
					{
						name: '甘孜藏族自治州',
						value: '15161'
					},
					{
						name: '凉山彝族自治州',
						value: '150018.5'
					},
					{
						name: '广安市',
						value: '18470'
					},
					{
						name: '巴中市',
						value: '21646'
					},
					{
						name: '眉山市',
						value: '2984'
					}
				]
			}]
		});

		pieChart.on('click',function(param) {
			sichaunChart.setOption({
				series: {
					name:param.name,
					data: findJsonData(param.name)
				},
				visualMap: {
					max: max
				}
			});
		});
	}
	var max=0;//地图数据最大值
	//获取饼图对应地图的json数据,name为key,level为json层级内容，即循环次数
	function findJsonData(name){
		max=0;
		var json = myDataConfig.getJson();
		var key = Object.keys(json)[1];
		var data = [];
		json = json[key];
		key = Object.keys(json)[0];
		json = json[key];
		for(var i in json){
			if(i==name){//循环得到选中饼图的名称
				json = json[i];//获取该扶贫项下各省市拨款情况
				for(var j in json){//将json格式转换成键值对数组
					data.push({name:json[j].name,value:json[j].value});
					if(json[j].value>max){
						max=json[j].value
					}
				}
				break;
			}
		}
		return data;
	}

	//扶贫纪事单击事件
	$("#three-div").click(function(){
		if($("div[id^=jsPanel]").length < 3) {
			$("#item_cover").hide();
			$("#item_map").fadeIn(800);
			$("#item_pie").fadeIn(800);
			myDataConfig.setFlag("true");
			ajax(poorJsonUrl);
			child1 = Object.keys(catalog[1]);
			//$("div[id^=jsPanel]").remove();
			//悬浮面板
			//var cc = "扶贫纪事";
			//drawJsPanel(cc);
			//drawJsTree();
			//drawFirstMapPic();
			drawMapAndPie();
		}

	});

	$("#economy").click(function(){
		window.location.href="index.html";
	});

	$("#statistic").click(function(){
		window.location.href="index.html";
	});

})