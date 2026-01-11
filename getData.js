const moment = require('moment');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const positions = require('./data/positions.json');
const members = require('./data/members.json');
const news = require('./data/news.json');

module.exports = async () => ({
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
            // Filter to only include current members (default to current if status not specified)
            Object.keys(members).forEach((key) => {
                members[key] = members[key]
                    .filter((member) => {
                        // If status is not specified, assume current
                        // Only filter out if explicitly marked as non-current
                        const status =
                            member.status && member.status.toLowerCase();
                        return (
                            !status ||
                            status === 'current' ||
                            status === 'active'
                        );
                    })
                    .sort((a, b) => {
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
    'news.ejs': {
        news,
        meta: await (async () => {
            const urls = [...news.art, ...news.adoption]
                .filter((item) => item.type === 'article')
                .map((item) => item.url);
            const meta = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const url of Object.values(urls)) {
                // eslint-disable-next-line no-await-in-loop
                const html = await fetch(url).then((resp) => resp.text());
                const root = parse(html);
                const metas = root.querySelectorAll('meta');
                meta[url] = metas
                    .filter(
                        (el) =>
                            el.getAttribute('property') &&
                            el.getAttribute('property').startsWith('og:')
                    )
                    .reduce((acc, item) => {
                        acc[item.getAttribute('property')] =
                            item.getAttribute('content');
                        return acc;
                    }, {});
            }
            return meta;
        })(),
    },
    'governing-documents.ejs': {
        page: 'governing-documents',
    },
});
