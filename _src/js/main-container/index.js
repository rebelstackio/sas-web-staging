import { MetaContainer } from '@rebelstack-io/metaflux';
import './index.css';
import '../components/header';
import '../handlers';

class MainContainer extends MetaContainer {
	constructor () {
		super();
		this.handleLang = this.handleLang.bind(this)
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		const content = document.createElement('div');
		const header = document.createElement('main-header');
		content.id = 'container';
		content.appendChild(header);
		this.handleLang();
		return content;
	}
	/**
	 * toggle visibility to the elements with the tag Lang
	 */
	handleLang () {
		global.storage.on('CHANGE_LANG', () => {
			const {lang} = global.storage.getState().Main;
			const show = document.querySelectorAll('*[lang="' + lang + '"]');
			const hide = document.querySelectorAll('*[lang^="e"]:not([lang="' + lang + '"])');
			show.forEach((s) => {
				s.classList.remove('hide');
			});
			hide.forEach((h) => {
				h.classList.remove('hide');
				h.classList.add('hide');
			});
		})
	}
}

window.customElements.define('main-container', MainContainer);
