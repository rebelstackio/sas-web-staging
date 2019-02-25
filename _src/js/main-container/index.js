import { MetaContainer } from '@rebelstack-io/metaflux';
import './index.css';
import '../components/header';
import '../components/home';
import '../components/dropdown';
import '../components/tour_packages';
import '../handlers';
import Navigo from 'navigo';

class MainContainer extends MetaContainer {
	constructor () {
		super();
		this.handleLang = this.handleLang.bind(this)
		this.handleRoute = this.handleRoute.bind(this)
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		const content = document.createElement('div');
		const header = document.createElement('main-header');
		this.siteContent = document.createElement('div');
		content.id = 'container';
		content.append(header, this.siteContent);
		this.handleLang();
		this.handleRoute()
		return content;
	}
	/**
	 * handle the route in the site
	 */
	handleRoute () {
		const that = this;
		let root = null;
		let useHash = true; // Defaults to: false
		let hash = '#'; // Defaults to: '#'
		let router = new Navigo(root, useHash, hash);
		router
		.on({
			'/': function () {
				const mainContent = document.createElement('main-home')
				that.siteContent.innerHTML = '';
				that.siteContent.appendChild(mainContent);
				that.toggleLang();
			},
			'about/': function () {
				const otherSite = document.createElement('span');
				otherSite.id = 'other-site';
				that.siteContent.innerHTML = '';
				that.siteContent.appendChild(otherSite);
			},
			'packagecoast/:id': function (params) {
				const b = params.id === 'package-mystery-south-coast' ? 0 : 1;
				const tourPackages = document.createElement('tour-packages');
				tourPackages.type = b;
				tourPackages.searchKey = params.id;
				that.siteContent.innerHTML = '';
				that.siteContent.appendChild(tourPackages);
				that.toggleLang();
			}
		})
		.resolve();
	}
	/**
	 * handle lang store evenet
	 */
	handleLang () {
		global.storage.on('CHANGE_LANG', () => {
			this.toggleLang();
		})
	}

	/**
	 * function that toggle visibility of the tags by lang
	 */
	toggleLang () {
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
	}

}

window.customElements.define('main-container', MainContainer);
