// wanderly-data.js
(function () {
    "use strict";

    window.Wanderly = window.Wanderly || {};

    // ==========================================================================
    // LAYER 2: DATA REGISTRY (Local Database Layer)
    // ==========================================================================
    const styleData = {
        "Slow & cultural": [
            { t: "10 days in Portugal's Alentejo", p: "Whitewashed villages, long lunches, cork-oak plains.", i: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" },
            { t: "12 days along the Silk Road", p: "Samarkand to Bukhara, with a local historian.", i: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=800&q=80" },
            { t: "7 days in Kyoto, slowly", p: "Temples at dawn, omakase at dusk.", i: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80" }
        ],
        Adventure: [
            { t: "14 days in Patagonia", p: "W-trek, glaciers, and estancia nights.", i: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
            { t: "9 days in Iceland's highlands", p: "Super-jeeps, hot springs, and aurora hunts.", i: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80" },
            { t: "11 days in Namibia", p: "Self-drive through dunes, Skeleton Coast.", i: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80" }
        ],
        Romance: [
            { t: "7 days on the Amalfi Coast", p: "Cliffside suites, private boats, lemon groves.", i: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80" },
            { t: "5 days in a riad, Marrakech", p: "Courtyards, hammams, and the Atlas beyond.", i: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80" },
            { t: "10 days across the Scottish isles", p: "Castles, whisky, and a lot of weather.", i: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" }
        ],
        Culinary: [
            { t: "8 days in San Sebastián & Rioja", p: "Pintxos, three-star tables, and winemakers.", i: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" },
            { t: "9 days in Oaxaca", p: "Mezcal palenques, mole masters, markets.", i: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" },
            { t: "6 days in Emilia-Romagna", p: "Parmesan caves, balsamic lofts, pasta labs.", i: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=800&q=80" }
        ],
        Wellness: [
            { t: "7 days at an Ayurveda retreat, Kerala", p: "Daily treatments, silence, backwater walks.", i: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" },
            { t: "6 days in a Swiss alpine spa", p: "Thermal baths, forest trails, long sleep.", i: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80" },
            { t: "10 days in Bali, quietly", p: "Yoga, water temples, and a lot of rice fields.", i: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" }
        ],
        Family: [
            { t: "12 days in Costa Rica", p: "Sloths, surf, cloud forests, and kids' camps.", i: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
            { t: "9 days in Sri Lanka", p: "Trains, elephants, and very gentle beaches.", i: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80" },
            { t: "10 days in southern Italy", p: "Pizza classes, trulli houses, blue water.", i: "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&w=800&q=80" }
        ]
    };

    const days = [
        { d: 1, t: "Lisbon, softly", p: "Alfama at dawn, pastéis at Manteigaria.", i: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80" },
        { d: 2, t: "Sintra day trip", p: "Palaces, forest trails, travesseiros.", i: "https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=800&q=80" },
        { d: 3, t: "Évora, slow morning", p: "Roman temple, cheese, a quiet plaza.", i: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" },
        { d: 4, t: "Comporta beach", p: "Pinewoods, rice paddies, seafood shack.", i: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80" },
        { d: 5, t: "Algarve, cliffside", p: "Kayak the sea caves, lunch on the cliffs.", i: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
        { d: 6, t: "Douro Valley", p: "Wine train, port tasting, terrace dinner.", i: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=800&q=80" },
        { d: 7, t: "Porto, two nights", p: "Tile walks, francesinha, jazz bar.", i: "https://images.unsplash.com/photo-1580323956656-26bbb7e1a928?auto=format&fit=crop&w=800&q=80" },
        { d: 8, t: "Gerês National Park", p: "Granite trails, waterfalls, stone villages.", i: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" }
    ];

    const testimonials = [
        { q: "The most effortless two weeks we've ever had abroad. Every detail, quietly perfect.", n: "Isabella & Mark R.", l: "London · Portugal trip", i: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
        { q: "I've used three other travel designers. Wanderly is the first that truly listens.", n: "Rohan V.", l: "Mumbai · Japan trip", i: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
        { q: "Our editor somehow knew we wanted a slow morning before we did. Magic.", n: "The Chen family", l: "Singapore · Italy trip", i: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
        { q: "We've already booked our next three trips through them.", n: "Camille D.", l: "Paris · Patagonia trip", i: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80" },
        { q: "A level of care I didn't know still existed in travel.", n: "James O.", l: "New York · Iceland trip", i: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" }
    ];

    const sandboxDB = {
        Kyoto: {
            url: "wanderly.app/drafts/kyoto",
            price: "$5,240",
            img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
            title: "Day 3 · Arashiyama, 06:40",
            sub: "Private bamboo grove walk before public crowd arrival.",
            Quiet: {
                Cultural: [{ d: "01", t: "Arrive Kansai · Gion Zen", p: "Check-in Hyatt · Quiet garden tea service", c: "$840" }, { d: "02", t: "Sumi-e Wash Painting Masterclass", p: "Private atelier study under an elder artist", c: "$310" }, { d: "03", t: "Koyasan Mount Retreat", p: "Temple overnight lodging & Shinto chanting", c: "$560" }],
                Culinary: [{ d: "01", t: "Kyoto Arrival & Kaiseki Intro", p: "Sip ancient matcha · Traditional multi-course diner", c: "$950" }, { d: "02", t: "Organic Sake Brewery Private Tour", p: "Deep tasting of legacy brews inside historic Fushimi cellar", c: "$420" }, { d: "03", t: "Zen Tofu Culinary Class", p: "Learn slow kitchen techniques with a master monk chef", c: "$390" }],
                Adventure: [{ d: "01", t: "Rural Kyoto Arrival", p: "Traditional Ryokan check-in overlooking Arashiyama gorge", c: "$890" }, { d: "02", t: "Hozugawa River Cruise (Quiet Slot)", p: "Sunrise rowboat descent through ancient forested canyons", c: "$310" }, { d: "03", t: "Kyoto Trail Sacred Forest Hike", p: "Solitary morning hike across hidden moss cedar lines", c: "$240" }]
            },
            Active: {
                Cultural: [{ d: "01", t: "Active Kyoto Discovery", p: "Cycle back-alleys of Higashiyama historic district", c: "$450" }, { d: "02", t: "Fushimi Inari Full Summit Hike", p: "Trek the entire 10,000 mountain gate trail at midnight", c: "$290" }, { d: "03", t: "Samurai Swordplay Foundations", p: "Historic training inside a 200-year-old dojo", c: "$380" }],
                Culinary: [{ d: "01", t: "Nishiki Market Street Raid", p: "Sample wild local sea items with an editor", c: "$210" }, { d: "02", t: "Gion Night Tavern Crawl", p: "Sip premium draft sake inside three secret micro-pubs", c: "$380" }, { d: "03", t: "Uji Tea Estate Cycle Harvest", p: "Cycle and pick premium tea leaves beside legacy farmers", c: "$450" }],
                Adventure: [{ d: "01", t: "Takao Mountain Trail Run", p: "Fast-pace forest run connecting remote peak shrines", c: "$290" }, { d: "02", t: "Biwa Lake Windsurfing Ascent", p: "Active morning riding clear mountain waters", c: "$390" }, { d: "03", t: "Arashiyama Bamboo Off-Grid Expedition", p: "Mountain bike through deep, deep vertical groves", c: "$320" }]
            }
        },
        Patagonia: {
            url: "wanderly.app/drafts/patagonia",
            price: "$8,120",
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
            title: "Day 5 · French Valley, 09:30",
            sub: "Hike under sheer granite towers alongside our senior guide.",
            Quiet: {
                Cultural: [{ d: "01", t: "Estancia Ranch Homestead Check-in", p: "Stately fireside reading · Traditional mate tea pairing", c: "$950" }, { d: "02", t: "Sheep Shearing & Woolcraft Study", p: "Spend the morning with third-generation gauchos", c: "$410" }, { d: "03", t: "Patagonian Skies Astronomy", p: "Telescope session overlooking vast plains with zero light", c: "$350" }],
                Culinary: [{ d: "01", t: "Asado Fire Kitchen Gathering", p: "Slow roasted lamb paired with heavy Malbec wines", c: "$1,100" }, { d: "02", t: "Wild Berries & Herbs Gathering", p: "Walk alongside an award-winning chef picking mountain flora", c: "$380" }, { d: "03", t: "Remote Lakeside Sourdough Class", p: "Bake fresh bread over wood fire embers in a hidden cabin", c: "$410" }],
                Adventure: [{ d: "01", t: "Lakeside Eco-Dome Arrival", p: "Listen to ice calves fall off glaciers from bed", c: "$1,200" }, { d: "02", t: "Puma Photographic Safari", p: "Track elusive big cats with safe professional scopes", c: "$620" }, { d: "03", t: "Grey Glacier Kayaking", p: "Quiet float alongside sapphire blue giant ice bergs", c: "$480" }]
            },
            Active: {
                Cultural: [{ d: "01", t: "Gaucho Horseback Ride Out", p: "Gallop along deep untamed rivers with active cattle-hands", c: "$550" }, { d: "02", t: "Tehuelche Ancient Cave Art Trek", p: "Ascend high rocky cliffs to see 4,000-year-old drawings", c: "$420" }, { d: "03", t: "Estancia Legacy Horse Drive", p: "Assist standard gauchos moving herd animals across plains", c: "$610" }],
                Culinary: [{ d: "01", t: "Chaltén Microbrew Tour Hike", p: "Hike a mountain trail ending directly at a legacy brewery", c: "$290" }, { d: "02", t: "Glacier Ice Whiskey Trek", p: "Trek high onto blue ice to chip natural ice into old malts", c: "$480" }, { d: "03", t: "Patagonian Estuary Crab Sourcing", p: "Pull natural giant crabs from cold ocean water in a zodiac", c: "$650" }],
                Adventure: [{ d: "01", t: "Fitz Roy Full Ascent Trek", p: "Fast-pace high-elevation hike to iconic mountain base", c: "$680" }, { d: "02", t: "Perito Moreno Deep Ice Walk", p: "Fit crampons to hike directly into active crevasse systems", c: "$790" }, { d: "03", t: "Paine Massif Mountain Biking", p: "Technical downhill run along glacier moraine gravels", c: "$410" }]
            }
        },
        Amalfi: {
            url: "wanderly.app/drafts/amalfi",
            price: "$6,850",
            img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
            title: "Day 4 · Ravello Cliffside, 10:30",
            sub: "Stroll legacy garden walks overlooking clear blue water.",
            Quiet: {
                Cultural: [{ d: "01", t: "Check-in Legacy Monastery", p: "Unpack in a converted 12th-century cliffside sanctuary", c: "$1,100" }, { d: "02", t: "Villa Cimbrone Quiet Gardens", p: "Sip espresso with exclusive early morning garden access", c: "$280" }, { d: "03", t: "Handmade Amalfi Paper Workshop", p: "Stir natural cotton pulps inside a 13th-century mill", c: "$310" }],
                Culinary: [{ d: "01", t: "Sfusato Lemon Orchard Walk", p: "Linger under heavy lemon vines with a legacy orchard family", c: "$340" }, { d: "02", t: "Ravello Private Olive Oil Press", p: "Drizzle fresh extra virgin oil over direct woodfire crusts", c: "$410" }, { d: "03", t: "Hidden Cove Seafood Table", p: "Eat catch-of-the-day fish accessible only by private boat", c: "$790" }],
                Adventure: [{ d: "01", t: "Cliffside Sanctuary Walk", p: "Arrive at a quiet resort hanging directly over open sea", c: "$1,250" }, { d: "02", t: "Capri Sunrise Wooden Boat Loop", p: "Charter a legacy wooden gozzo around silent sea caves", c: "$890" }, { d: "03", t: "Quiet Ravello High Forest Walk", p: "Escape coast noise hiking under giant canopy stone pines", c: "$210" }]
            },
            Active: {
                Cultural: [{ d: "01", t: "Amalfi Town Architectural Run", p: "Explore vertical alleyways and Roman vaults with an architect", c: "$320" }, { d: "02", t: "Path of the Gods Trek", p: "Hike the legendary high route from Bomerano to Positano", c: "$450" }, { d: "03", t: "Ancient Ruins Pompeii Private Tour", p: "Trek the stone roads of Pompeii with an archaeologist", c: "$560" }],
                Culinary: [{ d: "01", t: "Positano Clifftop Kitchen Class", p: "Active pasta making session pairing local herbs and clams", c: "$420" }, { d: "02", t: "Deep Wine Hike Tramonti", p: "Trek through wild vineyards sampling pre-phylloxera red wines", c: "$490" }, { d: "03", t: "Capri Lobster Night Sourcing", p: "Join local sea captains throwing night nets under starlight", c: "$810" }],
                Adventure: [{ d: "01", t: "Fiordo di Furore Sea Kayak", p: "Hard paddle inside Positano's hidden deep water fjord", c: "$310" }, { d: "02", t: "Amalfi High Vertical Hike", p: "Ascend high rocky steps connecting Positano to upper towns", c: "$290" }, { d: "03", t: "Deep Sea Amalfi Swimming Trail", p: "Open-water coastal swim with professional safety boats", c: "$450" }]
            }
        }
    };

    const perksDB = {
        Aman: {
            headline: "Aman Resorts Preferred Guest Plus Benefits",
            sub: "Secure these exceptional perks through Wanderly across all 14 global Aman sanctuaries.",
            list: [
                "Complimentary space-available room upgrade at check-in (valued at $350+/night)",
                "Daily customized breakfast for two at any property restaurant",
                "A $100 equivalent hotel spa experience credit per stay",
                "Personalized greeting amenities from the General Manager upon arrival",
                "Guaranteed 4PM late checkout options for longer rest"
            ],
            quote: "Aman is not simply a lodging; it is a profound philosophy of peace. Our partnership guarantees immediate alignment with resort managers prior to arrival.",
            author: "Amara Okafor, Africa & Middle East Editor"
        },
        Belmond: {
            headline: "Belmond Bellini Exclusive Benefits",
            sub: "Load premium amenities into iconic heritage venues, trains, and river yachts.",
            list: [
                "Upgraded room status on arrival across all hotels and historic lodges",
                "A $500 equivalent booking credit per suite or $200 per standard double room",
                "Premium daily buffet breakfasts for two guests",
                "Unique local gift curated from region artisans on arrival",
                "Free premium high-speed internet connections throughout stay"
            ],
            quote: "Belmond properties protect the soul of historic travel. From Venice to Machu Picchu, our clients receive highest-tier VIP designation on arrival.",
            author: "Elena Marín, Europe Editor"
        },
        SixSenses: {
            headline: "Six Senses Preferred Wellness Benefits",
            sub: "Secure exceptional wellness additions and earth-first upgrades globally.",
            list: [
                "Room upgrade subject to availability at check-in",
                "Complimentary 50-minute body treatment massage for two guests",
                "Daily natural-harvest breakfast for two",
                "Early check-in and late checkout options subject to availability",
                "Exclusive access to regional sustainable workshop masterclasses"
            ],
            quote: "Six Senses balances luxury with radical, non-compromising ecological care. Our travelers receive custom wellness consultations prior to spa entry.",
            author: "Hiroshi Tanaka, Asia Editor"
        }
    };

    const editorsDB = [
        { name: "Elena Marín", region: "Europe", location: "Madrid", exp: "18 years · 62 countries", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80", tip: "Skip Positano in August. Travel Alentejo in Portugal instead. The light is softer, and the crowds are virtually nonexistent." },
        { name: "Hiroshi Tanaka", region: "Asia", location: "Kyoto", exp: "22 years · 48 countries", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", tip: "The most beautiful temple view in Kyoto is Shoren-in temple garden at dusk. Sit on the veranda; it is totally quiet." },
        { name: "Amara Okafor", region: "Africa", location: "Lagos", exp: "14 years · 39 countries", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80", tip: "When in Marrakech, venture 40 minutes south to the Agafay stone desert. Eat dinner in an open Berber tent under clear stars." },
        { name: "Sam Whitfield", region: "Americas", location: "NYC", exp: "11 years · 54 countries", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80", tip: "In Patagonia, avoid massive coach tours to Perito Moreno. Go sea-kayaking instead. Getting near ice calves in silence is magic." }
    ];

    /**
     * Promisified Mock API Database layer
     */
    const Database = {
        _delay: (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms)),
        async getStyleData(key) {
            await this._delay();
            return styleData[key] || [];
        },
        async getTimelineDays() {
            await this._delay();
            return days;
        },
        async getTestimonials() {
            await this._delay();
            return testimonials;
        },
        async getSandboxData(dest) {
            await this._delay();
            return sandboxDB[dest] || null;
        },
        async getPerksData(key) {
            await this._delay();
            return perksDB[key] || null;
        },
        async getEditors(regionFilter) {
            await this._delay();
            return regionFilter === "All" ? editorsDB : editorsDB.filter((ed) => ed.region === regionFilter);
        }
    };

    window.Wanderly.styleData = styleData;
    window.Wanderly.days = days;
    window.Wanderly.testimonials = testimonials;
    window.Wanderly.sandboxDB = sandboxDB;
    window.Wanderly.perksDB = perksDB;
    window.Wanderly.editorsDB = editorsDB;
    window.Wanderly.Database = Database;
})();