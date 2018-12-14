import '@webcomponents/webcomponentsjs';
import '../main-container';

document.addEventListener('DOMContentLoaded', () => {
	const container = document.createElement('main-container');
	const inner = document.getElementsByClassName('content')[0] 
	inner.appendChild(container);
	// this would handle the first load in the lang of the browser
	var userLang = navigator.language || navigator.userLanguage;
	global.storage.dispatch({type: 'CHANGE_LANG', value: userLang.split('-')[0]})
})

