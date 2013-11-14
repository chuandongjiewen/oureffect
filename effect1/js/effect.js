window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	var box = getElementsByClassName('box_clone');
	var len = box.length;
	for(var i=0;i<len;i++){
		(function(i){
			startMove(box[i],{'height':'510'},1000);
		})(i);
	}
	
}

function CreateBlock(){
	var parent = document.createElement('div');
	parent.className = 'box_clone';
	parent.style.left = '100px';
	var img = document.createElement('img');
	img.src = 'images/1_2.jpg';
	img.style.left = '-100px';
	parent.appendChild(img);
	return parent;
}

function debug(infor){
	console.log(infor);
}