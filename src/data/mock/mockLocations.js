export const mockLocations = {
  states: [
    {
      id: "ST-MH",
      name: "Maharashtra",
      districts: [
        {
          id: "DIS-MH-PUNE",
          name: "Pune",
          blocks: [
            { id: "BLK-PUNE-HAV", name: "Haveli", villages: ["Khed Shivapur", "Nanded", "Khanapur", "Kondhwa Khurd"] },
            { id: "BLK-PUNE-BAR", name: "Baramati", villages: ["Malegaon", "Kolewadi", "Gunawadi", "Pandhare"] },
            { id: "BLK-PUNE-SHI", name: "Shirur", villages: ["Shikrapur", "Nabalwada", "Koregaon Bhima"] }
          ]
        },
        {
          id: "DIS-MH-SAT",
          name: "Satara",
          blocks: [
            { id: "BLK-SAT-KRA", name: "Karad", villages: ["Umbraj", "Waghwade", "Shenoli"] },
            { id: "BLK-SAT-WAI", name: "Wai", villages: ["Bhavani Nagar", "Panchgani border"] }
          ]
        },
        {
          id: "DIS-MH-NAS",
          name: "Nashik",
          blocks: [
            { id: "BLK-NAS-NIP", name: "Niphad", villages: ["Pimplas", "Chandori"] },
            { id: "BLK-NAS-SIN", name: "Sinnar", villages: ["Musalgaon", "Wavi"] }
          ]
        }
      ]
    },
    {
      id: "ST-KA",
      name: "Karnataka",
      districts: [
        {
          id: "DIS-KA-BLR",
          name: "Bengaluru Rural",
          blocks: [
            { id: "BLK-KA-DOD", name: "Doddaballapura", villages: ["Tubagere", "Rajaghatta"] },
            { id: "BLK-KA-DEV", name: "Devanahalli", villages: ["Vijayapura", "Kannamangala"] }
          ]
        }
      ]
    },
    {
      id: "ST-GJ",
      name: "Gujarat",
      districts: [
        {
          id: "DIS-GJ-RAJ",
          name: "Rajkot",
          blocks: [
            { id: "BLK-GJ-GON", name: "Gondal", villages: ["Bhadwa", "Daiya"] }
          ]
        }
      ]
    }
  ]
};
