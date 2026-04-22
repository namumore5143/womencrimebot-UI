/**
 * Data Loader Utility
 * Parses CrimesOnWomenData.csv and provides processed data for the dashboard.
 */

export const loadCrimeData = async () => {
    try {
        const response = await fetch('/CrimesOnWomenData.csv');
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, i) => {
                const val = values[i];
                obj[header.trim()] = isNaN(val) ? val.trim() : parseFloat(val);
            });
            // Total Crimes calculation
            obj.Total = (obj.Rape || 0) + (obj['K&A'] || 0) + (obj.DD || 0) + (obj.AoW || 0) + (obj.AoM || 0) + (obj.DV || 0) + (obj.WT || 0);
            return obj;
        });

        return data;
    } catch (error) {
        console.error("Error loading crime data:", error);
        return [];
    }
};

export const getDashboardStats = (data) => {
    if (!data.length) return null;

    const totalCases = data.reduce((sum, item) => sum + item.Total, 0);
    
    // Year-wise trends
    const yearlyMap = {};
    data.forEach(item => {
        yearlyMap[item.Year] = (yearlyMap[item.Year] || 0) + item.Total;
    });
    const trendData = Object.keys(yearlyMap).sort().map(year => ({
        year,
        crimes: yearlyMap[year]
    }));

    // State-wise totals (Top 10)
    const stateMap = {};
    data.forEach(item => {
        stateMap[item.State] = (stateMap[item.State] || 0) + item.Total;
    });
    const topStates = Object.keys(stateMap)
        .map(state => ({ name: state, count: stateMap[state] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Crime type distribution (Total)
    const crimeTypes = [
        { name: 'Rape', value: data.reduce((sum, item) => sum + (item.Rape || 0), 0) },
        { name: 'Kidnapping', value: data.reduce((sum, item) => sum + (item['K&A'] || 0), 0) },
        { name: 'Dowry Death', value: data.reduce((sum, item) => sum + (item.DD || 0), 0) },
        { name: 'Assault on Women', value: data.reduce((sum, item) => sum + (item.AoW || 0), 0) },
        { name: 'Modesty Assault', value: data.reduce((sum, item) => sum + (item.AoM || 0), 0) },
        { name: 'Domestic Violence', value: data.reduce((sum, item) => sum + (item.DV || 0), 0) },
        { name: 'Trafficking', value: data.reduce((sum, item) => sum + (item.WT || 0), 0) },
    ];

    return {
        totalCases,
        trendData,
        topStates,
        crimeTypes
    };
};

export const getStateAnalysisData = (data, stateName) => {
    const filtered = data.filter(item => item.State === stateName);
    if (!filtered.length) return null;

    const trend = filtered.sort((a, b) => a.Year - b.Year).map(item => ({
        year: item.Year.toString(),
        count: item.Total
    }));

    const latest = filtered[filtered.length - 1];
    const categories = [
        { name: 'Domestic Violence', value: latest.DV || 0 },
        { name: 'Kidnapping', value: latest['K&A'] || 0 },
        { name: 'Rape', value: latest.Rape || 0 },
        { name: 'Assault', value: (latest.AoW || 0) + (latest.AoM || 0) },
        { name: 'Other', value: (latest.DD || 0) + (latest.WT || 0) },
    ];

    return {
        total: filtered.reduce((sum, item) => sum + item.Total, 0),
        trend,
        categories,
        latestYear: latest.Year
    };
};
