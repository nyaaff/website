module.exports = {
    './efforts.ejs': {
        efforts: require('./data/positions').sort(((a, b) => a.title.localeCompare(b.title)))
    },
    './members.ejs': {
        members: (() => {
            const members = require('./data/members').sort(((a, b) => a.name.localeCompare(b.name)));
            const pics = require('./data/profile-pic');
            members.forEach(member => { // SELECT * FROM members INNER JOIN  "profile-pic" ON members.id = "profile-pic".id
                if (pics[member.id]) {
                    member.image = pics[member.id];
                    return;
                }
                member.image = null;
            });
            return members;
        })()
    }
};
