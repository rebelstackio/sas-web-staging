import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';
import '../menu';

class Header extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super();
		this.galery = ['machupicchu-1', 'machupicchu-2', 'nazca-1', 'bikeparacas-1'];
		this.step = 0;
		this.handleSeq = this.handleSeq.bind(this);
		this.createHeaderText = this.createHeaderText.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		const img = document.createElement('div');
		const imgTag = document.createElement('img')
		this.content.id = 'header-content';
		this.content.className = 'header-content ' + this.galery[this.step];
		imgTag.setAttribute('src', 'assets/images/logo.png')
		img.id = 'header-logo';
		img.append(imgTag);
		this.content.appendChild(img);
		this.createHeaderText();
		setInterval(this.handleSeq, 10000)
		// get the menu
		this.appendChild(document.createElement('main-menu'))
		return this.content;
	}
	/**
	 * create the text for the header
	 */
	createHeaderText () {
		const textWrapper = document.createElement('div');
		textWrapper.id = 'header-text';
		const title = document.createElement('h1');
		const subTitle = document.createElement('h2');
		const div = document.createElement('div')
		title.textContent = 'South American\'s Secrets';
		subTitle.textContent = 'Secrets of Peru';
		div.append(title, subTitle);
		textWrapper.append(div);
		this.content.appendChild(textWrapper);
	}
	/**
	 * handle the presentantion
	 */
	handleSeq () {
		this.step++;
		if (this.step === this.galery.length ) {
			this.step = 0
		}
		this.content.className = 'header-content ' + this.galery[this.step];
	}

}

window.customElements.define('main-header', Header);
