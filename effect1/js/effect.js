window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];

	var effect1 = new EffectOne();
	effect1.fadeOut(tag);
	// effect1.test()
	
}

function doMovement(list,curIndex){
	var elem = list[curIndex];
	curIndex ++;
	startMove(
		elem,
		{
			height:510,
		},
		200
	);
	var timer = setTimeout(function(){
		if (curIndex == 9) {
			debug(curIndex);
			clearTimeout(timer);
		}else{
			doMovement(list,curIndex);
		}
	},100);

}


// function createBlock(param,imgUrl){
// 	var parent = document.createElement('div');
// 	parent.className = 'box_clone';
// 	var img = document.createElement('img');
// 	if (imgUrl == undefined) {
// 		img.src = 'images/1_3.jpg';
// 	}else{
// 		img.src = imgUrl;
// 	}
// 	for(var p in param){
// 		parent.style[p] = param[p];
// 	}
// 	img.className = 'strip_img';
// 	img.style.left = -param['left'];
// 	img.style.top = -param['top'];
// 	parent.appendChild(img);
// 	return parent;
// }
function createBlock(param,imgUrl){
	var parent = document.createElement('div');
	parent.className = 'box_clone';
	for(var p in param){
		parent.style[p] = param[p];
	}
	css(parent, param);
	return parent;
}

function debug(infor){
	console.log(infor);
}