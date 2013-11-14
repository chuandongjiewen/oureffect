window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	var list = [];
	for(var i=0; i<9;i++){
		var elem = createBlock({left:i*100});
		list.push(elem);
		tag.appendChild(elem);
	}

	var box = getElementsByClassName('box_clone');
	var len = box.length;
	for(var i=0;i<len;i++){
		(function(i){
			animate(box[i],{'height':'510','width':'100','opacity':'100'},1000);		
		})(i);
	}
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
	css(parent, param);
	return parent;
}

function debug(infor){
	console.log(infor);
}