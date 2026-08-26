export const mockLocations = {
  states: [
    {
      id: "ST-KA",
      name: "Karnataka",
      districts: [
        {
          id: "DIS-KA-BLR-R",
          name: "Bengaluru Rural",
          lat: 13.29,
          lon: 77.55,
          blocks: [
            { id: "BLK-KA-DOD", name: "Doddaballapura", villages: ["Tubagere", "Rajaghatta", "Doddahejjaji"] },
            { id: "BLK-KA-DEV", name: "Devanahalli", villages: ["Vijayapura", "Kannamangala", "Avathi"] },
            { id: "BLK-KA-NEL", name: "Nelamangala", villages: ["Tyamagondlu", "Sompura", "Begur"] },
            { id: "BLK-KA-HOS", name: "Hosakote", villages: ["Nandagudi", "Anugondanahalli", "Jadigenahalli"] }
          ]
        },
        {
          id: "DIS-KA-BLR-U",
          name: "Bengaluru Urban",
          lat: 12.97,
          lon: 77.59,
          blocks: [
            { id: "BLK-KA-BLR-N", name: "Bengaluru North", villages: ["Yelahanka", "Hesaraghatta", "Jala"] },
            { id: "BLK-KA-BLR-S", name: "Bengaluru South", villages: ["Begur", "Kengeri", "Uttarahalli"] },
            { id: "BLK-KA-BLR-E", name: "Bengaluru East", villages: ["Varthur", "KR Puram", "Bidarahalli"] },
            { id: "BLK-KA-ANE", name: "Anekal", villages: ["Attibele", "Sarjapura", "Jigani"] }
          ]
        },
        {
          id: "DIS-KA-MYS",
          name: "Mysuru",
          lat: 12.30,
          lon: 76.65,
          blocks: [
            { id: "BLK-KA-MYS-C", name: "Mysuru", villages: ["Varuna", "Jayapura", "Elwala"] },
            { id: "BLK-KA-NAN", name: "Nanjangud", villages: ["Hullahalli", "Hedathale", "Debur"] },
            { id: "BLK-KA-TNA", name: "T. Narasipura", villages: ["Mugur", "Bannur", "Sosale"] },
            { id: "BLK-KA-HUN", name: "Hunsur", villages: ["Biligere", "Gavadagere", "Hanagod"] }
          ]
        },
        {
          id: "DIS-KA-BEL",
          name: "Belagavi",
          lat: 15.85,
          lon: 74.50,
          blocks: [
            { id: "BLK-KA-BEL-C", name: "Belagavi", villages: ["Peeranwadi", "Kakati", "Uchagaon"] },
            { id: "BLK-KA-GOK", name: "Gokak", villages: ["Koujalagi", "Arabhavi", "Lolsur"] },
            { id: "BLK-KA-CHI", name: "Chikkodi", villages: ["Nipani", "Sadalga", "Examba"] },
            { id: "BLK-KA-BAI", name: "Bailhongal", villages: ["Nesargi", "Sampgaon", "Devalapur"] }
          ]
        },
        {
          id: "DIS-KA-KAL",
          name: "Kalaburagi",
          lat: 17.33,
          lon: 76.83,
          blocks: [
            { id: "BLK-KA-KAL-C", name: "Kalaburagi", villages: ["Farhatabad", "Kotnoor", "Kusnoor"] },
            { id: "BLK-KA-ALA", name: "Aland", villages: ["Nimbal", "Madana", "Narona"] },
            { id: "BLK-KA-SED", name: "Sedam", villages: ["Kodalhangarga", "Mudhol", "Ranjol"] },
            { id: "BLK-KA-AFZ", name: "Afzalpur", villages: ["Karajagi", "Gobbur", "Mallasaragi"] }
          ]
        },
        {
          id: "DIS-KA-BAL",
          name: "Ballari",
          lat: 15.14,
          lon: 76.92,
          blocks: [
            { id: "BLK-KA-BAL-C", name: "Ballari", villages: ["Moka", "Kappagal", "Kurugodu"] },
            { id: "BLK-KA-SIR", name: "Siruguppa", villages: ["Tekkalakote", "Karur", "Hatcholli"] },
            { id: "BLK-KA-SAN", name: "Sandur", villages: ["Toranagallu", "Yeshwantnagar", "Choranur"] }
          ]
        },
        {
          id: "DIS-KA-KOL",
          name: "Kolar",
          lat: 13.13,
          lon: 78.13,
          blocks: [
            { id: "BLK-KA-KOL-C", name: "Kolar", villages: ["Vokkaleri", "Sugatur", "Holur"] },
            { id: "BLK-KA-BAN", name: "Bangarapet", villages: ["Kammasandra", "Kyasamballi", "Deshihalli"] },
            { id: "BLK-KA-MUL", name: "Mulbagal", villages: ["Avani", "Duggasandra", "Byrakur"] },
            { id: "BLK-KA-MAL", name: "Malur", villages: ["Lakkur", "Masti", "Tekal"] }
          ]
        },
        {
          id: "DIS-KA-MAN",
          name: "Mandya",
          lat: 12.52,
          lon: 76.90,
          blocks: [
            { id: "BLK-KA-MAN-C", name: "Mandya", villages: ["Kothathi", "Dudda", "Keragodu"] },
            { id: "BLK-KA-MAD", name: "Maddur", villages: ["Koppa", "Chikkayarasinahalli", "Besagarahalli"] },
            { id: "BLK-KA-PAN", name: "Pandavapura", villages: ["Melukote", "Chinya", "Katteri"] },
            { id: "BLK-KA-SRA", name: "Srirangapatna", villages: ["Arakere", "Belagola", "K.R. Pet"] }
          ]
        },
        {
          id: "DIS-KA-TUM",
          name: "Tumakuru",
          lat: 13.34,
          lon: 77.10,
          blocks: [
            { id: "BLK-KA-TUM-C", name: "Tumakuru", villages: ["Urdigere", "Hebbur", "Gulur"] },
            { id: "BLK-KA-GUB", name: "Gubbi", villages: ["Nittur", "C.S. Pura", "Hagalavadi"] },
            { id: "BLK-KA-TIR", name: "Tiptur", villages: ["Kibbanahalli", "Nonavinakere", "Honavalli"] },
            { id: "BLK-KA-SIRA", name: "Sira", villages: ["Bukkapatna", "Kallambella", "Tavarekere"] }
          ]
        },
        {
          id: "DIS-KA-SHI",
          name: "Shivamogga",
          lat: 13.93,
          lon: 75.57,
          blocks: [
            { id: "BLK-KA-SHI-C", name: "Shivamogga", villages: ["Holenarasipura", "Kumsi", "Ayanur"] },
            { id: "BLK-KA-BHA", name: "Bhadravathi", villages: ["Holehonnu", "Kudligere", "Barandur"] },
            { id: "BLK-KA-SAG", name: "Sagara", villages: ["Anandapura", "Avinahalli", "Karur"] },
            { id: "BLK-KA-THI", name: "Thirthahalli", villages: ["Agumbe", "Mandagadde", "Maranakatte"] }
          ]
        },
        {
          id: "DIS-KA-CHK",
          name: "Chikkamagaluru",
          lat: 13.32,
          lon: 75.77,
          blocks: [
            { id: "BLK-KA-CHK-C", name: "Chikkamagaluru", villages: ["Vastare", "Aldur", "Avathi"] },
            { id: "BLK-KA-TAR", name: "Tarikere", villages: ["Ajjampura", "Lakkavalli", "Lingadahalli"] },
            { id: "BLK-KA-KAD", name: "Kadur", villages: ["Birur", "Singatagere", "Yagati"] },
            { id: "BLK-KA-MUD", name: "Mudigere", villages: ["Gonibeedu", "Kalasa", "Balur"] }
          ]
        },
        {
          id: "DIS-KA-DKN",
          name: "Dakshina Kannada (Mangaluru)",
          lat: 12.87,
          lon: 74.88,
          blocks: [
            { id: "BLK-KA-MAN-C2", name: "Mangaluru", villages: ["Surathkal", "Gurupura", "Mulki"] },
            { id: "BLK-KA-BAN2", name: "Bantwal", villages: ["Panemangalore", "Mani", "Vittal"] },
            { id: "BLK-KA-PUT", name: "Puttur", villages: ["Uppinangady", "Kadaba", "Nelyadi"] },
            { id: "BLK-KA-BEL2", name: "Belthangady", villages: ["Dharmasthala", "Ujire", "Kokkada"] }
          ]
        },
        {
          id: "DIS-KA-UDU",
          name: "Udupi",
          lat: 13.34,
          lon: 74.74,
          blocks: [
            { id: "BLK-KA-UDU-C", name: "Udupi", villages: ["Malpe", "Manipal", "Kaup"] },
            { id: "BLK-KA-KUN", name: "Kundapura", villages: ["Byndoor", "Kota", "Shankaranarayana"] },
            { id: "BLK-KA-KAR", name: "Karkala", villages: ["Hebri", "Ajekar", "Bailoor"] }
          ]
        },
        {
          id: "DIS-KA-UKN",
          name: "Uttara Kannada (Karwar)",
          lat: 14.82,
          lon: 74.13,
          blocks: [
            { id: "BLK-KA-KAR-C", name: "Karwar", villages: ["Majali", "Kadra", "Amadalli"] },
            { id: "BLK-KA-ANK", name: "Ankola", villages: ["Sunksal", "Aversa", "Belse"] },
            { id: "BLK-KA-KUM", name: "Kumta", villages: ["Gokarna", "Mirjan", "Hegde"] },
            { id: "BLK-KA-SIR2", name: "Sirsi", villages: ["Banavasi", "Hulekal", "Dasankop"] }
          ]
        },
        {
          id: "DIS-KA-KOD",
          name: "Kodagu (Madikeri)",
          lat: 12.42,
          lon: 75.74,
          blocks: [
            { id: "BLK-KA-MAD-C", name: "Madikeri", villages: ["Napoklu", "Sampaje", "Bhagamandala"] },
            { id: "BLK-KA-SOM", name: "Somwarpet", villages: ["Shanivarasanthe", "Kushalnagar", "Kodlipet"] },
            { id: "BLK-KA-VIR", name: "Virajpet", villages: ["Gonikoppal", "Ponnampet", "Srimangala"] }
          ]
        },
        {
          id: "DIS-KA-HBD",
          name: "Hubballi-Dharwad",
          lat: 15.36,
          lon: 75.12,
          blocks: [
            { id: "BLK-KA-DHA-C", name: "Dharwad", villages: ["Garag", "Alnavar", "Hebballi"] },
            { id: "BLK-KA-HUB-C", name: "Hubballi", villages: ["Chabbi", "Kundgol", "Navalgund"] },
            { id: "BLK-KA-KAL2", name: "Kalghatgi", villages: ["Dummavada", "Mishrikoti", "Tabakad"] }
          ]
        },
        {
          id: "DIS-KA-RAI",
          name: "Raichur",
          lat: 16.20,
          lon: 77.36,
          blocks: [
            { id: "BLK-KA-RAI-C", name: "Raichur", villages: ["Yeragera", "Shaktinagar", "Ghatbichal"] },
            { id: "BLK-KA-MAN2", name: "Manvi", villages: ["Sirwar", "Pothnal", "Neeramanvi"] },
            { id: "BLK-KA-SIN", name: "Sindhanur", villages: ["Turvihal", "Javalgira", "Salagunda"] },
            { id: "BLK-KA-DEV2", name: "Devadurga", villages: ["Arakera", "Gabbur", "Jalahalli"] }
          ]
        },
        {
          id: "DIS-KA-VIJ",
          name: "Vijayapura",
          lat: 16.83,
          lon: 75.71,
          blocks: [
            { id: "BLK-KA-VIJ-C", name: "Vijayapura", villages: ["Tikota", "Mamdapur", "Honavada"] },
            { id: "BLK-KA-IND", name: "Indi", villages: ["Chadchan", "Loni", "Horti"] },
            { id: "BLK-KA-SIN2", name: "Sindagi", villages: ["Almel", "Devarahipparagi", "Golageri"] },
            { id: "BLK-KA-BAS", name: "Basavana Bagewadi", villages: ["Kolhar", "Nidagundi", "Managuli"] }
          ]
        }
      ]
    }
  ]
};

export const KARNATAKA_DISTRICTS = [
  { id: "DIS-KA-BAL", name: "Ballari", lat: 15.13, lon: 76.92 },
  { id: "DIS-KA-BEL", name: "Belagavi", lat: 15.85, lon: 74.50 },
  { id: "DIS-KA-BLR-R", name: "Bengaluru Rural", lat: 13.28, lon: 77.55 },
  { id: "DIS-KA-BLR-U", name: "Bengaluru Urban", lat: 12.97, lon: 77.59 },
  { id: "DIS-KA-CHK", name: "Chikkamagaluru", lat: 13.33, lon: 75.77 },
  { id: "DIS-KA-DAK", name: "Dakshina Kannada (Mangaluru)", lat: 12.87, lon: 74.88 },
  { id: "DIS-KA-DHA", name: "Hubballi-Dharwad", lat: 15.36, lon: 75.12 },
  { id: "DIS-KA-KAL", name: "Kalaburagi", lat: 17.33, lon: 76.83 },
  { id: "DIS-KA-KOD", name: "Kodagu (Madikeri)", lat: 12.42, lon: 75.73 },
  { id: "DIS-KA-KOL", name: "Kolar", lat: 13.13, lon: 78.13 },
  { id: "DIS-KA-MAN", name: "Mandya", lat: 12.52, lon: 76.90 },
  { id: "DIS-KA-MYS", name: "Mysuru", lat: 12.30, lon: 76.64 },
  { id: "DIS-KA-RAI", name: "Raichur", lat: 16.20, lon: 77.35 },
  { id: "DIS-KA-SHI", name: "Shivamogga", lat: 13.93, lon: 75.57 },
  { id: "DIS-KA-TUM", name: "Tumakuru", lat: 13.34, lon: 77.10 },
  { id: "DIS-KA-UDU", name: "Udupi", lat: 13.34, lon: 74.74 },
  { id: "DIS-KA-UTT", name: "Uttara Kannada (Karwar)", lat: 14.81, lon: 74.13 },
  { id: "DIS-KA-VIJ", name: "Vijayapura", lat: 16.83, lon: 75.71 }
];
