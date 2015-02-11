/* jshint browser: true */
/* global $ */

module.exports = function(core, config, state) {
	var React = require("react"),
		ListView = require("./list-view.jsx")(core, config, state),
		GridView = require("./grid-view.jsx")(core, config, state),
		RoomCard = require("./room-card.jsx")(core, config, state),
		RoomListItem = require("./room-list-item.jsx")(core, config, state),
		HomeFeed, RoomList,
		titles = {
			owner: "My rooms",
			moderator: "My rooms",
			member: "Following",
			visitor: "Recently visited"
		},
		homefeed = document.getElementById("js-home-feed"),
		roomlist = document.getElementById("js-room-list");

	function getSections(type) {
		var sections = {}, arr = [];

		state.get("indexes", "userRooms", state.get("userId")).forEach(function(rel) {
			sections[rel.role] = sections[rel.role] || {
				key: rel.role,
				header: titles[rel.role],
				items: []
			};

			sections[rel.role].items.push({
				key: "room-card-" + rel.room,
				elem: (type === "small") ?  <RoomListItem roomId={rel.room} /> : <RoomCard roomId={rel.room} discussionCount="2" />
			});
		});

		for (var role in sections) {
			arr.push({
				key: sections[role].key + (type ? "-" + type : ""),
				header: sections[role].header,
				items: sections[role].items
			});
		}

		return arr;
	}

	HomeFeed = React.createClass({
		render: function() {
			return (<GridView sections={getSections("large")} />);
		}
	});

	RoomList = React.createClass({
		render: function() {
			return (<ListView sections={getSections("small")} />);
		}
	});

	core.on("statechange", function(changes, next) {
		var mode = state.get("nav", "mode");

		if (changes && changes.indexes && changes.indexes.userRooms) {
			if (mode === "home") {
				React.render(<HomeFeed />, homefeed);
			}

			if (mode === "room") {
				React.render(<RoomList />, roomlist);
			}
		}

		next();
	}, 500);

	$(".js-goto-room").on("click", function() {
	    core.emit("setstate", {
	        nav: {
	            mode: "room",
	            view: null
	        }
	    });
	});

	return HomeFeed;
};

