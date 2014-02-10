window.onload = function(){
	var tag = getElementsByClassName('skitter')[0];
	var holeImg = document.getElementsByClassName('image')[0].getElementsByTagName('img')[0];
	var effect1 = new EffectOne({
		'row':10,
		'col':5,
		'moveType':'flexibleMove',
		//'moveType':'bufferMove',
		'speed':30
	});
	effect1.fadeIn(tag,holeImg,
		{		
		'left0':0,
		'top0':0,
		'imgUrl':'images/1_3.jpg',
		'opacity':[0,100],
		'dir':{'x':1,'y':-1}//{-1,1} {1,-1} {-1,-1}
		},function(){
				var effect2 = new EffectOne({
				'row':5,
				'col':5,
				//'moveType':'flexibleMove',
				'moveType':'bufferMove',
				'speed':30
				});
				effect2.fadeOut(tag,holeImg,
				{		
				'left0':0,
				'top0':0,
				'width':0,
				'height':0,
				'imgUrl':"images/1_2.jpg",
				'opacity':[100,0],
				});
		});






	var effect3 = new EffectTwo({
		'row':6,
		'col':10,
		'moveType':'flexibleMove',
		//'moveType':'bufferMove',
		'speed':100
	});
	// effect3.fadeIn(tag,holeImg,
	// 	{		
	// 	'left0':0,
	// 	'top0':0,
	// 	'imgUrl':'images/1_2.jpg',
	// 	'opacity':[0,100],
	// 	},function(){
	// 		effect3.fadeOut(tag,holeImg,
	// 			{		
	// 			'left0':100,
	// 			'top0':500,
	// 			'imgUrl':'images/1_3.jpg',
	// 			'opacity':[100,0],
	// 			}
	// 		);		
	// 	}
	// );

	var effect4 = new EffectThree({
		'row':4,
		'col':6,
		'moveType':'flexibleMove',
		//'moveType':'bufferMove',
		'speed':100
	});
	// effect4.fadeIn(tag,holeImg,
	// 	{		
	// 	'left0':0,
	// 	'top0':0,
	// 	'imgUrl':'images/1_3.jpg',
	// 	'opacity':[0,100],
	// 	}
	// ,function(){
	// 		effect4.fadeOut(tag,holeImg,
	// 			{		
	// 			'left0':0,
	// 			'top0':500,
	// 			'imgUrl':'images/1_2.jpg',
	// 			'opacity':[100,0],
	// 			}
	// 		);		
	// 	}	
	// );
var effect5 = new EffectFour({
		'moveType':'flexibleMove',
		//'moveType':'bufferMove',
		'speed':100
	});
	// effect5.fadeOut(tag,holeImg,
	// 	{		
	// 	'imgUrl':'images/1_3.jpg',
	// 	'opacity':[100,0],
	// 	}
	// );
}

function debug(infor){
	console.log(infor);
}