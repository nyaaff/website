const moment = require('moment');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const positions = require('./data/positions.json');
const members = require('./data/members.json');
const news = require('./data/news.json');

function parseEffortDate(dateStr) {
    // Historical data uses multiple formats (e.g. "5/16/25", "2/15/2021", "03-18-2026").
    // Prefer strict parsing across known formats to avoid "Invalid Date" sorting/rendering.
    const parsed = moment(
        dateStr,
        ['MM-DD-YYYY', 'M-D-YYYY', 'M/D/YYYY', 'M/D/YY'],
        true
    );
    return parsed.isValid() ? parsed.toDate() : new Date(0);
}

function parseFileDateFromName(fileName, fallbackDate) {
    // Prefer extracting a date from the filename (e.g. 2025.05.12-My-Letter.pdf)
    // Otherwise fall back to the parent effort date.
    const match = fileName.match(/(\d+\.\d+\.\d+)-/);
    if (match && match[1]) {
        const parsed = moment(match[1], ['YYYY.MM.DD', 'YYYY-MM-DD'], true);
        if (parsed.isValid()) return parsed.toDate();
    }
    return fallbackDate;
}

module.exports = async () => ({
    'efforts.ejs': {
        efforts: positions
            .map((effort) => {
                effort.date = parseEffortDate(effort.date);
                effort.files = effort.files
                    .map((file) => ({
                        name: file,
                        date: parseFileDateFromName(file, effort.date),
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
