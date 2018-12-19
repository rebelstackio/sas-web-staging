import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';
import Navigo from 'navigo';

class Menu extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super(global.storage);
		this.getLangSelector = this.getLangSelector.bind(this);
		this.handleLang = this.handleLang.bind(this);
		this.createMenuContent = this.createMenuContent.bind(this);
		this.createFeedBack = this.createFeedBack.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		const {lang} = this.storage.getState().Main;
		this.content = document.createElement('div');
		this.content.id = 'menu-content';
		this.img = document.createElement('img');
		const box = document.createElement('div');
		box.id = 'menu-box';
		this.createMenuContent();
		this.createFeedBack();
		this.getLangSelector(lang);
		box.addEventListener('click', this.handleLang)
		box.appendChild(this.img)
		this.content.appendChild(box);
		return this.content;
	}
	/**
	 * handle the menu navigation 
	 */
	handleRoute (action) {
		let router = new Navigo(null, true, '#');
		router.navigate(action)
	}
	/**
	 * 
	 */
	createFeedBack () {
		const box = document.createElement('div');
		box.id = 'feedback-btn';
		this.content.appendChild(box);
	}
	/**
	 * create the text foreach menu item in both languages
	 */
	createMenuContent () {
		const {menuData} = this.storage.getState().Main;
		menuData.items.map(m => {
			const menuBox = document.createElement('div');
			menuBox.id = 'menu-box';
			Object.keys(m.data).forEach(key => {
				const menuItem = document.createElement('span');
				menuItem.textContent = m.data[key]
				menuItem.setAttribute('lang', key);
				menuItem.className = 'hide';
				menuBox.appendChild(menuItem);
				if (m.action !== '') {
					menuBox.addEventListener('click', this.handleRoute.bind(this, m.action))
				}
			})
			this.content.appendChild(menuBox);
		})
	}
	/**
	 * dispatch the lang selected
	 */
	handleLang () {
		const {lang} = this.storage.getState().Main;
		switch (lang) {
			case 'es':
				this.storage.dispatch({type: 'CHANGE_LANG', value: 'en'})
				break;
			case 'en':
				this.storage.dispatch({type: 'CHANGE_LANG', value: 'es'})
				break;
			default:
				this.storage.dispatch({type: 'CHANGE_LANG', value: 'en'})
				break;
		}
	}
	/**
	 * get the lang selector
	 */
	getLangSelector (lang) {
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
		/**
	 * Handle Events in a organized way.
	 */
	handleStoreEvents () {
		return {
			'CHANGE_LANG': () => {
				this.getLangSelector(this.storage.getState().Main.lang);
			}
		};
	}
}

window.customElements.define('main-menu', Menu);
