/**
 * cropWaterIntelligence.js
 * Agricultural Decision & Water Requirement Intelligence Service
 * 
 * Maps real backend rainfall forecast, deviation %, risk category, and dry spell warnings
 * to crop-specific water status, severity, recommended actions, and agronomic techniques.
 * 
 * Extensible for FAO-56 crop coefficients and regional Karnataka cropping systems.
 */

export const CROP_WATER_PROFILES = {
  ragi: {
    key: 'ragi',
    name: 'Ragi (Finger Millet)',
    name_kn: 'ರಾಗಿ (ಫಿಂಗರ್ ಮಿಲ್ಲೆಟ್)',
    category: 'Millets',
    waterDemandCategory: 'Low-Moderate',
    droughtResilience: 'High',
    kc_mid: 1.00,
    criticalStages: 'Tillering & Grain Filling',
    criticalStages_kn: 'ತೆನೆ ಒಡೆಯುವ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಹಂತ',
    // Thresholds in mm (14-16 day horizon)
    deficitThresholdMm: 25.0,
    excessThresholdMm: 120.0,
    deficitGuidance: {
      en: {
        action: 'Provide protective/supplemental irrigation if dry spell exceeds 10 days.',
        techniques: [
          'Straw or crop residue mulching to reduce soil evaporation',
          'Inter-cultivation (dust mulching) to break soil capillaries',
          'Foliar spray of 2% Urea or 1% Potassium Nitrate during dry spells',
          'Utilization of harvested rainwater from Farm Ponds (Krishi Bhagya)'
        ]
      },
      kn: {
        action: 'ಒಣ ಅವಧಿಯು 10 ದಿನ ಮೀರಿದರೆ ಸಂರಕ್ಷಿತ/ಪೂರಕ ನೀರಾವರಿ ಒದಗಿಸಿ.',
        techniques: [
          'ಮಣ್ಣಿನ ತೇವಾಂಶ ಸಂರಕ್ಷಿಸಲು ಸಾವಯವ ತ್ಯಾಜ್ಯ/ಹುಲ್ಲಿನ ಹೊದಿಕೆ (Mulching)',
          'ಮಣ್ಣಿನ ಬಿರುಕುಗಳನ್ನು ಮುಚ್ಚಲು ಲಘು ಅಂತರ ಬೇಸಾಯ',
          'ಒಣ ಹವೆಯಲ್ಲಿ 2% ಯೂರಿಯಾ ಅಥವಾ 1% ಪೊಟ್ಯಾಸಿಯಂ ನೈಟ್ರೇಟ್ ಸಿಂಪಡಣೆ',
          'ಕೃಷಿ ಹೊಂಡದ ನೀರಿನ ಸದ್ಬಳಕೆ'
        ]
      }
    },
    excessGuidance: {
      en: {
        action: 'Ensure rapid field drainage to prevent waterlogging and collar rot.',
        techniques: [
          'Clear peripheral and inter-row drainage furrows',
          'Delay top-dressing fertilizer until standing water drains',
          'Scout for blast disease and root rot fungal infections'
        ]
      },
      kn: {
        action: 'ನೀರು ನಿಲ್ಲುವುದನ್ನು ಮತ್ತು ಕೊಳೆ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.',
        techniques: [
          'ಜಮೀನಿನಲ್ಲಿ ನಿಂತ ನೀರನ್ನು ತಕ್ಷಣ ಬಸಿದು ಹೊರಹಾಕಿ',
          'ನೀರು ಬಸಿದ ನಂತರವಷ್ಟೇ ಮೇಲುಗೊಬ್ಬರ ನೀಡಿ',
          'ಬೆಂಕಿ ರೋಗ ಮತ್ತು ಬೇರು ಕೊಳೆ ರೋಗದ ಬಾಧೆ ಗಮನಿಸಿ'
        ]
      }
    },
    optimalGuidance: {
      en: {
        action: 'Continue planned intercultural operations and standard nutrition schedule.',
        techniques: [
          'Standard weeding and earthing-up operations',
          'Recommended NPK split application at tillering stage',
          'Maintain optimum plant population'
        ]
      },
      kn: {
        action: 'ನಿಗದಿತ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ನಿರ್ವಹಣೆಯನ್ನು ಮುಂದುವರಿಸಿ.',
        techniques: [
          'ಸಕಾಲಿಕ ಕಳೆ ಕೀಳುವಿಕೆ ಮತ್ತು ಸಾಲುಗಳ ನಡುವೆ ಮಣ್ಣು ಏರಿಸುವುದು',
          'ತೆನೆ ಹಂತದಲ್ಲಿ ಶಿಫಾರಸು ಮಾಡಿದ ಪೋಷಕಾಂಶಗಳ ನಿರ್ವಹಣೆ',
          'ಸೂಕ್ತ ಬೆಳೆ ಸಾಂದ್ರತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ'
        ]
      }
    }
  },

  maize: {
    key: 'maize',
    name: 'Maize (Field Corn)',
    name_kn: 'ಮೆಕ್ಕೆಜೋಳ',
    category: 'Cereals',
    waterDemandCategory: 'Moderate-High',
    droughtResilience: 'Moderate',
    kc_mid: 1.20,
    criticalStages: 'Tasseling, Silking & Grain Filling',
    criticalStages_kn: 'ತೆನೆ ಮೂಡುವ (Tasseling) ಮತ್ತು ಕಾಳು ತುಂಬುವ ಹಂತ',
    deficitThresholdMm: 35.0,
    excessThresholdMm: 140.0,
    deficitGuidance: {
      en: {
        action: 'Critical moisture stress risk! Immediate supplemental irrigation required at flowering/silking.',
        techniques: [
          'Prioritize irrigation during critical tasseling and silking stages',
          'Apply micro-irrigation (drip / sprinkler) to maximize water efficiency',
          'Avoid nitrogen top dressing until moisture availability improves',
          'Adopt broad bed and furrow (BBF) moisture conservation'
        ]
      },
      kn: {
        action: 'ತೀವ್ರ ತೇವಾಂಶ ಕೊರತೆ ಅಪಾಯ! ತೆನೆ ಮೂಡುವ ಹಂತದಲ್ಲಿ ತಕ್ಷಣ ಪೂರಕ ನೀರಾವರಿ ಒದಗಿಸಿ.',
        techniques: [
          'ತೆನೆ ಮೂಡುವ ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ನಿರ್ಣಾಯಕ ಹಂತಗಳಲ್ಲಿ ನೀರುಣಿಸಲು ಆದ್ಯತೆ ನೀಡಿ',
          'ಹನಿ ಅಥವಾ ತುಂತುರು ನೀರಾವರಿ ಬಳಸಿ ನೀರಿನ ದಕ್ಷತೆ ಹೆಚ್ಚಿಸಿ',
          'ತೇವಾಂಶ ಸಿಗುವವರೆಗೂ ಸಾರಜನಕ ಮೇಲುಗೊಬ್ಬರ ನೀಡಬೇಡಿ',
          'ಅಗಲ ಪಾತಿ ಮತ್ತು ಸಾಲು ಪದ್ಧತಿಯಲ್ಲಿ ತೇವಾಂಶ ಸಂರಕ್ಷಿಸಿ'
        ]
      }
    },
    excessGuidance: {
      en: {
        action: 'Maize is highly sensitive to waterlogging. Drain excess water within 24 hours.',
        techniques: [
          'Open dead furrows every 3-4 rows for rapid excess water disposal',
          'Apply additional Nitrogen dose (25 kg/ha urea) post-drainage to revive yellowing crops',
          'Monitor closely for Fall Armyworm (FAW) and sheath blight'
        ]
      },
      kn: {
        action: 'ಮೆಕ್ಕೆಜೋಳವು ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲುವುದನ್ನು ಸಹಿಸುವುದಿಲ್ಲ. 24 ಗಂಟೆಯೊಳಗೆ ನೀರನ್ನು ಬಸಿದು ಹೊರಹಾಕಿ.',
        techniques: [
          'ಹೆಚ್ಚುವರಿ ನೀರು ಹರಿದುಹೋಗಲು ಪ್ರತಿ 3-4 ಸಾಲುಗಳಿಗೊಮ್ಮೆ ಬಸಿಗಾಲುವೆ ನಿರ್ಮಿಸಿ',
          'ನೀರು ಬಸಿದ ನಂತರ ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದ ಬೆಳೆಗೆ ಯೂರಿಯಾ (25 ಕೆಜಿ/ಹೆಕ್ಟೇರ್) ನೀಡಿ',
          'ಲದ್ದಿ ಹುಳು (Fall Armyworm) ಬಾಧೆಯನ್ನು ಗಮನಿಸಿ'
        ]
      }
    },
    optimalGuidance: {
      en: {
        action: 'Favorable moisture conditions. Proceed with planned inter-row cultivation and top-dressing.',
        techniques: [
          'Top-dress Urea at knee-high and tasseling stages',
          'Perform mechanical weeding or herbicide spray if weeds are active',
          'Ensure uniform plant spacing'
        ]
      },
      kn: {
        action: 'ಉತ್ತಮ ತೇವಾಂಶ ಪರಿಸ್ಥಿತಿ. ನಿಗದಿತ ಮೇಲುಗೊಬ್ಬರ ಮತ್ತು ಅಂತರ ಬೇಸಾಯ ಮುಂದುವರಿಸಿ.',
        techniques: [
          'ಮಂಡಿ ಎತ್ತರ ಮತ್ತು ತೆನೆ ಹಂತದಲ್ಲಿ ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರ ನೀಡಿ',
          'ಅಂತರ ಬೇಸಾಯದ ಮೂಲಕ ಕಳೆ ನಿಯಂತ್ರಿಸಿ',
          'ಸಸ್ಯಗಳ ಏಕರೂಪ ಬೆಳವಣಿಗೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ'
        ]
      }
    }
  },

  jowar: {
    key: 'jowar',
    name: 'Jowar (Sorghum)',
    name_kn: 'ಜೋಳ (ಸೋರ್ಗಮ್)',
    category: 'Millets',
    waterDemandCategory: 'Low-Moderate',
    droughtResilience: 'High',
    kc_mid: 1.00,
    criticalStages: 'Booting & Flowering',
    criticalStages_kn: 'ಹೊಡೆ ಮೂಡುವ ಮತ್ತು ಹೂವಾಡುವ ಹಂತ',
    deficitThresholdMm: 22.0,
    excessThresholdMm: 110.0,
    deficitGuidance: {
      en: {
        action: 'Drought-tolerant crop. Provide one protective irrigation only if flag leaf wilts before noon.',
        techniques: [
          'Dust mulching through shallow hoeing',
          'Maintain vegetative mulch in inter-row space',
          'Foliar spray of 1% KNO3 during prolonged dry spells',
          'Ensure protective irrigation at booting stage if available'
        ]
      },
      kn: {
        action: 'ಬರ ನಿರೋಧಕ ಬೆಳೆ. ಮಧ್ಯಾಹ್ನಕ್ಕೂ ಮುನ್ನ ಎಲೆಗಳು ಬಾಡಿದರೆ ಮಾತ್ರ ಒಂದು ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ನೀಡಿ.',
        techniques: [
          'ಮೇಲ್ಮೈ ಮಣ್ಣನ್ನು ಹದಗೊಳಿಸಿ ತೇವಾಂಶ ಆವಿಯಾಗುವುದನ್ನು ತಡೆಯಿರಿ',
          'ಸಾಲುಗಳ ನಡುವೆ ಹೊದಿಕೆ ಹಾಕಿ',
          'ದೀರ್ಘ ಒಣ ಹವೆಯಲ್ಲಿ 1% ಪೊಟ್ಯಾಸಿಯಂ ನೈಟ್ರೇಟ್ ಸಿಂಪಡಿಸಿ',
          'ಹೊಡೆ ಮೂಡುವ ಹಂತದಲ್ಲಿ ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ಒದಗಿಸಿ'
        ]
      }
    },
    excessGuidance: {
      en: {
        action: 'Prevent water stagnation to avoid shoot fly proliferation and grain mold.',
        techniques: [
          'Provide drainage outlets at field corners',
          'Spray protective copper fungicide if high humidity persists',
          'Scout for shoot fly and stem borer'
        ]
      },
      kn: {
        action: 'ಕಾಳು ಕಪ್ಪುಗಟ್ಟುವುದನ್ನು ಮತ್ತು ಸುಳಿ ನೊಣದ ಬಾಧೆಯನ್ನು ತಪ್ಪಿಸಲು ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        techniques: [
          'ಜಮೀನಿನ ಮೂಲೆಗಳಲ್ಲಿ ಬಸಿಗಾಲುವೆ ತೆರೆಯಿರಿ',
          'ಹೆಚ್ಚಿನ ತೇವಾಂಶವಿದ್ದರೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ',
          'ಸುಳಿ ನೊಣದ ಬಾಧೆಯನ್ನು ಗಮನಿಸಿ'
        ]
      }
    },
    optimalGuidance: {
      en: {
        action: 'Excellent growth conditions. Continue regular agro-advisory schedule.',
        techniques: [
          'Thinning of excess seedlings to maintain optimum spacing',
          'Split fertilizer application as per package of practices',
          'Routine scout for aphid clusters'
        ]
      },
      kn: {
        action: 'ಸೂಕ್ತ ಬೆಳೆ ವಾತಾವರಣ. ಶಿಫಾರಸು ಮಾಡಿದ ಕೃಷಿ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಪಾಲಿಸಿ.',
        techniques: [
          'ಅತಿಯಾದ ಸಸಿಗಳನ್ನು ಕೀಳುವ ಮೂಲಕ ಸೂಕ್ತ ಅಂತರ ಕಾಯ್ದುಕೊಳ್ಳಿ',
          'ಶಿಫಾರಸು ಮಾಡಿದ ಪೋಷಕಾಂಶಗಳ ನಿರ್ವಹಣೆ',
          'ಸೀಡೆ ಮತ್ತು ಹೇನುಗಳ ಬಾಧೆಯನ್ನು ಗಮನಿಸಿ'
        ]
      }
    }
  },

  groundnut: {
    key: 'groundnut',
    name: 'Groundnut (Peanut)',
    name_kn: 'ಕಡಲೆಕಾಯಿ',
    category: 'Oilseeds',
    waterDemandCategory: 'Moderate',
    droughtResilience: 'Moderate-High',
    kc_mid: 1.15,
    criticalStages: 'Flowering, Pegging & Pod Development',
    criticalStages_kn: 'ಹೂವಾಡುವ, ಊಡ ಇಳಿಯುವ (Pegging) ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ',
    deficitThresholdMm: 30.0,
    excessThresholdMm: 130.0,
    deficitGuidance: {
      en: {
        action: 'Moisture deficit during pegging drastically reduces pod set. Give priority irrigation.',
        techniques: [
          'Ensure light protective irrigation especially at peg entry stage (35-50 DAS)',
          'Avoid hard soil crusting to facilitate smooth peg penetration',
          'Gypsum application (500 kg/ha) at pegging followed by light moisture',
          'Sprinkler irrigation preferred for uniform soil wetting'
        ]
      },
      kn: {
        action: 'ಊಡ ಇಳಿಯುವ ಹಂತದಲ್ಲಿ ತೇವಾಂಶ ಕೊರತೆಯಾದರೆ ಇಳುವರಿ ಗಣನೀಯವಾಗಿ ಕುಸಿಯುತ್ತದೆ. ಆದ್ಯತೆಯ ನೀರುಣಿಸಿ.',
        techniques: [
          'ಊಡ ಇಳಿಯುವ ಹಂತದಲ್ಲಿ (35-50 ದಿನಗಳು) ಲಘು ನೀರಾವರಿ ನೀಡಿ',
          'ಮಣ್ಣು ಗಟ್ಟಿಯಾಗದಂತೆ ಲಘು ಅಂತರ ಬೇಸಾಯ ಮಾಡಿ',
          'ಊಡ ಇಳಿಯುವಾಗ ಜಿಪ್ಸಂ (500 ಕೆಜಿ/ಹೆಕ್ಟೇರ್) ಬಳಸಿ',
          'ಏಕರೂಪದ ತೇವಾಂಶಕ್ಕಾಗಿ ತುಂತುರು ನೀರಾವರಿ ಬಳಸಿ'
        ]
      }
    },
    excessGuidance: {
      en: {
        action: 'Excess moisture promotes Tikka leaf spot and collar rot. Ensure rapid surface drainage.',
        techniques: [
          'Provide inter-row drainage channels to prevent peg decay',
          'Apply Mancozeb / Hexaconazole if Tikka leaf spot symptoms appear',
          'Do not walk on wet field to prevent soil compaction around pods'
        ]
      },
      kn: {
        action: 'ಹೆಚ್ಚುವರಿ ತೇವಾಂಶವು ತಿಕ್ಕಾ ಎಲೆಚುಕ್ಕೆ ಮತ್ತು ಕೊಳೆ ರೋಗಕ್ಕೆ ಕಾರಣವಾಗುತ್ತದೆ. ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.',
        techniques: [
          'ಊಡ ಮತ್ತು ಕಾಯಿ ಕೊಳೆಯದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು ತೆರೆಯಿರಿ',
          'ತಿಕ್ಕಾ ಎಲೆಚುಕ್ಕೆ ರೋಗ ಕಂಡುಬಂದರೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ',
          'ಮಣ್ಣು ಗಟ್ಟಿಯಾಗದಂತೆ ಒದ್ದೆ ಜಮೀನಿನಲ್ಲಿ ಅನಗತ್ಯ ಓಡಾಟ ತಪ್ಪಿಸಿ'
        ]
      }
    },
    optimalGuidance: {
      en: {
        action: 'Optimal pod formation environment. Keep field weed-free and monitor pod filling.',
        techniques: [
          'Avoid deep hoeing after peg initiation',
          'Monitor for spodoptera caterpillars and sucking pests',
          'Maintain loose soil bed around plant base'
        ]
      },
      kn: {
        action: 'ಕಾಯಿ ಕಟ್ಟಲು ಅತ್ಯಂತ ಸೂಕ್ತ ಪರಿಸ್ಥಿತಿ. ಕಳೆ ಮುಕ್ತವಾಗಿರಿಸಿ ಮತ್ತು ಕಾಯಿ ಬೆಳವಣಿಗೆ ಗಮನಿಸಿ.',
        techniques: [
          'ಊಡ ಇಳಿದ ನಂತರ ಆಳವಾದ ಅಂತರ ಬೇಸಾಯ ಮಾಡಬೇಡಿ',
          'ಎಲೆ ತಿನ್ನುವ ಹುಳುಗಳ ಬಾಧೆ ಗಮನಿಸಿ',
          'ಗಿಡದ ಬುಡದಲ್ಲಿ ಮಣ್ಣು ಸಡಿಲವಾಗಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ'
        ]
      }
    }
  },

  cotton: {
    key: 'cotton',
    name: 'Cotton',
    name_kn: 'ಹತ್ತಿ',
    category: 'Commercial',
    waterDemandCategory: 'Moderate-High',
    droughtResilience: 'Moderate',
    kc_mid: 1.15,
    criticalStages: 'Square Formation, Flowering & Boll Development',
    criticalStages_kn: 'ಮೊಗ್ಗು ಬಿಡುವ, ಹೂವಾಡುವ ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತ',
    deficitThresholdMm: 35.0,
    excessThresholdMm: 150.0,
    deficitGuidance: {
      en: {
        action: 'Water stress causes heavy flower and boll shedding. Provide protective irrigation immediately.',
        techniques: [
          'Alternate furrow irrigation to economize limited water',
          'Spray 2% DAP or 1% 19:19:19 to prevent premature square drop',
          'Apply synthetic mulch or crop residues along plant rows',
          'Drip irrigation scheduling for high water use efficiency'
        ]
      },
      kn: {
        action: 'ತೇವಾಂಶ ಕೊರತೆಯಿಂದ ಹೂ ಮತ್ತು ಕಾಯಿ ಉದುರುವಿಕೆ ಹೆಚ್ಚಾಗುತ್ತದೆ. ತಕ್ಷಣ ಸಂರಕ್ಷಿತ ನೀರಾವರಿ ನೀಡಿ.',
        techniques: [
          'ನೀರಿನ ಮಿತವ್ಯಯಕ್ಕಾಗಿ ಪರ್ಯಾಯ ಸಾಲು ನೀರಾವರಿ (Alternate Furrow) ಅನುಸರಿಸಿ',
          'ಹೂ ಮತ್ತು ಕಾಯಿ ಉದುರುವುದನ್ನು ತಡೆಯಲು 2% ಡಿಎಪಿ ಸಿಂಪಡಿಸಿ',
          'ಸಾಲುಗಳ ನಡುವೆ ಹೊದಿಕೆ ಹಾಕಿ ತೇವಾಂಶ ಕಾಪಾಡಿ',
          'ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಹಿತಮಿತವಾಗಿ ನೀರುಣಿಸಿ'
        ]
      }
    },
    excessGuidance: {
      en: {
        action: 'Cotton is extremely sensitive to root asphyxiation and parawilt in waterlogged soils. Immediate drainage mandatory.',
        techniques: [
          'Deep surface drainage trenches to drain sub-surface root zone',
          'Spray 1% Cobalt Chloride or 1% Urea to counter parawilt shock post-drainage',
          'Intensive scouting for sucking pest complexes (jassids, whiteflies) and bollworms'
        ]
      },
      kn: {
        action: 'ಹತ್ತಿಯು ನೀರು ನಿಲ್ಲುವುದರಿಂದ ಸೊರಗು ರೋಗಕ್ಕೆ (Parawilt) ತುತ್ತಾಗುತ್ತದೆ. ತಕ್ಷಣ ನೀರನ್ನು ಹೊರಹಾಕಿ.',
        techniques: [
          'ಬೇರುಗಳ ವಲಯದಿಂದ ನೀರು ಬಸಿದು ಹೋಗಲು ಆಳವಾದ ಬಸಿಗಾಲುವೆಗಳನ್ನು ತೋಡಿ',
          'ಸೊರಗು ರೋಗ ತಡೆಯಲು ನೀರು ಬಸಿದ ನಂತರ 1% ಯೂರಿಯಾ ಸಿಂಪಡಿಸಿ',
          'ರಸಹೀರುವ ಕೀಟಗಳು ಮತ್ತು ಕಾಯಿಕೊರೆಯುವ ಹುಳುಗಳ ಬಾಧೆ ಗಮನಿಸಿ'
        ]
      }
    },
    optimalGuidance: {
      en: {
        action: 'Favorable vegetative and reproductive conditions. Continue balanced IPM & INM schedule.',
        techniques: [
          'Nipping of terminal shoots at 80-90 days to encourage sympodial branches',
          'Install pheromone traps (5/acre) for bollworm monitoring',
          'Foliar spray of micronutrient mixture (zinc, boron)'
        ]
      },
      kn: {
        action: 'ಬೆಳವಣಿಗೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ವಾತಾವರಣ. ಸಮಗ್ರ ಕೀಟ ಮತ್ತು ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆ ಮುಂದುವರಿಸಿ.',
        techniques: [
          'ರೆಂಬೆಗಳ ಸಂಖ್ಯೆ ಹೆಚ್ಚಿಸಲು 80-90 ದಿನಗಳ ನಂತರ ತುದಿಯನ್ನು ಚಿವುಟಿ',
          'ಕಾಯಿಕೊರೆಯುವ ಹುಳುಗಳ ನಿಯಂತ್ರಣಕ್ಕೆ ಮೋಹಕ ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ',
          'ಲಘು ಪೋಷಕಾಂಶಗಳ (ಜಿಂಕ್, ಬೋರಾನ್) ಮಿಶ್ರಣವನ್ನು ಸಿಂಪಡಿಸಿ'
        ]
      }
    }
  }
};

/**
 * Evaluates the agricultural crop water status based on live prediction data
 * and crop-specific agronomic profiles.
 * 
 * @param {string} cropKey - Key of the crop ('ragi', 'maize', 'jowar', 'groundnut', 'cotton')
 * @param {object} predictionData - Live backend prediction object from apiService
 * @returns {object} Structured agricultural decision & water intelligence report
 */
export function evaluateCropWaterIntelligence(cropKey, predictionData) {
  const normalizedKey = (cropKey || 'ragi').toLowerCase().trim();
  const profile = CROP_WATER_PROFILES[normalizedKey] || CROP_WATER_PROFILES.ragi;

  const forecast14Day = Number(predictionData?.forecast14DayRainfall ?? predictionData?.forecast?.[`14_day_forecast_mm`] ?? 20);
  const monthlyPredicted = Number(predictionData?.predictedMonthlyRainfall ?? predictionData?.forecast?.predicted_monthly_rainfall_mm ?? 115);
  const deviationPct = Number(predictionData?.deviationPct ?? predictionData?.forecast?.deviation_pct ?? 0);
  const riskCategory = String(predictionData?.riskCategory ?? predictionData?.risk_assessment?.risk_category ?? 'NORMAL').toUpperCase();
  const drySpellWarning = Boolean(predictionData?.drySpellWarning ?? predictionData?.risk_assessment?.dry_spell_warning ?? false);

  let status = 'NORMAL_MOISTURE';
  let severity = 'MODERATE';
  let severity_kn = 'ಸಾಮಾನ್ಯ';
  let waterStatus = 'NORMAL MOISTURE';
  let waterStatus_kn = 'ಸಾಮಾನ್ಯ ತೇವಾಂಶ';
  let statusColor = 'emerald';
  let guidanceType = 'optimalGuidance';
  let waterNeedDescription = 'Normal Water';
  let waterNeedDescription_kn = 'ಸಾಮಾನ್ಯ ನೀರು ಸಾಕು';

  // Decision logic combining real backend metrics + crop-specific thresholds
  if (riskCategory === 'HIGH' || drySpellWarning || deviationPct < -30 || forecast14Day < profile.deficitThresholdMm) {
    status = 'WATER_DEFICIT';
    waterStatus = 'WATER DEFICIT';
    waterStatus_kn = 'ತೀವ್ರ ತೇವಾಂಶ ಕೊರತೆ';
    statusColor = 'rose';
    guidanceType = 'deficitGuidance';
    waterNeedDescription = 'More Water Needed (Supplemental Irrigation)';
    waterNeedDescription_kn = 'ಹೆಚ್ಚುವರಿ ನೀರು ಬೇಕು (ಪೂರಕ ನೀರಾವರಿ)';

    if (drySpellWarning || deviationPct < -45 || forecast14Day < (profile.deficitThresholdMm * 0.6)) {
      severity = 'CRITICAL';
      severity_kn = 'ಅತ್ಯಂತ ಗಂಭೀರ';
    } else {
      severity = 'HIGH';
      severity_kn = 'ಹೆಚ್ಚಿನ ಕೊರತೆ';
    }
  } else if (riskCategory === 'ABOVE_NORMAL' || deviationPct > 35 || forecast14Day > profile.excessThresholdMm) {
    status = 'EXCESS_WATER_RISK';
    waterStatus = 'EXCESS WATER RISK';
    waterStatus_kn = 'ಹೆಚ್ಚುವರಿ ನೀರು / ಜಲಾವೃತ ಅಪಾಯ';
    statusColor = 'blue';
    guidanceType = 'excessGuidance';
    waterNeedDescription = 'Less / No Additional Water (Drainage Needed)';
    waterNeedDescription_kn = 'ಹೆಚ್ಚುವರಿ ನೀರು ಬೇಡ (ಬಸಿಗಾಲುವೆ ಅಗತ್ಯ)';

    if (deviationPct > 60 || forecast14Day > (profile.excessThresholdMm * 1.3)) {
      severity = 'ELEVATED SURPLUS';
      severity_kn = 'ತೀವ್ರ ಹೆಚ್ಚುವರಿ';
    } else {
      severity = 'MODERATE SURPLUS';
      severity_kn = 'ಸಾಧಾರಣ ಹೆಚ್ಚುವರಿ';
    }
  } else {
    status = 'OPTIMAL_MOISTURE';
    waterStatus = 'OPTIMAL MOISTURE';
    waterStatus_kn = 'ಸೂಕ್ತ ಕಾಲೋಚಿತ ತೇವಾಂಶ';
    statusColor = 'emerald';
    guidanceType = 'optimalGuidance';
    severity = 'OPTIMAL';
    severity_kn = 'ಉತ್ತಮ ಸ್ಥಿತಿ';
    waterNeedDescription = 'Normal Water (Standard Sowing)';
    waterNeedDescription_kn = 'ಸಾಮಾನ್ಯ ತೇವಾಂಶ ನಿರ್ವಹಣೆ';
  }

  const enGuidance = profile[guidanceType].en;
  const knGuidance = profile[guidanceType].kn;

  return {
    cropKey: profile.key,
    cropName: profile.name,
    cropName_kn: profile.name_kn,
    category: profile.category,
    waterDemandCategory: profile.waterDemandCategory,
    droughtResilience: profile.droughtResilience,
    kc_mid: profile.kc_mid,
    criticalStages: profile.criticalStages,
    criticalStages_kn: profile.criticalStages_kn,
    status,
    waterStatus,
    waterStatus_kn,
    statusColor,
    severity,
    severity_kn,
    waterNeedDescription,
    waterNeedDescription_kn,
    forecast14DayMm: forecast14Day,
    monthlyPredictedMm: monthlyPredicted,
    deviationPct,
    riskCategory,
    drySpellWarning,
    recommendation: {
      action_en: enGuidance.action,
      action_kn: knGuidance.action,
      techniques_en: enGuidance.techniques,
      techniques_kn: knGuidance.techniques
    }
  };
}
