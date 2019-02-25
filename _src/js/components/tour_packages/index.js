import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';
import { getMultyLangText } from '../../util';

class TourPackages extends MetaComponent {

	constructor () {
		super();
		this.createTourContainers = this.createTourContainers.bind(this);
		document.getElementsByTagName('title')[0].innerText = 'Packages';
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.className = 'package-content';
		this.createTourContainers();
		return this.content;
	}
	/**
	 * 
	 */
	createTourContainers () {
		const data = global.storage.getState().Main.tourPackages[this.type]
		const tourContainer = document.createElement('div');
		tourContainer.className = 'tour-container';
		this.createArticle(data, tourContainer);
		this.content.appendChild(tourContainer);
	}
	/**
	 * 
	 */
	createArticle (data, box) {
		console.log(data);
		const artImg = document.createElement('img');
		artImg.setAttribute('src', data.url_image);
		const artText = document.createElement('div');
		artText.className = 'text-box';
		getMultyLangText(data.title, artText, 'div', undefined, 'article-title');
		getMultyLangText(data.subtitle, artText, 'p', undefined, 'bold');
		getMultyLangText(data.description, artText, 'p');
		box.append(artImg, artText);
	}
}

window.customElements.define('tour-packages', TourPackages);
