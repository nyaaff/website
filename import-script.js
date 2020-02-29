const fs = require('fs-extra');

//NAME	LAW FIRM	STREET  ADDRESS	CITY	STATE	ZIP CODE	PHONE NUMBER	EMAIL ADDRESS	WEBSITE	FACEBOOK	TWITTER	LINKEDIN	YOUTUBE	INSTAGRAM	FOCUS1	FOCUS 2

const contents = fs.readFileSync('./data/members-paste.txt').toString();
const currentMembers = require('./data/members');

const members = contents.split('\n')
    .map(line => line.split('\t'))
    .map((line, index) => {
        line = line.map(item => item.trim());

        const obj = {
            id: index + 1, // yes, foreign keys in json
            name: line[0],
            law_firm: line[1],
            addresses: [line[2]],
            cities: [line[3]],
            states: line[4] ? line[4].split(/\s+/) : null,
            zips: line[5] ? line[5].split(/\s+/) : null,
            phone: line[6],
            email: line[7],
            websites: line[8] ? line[8].split(" ").map(site => httptize(site.trim())) : [],
            social_media: {
                Facebook: line[9] ? line[9] : null,
                Twitter: line[10] ? line[10] : null,
                LinkedIn: line[11] ? line[11] : null,
                YouTube: line[12] ? line[12] : null,
                Instragram: line[13] ? line[13] : null,
            },
            focuses: []
        };
        if (line[14]) {
            obj.focuses.push(line[14])
        }
        if (line[15]) {
            obj.focuses.push(line[15])
        }
        return obj;
    });

function httptize(url) {
    if(url.startsWith("http")){
        return url;
    }
    return "http://" + url;
}

fs.writeFileSync('./data/members.json', JSON.stringify(currentMembers.concat(members)));
