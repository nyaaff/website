const moment = require('moment');
const positions = require('./data/positions.json');
const members = require('./data/members.json');

module.exports = {
    'efforts.ejs': {
        efforts: positions
            .map((effort) => {
                effort.date = moment(effort.date, 'MM-DD-YYYY').toDate();
                effort.files = effort.files
                    .map((file) => ({
                        name: file,
                        date: moment(
                            file.match(/(\d+\.\d+\.\d+)-/)[1],
                            'YYYY-MM-DD'
                        ).toDate(),
                    }))
                    .sort((a, b) => b.date - a.date);
                return effort;
            })
            .sort((a, b) => b.date - a.date),
    },
    'members.ejs': {
        members: (() => {
            Object.keys(members)
                .slice(1)
                .forEach((key) => {
                    members[key] = members[key].sort((a, b) => {
                        const getSortName = (str) => {
                            const split = str
                                .replace(/, ?Esq\.( ?, ?LCSW)?/, '')
                                .split(' ');
                            return `${split.pop()}, ${split.join(' ')}`;
                        };
                        return getSortName(a.name).localeCompare(
                            getSortName(b.name)
                        );
                    });
                });

            const ids = [];
            Object.values(members)
                .flat(1)
                .forEach((member) => {
                    if (ids.includes(member.id)) {
                        throw new Error(`Duplicate Key: ${member.id}`);
                    }
                    ids.push(member.id);
                });
            return members;
        })(),
    },
};
