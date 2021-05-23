const moment = require('moment');

module.exports = {
    'efforts.ejs': {
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
    'members.ejs': {
        members: (() => {
            const members = require('./data/members');
            Object.keys(members).slice(1).forEach(key => {
                members[key] = members[key].sort((a, b) => {
                    const getSortName = (str) => {
                      const split = str.replace(/, ?Esq\.( ?, ?LCSW)?/, '')
                          .split(" ");
                      return split.pop() + ", " + split.join(" ");
                    };
                    return getSortName(a.name).localeCompare(getSortName(b.name));
                });
            });

            const ids = [];
            Object.values(members).flat(1).forEach(member => {
               if(ids.includes(member.id)){
                   throw 'Duplicate Key: ' + member.id;
               }
               ids.push(member.id)
            });
            return members;
        })()
    }
};
