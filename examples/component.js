$(function(){
	var self = this;
	var components = {};
	window.components = {};

	function handleComponent(){
		var name = $(this).attr('component');
		var template = '';

		if (components[name]) return;
		components[name] = true;

		$.ajax({dataType:'text', url: name+'.css',success:function(data){
			$('<style>').appendTo('body').text(data);
		}});
		$.ajax({dataType:'text', url: name+'.html',success:function(data){
			template = data;
			$.ajax({dataType:'text', url: name+'.js',success:function(data){
				var h = window.onerror;
				window.onerror = function(msg, url, line, col, error) {
					var extra = !col ? '' : '\ncolumn: ' + col;
					extra += !error ? '' : '\nerror: ' + error;
					url = !url?name+'.js':url;
					alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
					return true;
				};
				$('<script>').appendTo('body').text(data);
				window.onerror = h;
				if (!window.components[name]) alert('could not load '+name+'.js');
				$(['div.component[component="'+name+'"]']).each(function(){
					window.components[name]($(this),template);
				});
			}});
		}});
	}

	$('div.component').each(handleComponent);
});