require("dotenv").config();
const puppeteer = require("puppeteer");
const { eventCrawler } = require("./eventCrawler");
const { persistToDB } = require("./database/dbOperations");

const manageCrawler = async (startId, db) => {
    const browser = await puppeteer.launch();
    try {
        let eventId = startId;
        while (eventId) {
            const scrapedEvent = await eventCrawler(browser, eventId);
            if (scrapedEvent !== null) {
                res = await persistToDB(db.LastFMEvents, {
                    id: eventId,
                    description: scrapedEvent.description,
                    date: scrapedEvent.date,
                    location: scrapedEvent.location,
                    link: scrapedEvent.link,
                    lineup: scrapedEvent.lineup
                });
                console.log(res)
            } else {
                console.log(scrapedEvent)
            }
            eventId++;
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
    const startId = 4000000;

    await manageCrawler(startId, models);
})();
