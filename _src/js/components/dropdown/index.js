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
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.isMultyColumn = false;
		this.createContent (this.complex, this.data)
		return this.content;
	}
	/**
	 * create the dropdown content
	 */
	createContent (b, data) {
		if (b) {
			this.createComplex(data);
		} else {

		}
	}
	
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
	 * Handle Events in a organized way.
	 */
	handleStoreEvents () {
		return {
			'DROPDOWN_TOGGLE': (action) => {
				if (action.id === this.id) {
					this.className = this.className === 'hide' ? '' : 'hide';
				}
			}
		};
	}
}

window.customElements.define('dropdown-menu', DropDown);