$(function () {
	$.ajax({
		url: "/getAudioList",
		success: function (data) {
			data.forEach(function (item){
				var name = item.split(".")[0];
				$("#playButtons").append("<button class='btn btn-default' btn btn-default id='"+name+"'>"+name+"</button><br>");
				$("#"+name).click(function(){
					$.ajax({
						url: "/playAudio/"+item,
						success: function (data) {
							console.log(data);
						},
						error: function (data) {
							console.log(data);
						}
					});
				});
			});
		},
		error: function (data) {
			console.log(data);
		}
	})
});
