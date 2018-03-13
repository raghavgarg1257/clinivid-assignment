const regex = /<([^<^>]+)>/g;

function regexMatch(string) {
	const found = [];
	while (match = regex.exec(string)) {
		found.push(match[1]);
	}
	return found;
}

function neutralize(string) {
	return string || '';
}

function getName(string) {
	const [ first, middle, last ] = regexMatch(string);
	return {
		first: neutralize(first),
		middle: neutralize(middle),
		last: neutralize(last),
	};
}

function getLocation(string) {
	const [ name, long, lat ] = regexMatch(string);
	return {
		name: neutralize(name),
		coords: {
			long: neutralize(long),
			lat: neutralize(lat),
		}
	};
}

function getProfile(string) {
	const [ id, nameString, locationString, imageId ] = string.split('|');
	return {
		id: neutralize(id),
		name: getName(nameString),
		locatoin: getLocation(locationString),
		imageId: neutralize(imageId)
	};
}

function getFollowers(string) {
	return string.split('@@').map(record => {
		// profile should have only 4 parameters and to divide (n) things we need (n-1) dividers
		if ((record.split('|').length - 1) !== 3 && record[0] === "|") {
				record = record.substring(1);
		}
		return getProfile(record);
	});
}

function parseProfileString(string) {

	console.log("=====================================================");
	console.log("[parsing] ", string);

	const parsed = {};
	const [ profile, followers ] = string.split('**');

	// profile
	const [ profileKey, ...profileData ] = profile.split('|');
	parsed[profileKey] = getProfile(profileData.join('|'));

	// followers
	const followerKeyIndex = followers.indexOf('|') + 1;
	const [ followerKey, followersData ] = [ followers.substring(0, followerKeyIndex).replace(/\|/g, ''), followers.substring(followerKeyIndex) ];
	parsed[followerKey] = getFollowers(followersData);

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
