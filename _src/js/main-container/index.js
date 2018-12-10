import { MetaContainer } from '@rebelstack-io/metaflux';
import './index.css';

class MainContainer extends MetaContainer {
	// eslint-disable-next-line class-method-use-this
	render () {
		const content = document.createElement('div');
		content.id = 'container';
		return content;
	}
}

window.customElements.define('main-container', MainContainer);
