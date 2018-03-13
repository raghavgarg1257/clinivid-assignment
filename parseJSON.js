const regex = /\<([^)]+)\>/;

function regexMatch(regex, string) {
	const match = regex.exec(string);
	return match ? match[1] : '';
}

function neutralize(string) {
	return string || '';
}

function getName(string) {
	const [ first, middle, last ] = string.replace(/\>/g, '> ').split(' ').filter(Boolean).map(o => o.replace(/[<>]/g, ''));
	return {
		first: neutralize(first),
		middle: neutralize(middle),
		last: neutralize(last),
	};
}

function getLocation(string) {
	const index = string.indexOf('>') + 1;
	const [ long, lat ] = regexMatch(regex, string.substring(index)).replace(/\>/g, '> ').split(' ').filter(Boolean).map(o => o.replace(/[<>]/g, ''))

	return {
		name: regexMatch(regex, string.substring(0, index)),
		coords: {
			long: neutralize(long),
			lat: neutralize(lat),
		}
	};
}

function parseProfileString(string) {

	const parsed = {
		profile: {},
		followers: []
	};

	console.log("=====================================================");
	console.log("[parsing] ", string);

	const [ profile, followers ] = string.split('**');

	// profile
	const [ profileKey, id, nameString, locationString, imageId ] = profile.split('|');
	parsed[profileKey] = {
		id: neutralize(id),
		name: getName(nameString),
		locatoin: getLocation(locationString),
		imageId: neutralize(imageId)
	};

	// followers
	const index = followers.indexOf('|') + 1;
	const [ followerKey, rest ] = [ followers.substring(0, index).replace(/\|/g, ''), followers.substring(index) ];
	parsed[followerKey] = rest.split('@@').map(o => {
		if (o[0] === '|') {
			o = o.substring(1);
		}
		const [ id, nameString, locationString, imageId ] = o.split('|');
		return {
			id: neutralize(id),
			name: getName(nameString),
			locatoin: getLocation(locationString),
			imageId: neutralize(imageId)
		};
	});

	console.log("[parsed|json]", require('util').inspect(parsed, { depth: null }));
	console.log("=====================================================");

	return parsed;
}

const p1 = "profile|73241232|<Aamir><Hussain><Khan>|<Mumbai><<72.872075><19.075606>>|73241232.jpg**followers|54543342|<Anil><><Kapoor>|<Delhi><<23.23><12.07>>|54543342.jpg@@|12311334|<Amit><><Bansal>|<Bangalore><<><>>|12311334.jpg";
const p2 = "profile|73241234|<Niharika><><Khan>|<Mumbai><<72.872075><19.075606>>|73241234.jpg**followers|54543343|<Amitabh><><>|<Dehradun><<><>>|54543343.jpg@@|22112211|<Piyush><><>||";
const p3 = "profile|73241234|<Niharika><><>|<Mumbai><<><19.075606>>|73241234.jpg**followers|54543343|<><><>|<Dehradun><<><>>|54543343.jpg@@|22112211|<><><>|<><<><>>|";
const p4 = "profile||<><><>|<><<><>>|**followers||<><><>|<><<><>>|@@||<><><>|<><<><>>|";
const p5 = "profile||||**followers||||@@||||";

parseProfileString(p1);
parseProfileString(p2);
parseProfileString(p3);
parseProfileString(p4);
parseProfileString(p5);

// {
// 	"id":"73241232",
// 	"name":{
// 		"first":"Aamir",
// 		"middle":"Hussain",
// 		"last":"Khan"
// 	},
// 	"location":{
// 		"name":"Mumbai",
// 		"coords":{
// 			"long":72.872075,
// 			"lat":19.075606
// 		}
// 	},
// 	"imageId":"73241232.jpg",
// 	"followers":[
// 		{
// 			"id":"54543342",
// 			"imageId":"54543342.jpg",
// 			"name":{
// 				"first":"Anil",
// 				"middle":"",
// 				"last":"Kapoor"
// 			},
// 			"location":{
// 				"name":"Delhi",
// 				"coords":{
// 					"long":23.23,
// 					"lat":12.07
// 				}
// 			}
// 		},
// 		{
// 			"id":"12311334",
// 			"imageId":"12311334.jpg",
// 			"name":{
// 				"first":"Amit",
// 				"middle":"",
// 				"last":"Bansal"
// 			},
// 			"location":{
// 				"name":"Bangalore",
// 				"coords":{
// 					"long":"",
// 					"lat":""
// 				}
// 			}
// 		}
// 	]
// }
