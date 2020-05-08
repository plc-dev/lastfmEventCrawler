require("dotenv").config();
const puppeteer = require("puppeteer");
const { eventCrawler } = require("./eventCrawler");
const { persistToDB } = require("./database/dbOperations");

const manageCrawler = async (startId, db) => {
    const browser = await puppeteer.launch({headless: false});
    try {
        let eventId = startId;
        while (eventId) {
            const scrapedEvent = await eventCrawler(browser, eventId);
            eventId++;
            await persistToDB(db.LastFMEvents, {
                eventId: currentEventId,
                eventTitle: scrapedEvent.title,
                eventDescription: scrapedEvent.description,
                entities: scrapedEvent.mergedEntities
            });
            console.log(eventId)
        };
    } catch(e) {
        console.log(e)
    } finally {
        await browser.close()
        return;
    }
};

(async function main() {
    const mdb = await require("./database/mongooseDAO")();
    const models = mdb.models;
    const startId = 100000;

    await manageCrawler(startId, models);
})();
