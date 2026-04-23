/**
 * Simple Linear Regression Model
 * Trains on Year vs Total Crimes and predicts future years.
 */

export const predictFutureCrimes = (historicalData) => {
    if (!historicalData || historicalData.length < 2) return [];

    // Simple Linear Regression: y = mx + c
    // historicalData = [{ year: 2001, crimes: 1000 }, ...]
    
    const n = historicalData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    historicalData.forEach(point => {
        const x = parseInt(point.year);
        const y = point.crimes;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict for 10 years (2022-2031) based on last year in data (2021)
    const lastYear = parseInt(historicalData[historicalData.length - 1].year);
    const predictions = [];

    for (let i = 1; i <= 10; i++) {
        const year = lastYear + i;
        const predictedValue = Math.round(slope * year + intercept);
        predictions.push({
            year: year.toString(),
            predicted: predictedValue > 0 ? predictedValue : 0
        });
    }

    return predictions;

};

export const getPredictionChartData = (historicalData, predictions) => {
    // Combine historical and predicted data for a single line chart
    const combined = historicalData.map(d => ({
        name: d.year.toString(),
        actual: d.crimes,
        predicted: d.crimes // Show actual as base for prediction line
    }));

    predictions.forEach(p => {
        combined.push({
            name: p.year,
            predicted: p.predicted
        });
    });

    return combined;
};
