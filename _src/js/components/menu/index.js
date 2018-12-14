import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class Menu extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super();
		this.getLangSelector = this.getLangSelector.bind(this);
		this.handleLang = this.handleLang.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.id = 'menu-content';
		const {menuData} = global.storage.getState().Main;
		menuData.items.map(m => {
			const menuBox = document.createElement('div');
			menuBox.id = 'menu-box';
			Object.keys(m).forEach(key => {
				const menuItem = document.createElement('span');
				menuItem.textContent = m[key]
				menuItem.setAttribute('lang', key);
				menuItem.className = 'hide';
				menuBox.appendChild(menuItem);
			})
			this.content.appendChild(menuBox);
		})
		this.img = document.createElement('img');
		const box = document.createElement('div');
		box.id = 'menu-box';
		this.getLangSelector();
		box.addEventListener('click', this.handleLang)
		box.appendChild(this.img)
		this.content.appendChild(box);
		return this.content;
	}

	handleLang () {
		const {lang} = global.storage.getState().Main;
		switch (lang) {
			case 'es':
				global.storage.dispatch({type: 'CHANGE_LANG', value: 'en'})
				break;
			case 'en':
				global.storage.dispatch({type: 'CHANGE_LANG', value: 'es'})
				break;
			default:
				global.storage.dispatch({type: 'CHANGE_LANG', value: 'en'})
				break;
		}
		this.getLangSelector();
	}
	/**
	 * get the lang selector
	 */
	getLangSelector () {
		const {lang} = global.storage.getState().Main;
		switch (lang) {
			case 'en':
				this.img.setAttribute('src', 'assets/images/spain_flag.png');
				break;
			case 'es':
				this.img.setAttribute('src', 'assets/images/usa_flag.png');
				break;
			default:
				this.img.setAttribute('src', 'assets/images/usa_flag.png')
				break;
		}
	}
}

window.customElements.define('main-menu', Menu);
