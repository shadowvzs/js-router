(function(global) {

	const regex = /\bimport {(.*)} from "(.*)";/gm;
	const entrypoint = 'js/index'
	const initFunction = "__App";
	const keyData = new Set();
	let files = {};
	let content = [];

	function load (keys, url) {
		keys.forEach( k =>  ( !keyData.has(k)) && keyData.add(k) );
		if (files[url] && files[url].loaded) {
			return;
		}
		files[url] = { loaded: false, url};
		_getScript(url);
	}

	async function _getScript(url, init = false) {
			console.log('loaded: ', url, Date.now());
			const content = await _ajax(url+'.js');
			!init && (files[url].loaded = true);
			extractImport(regex, content)
	}

	function extractImport(regex, newContent) {
			let m, c = 0; // m = matches array ([0] = whole string, [1] = keys, [2] = url)
			do {
			    m = regex.exec(newContent);
			    if (m) {
				    	if (!files[m[2]]) {
				    			c++;
				        	load(m[1].split(',').map(e => e.trim() ), m[2]) ;
				    	}
			    }
			} while (m);


			newContent = newContent.replace(regex, '');
			content.unshift(newContent);


			const remaining = Object.keys(files).reduce((t, c) => t + +!files[c].loaded, 0);
			if (c == 0 && remaining == 0) {
					createScript(newContent);
			}
	}

	function createScript(newContent) {
		const loadedJS = document.createElement('script'),
				mainJS = document.createElement('script'),
				main = content.splice(-1)[0],
		    props = Array.from(keyData).reverse();
		// my idea here is: lets close everything into a scope, then add to global what i need
		content.unshift(`{`);
		content.push(`
		const global = window;
		global.tunnel = {};
		const __keys = [${props.map(e => '"' + e + '"')}];
		const __values = [${props}];
		for( const index in __keys) {
			global.tunnel[__keys[index]] = __values[index];
		}
		`);
		content.push(`}`);
		loadedJS.innerHTML = content.join(' \n ');
		document.head.appendChild(loadedJS);
		mainJS.innerHTML = `function ${initFunction}() {
			const global = window;
			const { ${props.join(',')} } = global.tunnel;
			delete global.tunnel;
			${main.replace(regex, '')}
		}`;
		document.body.appendChild(mainJS);
		const loader = document.head.querySelector(`[data-role="js-loader"]`);
		setTimeout( _ => {
				global[initFunction]();
				loader.remove();
				keyData.clear();
				files = null;
				content = null;
		}, 0);
	}

	function _ajax(url) {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", '/'+url, true);
			//xhr.setRequestHeader("Connection", "Keep-Alive");
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8; Keep-Alive;");
			xhr.responseType = "text";
			xhr.send();
			return new Promise((resolve, reject) => {
					xhr.onreadystatechange = function() {
							if (this.readyState == 4) {
									if (this.status == 200) {
											resolve(this.responseText);
									} else {
											reject(`Unable to load: ${url}`);
									}
							}
					};
			});
	}

	_getScript(entrypoint, true);


})(this);
