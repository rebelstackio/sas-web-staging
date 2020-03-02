export default [
    {
        id: 'shore-salaverry',
        shortTitle: 'Shore excursions from Salaverry cruise terminal',
        title: 'Shore excursions to Chan Chan, the largest city of the pre-Columbian era in South America.',
        subtitle: 'from Salaverry cruise terminal',
        description: 'Live the amazing archeological experience of "the City of Eternal Spring", this tour takes you to visit the best places in Trujillo, with full assistance, English speaking tour guides and comfortable cars with air conditioning',
        img: {
            portrait: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1576877525/SAS/salaberry_splash_pt.jpg',
            landscape: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1576794897/SAS/salaberry_splash.jpg'
        },
        media: [
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1578084877/SAS/salaverry_cruise_01.jpg',
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1578084877/SAS/salaberry_cruise_02.jpg'
        ],
        price: {
            standard: {
                amount: 85
            }
        },
        itinerary: {
            '8:30AM': 'Pickup from the cruise terminal.',
            '9:00AM': 'Arrival to Temple of the sun & the Moon.',
            '11:15AM': 'Arrival to colonial Trujillo city, we will have walking by the largest plaza and colonial Mansion.',
            '11:45AM': 'Arrival to largest Adobe ancient City of America Chan Chan',
            '1:30PM': 'Visit Huanchaco Fishing Village we will have time for lunch on your own after lunch return to the cruise terminal.',
            '2:30PM': 'End of our service.'
        },
        include: {
            standard: ['All entrance fees', 'All transportation', 'English speaking guide']
        },
        cruisesdates: [
            {
                destination: 'Marina',
                title: 'Oceania Cruises',
                date: 'January 9, Thursday.'
            },
            {
                destination: 'Volendam',
                title: 'Holland America',
                date: 'January 15, Wednesday.'
            },
            {
                destination: 'Silver Shadow',
                title: 'Silver Sea',
                date: 'February 4, Tuesday.'
            },
            {
                destination: 'Insignia',
                title: 'Oceania Cruises',
                date: 'February 11, Tuesday.'
            },
            {
                destination: 'Ms Zaandam',
                title: 'Holland America',
                date: 'March 27, Friday.'
            },
            {
                destination: 'Seven Seas Navigator',
                title: 'Regent Seven Seas',
                date: 'April 26, Sunday.'
            },
            {
                destination: 'Seven Seas Mariner',
                title: 'Regent Seven Seas',
                date: 'November 12, Thursday.'
            },
            {
                destination: 'Marina',
                title: 'Oceania Cruises',
                date: 'December 17, Thursday.'
            },
        ]
    },
    {
        id: 'shore-excursion-lima-8h',
        title: 'Shore excursions to Pachacamac Archaeological sites, City of Kings & modern cosmopolitan metropolis, 8 hours',
        shortTitle: 'Shore excursions from Callao cruise terminal',
        subtitle: 'from Callao cruise terminal',
        description: 'You are arriving on a cruise to Lima? we offer deluxe tours according to your time and requirements. Our Special Excursion It will take you to visit the best of Lima. The shore excursions include cars with air-conditioning, professional English speaking tour guides.',
        img: {
            portrait: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577414817/SAS/callao_port_pt.jpg',
            landscape: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577414817/SAS/callao_port.jpg'
        },
        media: [
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579147717/SAS/tour-lima-02.jpg',
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579147717/SAS/tour-lima-03.jpg'
        ],
        price: {
            standard: {
                amount: 85
            }
        },
        itinerary: {
            '8:30AM': 'pickup from the main gate of Callao harbor or shuttle bus meeting point, Plaza San Miguel, Plaza Salaverry, Larcomar.',
            '8:45AM': 'drive to Pachacamac Earth or realms creator\'s Temple.',
            '9:45AM': 'touring around Archaeological sites Pachacamac.',
            '11:00AM': 'drive to the modern city of Lima Barranco Miraflores, Parque del Amor, coastline panoramic view, olive of San Isidro, visit unforgettable Inca Market.',
            '1:30PM': 'visit a traditional restaurant for lunch on your own.',
            '2:30PM': 'drive to Lima City of Kings, palaces, cathedrals, underground catacombs of San Francisco.',
            '4:30PM': 'end of Our service or return to the shuttle bus stop.'
        },
        include: {
            standard: ['English speaking Guide', '8 hours itinerary', 'Certified tourist bus ( air-conditioned bus ).']
        },
        cruisesdates: [
            {destination: "Marina ", title: "Oceania Cruises ", date: "January 8."},
            {destination: "Volendam ", title: "Holland America ", date: "January 16, 17."},
            {destination: "ISLAND PRINCESS ", title: "Princess Cruises ", date: "January 21, 22."},
            {destination: "COSTA DELICIOZA ", title: "Costa Cruises ", date: "January 30."},
            {destination: "Silver Shadow ", title: "Silver Sea ", date: "February 5, 6."},
            {destination: "Insignia ", title: "Oceania Cruises ", date: "February 12."},
            {destination: "MSC MAGNIFICA ", title: "MSC Cruises ", date: "February 15."},
            {destination: "BALMORAL ", title: "Fred. Olsen Cruises ", date: "February 18."},
            {destination: "QUEEN VICTORIA ", title: "Cunard ", date: "March 5, 6."},
            {destination: "MARINA ", title: "Oceania Cruises ", date: "March 15."},
            {destination: "CELEBRITY ECLIPSE ", title: "Celebrity Cruises ", date: "March 19."},
            {destination: "Star ", title: "Norwegian Cruise Line ", date: "March 20."},
            {destination: "AZAMARA PURSUIT ", title: "Azamara Club Cruises ", date: "March 23 (Monday)."},
            {destination: "Ms Zaandam ", title: "Holland America ", date: "March 25, 26."},
            {destination: "KONINGSDAM ", title: "Holland America ", date: "April 16."},
            {destination: "Seven Seas Navigator ", title: "Regent Seven Seas ", date: "April 24, 25."},
            {destination: "SEA PRINCESS ", title: "Princess Cruises ", date: "August 3, 4. (Monday)."},
            {destination: "Westerdam ", title: "Holland America ", date: "October 25."},
            {destination: "Seven Seas Mariner ", title: "Regent Seven Seas ", date: "November 13, 14."},
            {destination: "CORAL PRINCESS ", title: "Princess Cruises ", date: "November 27."},
            {destination: "PACIFIC PRINCESS ", title: "Princess Cruises ", date: "December 10, 11."},
            {destination: "Marina ", title: "Oceania Cruises ", date: "December 18, 19."}
        ],
        extraTours: [
            {
                id: 'shore-excursion-lima',
                title: 'Shore excursions to Larco Museum city of Kings & Modern cosmopolitan city Inca Market, Huaca Pucllana, 6 hours',
                subtitle: 'from Callao cruise terminal',
                description: 'You are arriving on a cruise to Lima? we offer deluxe tours according to your time and requirements. Our Special Excursion It will take you to visit the best of Lima. The shore excursions include cars with air-conditioning, professional English speaking tour guides.',
                media: [
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579147716/SAS/tour-lima-04.jpg',
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579147715/SAS/tour-lima-01.jpg'
                ],
                price: {
                    standard: {
                        amount: 75
                    }
                },
                itinerary: {
                    '8:30AM': 'pickup from the main gate of Callao cruise terminal, or shuttle bus meeting point, Plaza San Miguel, plaza Salaverry, Larco Mar.',
                    '9:00AM': 'visit Larco Museum',
                    '10:00AM': 'drive to Lima, City of Kings, palaces, cathedrals, underground catacombs.',
                    '11:30AM': 'drive to the modern city of Lima Miraflores, Huaca Pucllana (Archaeological sites), San Isidro, Inca Market. Panoramic view coastline.',
                    '1:30PM': 'visit a traditional restaurant for lunch on your own.',
                    '2:30PM': 'return to shuttle bus meeting point end of Our service.',
                },
                include: {
                    standard: ['English speaking Guide', '6 hours itinerary', 'Certified tourist bus ( air-conditioned bus ).']
                }
            }
        ]
    },
    {
        id: 'shore-paracas',
        title: 'Shore excursions to Islas Ballestas',
        shortTitle: 'Shore excursions from TPP Pisco Paracas',
        subtitle: 'from TPP Pisco Paracas cruise terminal',
        description: 'We pick you up you directly from the port and personally escort you to Paracas dock. This round-trip tour of Peru\'s most famous islands lets you enjoy magnificent rocks formations sculpted by nature and is home of Humboldt penguins, south Americans sea lions and a multitude of marine birds. Services also available in First and Private classes.All yacht tours include a trained, certified, registered yatchsman and crewman/guide onboard. Our yacht services are insured and registered with all appropriate agencies as mandated by law.',
        img: {
            portrait: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577419105/SAS/paracas_splash_pt.jpg',
            landscape: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577419105/SAS/paracas_splash.jpg'
        },
        media: [
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577998819/SAS/paracas_cruise_01.jpg',
            'https://res.cloudinary.com/dvv4qgnka/image/upload/v1578271566/SAS/paracas_cruise_02.jpg'
        ],
        price: {
            standard: {
                amount: 85
            },
            firstclass: {
                amount: 110
            }
        },
        itinerary: {
            '09:00 AM': 'pickup from San Martin harbor',
            '09:30 AM': 'arrival to Paracas City ( tourist pier )',
            '10:00 AM': 'ride to Ballestas islands it last for 2 hours, We will see marine birds, sea lions, Humboldt penguin, Inka tern, in the way to the Islands we will have chance to see the enigmatic line similar to Nazca lines, named Candelabra.',
            '12:00 PM': 'return to Paracas City, free time to walk in Paracas boulevard, chop, or drink Pisco sour.',
            '01:00 PM': 'departure to Paracas nature Reserve this tour last for 2 hours, we will have short walk on the driest desert of Paracas,  and photo stops on dramatic Rocky coast line of Paracas Reserve, and more.',
            '03:00 PM': 'return to Cruise ship end of our services.'
        },
        include: {
            standard: ['Limeted to 28 participants ','All entrance fees', 'Harbor tax', 'Personal insurance in case of injuries', 'Pickup and dropoff directly from port/harbor', 'All transportation', 'English speaking guide'],
            firstclass: ['All Standard Features','Limited to 18 guests', 'Double seating']
        },
        cruisesdates: [
            {destination: "Volendam ", title: "Holland America ", date: "January 18."},
            {destination: "Island Princess ", title: "Princess Cruises ", date: "January 23."},
            {destination: "Insignia ", title: "Oceania Cruises ", date: "February 13."},
            {destination: "Balmoral ", title: "Fred. Olsen Cruises ", date: "February 17."},
            {destination: "Marina ", title: "Oceania Cruises ", date: "March 14."},
            {destination: "Star ", title: "Norwegian Cruise Line ", date: "March 19."},
            {destination: "Azamara Pursuit ", title: "Azamara Club Cruises ", date: "March 22."},
            {destination: "Sea Princess ", title: "Princess Cruises ", date: "August 5."},
            {destination: "Seven Seas Mariner ", title: "Regent Seven Seas ", date: "November 15."},
            {destination: "Coral Princess ", title: "Princess Cruises ", date: "November 29."},
            {destination: "Pacific Princess ", title: "Princess Cruises ", date: "December 9."},
            {destination: "Marina ", title: "Oceania Cruises ", date: "December 20."}
        ],
        extraTours: [
            {
                id: 'tambo-colorado',
                title: 'Shore excursions to Tambo Colorado',
                subtitle: 'from San Martin harbor',
                description: 'Tambo Colorado (Red Branch) is located 60 Km from Paracas city, this Inca archaeological site is well preserved in the coastal kingdom of Incas, the palace was painted with red, white and yellow gold, the yellow gold painting accentuate mostly the trapezoidal niches. Tambo Colorado was built at the end of the 15th century probably ware used to control commercial trading and integrating the locals into Inca Religion. The Tambo Colorado palace is surrounded by sacred sites like temples, pyramid, platform for praying and a great trapezoidal chapped plaza',
                media: [
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1578270816/SAS/tour-tambo-colorado-01.jpg',
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1578271256/SAS/tour-tambo-colorado-02.jpg'
                ],
                price: {
                    standard: {
                        amount: 95
                    }
                },
                itinerary: {
                    '8:00 AM': 'pickup from the harbor.',
                    '9:30 AM': 'arrival to Inca archaeological site.',
                    '9:45 AM': 'touring at Tambo Colorado ( guided walking around the  Inca palace finally getting interiors of the Palace, it last for 1 hour with photo stops.',
                    '10:45 AM': 'free walking by yourself after group touring.',
                    '11:15 AM': 'return to Pisco city', 
                    '12:15 PM': 'short stop in the Plaza of Pisco,( opportunity for lunch by your own or Pisco sour).',
                    '1:30 PM': 'bus ride to Paracas nature Reserve.',
                    '2:00 PM': 'touring Paracas nature Reserve, this tour can last for 1 hour half or 2 hours. Btw, the Paracas nature Reserve is right next to San Martin\'s harbor, so, the return will be in 20 minutes there.',
                    '3:45 PM': 'end of our services.'
                },
                include: {
                    standard: ['limited to 18 Participants.', 'all entrance fees', 'Pickup and drop off directly from the harbor', 'English speaking Guide', 'Certified tourist bus ( air-conditioned bus ).']
                }
            },
            {
                id: 'flight-nazca-line',
                title: 'Nazca Lines flight',
                subtitle: 'from Pisco Cruise Terminal',
                description: 'Discovering the unsolved mysterious lines of the South Coast of Peru, where the ancient civilization developed successfully despite inheriting the aridest desert in South America.',
                media: [
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579059525/SAS/tour-nazca-line-01.jpg',
                    'https://res.cloudinary.com/dvv4qgnka/image/upload/v1579059525/SAS/tour-nazca-line-02.jpg'
                ],
                price: {
                    standard: {
                        amount: 380
                    }
                },
                itinerary: {
                    '8:30AM': 'pickup from cruise ship',
                    '9:00AM': 'check-in with the airline for NAZCA Lines flight.',
                    '9:20AM': 'the guide will provide you information according to last research concerning about the mysterious Lines',
                    '9:45AM': 'flight to NAZCA Lines the aircraft will fly through the green valley of Ica city. Once you are onboard the pilot will guide you to the location of each Line.',
                    '12:00PM': 'the guide will be waiting for you to transfer you to a local restaurant for lunch on your own.',
                    '1:30PM': 'return to the cruise terminal.',
                    'This Itinerary is referential': 'Your guide & driver will be flexible with the time table.'
                },
                include: {
                    standard: ['all taxes & transfers.', 'Pickup and drop off directly from the harbor', 'English speaking Guide']
                }
            }
        ]
    },
    {
        id: 'shore-cuzco',
        title: 'Shore excursions to Machu Picchu and Cusco',
        subtitle: '3 nights and 4 days in the breathtaking scenery of Machu Picchu',
        description: 'Discover the famous Inca city and learn about the ancient civilization that once thrived there. This tour is suited for first-time visitors, families (non-strenuous hiking) and individual travelers and is a once-in-a-lifetime experience - a must-do when visiting Peru! You have the option to upgrade to The Vistadome panoramic rail service which is the most comfortable way to journey to Machu Picchu.',
        itinerary: {
            'Day 1 CUSCO': 'Flight Lima-Cusco, transfer to the airport, assistance with check-in. After clearing baggage security in Cusco airport look for your guide in the parking lot waiting area, holding up a sign with your name on it and transfer to Hotel in the Sacred Valley. On route visit Pisac Market 30 Km (1h).',
            'Day 2 SACRED VALLEY CHINCHERO MARAS MORAY': 'Full-day Tour Sacred Valley. Drive to Chinchero 33km (1h). Weaving demonstration in Chinchero 3650m  (1h). drive to Moray terraces (2h). Drive to Maras and Salt pans (2h). Lunch at a local family Then continue to Ollantaytambo (1.5h) and visit the ruins (2h).',
            'Day 3 OLLANTA -MACHU PICCHU -CUSCO': 'Transfer to train station, Expedition train to Machu Picchu Meet your private guide at Aguas Calientes train station. Guided visit Machu Picchu 2460m (3h). Afternoon train to Ollantaytambo, then transfer to Cusco.',
            'CUSCO - LIMA - FLIGHT': 'Transfer to Cusco airport, assistance check inn, in Lima our driver will be waiting for you, holding the sign with your name on it.'
        },
        price: {
            standard: {
                amount: 1287
            }
        },
        include: {
            standard: [
                'All necessary land transport and assistance.',
                'English-speaking guide',
                'Entrance fees for all tours and excursions.',
                'Train, buses and entrance fees to Machu Picchu',
                'Accommodation at selected hotel with private bathroom (double room basis).',
                'Meals according to the itinerary.',
                'Domestic flight unless you book directly.'
            ]
        },
        notinclude: [
            'Tips to guides or the staff',
            'Entrance to Huayna Picchu (subject to availability)'
        ],
        img: {
            portrait: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577414817/SAS/callao_port_pt.jpg',
            landscape: 'https://res.cloudinary.com/dvv4qgnka/image/upload/v1577414817/SAS/callao_port.jpg'
        },
        media: [
            'https://i.imgur.com/WyO2Cm2.jpg',
            'https://i.imgur.com/pHPibRX.jpg',
            'https://i.imgur.com/23Q9HIG.jpg',
            'https://i.imgur.com/pVMIhAX.jpg',
            'https://i.imgur.com/2arNGAg.jpg',
            'https://i.imgur.com/KA9ALkn.jpg',
            'https://i.imgur.com/eIwymXn.jpg'
        ],
        cruisesdates: [],
        isDescriptive: true
    }
]