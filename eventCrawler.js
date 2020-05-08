const crawlEventDescription = async page => {
    let eventDescription = null;
    try {
        await page.waitFor(() => !!document.querySelector('.qa-event-description'), {timeout: 2000});
        eventDescription = await page.$eval('.qa-event-description', el => el.textContent );
    } catch (e) {
        eventDescription = null;
    } finally {
        return eventDescription;
    }
}

const crawlLineUp = async page => {
    let lineUp = null;
    try {
        await page.waitFor(() => !!document.querySelector('.secondary-nav-item--lineup', {timeout: 2000}));
        // await page.click('.secondary-nav-item--lineup a');

        await page.goto(page.url() + "/lineup");
        await page.waitFor(() => !!document.querySelector('.big-artist-list'));

        lineUp = await page.evaluate(() => {
            const getTextContentIfExists = nestedEl => nestedEl ? nestedEl.textContent : null;
            return Array.from(document.querySelectorAll('.big-artist-list .big-artist-list-item'))
                .map(artist => {
                    const titleElement = artist.querySelector('.big-artist-list-title a');
                    const name = getTextContentIfExists(titleElement);
                    let link = name ? titleElement.href : null;
                    const genres = Array.from(artist.querySelectorAll('.big-artist-list-tags .tag')).map(tag => tag.textContent)
                    return { name, link, genres };
                });
        });
    } catch (e) {
        lineUp = null;
    } finally {
        return lineUp;
    }
};

const crawlDate = async page => {
    let date = null;
    try {
        await page.waitFor(() => !!document.querySelector('[itemprop="startDate"]'), {timeout: 2000});
        date = await page.$eval('[itemprop="startDate"]', el => {
            const timestamp = el.getAttribute("content");
            const dateText = el.textContent.trim();
            return { timestamp, dateText };
        });
    } catch(e) {
        date = null;
    } finally {
        return date;
    }
}

const crawlLocation = async page => {
    let location = null;
    try {
        await page.waitFor(() => !!document.querySelector('.event-detail-address'), {timeout: 2000});
        location = await page.$eval('.event-detail-address', el => {
            const getInfoIfExists = nestedEl => nestedEl ? nestedEl.textContent : null;
            const venue = getInfoIfExists(el.querySelector('[itemprop="name"]'));
            const address = getInfoIfExists(el.querySelector('[itemprop="streetAddress"]'));
            const city = getInfoIfExists(el.querySelector('[itemprop="addressLocality"]'));
            const country = getInfoIfExists(el.querySelector('[itemprop="addressCountry"]'));
            return { venue, address, city, country };
        });
    } catch(e) {
        location = null;
    } finally {
        return location;
    }
}

const crawlLink = async page => {
    let eventLink = null;
    try {
        await page.waitFor(() => !!document.querySelector('.qa-event-link'), {timeout: 2000});
        eventLink = await page.$eval('.qa-event-link a', el => el.href );
    } catch(e) {
        eventLink = null;
    } finally {
        return eventLink;
    }
}

const check404 = async page => {
    if (await page.evaluate(() => /404 - Seite nicht gefunden/.test(document.querySelector('.page-content').textContent))) {
        throw new Error("skipped: 404")
    }
    return;
};

const eventCrawler = async (browser, eventId) => {
    let event = null;
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    try {
        const url = `https://www.last.fm/de/event/${eventId}`;
        await page.goto(url);

        await check404(page);
        const description = await crawlEventDescription(page);
        const date = await crawlDate(page);
        const location = await crawlLocation(page);
        const link = await crawlLink(page);
        const lineUp = await crawlLineUp(page);
        
        event = { 
            description,
            date,
            location,
            link,
            lineUp
        };
        
    } catch (e) {
        console.log(e);
        event = null;
    } finally {
        await page.goto('about:blank');
        await page.close();
        return event;
    }
}

module.exports = { eventCrawler };