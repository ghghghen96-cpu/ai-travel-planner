import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    ChevronLeft, Calendar, Send, MapPin, Star, Plus, Trash2, Edit2, List,
    Clock, MessageCircle, Sparkles, X, Plane, BedDouble, PlusCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';

// ─── ADVERTISEMENT PLACEHOLDER ────────────────────────────────────────────────
const AdPlaceholder = ({ className = '', style = {} }) => (
    <div className={`bg-gray-100 border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 font-bold overflow-hidden relative ${className}`} style={style}>
        <span className="text-[10px] uppercase tracking-widest absolute top-2 right-3 text-gray-400">Advertisement</span>
        <div className="flex flex-col items-center gap-2 mt-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

// ─── IMAGE LIBRARY ───────────────────────────────────────────────────────────
const IMAGE_LIBRARY = {
    food: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800", "https://images.unsplash.com/photo-1626804475297-411db142642a?q=80&w=800"],
    nature: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800", "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800"],
    city: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800", "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800"],
    culture: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800", "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800"],
    relax: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"],
    market: ["https://images.unsplash.com/photo-1533920143825-963ad2b4122d?q=80&w=800"],
    tower: ["https://images.unsplash.com/photo-1572589028889-d584346e339b?q=80&w=800"],
    park: ["https://images.unsplash.com/photo-1513889961551-628c115e2eb3?q=80&w=800"],
    default: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800",
};

const getImg = (name = '', type = '') => {
    const n = name.toLowerCase();
    if (n.includes('market')) return IMAGE_LIBRARY.market[0];
    if (n.includes('tower') || n.includes('tree')) return IMAGE_LIBRARY.tower[0];
    if (n.includes('park') || n.includes('garden')) return IMAGE_LIBRARY.park[0];
    const arr = IMAGE_LIBRARY[type.toLowerCase()];
    if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
    return IMAGE_LIBRARY.default;
};

// ─── DESTINATION DATA ─────────────────────────────────────────────────────────
const DESTINATION_DATA = {
    'south korea': {
        activities: [
            { name: "N Seoul Tower", type: "Nature", rating: 4.8, desc: "Panoramic views of Seoul from Namsan Mountain.", latitude: 37.5511, longitude: 126.9882 },
            { name: "Gwangjang Market", type: "Food", rating: 4.7, desc: "Historic market famous for mung bean pancakes.", latitude: 37.5701, longitude: 126.9997 },
            { name: "Bukchon Hanok Village", type: "Culture", rating: 4.9, desc: "Traditional Korean village with preserved architecture.", latitude: 37.5826, longitude: 126.9831 },
            { name: "Hongdae Street", type: "City", rating: 4.6, desc: "Vibrant youth district known for fashion and busking.", latitude: 37.5568, longitude: 126.9237 },
            { name: "Gyeongbokgung Palace", type: "Culture", rating: 4.9, desc: "The main royal palace of the Joseon dynasty.", latitude: 37.5796, longitude: 126.9770 },
            { name: "Lotte World", type: "City", rating: 4.8, desc: "Major recreation complex and indoor theme park.", latitude: 37.5111, longitude: 127.0981 },
            { name: "Cheonggyecheon Stream", type: "Relax", rating: 4.7, desc: "Restored urban stream perfect for evening strolls.", latitude: 37.5692, longitude: 126.9778 },
            { name: "Dongdaemun Design Plaza", type: "City", rating: 4.6, desc: "Futuristic architecture hub for art and design.", latitude: 37.5665, longitude: 127.0092 },
            { name: "Insadong Antique Street", type: "Culture", rating: 4.5, desc: "Cultural street with traditional tea houses and crafts.", latitude: 37.5743, longitude: 126.9849 },
            { name: "Hangang Park", type: "Relax", rating: 4.8, desc: "Popular river park for picnics and cycling.", latitude: 37.5283, longitude: 126.9344 },
            { name: "War Memorial of Korea", type: "Culture", rating: 4.9, desc: "Museum exhibiting the military history of Korea.", latitude: 37.5366, longitude: 126.9771 },
            { name: "Seokchon Lake Park", type: "Nature", rating: 4.8, desc: "Scenic lake, beautiful during cherry blossom season.", latitude: 37.5097, longitude: 127.1035 },
            { name: "Itaewon", type: "Food", rating: 4.6, desc: "Multicultural district with diverse culinary options.", latitude: 37.5348, longitude: 126.9937 },
            { name: "Starfield COEX Library", type: "City", rating: 4.7, desc: "Stunning open-space library inside COEX Mall.", latitude: 37.5113, longitude: 127.0595 },
            { name: "Myeongdong Cathedral", type: "Culture", rating: 4.7, desc: "Neo-Gothic cathedral in the shopping district.", latitude: 37.5630, longitude: 126.9874 },
        ]
    },
    'japan (tokyo)': {
        activities: [
            { name: "Shibuya Crossing", type: "City", rating: 4.8, desc: "The world's busiest pedestrian scramble crossing.", latitude: 35.6594, longitude: 139.7005 },
            { name: "Senso-ji Temple", type: "Culture", rating: 4.9, desc: "Tokyo's oldest temple, located in Asakusa.", latitude: 35.7147, longitude: 139.7966 },
            { name: "Tokyo Skytree", type: "City", rating: 4.7, desc: "The tallest structure in Japan at 634m.", latitude: 35.7100, longitude: 139.8107 },
            { name: "Meiji Jingu Shrine", type: "Nature", rating: 4.8, desc: "Shinto shrine dedicated to Emperor Meiji.", latitude: 35.6763, longitude: 139.6993 },
            { name: "Tsukiji Outer Market", type: "Food", rating: 4.6, desc: "World-famous market for sushi and fresh seafood.", latitude: 35.6654, longitude: 139.7706 },
            { name: "Akihabara", type: "City", rating: 4.5, desc: "Electric Town — center of anime, manga and electronics.", latitude: 35.6983, longitude: 139.7730 },
            { name: "TeamLab Planets", type: "Culture", rating: 4.9, desc: "Immersive digital art museum in Toyosu.", latitude: 35.6459, longitude: 139.7925 },
            { name: "Shinjuku Gyoen", type: "Nature", rating: 4.8, desc: "Large park mixing Japanese, English, and French styles.", latitude: 35.6851, longitude: 139.7100 },
            { name: "Tokyo Disneyland", type: "City", rating: 4.9, desc: "A kingdom of dreams and magic.", latitude: 35.6328, longitude: 139.8803 },
            { name: "Ueno Park & Museums", type: "Culture", rating: 4.5, desc: "Public park famous for museums and cherry blossoms.", latitude: 35.7140, longitude: 139.7740 },
            { name: "Harajuku Takeshita St.", type: "City", rating: 4.4, desc: "Trendy street packed with fashion shops and crepes.", latitude: 35.6715, longitude: 139.7029 },
            { name: "Roppongi Hills", type: "City", rating: 4.7, desc: "Modern complex with shops, restaurants and art museum.", latitude: 35.6604, longitude: 139.7292 },
        ]
    },
    'japan (hokkaido)': {
        activities: [
            { name: "Sapporo Odori Park", type: "Nature", rating: 4.7, desc: "Central park, site of the famed Snow Festival.", latitude: 43.0597, longitude: 141.3468 },
            { name: "Otaru Canal", type: "Culture", rating: 4.8, desc: "Historic canal with Victorian-style street lamps.", latitude: 43.1994, longitude: 141.0028 },
            { name: "Nijo Market", type: "Food", rating: 4.6, desc: "Public market in Sapporo featuring fresh seafood.", latitude: 43.0583, longitude: 141.3582 },
            { name: "Farm Tomita", type: "Nature", rating: 4.8, desc: "Famous for its vast lavender fields in Furano.", latitude: 43.4184, longitude: 142.4278 },
            { name: "Blue Pond (Biei)", type: "Nature", rating: 4.8, desc: "Artificial pond with a stunning bright blue hue.", latitude: 43.4934, longitude: 142.6146 },
            { name: "Asahiyama Zoo", type: "Nature", rating: 4.9, desc: "Popular zoo with interactive animal viewing.", latitude: 43.7686, longitude: 142.4795 },
            { name: "Jigokudani Valley", type: "Nature", rating: 4.7, desc: "Spectacular valley above Noboribetsu Onsen.", latitude: 42.4969, longitude: 141.1448 },
            { name: "Sapporo Beer Museum", type: "Culture", rating: 4.7, desc: "Japan's only beer museum in a historic brick building.", latitude: 43.0722, longitude: 141.3695 },
            { name: "Hakodate Night View", type: "Nature", rating: 4.9, desc: "One of Japan's top three night views.", latitude: 41.7607, longitude: 140.7068 },
        ]
    },
    'usa': {
        activities: [
            { name: "Times Square", type: "City", rating: 4.8, desc: "Iconic commercial intersection in Midtown Manhattan.", latitude: 40.7580, longitude: -73.9855 },
            { name: "Central Park", type: "Nature", rating: 4.9, desc: "Iconic urban park in the heart of Manhattan.", latitude: 40.7851, longitude: -73.9683 },
            { name: "Metropolitan Museum of Art", type: "Culture", rating: 4.9, desc: "One of the world's largest and finest art museums.", latitude: 40.7794, longitude: -73.9632 },
            { name: "Brooklyn Bridge", type: "City", rating: 4.8, desc: "Historic suspension bridge connecting Manhattan and Brooklyn.", latitude: 40.7061, longitude: -73.9969 },
            { name: "Empire State Building", type: "City", rating: 4.8, desc: "Art Deco skyscraper with sweeping views of NYC.", latitude: 40.7484, longitude: -73.9857 },
            { name: "Statue of Liberty", type: "Culture", rating: 4.9, desc: "Neoclassical sculpture on Liberty Island in New York Harbor.", latitude: 40.6892, longitude: -74.0445 },
            { name: "High Line", type: "Relax", rating: 4.7, desc: "Elevated linear park built on a disused freight rail line.", latitude: 40.7480, longitude: -74.0048 },
            { name: "9/11 Memorial & Museum", type: "Culture", rating: 4.9, desc: "Tribute to the 9/11 victims in Lower Manhattan.", latitude: 40.7115, longitude: -74.0134 },
            { name: "MoMA (Museum of Modern Art)", type: "Culture", rating: 4.8, desc: "World-renowned collection of modern and contemporary art.", latitude: 40.7614, longitude: -73.9776 },
            { name: "Chelsea Market", type: "Food", rating: 4.7, desc: "Upscale food hall in a converted biscuit factory.", latitude: 40.7424, longitude: -74.0056 },
            { name: "One World Observatory", type: "City", rating: 4.8, desc: "Observation deck at the tallest building in the Western Hemisphere.", latitude: 40.7127, longitude: -74.0134 },
            { name: "Brooklyn DUMBO", type: "City", rating: 4.7, desc: "Trendy neighborhood with stunning Manhattan skyline views.", latitude: 40.7033, longitude: -73.9888 },
            { name: "Flushing Meadows Park", type: "Nature", rating: 4.6, desc: "Expansive park in Queens, site of the 1964 World's Fair.", latitude: 40.7298, longitude: -73.8420 },
            { name: "The Vessel", type: "City", rating: 4.5, desc: "Interactive public art installation at Hudson Yards.", latitude: 40.7539, longitude: -74.0027 },
            { name: "Katz's Delicatessen", type: "Food", rating: 4.8, desc: "Legendary deli famous for its pastrami sandwiches.", latitude: 40.7223, longitude: -73.9873 },
        ]
    },
    'france (paris)': {
        activities: [
            { name: "Eiffel Tower", type: "City", rating: 4.9, desc: "Iconic iron lattice tower on the Champ de Mars.", latitude: 48.8584, longitude: 2.2945 },
            { name: "Louvre Museum", type: "Culture", rating: 4.9, desc: "World's largest art museum with over 35,000 artworks.", latitude: 48.8606, longitude: 2.3376 },
            { name: "Montmartre District", type: "Culture", rating: 4.7, desc: "Bohemian hilltop with Sacré-Cœur Basilica.", latitude: 48.8867, longitude: 2.3431 },
            { name: "Palace of Versailles", type: "Culture", rating: 4.9, desc: "Opulent royal palace with stunning gardens.", latitude: 48.8048, longitude: 2.1203 },
            { name: "Seine River Cruise", type: "Relax", rating: 4.8, desc: "Scenic cruise past Paris's iconic monuments.", latitude: 48.8602, longitude: 2.3477 },
            { name: "Champs-Élysées", type: "City", rating: 4.6, desc: "World-famous avenue lined with shops and cafes.", latitude: 48.8698, longitude: 2.3078 },
            { name: "Musée d'Orsay", type: "Culture", rating: 4.9, desc: "Impressionist art museum in a converted railway station.", latitude: 48.8599, longitude: 2.3266 },
            { name: "Le Marais District", type: "City", rating: 4.7, desc: "Trendy neighbourhood with galleries and falafel shops.", latitude: 48.8566, longitude: 2.3546 },
        ]
    },
    'switzerland': {
        activities: [
            { name: "Jungfraujoch", type: "Nature", rating: 5.0, desc: "Top of Europe — spectacular glacier and alpine views.", latitude: 46.5475, longitude: 7.9854 },
            { name: "Chapel Bridge (Lucerne)", type: "Culture", rating: 4.8, desc: "Oldest wooden covered bridge in Europe.", latitude: 47.0517, longitude: 8.3075 },
            { name: "Matterhorn (Zermatt)", type: "Nature", rating: 4.9, desc: "Iconic pyramid-shaped peak of the Alps.", latitude: 45.9766, longitude: 7.6586 },
            { name: "Lake Geneva", type: "Relax", rating: 4.7, desc: "Vast lake perfect for scenic cruises.", latitude: 46.4524, longitude: 6.6658 },
            { name: "Chillon Castle", type: "Culture", rating: 4.8, desc: "Medieval island castle on Lake Geneva.", latitude: 46.4142, longitude: 6.9275 },
            { name: "Bern Old City", type: "Culture", rating: 4.7, desc: "UNESCO World Heritage medieval old town.", latitude: 46.9479, longitude: 7.4446 },
            { name: "Interlaken", type: "Relax", rating: 4.9, desc: "Adventure sports capital between two lakes.", latitude: 46.6863, longitude: 7.8632 },
            { name: "Rhine Falls", type: "Nature", rating: 4.7, desc: "The largest plain waterfall in Europe.", latitude: 47.6780, longitude: 8.6148 },
            { name: "Zurich Old Town", type: "City", rating: 4.6, desc: "Historic center with guild houses and churches.", latitude: 47.3717, longitude: 8.5422 },
            { name: "Grindelwald First", type: "Nature", rating: 4.8, desc: "Cliff walk and mountain hiking with alpine panoramas.", latitude: 46.6572, longitude: 8.0519 },
        ]
    },
    'spain (barcelona)': {
        activities: [
            { name: "Sagrada Família", type: "Culture", rating: 4.9, desc: "Gaudí's breathtaking unfinished basilica.", latitude: 41.4036, longitude: 2.1744 },
            { name: "Park Güell", type: "Nature", rating: 4.8, desc: "Colorful mosaic park with city views by Gaudí.", latitude: 41.4145, longitude: 2.1527 },
            { name: "La Rambla", type: "City", rating: 4.6, desc: "Famous tree-lined pedestrian street in city center.", latitude: 41.3818, longitude: 2.1736 },
            { name: "Casa Batlló", type: "Culture", rating: 4.9, desc: "Modernist masterpiece by Antoni Gaudí.", latitude: 41.3917, longitude: 2.1649 },
            { name: "Gothic Quarter", type: "Culture", rating: 4.7, desc: "Historic neighborhood with medieval architecture.", latitude: 41.3834, longitude: 2.1766 },
            { name: "Barcelona Beach", type: "Relax", rating: 4.6, desc: "Sandy urban beach perfect for sunbathing.", latitude: 41.3809, longitude: 2.1916 },
            { name: "Mercat de la Boqueria", type: "Food", rating: 4.7, desc: "Vibrant public market off La Rambla.", latitude: 41.3818, longitude: 2.1716 },
            { name: "Tibidabo Amusement Park", type: "City", rating: 4.4, desc: "Hilltop park with panoramic views of Barcelona.", latitude: 41.4217, longitude: 2.1187 },
        ]
    },
    'italy (rome)': {
        activities: [
            { name: "Colosseum", type: "Culture", rating: 4.9, desc: "Iconic oval amphitheatre of ancient Rome.", latitude: 41.8902, longitude: 12.4922 },
            { name: "Vatican Museums", type: "Culture", rating: 4.9, desc: "Sistine Chapel and world-class papal art collection.", latitude: 41.9065, longitude: 12.4536 },
            { name: "Trevi Fountain", type: "City", rating: 4.8, desc: "Baroque masterpiece — toss a coin for good luck!", latitude: 41.9009, longitude: 12.4833 },
            { name: "Roman Forum", type: "Culture", rating: 4.8, desc: "Ruins of ancient Rome's civic heart.", latitude: 41.8925, longitude: 12.4853 },
            { name: "Pantheon", type: "Culture", rating: 4.9, desc: "Best-preserved ancient Roman temple.", latitude: 41.8986, longitude: 12.4769 },
            { name: "Borghese Gallery", type: "Culture", rating: 4.8, desc: "Baroque sculpture masterpieces in a villa setting.", latitude: 41.9143, longitude: 12.4923 },
            { name: "Piazza Navona", type: "City", rating: 4.7, desc: "Baroque square with fountains and street artists.", latitude: 41.8990, longitude: 12.4730 },
            { name: "Trastevere District", type: "Food", rating: 4.7, desc: "Charming cobblestone neighbourhood with great restaurants.", latitude: 41.8896, longitude: 12.4698 },
        ]
    },
    'uk (london)': {
        activities: [
            { name: "Big Ben & Westminster", type: "Culture", rating: 4.9, desc: "Iconic clock tower and seat of the UK Parliament.", latitude: 51.5007, longitude: -0.1246 },
            { name: "The British Museum", type: "Culture", rating: 4.9, desc: "World's greatest collections of art and antiquities.", latitude: 51.5194, longitude: -0.1270 },
            { name: "Tower of London", type: "Culture", rating: 4.8, desc: "Historic royal palace and fortress on the Thames.", latitude: 51.5081, longitude: -0.0759 },
            { name: "Buckingham Palace", type: "Culture", rating: 4.8, desc: "Official residence of the UK's monarch.", latitude: 51.5014, longitude: -0.1419 },
            { name: "Hyde Park", type: "Relax", rating: 4.7, desc: "Vast Royal Park in the heart of London.", latitude: 51.5073, longitude: -0.1657 },
            { name: "Borough Market", type: "Food", rating: 4.8, desc: "London's oldest and most renowned food market.", latitude: 51.5055, longitude: -0.0909 },
            { name: "Tate Modern", type: "Culture", rating: 4.8, desc: "World-class modern art gallery in a converted power station.", latitude: 51.5076, longitude: -0.0994 },
            { name: "Camden Market", type: "City", rating: 4.7, desc: "Eclectic market and nightlife hub in North London.", latitude: 51.5415, longitude: -0.1477 },
            { name: "Covent Garden", type: "City", rating: 4.7, desc: "Lively piazza with street performers and boutiques.", latitude: 51.5117, longitude: -0.1240 },
        ]
    },
    'thailand (bangkok)': {
        activities: [
            { name: "Grand Palace", type: "Culture", rating: 4.9, desc: "Ornate royal complex and home of Emerald Buddha.", latitude: 13.7500, longitude: 100.4913 },
            { name: "Wat Pho", type: "Culture", rating: 4.8, desc: "Temple of the Reclining Buddha, largest in Bangkok.", latitude: 13.7465, longitude: 100.4930 },
            { name: "Chatuchak Market", type: "Food", rating: 4.7, desc: "One of the world's largest weekend markets.", latitude: 13.7997, longitude: 100.5500 },
            { name: "Asiatique The Riverfront", type: "City", rating: 4.6, desc: "Open-air lifestyle mall on the Chao Phraya River.", latitude: 13.7181, longitude: 100.5127 },
            { name: "Khao San Road", type: "City", rating: 4.4, desc: "Famous backpacker hub with hotels, bars and clubs.", latitude: 13.7589, longitude: 100.4974 },
            { name: "Lumpini Park", type: "Relax", rating: 4.7, desc: "Green oasis in the heart of Bangkok.", latitude: 13.7310, longitude: 100.5418 },
            { name: "Sky Bar at Lebua", type: "City", rating: 4.8, desc: "Rooftop bar high above Bangkok's skyline.", latitude: 13.7212, longitude: 100.5143 },
            { name: "Jim Thompson House", type: "Culture", rating: 4.7, desc: "Museum showcasing traditional Thai silk arts.", latitude: 13.7479, longitude: 100.5272 },
        ]
    },
    'indonesia (bali)': {
        activities: [
            { name: "Tanah Lot Temple", type: "Culture", rating: 4.8, desc: "Sea temple on a rock formation at sunset.", latitude: -8.6215, longitude: 115.0866 },
            { name: "Ubud Monkey Forest", type: "Nature", rating: 4.7, desc: "Natural sanctuary home to hundreds of macaques.", latitude: -8.5187, longitude: 115.2627 },
            { name: "Tegallalang Rice Terraces", type: "Nature", rating: 4.8, desc: "Stunning stepped rice paddies north of Ubud.", latitude: -8.4338, longitude: 115.2789 },
            { name: "Seminyak Beach", type: "Relax", rating: 4.7, desc: "Upscale beach with beach clubs and resorts.", latitude: -8.6909, longitude: 115.1561 },
            { name: "Uluwatu Temple", type: "Culture", rating: 4.9, desc: "Cliff-top temple with Kecak fire dance shows.", latitude: -8.8291, longitude: 115.0849 },
            { name: "Bali Safari Park", type: "Nature", rating: 4.8, desc: "Home to over 100 species of exotic animals.", latitude: -8.6022, longitude: 115.3603 },
            { name: "Ubud Art Market", type: "Food", rating: 4.6, desc: "Vibrant market with Balinese art and handicrafts.", latitude: -8.5069, longitude: 115.2624 },
        ]
    },
    'singapore': {
        activities: [
            { name: "Gardens by the Bay", type: "Nature", rating: 4.9, desc: "Futuristic nature park with iconic Supertree Grove.", latitude: 1.2816, longitude: 103.8636 },
            { name: "Marina Bay Sands", type: "City", rating: 4.8, desc: "Iconic integrated resort with rooftop infinity pool.", latitude: 1.2834, longitude: 103.8607 },
            { name: "Sentosa Island", type: "Relax", rating: 4.8, desc: "Resort island with beaches, Universal Studios and more.", latitude: 1.2494, longitude: 103.8303 },
            { name: "Chinatown", type: "Culture", rating: 4.7, desc: "Historic enclave with temples, markets and hawker stalls.", latitude: 1.2830, longitude: 103.8448 },
            { name: "Little India", type: "Culture", rating: 4.7, desc: "Colorful district with spice shops and temples.", latitude: 1.3066, longitude: 103.8518 },
            { name: "Hawker Chan", type: "Food", rating: 4.8, desc: "Michelin-starred hawker centre—world's cheapest star meal.", latitude: 1.2830, longitude: 103.8414 },
            { name: "S.E.A. Aquarium", type: "City", rating: 4.7, desc: "One of the world's largest aquariums at Sentosa.", latitude: 1.2549, longitude: 103.8196 },
        ]
    },
    'australia (sydney)': {
        activities: [
            { name: "Sydney Opera House", type: "Culture", rating: 4.9, desc: "UNESCO site and symbol of Australia.", latitude: -33.8568, longitude: 151.2153 },
            { name: "Bondi Beach", type: "Relax", rating: 4.8, desc: "Australia's most famous beach.", latitude: -33.8915, longitude: 151.2767 },
            { name: "Sydney Harbour Bridge", type: "City", rating: 4.9, desc: "Iconic steel arch bridge over Sydney Harbour.", latitude: -33.8523, longitude: 151.2108 },
            { name: "Taronga Zoo", type: "Nature", rating: 4.8, desc: "World-class zoo with stunning harbour views.", latitude: -33.8432, longitude: 151.2414 },
            { name: "The Rocks", type: "Culture", rating: 4.7, desc: "Historic sandstone buildings and weekend markets.", latitude: -33.8597, longitude: 151.2090 },
            { name: "Royal Botanic Garden", type: "Nature", rating: 4.7, desc: "Lush garden adjacent to the Opera House.", latitude: -33.8642, longitude: 151.2166 },
            { name: "Darling Harbour", type: "City", rating: 4.6, desc: "Vibrant waterfront precinct with bars and museums.", latitude: -33.8740, longitude: 151.2009 },
        ]
    },
    'default': {
        activities: [
            { name: "Times Square", type: "City", rating: 4.8, desc: "Neon-lit commercial hub of Midtown Manhattan.", latitude: 40.7580, longitude: -73.9855 },
            { name: "Central Park", type: "Nature", rating: 4.9, desc: "Urban oasis in the heart of New York City.", latitude: 40.7851, longitude: -73.9683 },
            { name: "Eiffel Tower", type: "City", rating: 4.9, desc: "Iconic iron lattice tower on the Champ de Mars.", latitude: 48.8584, longitude: 2.2945 },
            { name: "Colosseum", type: "Culture", rating: 4.9, desc: "Oval amphitheatre in the centre of Rome.", latitude: 41.8902, longitude: 12.4922 },
            { name: "Grand Canyon", type: "Nature", rating: 5.0, desc: "Steep-sided canyon carved by the Colorado River.", latitude: 36.1069, longitude: -112.113 },
            { name: "Machu Picchu", type: "Culture", rating: 4.9, desc: "15th-century Inca citadel set high in the Andes.", latitude: -13.163, longitude: -72.545 },
            { name: "Santorini Oia", type: "Relax", rating: 4.9, desc: "Whitewashed houses and legendary sunsets in Greece.", latitude: 36.4618, longitude: 25.3753 },
            { name: "Great Barrier Reef", type: "Nature", rating: 4.9, desc: "World's largest coral reef system off Australia.", latitude: -18.286, longitude: 147.700 },
            { name: "Angkor Wat", type: "Culture", rating: 4.9, desc: "Largest religious monument in the world, in Cambodia.", latitude: 13.4125, longitude: 103.867 },
            { name: "Mount Fuji", type: "Nature", rating: 4.9, desc: "Japan's iconic sacred volcano and highest peak.", latitude: 35.3606, longitude: 138.7274 },
        ]
    },
};


// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const calcDist = (la1, lo1, la2, lo2) => {
    if (!la1 || !lo1 || !la2 || !lo2) return 999999;
    const R = 6371, toRad = (v) => v * Math.PI / 180;
    const dLa = toRad(la2 - la1), dLo = toRad(lo2 - lo1);
    const a = Math.sin(dLa / 2) ** 2 + Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLo / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
const ActivityCard = ({ activity, onSave, onDelete }) => {
    const [editing, setEditing] = useState(activity.isNew || false);
    const [ed, setEd] = useState(activity);
    const [timeEdit, setTimeEdit] = useState(false);
    const timeRef = useRef(null);
    const dc = useDragControls();

    const save = () => { onSave({ ...ed, img: getImg(ed.name, ed.type), isNew: false }); setEditing(false); };

    // commit inline time change → triggers auto-sort in parent
    const commitTime = (val) => {
        setTimeEdit(false);
        if (val) onSave({ ...activity, time: val });
    };

    if (editing) return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 space-y-4">
            <div className="flex gap-3 items-center">
                <input autoFocus value={ed.name} onChange={e => setEd({ ...ed, name: e.target.value })}
                    className="flex-1 font-black text-2xl border-b-2 border-gray-200 focus:outline-none px-1 py-1 text-secondary" placeholder="Place name" />
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time</span>
                    <input type="time" value={ed.time} onChange={e => setEd({ ...ed, time: e.target.value })}
                        className="font-bold text-base text-primary bg-primary/5 rounded-lg px-3 py-2 outline-none border border-primary/20 focus:ring-2 focus:ring-primary/30" />
                </div>
            </div>
            <textarea value={ed.desc} onChange={e => setEd({ ...ed, desc: e.target.value })} rows={2}
                className="w-full text-sm text-gray-600 border border-gray-200 rounded-xl p-3 focus:outline-none bg-gray-50 resize-none" />
            <div className="flex gap-2 justify-end">
                <button onClick={() => setEditing(false)} className="px-5 py-2 text-gray-500 font-bold text-sm">Cancel</button>
                <button onClick={save} className="px-6 py-2 bg-primary text-secondary rounded-xl font-bold text-sm">Save</button>
            </div>
        </div>
    );

    return (
        <Reorder.Item value={activity} id={activity.id} dragListener={false} dragControls={dc} className="group">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex gap-5 items-center">
                {/* drag handle */}
                <div onPointerDown={e => dc.start(e)} className="cursor-move p-2 hover:bg-gray-50 rounded-lg text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                    <List size={20} />
                </div>

                {/* image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                    <img src={activity.img || getImg(activity.name, activity.type)} alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-black flex items-center gap-0.5 shadow-sm">
                        <Star size={8} className="text-yellow-500 fill-yellow-500" /> {activity.rating}
                    </div>
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-secondary text-xl truncate group-hover:text-primary transition-colors">{activity.name}</h3>

                    {/* ── INLINE TIME ── */}
                    <div className="mt-1">
                        {timeEdit ? (
                            <input
                                ref={timeRef}
                                type="time"
                                defaultValue={activity.time}
                                autoFocus
                                onBlur={e => commitTime(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') commitTime(e.target.value);
                                    if (e.key === 'Escape') setTimeEdit(false);
                                }}
                                className="text-sm font-bold text-primary bg-primary/5 border border-primary/30 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        ) : (
                            <button
                                onClick={() => setTimeEdit(true)}
                                title="Click to change time"
                                className="inline-flex items-center gap-1.5 text-primary font-bold text-xs px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                            >
                                <Clock size={12} />
                                {fmtTime(activity.time) || 'Set time'}
                                <span className="text-[9px] text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5">✎</span>
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 truncate mt-1">{activity.desc}</p>
                </div>

                {/* action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => setEditing(true)} className="p-2.5 text-blue-400 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={18} /></button>
                    <button onClick={onDelete} className="p-2.5 text-red-400  hover:bg-red-50  rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
            </div>
        </Reorder.Item>
    );
};

// ─── AI CHAT MODAL ────────────────────────────────────────────────────────────
const AIChatModal = ({ isOpen, onClose, destination }) => {
    const [msgs, setMsgs] = useState([{ role: 'assistant', text: `Hi! I'm your travel guide for ${destination}. Any questions?` }]);
    const [inp, setInp] = useState('');
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, isOpen]);

    const send = () => {
        if (!inp.trim()) return;
        const next = [...msgs, { role: 'user', text: inp }];
        setMsgs(next); setInp('');
        setTimeout(() => {
            const r = inp.toLowerCase().includes('food')
                ? 'Check out the local markets in your itinerary!'
                : "Great question! I'll look into that for you.";
            setMsgs([...next, { role: 'assistant', text: r }]);
        }, 800);
    };

    if (!isOpen) return null;
    return (
        <div className="fixed bottom-24 right-8 w-96 h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50">
            <div className="bg-secondary px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary"><Sparkles size={16} /></div>
                    <span className="text-white font-bold text-sm">WanderAI</span>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>{m.text}</div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input value={inp} onChange={e => setInp(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()}
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Ask anything…" />
                <button onClick={send} className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center hover:scale-105 transition-transform">
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

// ─── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, count, onAdd, addLabel, children }) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 text-left group">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon size={18} />
                    </div>
                    <span className="text-lg font-black text-secondary group-hover:text-primary transition-colors">{title}</span>
                    <span className="text-xs font-bold px-2.5 py-1 bg-secondary/10 text-secondary rounded-full">{count}</span>
                    {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                <button onClick={onAdd}
                    className="flex items-center gap-1.5 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors">
                    <PlusCircle size={16} /> {addLabel}
                </button>
            </div>
            {open && <div className="px-8 py-6 space-y-4">{children}</div>}
        </div>
    );
};

// ─── FLIGHT CARD ──────────────────────────────────────────────────────────────
const FlightCard = ({ f, onChange, onRemove, showRemove }) => (
    <div className="relative group bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg">
        {showRemove && (
            <button onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
            </button>
        )}
        {/* ticket top strip */}
        <div className="flex items-center gap-2 mb-3">
            <select value={f.type} onChange={e => onChange('type', e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg px-2 py-1 outline-none">
                <option>Outbound</option><option>Inbound</option><option>Internal</option><option>Layover</option>
            </select>
            <span className="ml-auto text-white/50 text-xs">✈ BOARDING PASS</span>
        </div>
        {/* route */}
        <div className="flex items-center gap-3 mb-3">
            <input value={f.from} onChange={e => onChange('from', e.target.value)}
                placeholder="FROM" className="w-20 bg-transparent text-2xl font-black uppercase outline-none placeholder:text-white/30 border-b border-white/20 text-center" />
            <div className="flex-1 flex items-center gap-1"><div className="flex-1 border-t border-dashed border-white/30" /><Plane size={14} className="text-white/50" /><div className="flex-1 border-t border-dashed border-white/30" /></div>
            <input value={f.to} onChange={e => onChange('to', e.target.value)}
                placeholder="TO" className="w-20 bg-transparent text-2xl font-black uppercase outline-none placeholder:text-white/30 border-b border-white/20 text-center" />
        </div>
        {/* details row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-white/40 uppercase tracking-wider mb-1">Flight No.</div>
                <input value={f.number} onChange={e => onChange('number', e.target.value)}
                    placeholder="KE1234" className="w-full bg-transparent font-bold outline-none placeholder:text-white/30 border-b border-white/20 pb-0.5" />
            </div>
            <div><div className="text-white/40 uppercase tracking-wider mb-1">Departure</div>
                <input value={f.time} onChange={e => onChange('time', e.target.value)}
                    placeholder="14:30" className="w-full bg-transparent font-bold outline-none placeholder:text-white/30 border-b border-white/20 pb-0.5" />
            </div>
            <div><div className="text-white/40 uppercase tracking-wider mb-1">Gate / Seat</div>
                <input value={f.notes} onChange={e => onChange('notes', e.target.value)}
                    placeholder="B22 / 32A" className="w-full bg-transparent font-bold outline-none placeholder:text-white/30 border-b border-white/20 pb-0.5" />
            </div>
        </div>
    </div>
);

// ─── HOTEL CARD ───────────────────────────────────────────────────────────────
const HotelCard = ({ h, onChange, onRemove, showRemove, index }) => (
    <div className="relative group bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-5 shadow-sm">
        {showRemove && (
            <button onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
            </button>
        )}
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-400/20 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                <BedDouble size={16} />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Stay {index + 1}</span>
                </div>
                <input value={h.name} onChange={e => onChange('name', e.target.value)}
                    placeholder="Hotel / Airbnb name…"
                    className="w-full bg-transparent text-lg font-black text-slate-800 outline-none border-b border-orange-200 pb-1 placeholder:text-gray-300" />
                <div className="grid grid-cols-2 gap-2">
                    <input value={h.address} onChange={e => onChange('address', e.target.value)}
                        placeholder="Address"
                        className="bg-white/70 border border-orange-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-orange-200 placeholder:text-gray-300" />
                    <input value={h.confirmation} onChange={e => onChange('confirmation', e.target.value)}
                        placeholder="Confirmation #"
                        className="bg-white/70 border border-orange-100 rounded-lg px-3 py-1.5 text-sm font-mono outline-none focus:ring-1 focus:ring-orange-200 placeholder:text-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input value={h.checkin} onChange={e => onChange('checkin', e.target.value)}
                        placeholder="Check-in date"
                        className="bg-white/70 border border-orange-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-orange-200 placeholder:text-gray-300" />
                    <input value={h.checkout} onChange={e => onChange('checkout', e.target.value)}
                        placeholder="Check-out date"
                        className="bg-white/70 border border-orange-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-orange-200 placeholder:text-gray-300" />
                </div>
            </div>
        </div>
    </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Itinerary = () => {
    const { state } = useLocation();

    useEffect(() => { if (state) sessionStorage.setItem('lastSurveyData', JSON.stringify(state)); }, [state]);

    const data = useMemo(() => {
        if (state) return state;
        const saved = sessionStorage.getItem('lastSurveyData');
        const def = { destination: 'South Korea (Seoul)', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000 * 4).toISOString(), focus: ['Food', 'Nature'], pace: 'Moderate', vibe: 'Social' };
        return saved ? { ...def, ...JSON.parse(saved) } : def;
    }, [state]);

    const [itinerary, setItinerary] = useState([]);
    const [destData, setDestData] = useState(null);
    const [activeTab, setActiveTab] = useState('itinerary');
    const [chatOpen, setChatOpen] = useState(false);

    // ── FLIGHTS state (array) ──
    const [flights, setFlights] = useState(() => {
        try { const s = localStorage.getItem(`flights_v2_${data.destination}`); if (s) return JSON.parse(s); } catch { }
        return [{ id: Date.now(), type: 'Outbound', from: '', to: '', number: '', time: '', notes: '' }];
    });

    // ── HOTELS state (array) ──
    const [hotels, setHotels] = useState(() => {
        try { const s = localStorage.getItem(`hotels_v2_${data.destination}`); if (s) return JSON.parse(s); } catch { }
        return [{ id: Date.now(), name: '', address: '', confirmation: '', checkin: '', checkout: '' }];
    });

    useEffect(() => { localStorage.setItem(`flights_v2_${data.destination}`, JSON.stringify(flights)); }, [flights, data.destination]);
    useEffect(() => { localStorage.setItem(`hotels_v2_${data.destination}`, JSON.stringify(hotels)); }, [hotels, data.destination]);

    const addFlight = () => setFlights(fs => [...fs, { id: Date.now(), type: 'Outbound', from: '', to: '', number: '', time: '', notes: '' }]);
    const removeFlight = (id) => setFlights(fs => fs.filter(f => f.id !== id));
    const updateFlight = (id, k, v) => setFlights(fs => fs.map(f => f.id === id ? { ...f, [k]: v } : f));

    const addHotel = () => setHotels(hs => [...hs, { id: Date.now(), name: '', address: '', confirmation: '', checkin: '', checkout: '' }]);
    const removeHotel = (id) => setHotels(hs => hs.filter(h => h.id !== id));
    const updateHotel = (id, k, v) => setHotels(hs => hs.map(h => h.id === id ? { ...h, [k]: v } : h));

    // ── CURATOR LOGIC ──────────────────────────────────────────────────────────
    useEffect(() => {
        const raw = (data.destination || '').toLowerCase().trim();

        // ── Multi-step fuzzy destination matching ──────────────────────────────
        // Strategy 1: Exact match
        let matchKey = Object.keys(DESTINATION_DATA).find(k => k !== 'default' && raw === k);

        // Strategy 2: raw contains key or key contains raw (ignoring parenthetical city)
        if (!matchKey) {
            const rawBase = raw.split('(')[0].trim(); // e.g. "usa" from "usa (new york)"
            matchKey = Object.keys(DESTINATION_DATA).find(k =>
                k !== 'default' && (raw.includes(k) || rawBase.includes(k) || k.includes(rawBase))
            );
        }

        // Strategy 3: Extract city name from parentheses and try to match
        if (!matchKey) {
            const cityMatch = raw.match(/\(([^)]+)\)/);
            const city = cityMatch ? cityMatch[1].trim() : raw;
            matchKey = Object.keys(DESTINATION_DATA).find(k =>
                k !== 'default' && (k.includes(city) || city.includes(k.split('(')[0].trim()))
            );
        }

        // Strategy 4: Word-by-word matching
        if (!matchKey) {
            const words = raw.replace(/[()]/g, ' ').split(/\s+/).filter(w => w.length > 2);
            matchKey = Object.keys(DESTINATION_DATA).find(k =>
                k !== 'default' && words.some(w => k.includes(w))
            );
        }

        const sd = DESTINATION_DATA[matchKey || 'default'];
        setDestData(sd);

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const dayCount = Math.max(differenceInDays(end, start) + 1, 1);
        const allActivities = [...sd.activities];
        const used = new Set();

        // ── ENHANCED MAPPING LOGIC ──
        // 1. Base activities per day from Pace
        let basePerDay = data.pace === 'Relaxed' ? 2 : data.pace === 'Packed' ? 5 : 3;
        // 2. Adjust based on Vibe
        if (data.vibe === 'Chill') basePerDay = Math.max(2, basePerDay - 1);
        if (data.vibe === 'Active') basePerDay = Math.min(6, basePerDay + 1);

        // 3. Define preferred types based on Vibe
        const vibePrefs = {
            'Chill': ['Relax', 'Nature', 'Culture'],
            'Active': ['Adventure', 'Nature', 'City'],
            'Social': ['City', 'Culture', 'Food'],
            'Quiet': ['Nature', 'Relax', 'Culture']
        };
        const prefTypes = vibePrefs[data.vibe] || [];
        const focusTypes = data.focus || [];

        const days = [];
        for (let i = 0; i < dayCount; i++) {
            const items = [];
            // Random jitter for variety
            const count = Math.max(2, Math.min(6, basePerDay + (Math.random() > 0.6 ? 1 : Math.random() < 0.2 ? -1 : 0)));
            let lastLa = null, lastLo = null;

            for (let j = 0; j < count; j++) {
                // Get available activities (not yet used in this trip)
                let avail = allActivities.filter(a => !used.has(a.name));

                // If pool is exhausted, reseed with all activities (they'll repeat in new days)
                if (!avail.length) {
                    used.clear();
                    avail = [...allActivities];
                }

                let next;
                if (j === 0) {
                    // First spot: Preference-driven selection
                    next = [...avail].sort((a, b) => {
                        let sa = a.rating || 4.5, sb = b.rating || 4.5;

                        // Weighting by User Focus
                        if (focusTypes.includes(a.type)) sa += 3;
                        if (focusTypes.includes(b.type)) sb += 3;

                        // Weighting by Vibe
                        if (prefTypes.includes(a.type)) sa += 1.5;
                        if (prefTypes.includes(b.type)) sb += 1.5;

                        return sb - sa + (Math.random() * 1.5 - 0.75);
                    })[0];
                } else {
                    // Subsequent spots: Geo-proximity + Slight preference nudge
                    next = [...avail].sort((a, b) => {
                        const distA = calcDist(lastLa, lastLo, a.latitude, a.longitude);
                        const distB = calcDist(lastLa, lastLo, b.latitude, b.longitude);

                        let scoreA = distA;
                        let scoreB = distB;

                        // Give a small "nudge" to preferred types even for slightly closer locations
                        if (prefTypes.includes(a.type)) scoreA *= 0.8;
                        if (prefTypes.includes(b.type)) scoreB *= 0.8;

                        return scoreA - scoreB;
                    })[0];
                }

                if (!next) break;
                used.add(next.name);
                lastLa = next.latitude; lastLo = next.longitude;
                items.push({
                    ...next,
                    img: getImg(next.name, next.type),
                    id: `${i}-${j}-${Date.now()}-${Math.random()}`,
                    time: `${String(9 + j * 3).padStart(2, '0')}:00`
                });
            }
            days.push({ id: i, dayNum: i + 1, date: addDays(start, i), items });
        }
        setItinerary(days);
    }, [data]);


    // ── ITINERARY MUTATORS ─────────────────────────────────────────────────────
    const setDayItems = (di, items) => setItinerary(prev => { const n = [...prev]; n[di] = { ...n[di], items }; return n; });
    const sortByTime = (items) => [...items].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    const updateAct = (di, id, a) => {
        const prev = itinerary[di].items;
        const updated = prev.map(x => x.id === id ? a : x);
        // if time changed, re-sort the day by time automatically
        const old = prev.find(x => x.id === id);
        const sorted = (old && old.time !== a.time) ? sortByTime(updated) : updated;
        setDayItems(di, sorted);
    };

    const deleteAct = (di, id) => setDayItems(di, itinerary[di].items.filter(x => x.id !== id));
    const addAct = (di) => {
        const nm = 'New Spot', tp = 'City';
        const item = { id: `new-${Date.now()}`, name: nm, time: '12:00', desc: 'Plan something new.', type: tp, rating: 4.5, img: getImg(nm, tp), isNew: true };
        setDayItems(di, [...itinerary[di].items, item]);
    };

    if (!destData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-6">
            <div className="text-2xl font-black text-secondary animate-pulse">Curating your perfect trip…</div>
            <AdPlaceholder className="w-full max-w-2xl h-[250px] shadow-sm" />
        </div>
    );

    // ── SUMMARY TABLE (reads from itinerary state) ─────────────────────────────
    const totalSpots = itinerary.reduce((s, d) => s + d.items.length, 0);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* NAV */}
            <nav className="h-20 px-8 md:px-14 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <Link to="/survey" className="flex items-center gap-3 group">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ChevronLeft size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-2xl text-secondary leading-none">{data.destination}</h1>
                        <p className="text-xs font-bold text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(data.startDate), 'MMM dd')} – {format(new Date(data.endDate), 'MMM dd')} · {itinerary.length} Days
                        </p>
                    </div>
                </Link>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    {['itinerary', 'summary'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white shadow text-secondary' : 'text-gray-400 hover:text-gray-600'}`}>
                            {tab[0].toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </nav>

            {/* MAIN */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-10">
                {/* LEFT SIDEBAR (ADS) */}
                <aside className="hidden lg:flex flex-col w-72 flex-shrink-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recommended</h3>
                            <AdPlaceholder className="w-full h-[600px] shadow-inner" />
                        </div>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">

                        {/* ── ITINERARY TAB ── */}
                        {activeTab === 'itinerary' && (
                            <motion.div key="itin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-14">
                                {itinerary.map((day, di) => (
                                    <div key={day.id}>
                                        <div className="flex items-center gap-5 mb-7">
                                            <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex flex-col items-center justify-center font-black shadow-xl">
                                                <span className="text-[9px] uppercase tracking-widest opacity-60">Day</span>
                                                <span className="text-3xl leading-none">{day.dayNum}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-secondary">{format(day.date, 'EEEE, MMM do')}</h2>
                                                <p className="text-sm text-gray-400 font-bold mt-0.5">{day.items.length} Activities</p>
                                            </div>
                                        </div>
                                        <Reorder.Group axis="y" values={day.items} onReorder={items => setDayItems(di, items)} className="space-y-4">
                                            {day.items.map(act => (
                                                <ActivityCard key={act.id} activity={act}
                                                    onSave={a => updateAct(di, act.id, a)}
                                                    onDelete={() => deleteAct(di, act.id)} />
                                            ))}
                                        </Reorder.Group>
                                        <button onClick={() => addAct(di)}
                                            className="w-full mt-6 py-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
                                            <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Add Spot
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* ── SUMMARY TAB ── */}
                        {activeTab === 'summary' && (
                            <motion.div key="sum" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

                                {/* FLIGHTS */}
                                <Section title="Flights" icon={Plane} count={flights.length} onAdd={addFlight} addLabel="Add Flight">
                                    {flights.map(f => (
                                        <FlightCard key={f.id} f={f}
                                            onChange={(k, v) => updateFlight(f.id, k, v)}
                                            onRemove={() => removeFlight(f.id)}
                                            showRemove={flights.length > 1} />
                                    ))}
                                </Section>

                                {/* HOTELS */}
                                <Section title="Accommodation" icon={BedDouble} count={hotels.length} onAdd={addHotel} addLabel="Add Stay">
                                    {hotels.map((h, i) => (
                                        <HotelCard key={h.id} h={h} index={i}
                                            onChange={(k, v) => updateHotel(h.id, k, v)}
                                            onRemove={() => removeHotel(h.id)}
                                            showRemove={hotels.length > 1} />
                                    ))}
                                </Section>

                                {/* JOURNEY OVERVIEW TABLE — reads from itinerary state directly */}
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                        <h3 className="text-lg font-black text-secondary flex items-center gap-2.5">
                                            <List size={18} className="text-primary" /> Journey Overview
                                        </h3>
                                        <div className="flex gap-3">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{itinerary.length} Days</span>
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">{totalSpots} Spots</span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    {['Day', 'Time', 'Activity', 'Type', 'Rating'].map(h => (
                                                        <th key={h} className={`px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest ${h === 'Rating' ? 'text-right' : ''}`}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {itinerary.map(day =>
                                                    day.items.length > 0 ? day.items.map((item, idx) => (
                                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                            {idx === 0 && (
                                                                <td rowSpan={day.items.length} className="px-6 py-5 align-top whitespace-nowrap">
                                                                    <span className="text-xl font-black text-secondary block">D{day.dayNum}</span>
                                                                    <span className="text-xs font-bold text-gray-400">{format(day.date, 'MMM dd')}</span>
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-5 text-primary font-bold text-sm whitespace-nowrap">{fmtTime(item.time)}</td>
                                                            <td className="px-6 py-5">
                                                                <p className="font-black text-secondary text-sm">{item.name}</p>
                                                                <p className="text-xs text-gray-400 truncate max-w-[180px]">{item.desc}</p>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">{item.type}</span>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                <span className="font-black text-secondary text-sm flex items-center justify-end gap-1">
                                                                    <Star size={11} className="text-yellow-400 fill-yellow-400" /> {item.rating}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr key={`empty-${day.id}`}>
                                                            <td className="px-6 py-5 font-black text-secondary">D{day.dayNum}</td>
                                                            <td colSpan={4} className="px-6 py-5 text-gray-400 text-sm italic">No activities yet</td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* FAB + CHAT */}
            <button onClick={() => setChatOpen(true)}
                className="fixed bottom-7 right-7 w-14 h-14 bg-primary text-secondary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40">
                <MessageCircle size={28} />
            </button>
            <AIChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} destination={data.destination} />
        </div>
    );
};

export default Itinerary;
