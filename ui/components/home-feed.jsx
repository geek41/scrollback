/* jshint browser: true */

module.exports = function(core, config, store) {
	var React = require("react"),
		roomListUtils = require("./room-list-utils.jsx")(core, config, store),
		GridView = require("./grid-view.jsx")(core, config, store),
		HomeFeed;

	HomeFeed = React.createClass({
		render: function() {
			return (<GridView sections={roomListUtils.getSections("card")} />);
		}
	});

	return HomeFeed;
};
