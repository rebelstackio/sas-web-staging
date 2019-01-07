import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';
import { getMultyLangText, getMultyLangLink } from '../../util';


class DropDown extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super(global.storage);
		this.createContent = this.createContent.bind(this);
		this.createComplex = this.createComplex.bind(this);
		this.createSimple = this.createSimple.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.createContent (this.complex, this.data);
		return this.content;
	}
	/**
	 * create the dropdown content
	 */
	createContent (b, data) {
		if (b) {
			this.createComplex(data);
		} else {
			this.createSimple(data);
		}
	}
	/**
	 * create a multy columns dropdown
	 * @param {Array} data 
	 */
	createComplex (data) {
		data.forEach(d => {
			const section = document.createElement('div');
			section.className = 'dropdown-section';
			const titleBox = document.createElement('div');
			getMultyLangText(d.title, titleBox, 'p', undefined, 'dropdown-complex-title');
			const optionsBox = document.createElement('div');
			optionsBox.className = 'dropdown-complex-options';
			d.items.forEach (item => {
				getMultyLangLink(item.title, optionsBox, 'dropdown-complex-link', item.url);
			})
			section.append(titleBox, optionsBox);
			this.content.appendChild(section);
		});
	}
	/**
	 * create simple dropdown
	 * @param {Array} data 
	 */
	createSimple (data) {
		data.forEach(d => {
			const section = document.createElement('div');
			section.className = 'dropdown-section';
			const titleBox = document.createElement('div');
			getMultyLangLink(d.title, titleBox, 'dropdown-simple-option', d.url);
			section.appendChild(titleBox);
			this.content.appendChild(section);
		})
	}
	/**
	 * Handle Toggle Events
	 */
	handleStoreEvents () {
		return {
			'DROPDOWN_TOGGLE': (action) => {
				if (action.id === this.id) {
					this.style.top = (this.parentNode.offsetTop + this.parentNode.offsetHeight) + 'px';
					this.style.left = this.parentNode.offsetLeft + 'px';
					if (this.classList.contains('hide')) {
						this.classList.remove('hide');
						this.parentNode.classList.add('dropdown-active');
					} else {
						this.classList.add('hide');
						this.parentNode.classList.remove('dropdown-active');
					}
				} else {
					this.classList.add('hide');
					this.parentNode.classList.remove('dropdown-active');
				}
			}
		};
	}
}

window.customElements.define('dropdown-menu', DropDown);