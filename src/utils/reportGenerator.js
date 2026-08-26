export function generateClimateReport(location = {}, crop = {}, predictionData = null) {
  const districtName = location.district || location.name || 'Bengaluru Rural';
  const cropName = crop.name || crop.key || 'Ragi';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const predRain = predictionData?.predictedMonthlyRainfall ?? predictionData?.forecast?.predicted_monthly_rainfall_mm ?? 116.5;
  const baselineRain = predictionData?.historicalBaseline ?? predictionData?.forecast?.historical_baseline_mm ?? 120.5;
  const deviation = predictionData?.deviationPct ?? predictionData?.forecast?.deviation_pct ?? -3.3;
  const riskCategory = predictionData?.riskCategory ?? predictionData?.risk_assessment?.risk_category ?? 'NORMAL';
  const advisoryEn = predictionData?.advisory?.english ?? predictionData?.agronomic_advisory?.advisory_en ?? 'Standard agricultural practices recommended.';
  const advisoryKn = predictionData?.advisory?.kannada ?? predictionData?.agronomic_advisory?.advisory_kn ?? 'samanya bittane.';

  const reportText = 'WEATHER INDEX CLIMATE ADVISORY REPORT\n' +
    'Target District: ' + districtName + '\n' +
    'Target Crop: ' + cropName + '\n' +
    'Predicted Monthly Rainfall: ' + Number(predRain).toFixed(1) + ' mm\n' +
    'Historical Baseline: ' + Number(baselineRain).toFixed(1) + ' mm\n' +
    'Deviation: ' + Number(deviation).toFixed(1) + '%\n' +
    'Risk Category: ' + riskCategory + '\n' +
    'Advisory (EN): ' + advisoryEn + '\n' +
    'Advisory (KN): ' + advisoryKn + '\n';

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'WeatherIndex_Report_' + districtName.replace(/\s+/g, '_') + '_' + Date.now() + '.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
