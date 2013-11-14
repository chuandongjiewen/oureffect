window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	var list = [];
	for(var i=0; i<9;i++){
		var elem = createBlock({left:i*100,top:-510});
		// list.push(elem);
		tag.appendChild(elem);
	}
	doMovement(list,0);
}

function doMovement(list,curIndex){
	var elem = list[curIndex];
	curIndex ++;
	startMove(elem,{top:0},100);
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
		img.style[p] = - param[p];
	}
	parent.appendChild(img);
	return parent;
}

function debug(infor){
	console.log(infor);
}