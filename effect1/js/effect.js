window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];

	var effect1 = new EffectOne();
	// effect1.fadeIn(tag);
	// effect1.fadeOut(tag);
	effect1.test(tag);
}


function createBlock(param,imgUrl){
	var parent = document.createElement('div');
	parent.className = 'box_clone';
	css(parent, param);
	return parent;
}

function debug(infor){
	console.log(infor);
}