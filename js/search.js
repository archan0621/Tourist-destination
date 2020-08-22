var serviceKey = "rGsn1VlU0oRBz%2BvlfrGBSo%2BYQvlpq7T7JNVyrHaSC%2FZpgBZb0pS8sds2z7pCLKMaOH3vn5n1z2y7gkESG7cUDQ%3D%3D";

		getArea("sido","");

		function getArea(sid, acode) {
			var sid = sid || "";
			if( ! sid ) return;
			var acode = acode || "";
			var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode'; /*URL*/
			var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey; /*Service Key*/
			queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
			queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
			queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
			queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
			queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');
			queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(acode);

			$.getJSON(url + queryParams, function(res){
				var sidojson = res.response.body.items.item;
				console.log(sidojson);
				var options = "<option>::선택::</option>";
				for(var i=0; i<sidojson.length; i++) {
					options += `<option value='${sidojson[i].code}'>
												${sidojson[i].name}
											</option>`;
				}
				$("#"+sid).html(options);
			});
		}

		$("#sido").change(function(){
			var code = $(this).val();
			$("#gugun").html("");
			if( ! code ) return;
			getArea("gugun",code);
		});

		$("#gugun").change(function(){
			var code = $(this).val();
			if( ! code ) return;
			showInfo(code);
		});		

		function showInfo(code){
			if( ! code ) return;
			var sidocode = $("#sido").val();
			var guguncode = code;
			var url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList";
			var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey; /*Service Key*/
			queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
			queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
			queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
			queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
			queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');
			queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(sidocode);
			queryParams += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent(guguncode);
			queryParams += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent('Y');
			queryParams += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('A');

			$.getJSON(url + queryParams, function(res){
				var info = res.response.body.items.item;
				console.log(info);
				$("#infolist table tbody").html("");
				if( ! info.length ) return;
				for( var i=0; i<info.length; i++ ) {
					var tel = info[i].tel || "";
					var addr1 = info[i].addr1 || "";
					var addr2 = info[i].addr2 || "";
					var tr = `
						<tr>
							<td>${info[i].title}</td>
							<td>
								${info[i].zipcode}) 
								${addr1} ${addr2}
							</td>
							<td>${tel}</td>
							<td>
								<a class='map' href='#!' data-x='${info[i].mapx}' data-y='${info[i].mapy}'>지도</a>
							</td>
							<td>
								<a class='img' href='#!' data-id='${info[i].contentid}'>이미지</a>
							</td>
						</tr>
					`;
					$("#infolist table tbody").append(tr);
				}
			});

		}

		$("#infolist table tbody").on("click", "a.map", function(){
			var x = $(this).attr("data-x");
			var y = $(this).attr("data-y");
			if( ! x || ! y ) return;
			var map = `https://www.google.com/maps/@${y},${x},15z?hl=ko`;
			window.open(map);
		});

		$("#infolist table tbody").on("click", "a.img", function(){
			var contentid = $(this).attr("data-id");
			if( ! contentid ) return;
			viewImage(contentid);
		});

		function viewImage(contentid){
			$("#photos").html("");
			var url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailImage";
			var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + serviceKey; /*Service Key*/
			queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
			queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
			queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC');
			queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest');
			queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');
			queryParams += '&' + encodeURIComponent('contentId') + '=' + encodeURIComponent(contentid);
			queryParams += '&' + encodeURIComponent('imageYN') + '=' + encodeURIComponent('Y');
			queryParams += '&' + encodeURIComponent('subImageYN') + '=' + encodeURIComponent('Y');
			$.getJSON(url + queryParams, function(res){
				var imgs = res.response.body.items.item;
				if( ! imgs ) return;
				for(var i=0; i<imgs.length; i++) {
					var imgurl = imgs[i].originimgurl || "";
					if( imgurl ) {
						var photo = `<img src='${imgurl}' alt='${imgurl}'>`;
						$("#photos").append(photo);
					}
				}	
				var obj = $("#photos");
				obj.css("top", Math.max(0, (($(window).height() - obj.outerHeight()) / 2) + $(window).scrollTop()) + "px");
				obj.css("left", Math.max(0, (($(window).width() - obj.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
				$("#photos").show();
			});
		}

		$("#photos").click(function(){
			$(this).hide();
		});