import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    dashboardOverview: "Monsoon & Crop Dashboard",
    cropAdvisoryGuidance: "Crop Water Advisory",
    farmerOutlook: "Farmer Farm Advisory",
    farmerAdvisory: "Farmer Extension Outlook",
    officerTelemetry: "Extension Officer Telemetry",
    karnatakaRiskMap: "Karnataka Risk Map",
    scenarioSimulator: "Scenario Simulator",
    modelSpecification: "Model Specification",
    predictionHistory: "Prediction History",
    systemStatus: "System Status",
    
    // Top Bar
    brandTitle: "Karnataka Hyperlocal Monsoon AI",
    brandSubtitle: "SIH2026 • UAS-B & C-DAC Aligned",
    searchLocation: "Search District or Taluk...",
    downloadReport: "Download Report",
    locationTarget: "District Centroid",
    
    // Common
    selectDistrict: "Select District",
    selectCrop: "Select Crop",
    refresh: "Refresh",
    highRisk: "HIGH RISK",
    moderateRisk: "MODERATE RISK",
    normalRisk: "OPTIMAL",
    surplusRisk: "SURPLUS",
    expectedRainfall: "Expected Rainfall",
    normalBaseline: "Normal Baseline",
    deviation: "Deviation from Normal",
    advisoryHeader: "AI Agronomic Advisory (Model Inference)",
    extensionGuidance: "Standard Extension Best Practices",
    previewNotice: "Preview Only — Automated Gateway Pending Live Deployment",
    
    // Risk Categories
    highDeficitTitle: "High Chance of Dry Spell / Severe Moisture Deficit",
    highDeficitSub: "Rainfall is predicted to be significantly below normal. Protect standing crops and plan supplemental irrigation.",
    moderateDeficitTitle: "Moderate Moisture Stress Expected",
    moderateDeficitSub: "Intermittent dry periods expected. Sowing can proceed with drought-hardy seed varieties.",
    optimalTitle: "Optimal Seasonal Soil Moisture",
    optimalSub: "Normal seasonal rainfall expected. Favorable conditions for standard crop management.",
    surplusTitle: "Surplus Rainfall / Good Moisture Availability",
    surplusSub: "Abundant rainfall expected. Ensure field drainage channels are clear to prevent waterlogging.",
    
    // Map
    gisTitle: "Interactive Meteorological GIS Viewer",
    gisHeader: "Karnataka Regional Monsoon Risk Map",
    gisSub: "Live parallel inference across all 18 Karnataka meteorological centroids (Lat/Lon via karnataka_merged_data.csv).",
    filterAll: "All Districts",
    filterHigh: "High Deficit",
    filterModerate: "Moderate",
    filterNormal: "Normal",
    filterSurplus: "Surplus",
    districtCentroidNote: "District-Level Centroids (Taluk/Village Grid planned for Phase 4)",
    districtTelemetry: "District Telemetry",
    
    // Officer
    officerHeader: "Extension Officer Agronomic Command & Telemetry",
    officerTitle: "Multi-Model Ensemble & Water Balance Intelligence",
    officerSub: "NOAA GFS + DWD ICON + ECMWF IFS synthesis, FAO-56 Penman-Monteith crop water balance, and SQLite audit logs.",
    copyBulletin: "Copy Bulletin",
    copiedBulletin: "Copied Bulletin!",
    ensembleSpread: "Multi-Model Meteorological Ensemble (16-Day Forecast)",
    faoWaterBalance: "FAO-56 Water Balance",
    broadcastPreview: "Broadcast Bulletin Composer (Preview / Staging)",
    auditTrail: "Logged Prediction Audit Trail (SQLite: monsoon_predictions.db)",
    
    // Simulator
    simLab: "Officer & Research Laboratory",
    simTitle: "Advanced Climate Scenario Simulator",
    simSub: "Evaluate hypothetical teleconnection permutations across all 7 model input features.",
    simSafeBadge: "In-Memory Inference (Does not pollute SQLite production logs)",
    simFeatures: "7 Standardized Model Features",
    simRunCTA: "Run Scenario Inference",
    simDiagnostics: "Simulation Diagnostics"
  },
  kn: {
    // Navigation
    dashboardOverview: "ಮಾನ್ಸೂನ್ ಮತ್ತು ಕೃಷಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    cropAdvisoryGuidance: "ಬೆಳೆ ನೀರಿನ ಸಲಹಾ ಕೇಂದ್ರ",
    farmerOutlook: "ರೈತರ ಕೃಷಿ ಸಲಹಾ ಕೇಂದ್ರ",
    farmerAdvisory: "ರೈತರ ಕೃಷಿ ವಿಸ್ತರಣಾ ನೋಟ",
    officerTelemetry: "ಕೃಷಿ ಅಧಿಕಾರಿ ನಿಯಂತ್ರಣ ಕೊಠಡಿ",
    karnatakaRiskMap: "ಕರ್ನಾಟಕ ಮಳೆ ಅಪಾಯ ನಕ್ಷೆ",
    scenarioSimulator: "ಹವಾಮಾನ ಸಿಮ್ಯುಲೇಟರ್",
    modelSpecification: "ಮಾದರಿ ತಾಂತ್ರಿಕ ವಿವರಣೆ",
    predictionHistory: "ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ",
    systemStatus: "ವ್ಯವಸ್ಥೆಯ ಸ್ಥಿತಿ",
    
    // Top Bar
    brandTitle: "ಕರ್ನಾಟಕ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕೃಷಿ ಸಲಹೆ",
    brandSubtitle: "ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ 2026",
    searchLocation: "ಜಿಲ್ಲೆ ಅಥವಾ ತಾಲೂಕು ಹುಡುಕಿ...",
    downloadReport: "ವರದಿ ಡೌನ್‌ಲೋಡ್",
    locationTarget: "ಜಿಲ್ಲಾ ಕೇಂದ್ರ",
    
    // Common
    selectDistrict: "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
    selectCrop: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ",
    refresh: "ನವೀಕರಿಸಿ",
    highRisk: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    moderateRisk: "ಮಧ್ಯಮ ಅಪಾಯ",
    normalRisk: "ಸಾಮಾನ್ಯ / ಸೂಕ್ತ",
    surplusRisk: "ಹೆಚ್ಚುವರಿ ಮಳೆ",
    expectedRainfall: "ನಿರೀಕ್ಷಿತ ಮಳೆ",
    normalBaseline: "ಸಾಮಾನ್ಯ ಸರಾಸರಿ",
    deviation: "ವಾಡಿಕೆಗಿಂತ ವ್ಯತ್ಯಾಸ",
    advisoryHeader: "ಮಾದರಿ ಆಧಾರಿತ ಕೃಷಿ ಸಲಹೆ (AI ಶಿಫಾರಸು)",
    extensionGuidance: "ಸಾಮಾನ್ಯ ಕೃಷಿ ವಿಸ್ತರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು",
    previewNotice: "ಮುನ್ನೋಟ ಮಾತ್ರ — ಸ್ವಯಂಚಾಲಿತ ಸಂದೇಶ ಗೇಟ್‌ವೇ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯ",
    
    // Risk Categories
    highDeficitTitle: "ತೀವ್ರ ತೇವಾಂಶ ಕೊರತೆ / ಒಣ ಹವೆಯ ಅಪಾಯ",
    highDeficitSub: "ಮಳೆಯು ವಾಡಿಕೆಗಿಂತ ಗಣನೀಯವಾಗಿ ಕಡಿಮೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದೆ. ಬೆಳೆಗಳಿಗೆ ತೇವಾಂಶ ಸಂರಕ್ಷಣಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.",
    moderateDeficitTitle: "ಮಧ್ಯಮ ತೇವಾಂಶ ಕೊರತೆಯ ಸಾಧ್ಯತೆ",
    moderateDeficitSub: "ಮಧ್ಯಂತರ ಒಣ ಅವಧಿಗಳು ಸಂಭವಿಸಬಹುದು. ಬರ ನಿರೋಧಕ ಬೀಜೋಪಚಾರದೊಂದಿಗೆ ಬಿತ್ತನೆ ಮುಂದುವರಿಸಿ.",
    optimalTitle: "ಸೂಕ್ತ ಕಾಲೋಚಿತ ತೇವಾಂಶ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
    optimalSub: "ವಾಡಿಕೆಯ ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದೆ. ಸಾಮಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಪರಿಸ್ಥಿತಿ.",
    surplusTitle: "ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಮಳೆ / ಸಮೃದ್ಧ ತೇವಾಂಶ",
    surplusSub: "ಸಾಕಷ್ಟು ಮಳೆಯಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ಕಾಲುವೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
    
    // Map
    gisTitle: "ಕರ್ನಾಟಕ ಉಪಗ್ರಹ ಆಧಾರಿತ ಹವಾಮಾನ ನಕ್ಷೆ",
    gisHeader: "ಕರ್ನಾಟಕ ಪ್ರಾದೇಶಿಕ ಮಾನ್ಸೂನ್ ಅಪಾಯ ನಕ್ಷೆ",
    gisSub: "18 ಕರ್ನಾಟಕ ಜಿಲ್ಲಾ ಹವಾಮಾನ ಕೇಂದ್ರಗಳ ನೇರ ಸಮೀಕ್ಷೆ (karnataka_merged_data.csv).",
    filterAll: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
    filterHigh: "ತೀವ್ರ ಕೊರತೆ",
    filterModerate: "ಮಧ್ಯಮ ಕೊರತೆ",
    filterNormal: "ವಾಡಿಕೆ ಮಳೆ",
    filterSurplus: "ಹೆಚ್ಚುವರಿ ಮಳೆ",
    districtCentroidNote: "ಜಿಲ್ಲಾ ಮಟ್ಟದ ಕೇಂದ್ರಗಳು (ತಾಲೂಕು/ಗ್ರಾಮ ಮಟ್ಟದ ಗ್ರಿಡ್ ಹಂತ 4 ರಲ್ಲಿ ಲಭ್ಯ)",
    districtTelemetry: "ಜಿಲ್ಲಾ ಹವಾಮಾನ ಮಾಹಿತಿ",
    
    // Officer
    officerHeader: "ಕೃಷಿ ವಿಸ್ತರಣಾ ಅಧಿಕಾರಿಗಳ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ",
    officerTitle: "ಬಹು-ಮಾದರಿ ಸಮನ್ವಯ ಮತ್ತು ಬೆಳೆ ನೀರಿನ ಸಮತೋಲನ",
    officerSub: "NOAA GFS + DWD ICON + ECMWF IFS ಸಮನ್ವಯ, FAO-56 ಬೆಳೆ ನೀರು ನಿರ್ವಹಣೆ, ಮತ್ತು SQLite ಇತಿಹಾಸ ದಾಖಲೆಗಳು.",
    copyBulletin: "ಸಲಹಾ ಸಂದೇಶ ನಕಲಿಸಿ",
    copiedBulletin: "ಸಂದೇಶ ನಕಲಿಸಲಾಗಿದೆ!",
    ensembleSpread: "ಹವಾಮಾನ ಮಾದರಿಗಳ 16-ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
    faoWaterBalance: "FAO-56 ಬೆಳೆ ನೀರಿನ ಸಮತೋಲನ",
    broadcastPreview: "ರೈತರಿಗೆ ಪ್ರಸಾರ ಮಾಡುವ ಸಂದೇಶ ಮುನ್ನೋಟ",
    auditTrail: "ದಾಖಲಾದ ಮುನ್ಸೂಚನೆಗಳ ಇತಿಹಾಸ (SQLite)",
    
    // Simulator
    simLab: "ಸಂಶೋಧನಾ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ವಿಭಾಗ",
    simTitle: "ಸುಧಾರಿತ ಹವಾಮಾನ ಮುನ್ಸೂಚನಾ ಸಿಮ್ಯುಲೇಟರ್",
    simSub: "7 ಹವಾಮಾನ ಸೂಚಿಗಳನ್ನು ಬದಲಾಯಿಸಿ ಮುನ್ಸೂಚನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    simSafeBadge: "ಪ್ರಾಯೋಗಿಕ ಗಣನೆ (ಇತಿಹಾಸದ ದತ್ತಾಂಶಕ್ಕೆ ಯಾವುದೇ ಧಕ್ಕೆ ಇಲ್ಲ)",
    simFeatures: "7 ಪ್ರಮಾಣಿತ ಹವಾಮಾನ ನಿಯತಾಂಕಗಳು",
    simRunCTA: "ಹವಾಮಾನ ಗಣನೆ ಪ್ರಾರಂಭಿಸಿ",
    simDiagnostics: "ಸಿಮ್ಯುಲೇಶನ್ ಫಲಿತಾಂಶಗಳು"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('weather_index_lang');
    return saved || 'kn'; // Default to Kannada
  });

  useEffect(() => {
    localStorage.setItem('weather_index_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'kn' ? 'en' : 'kn'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
