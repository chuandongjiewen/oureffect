/*
	ImageSwitcher
	Copyright 20140410 by Ada Wang/汪洁文
*/
window.onload = function(){
	$("#effect").switcher({
		// 'row':4,
		// 'col':6,
		// 'moveType':'bufferMove',
		'loopPlay':true,
		'speed':40,
		'moveStyle': "random"//random,blockIn,blockOut,closeIn,closeOut,crossIn,crossOut,circleOut
	});
	btnEffect();
}
function btnEffect(){
	var playing = false;
	var lis = $("#choseEffect li");
	var len = lis.length;
	//并列元素加事件
	lis.each(function(index, val) {
		$(val).click(function(event) {	//单纯this是htmlElement
			if($(this).hasClass('unable')) return;
			var action = val.innerText;
			$("#effect").switcherStop();
			switch(action){
				case 'stop':
					var _this = this;
					if(playing == true)	playing=false;
					$(this).removeClass('enable').addClass('unable');
					setTimeout(function(){			
						$(_this).nextAll().removeClass('unable').addClass('enable');
					},1500)
					
				break;
				case 'random':
					if(playing == true)	return;
					playing = true;	
					lis.eq(0).removeClass('unable').addClass('enable');
					lis.slice(1,len).removeClass('enable').addClass('unable');
					$("#effect").switcherPlay({
						'loopPlay':true,
						'moveStyle': action
					});	
				break;
				default:
					if(playing == true)	return;
					playing = true;	
					$("#effect").switcherPlay({
						'loopPlay':false,
						'moveStyle': action
					},function(){
						playing = false;
					});					
				break;
			}
		});
	});			
}