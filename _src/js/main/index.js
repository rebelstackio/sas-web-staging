import '@webcomponents/webcomponentsjs';
import '../main-container';

document.addEventListener('DOMContentLoaded', () => {
	const container = document.createElement('main-container');
	const inner = document.getElementsByClassName('content')[0] 
	inner.appendChild(container);
})
