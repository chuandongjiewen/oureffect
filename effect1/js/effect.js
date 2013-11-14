window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	var box = getElementsByClassName('box_clone');
	var len = box.length;
	
	var list = [];
	for(var i=0; i<9;i++){
		var elem = createBlock({left:i*100});
		list.push(elem);
		tag.appendChild(elem);
	}
	doMovement(list,0);
}

function doMovement(list,curIndex){
	var elem = list[curIndex];
	curIndex ++;
	startMove(elem,{height:510},100,function(){});
	var timer = setTimeout(function(){
		if (curIndex == 9) {
			debug(curIndex);
			clearTimeout(timer);
		}else{
			doMovement(list,curIndex);
		}
	},100);

}


function createBlock(param){
	var parent = document.createElement('div');
	parent.className = 'box_clone';
	var img = document.createElement('img');
	img.src = 'images/1_2.jpg';
	for(var p in param){
		parent.style[p] = param[p];
	}
	img.style.left = -param['left'];
	img.style.top = -param['top'];
	parent.appendChild(img);
	return parent;
}

function debug(infor){
	console.log(infor);
}