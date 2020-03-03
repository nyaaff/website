const moment = require('moment');

module.exports = {
    './efforts.ejs': {
        efforts: require('./data/positions')
            .map(effort => {
                effort.date = moment(effort.date, 'MM-DD-YYYY').toDate();
                effort.files = effort.files
                    .map(file => {
                        return {
                            name: file,
                            date: moment(file.match(/(\d+\.\d+\.\d+)-/)[1], 'YYYY-MM-DD').toDate()
                        }
                    })
                    .sort((a, b) => {
                        return b.date - a.date;
                    });
                return effort;
            })
            .sort((a, b) => {
                return b.date - a.date;
            })
    },
    './members.ejs': {
        members: (() => {
            const members = require('./data/members');
            Object.keys(members).slice(1).forEach(key => {
                members[key] = members[key].sort(((a, b) => a.name.localeCompare(b.name)));
            });

            const pics = require('./data/profile-pic');
            Object.values(members).forEach(arr => arr.forEach(member => { // SELECT * FROM members INNER JOIN  "profile-pic" ON members.id = "profile-pic".id
                if (pics[member.id]) {
                    member.image = pics[member.id];
                    return;
                }
                member.image = null;
            }));
            return members;
        })()
    }
};
console.log()
