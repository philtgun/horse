
$(function () {
	// Bootstrap-style file inputs
	$('input[type=file]').bootstrapFileInput();

	// Get audio file list and create buttons for each
	$.ajax({
		url: "/getAudioList",
		success: function (data) {
			data.forEach(function (item){
				var name = item.split(".")[0];
				$("#playButtons").append("<input type='button' class='btn btn-default play-button' id='"+name+"' value='"+name+"'>");
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
	});

	$('#sayButton').click(function(){
		var text = $('#sayText').val();
		$.ajax({
			url: "/sayText/"+text,
			method: 'POST',
			success: function (data) {
				console.log('Say AJAX success');
			},
			error: function (data) {
				console.log(data);
			}
		});
	});

	$('#sayText').keyup(function(event){
	    if(event.keyCode == 13) {
	        $("#sayButton").click();
	    }
	});
});
