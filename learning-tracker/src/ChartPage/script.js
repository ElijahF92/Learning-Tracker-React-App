let charts = {};

// Function to parse CSV data
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const values = lines[i].split(',');
        data.push({
            semester: values[0],
            test: values[1],
            standard: values[2],
            grade: values[3]
        });
    }
    return data;
}

// Function to get unique standards from data
function getUniqueStandards(data) {
    return [...new Set(data.map(row => row.standard))];
}

// Function to create the chart
function createChart(data, standard, canvasElement) {
    const filteredData = data.filter(row => row.standard === standard);
    const xValues = filteredData.map(row => row.test);
    const yValues = filteredData.map(row => {
        switch(row.grade.trim()) {
            case 'IE': return null;
            case 'Em': return 1;
            case 'De': return 2;
            case 'Ex': return 3;
            case 'Ed': return 4;
            default: return 0;
        }
    });

    const yLabels = {
        0.5: ' ',
        1: 'Em',
        2: 'De',
        3: 'Ex',
        4: 'Ed',
        4.5: ' '
    };

    const pointColors = {
        0: '#ffffff',
        1: '#f4ccccff',
        2: '#fce5cdff',
        3: '#d9ead3ff',
        4: '#cfe2f3ff'
    };

    const pointBackgroundColors = yValues.map(value => pointColors[value] || '#000000');

    const chart = new Chart(canvasElement, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues,
                pointBackgroundColor: pointBackgroundColors,
                pointBorderColor: '#000000',
                pointBorderWidth: 1,
                pointRadius: 6,
                spanGaps: true // Allow the line to span over null values
            }]
        },
        options: {
            legend: {display: false},
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return yLabels[tooltipItem.yLabel] || tooltipItem.yLabel;
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0.5,
                        max: 4.5,
                        stepSize: 1,
                        callback: function(value) {
                            return yLabels[value] || value;
                        }
                    }
                }]
            },
            maintainAspectRatio: false
        }
    });
    
    charts[standard] = chart;
}

// Event listeners
document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        const data = parseCSV(csvData);
        const standards = getUniqueStandards(data);
        
        // Clear existing charts
        Object.values(charts).forEach(chart => chart.destroy());
        charts = {};
        
        // Create charts grid
        const chartsGrid = document.getElementById('chartsGrid');
        chartsGrid.innerHTML = '';
        chartsGrid.className = 'charts-grid';
        
        // Create a chart for each standard
        standards.forEach(standard => {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            
            const title = document.createElement('h3');
            title.textContent = standard;
            chartContainer.appendChild(title);
            
            const canvas = document.createElement('canvas');
            canvas.style.height = '300px';
            chartContainer.appendChild(canvas);
            
            chartsGrid.appendChild(chartContainer);
            
            createChart(data, standard, canvas);
        });
    };
    
    reader.readAsText(file);
});