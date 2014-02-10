/**
 * 
 */

$(document).ready(function(){

		$(".m-drag").dragsort({ 
			dragSelector: "div", 
			itemSelector:"li",
			dragBetween: true, 
			dragEnd: saveOrder, 
			placeHolderItem: "<li class='placeHolder'><div></div></li>" ,
		});
		
		//将执行结果上传给服务器
		function saveOrder() {
			var data = $("#list1 li").map(function() { return $(this).children().html(); }).get();
			$("input[name=list1SortOrder]").val(data.join("|"));
			data = $("#list1 li").map(function() { return $(this).children().html(); }).get();
			$("input[name=list2SortOrder]").val(data.join("|"));
		};
});

