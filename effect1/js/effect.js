window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	
	var effect1 = new EffectOne();
	effect1.fadeOut(tag);
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
	css(parent, param);
	return parent;
}

function debug(infor){
	console.log(infor);
}