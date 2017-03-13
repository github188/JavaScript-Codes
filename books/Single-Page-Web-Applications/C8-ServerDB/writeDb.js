

db.user.insert({
	'name': 'lizc',
	'is_online': false,
	'css_map': {
		'top': 100,
		'left': 120,
		'background-color': 'rgb(136, 255, 136)'
	}
});

db.user.insert({
	'name': 'fll',
	'is_online': false,
	'css_map': {
		'top': 150,
		'left': 120,
		'background-color': 'rgb(136, 255, 136)'
	}
});

db.user.insert({
	'name': 'lwy',
	'is_online': false,
	'css_map': {
		'top': 50,
		'left': 120,
		'background-color': 'rgb(136, 255, 136)'
	}
});


//////////////  wget


wget http://localhost:3000/horse/create \
 --header='content-type: application/json' \
 --post-data='{"css_map":{"color":"#2e0"},"name":"Winney"}' \
 -O -

 wget http://localhost:3000/horse/list -O -