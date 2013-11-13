window.onload = function(){
	var tag = getElementsByClassName('skitter');

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