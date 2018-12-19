/*
* DEFAULT HANDLER
*/

const MainDefaultState = {
	menuData: global.menuData,
	lang: 'en',
	lastNews: global.lastNews
};

export default {
	MainDefaultState,
	MainHandler: {
		'CHANGE_LANG': (action, state) => {
			state.Main.lang = action.value;
			return { newState: state };
		}
	}
};
