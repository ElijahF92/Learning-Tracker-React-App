import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ChartPage/styles.css';

const ChartComponent = ({ assignmentData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!assignmentData || assignmentData.length === 0 || !chartRef.current) {
      return;
    }

    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get all learning targets
    const firstAssignment = assignmentData[0];
    if (!firstAssignment || !firstAssignment.categories) {
      console.error("Assignment data doesn't have the expected structure");
      return;
    }
    
    const learningTargets = Object.keys(firstAssignment.categories);
    if (learningTargets.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Prepare the data in the correct format
    const labels = assignmentData.map(assignment => assignment.name);
    
    // Generate a color palette for different learning targets
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 159, 64)',
      'rgb(153, 102, 255)',
      'rgb(255, 205, 86)',
      'rgb(201, 203, 207)'
    ];
    
    const datasets = learningTargets.map((target, index) => {
      // Make sure we map the data correctly and check for missing values
      const data = assignmentData.map(assignment => {
        const gradeValue = assignment.categories[target];
        return convertGradeToNumber(gradeValue);
      });
      
      return {
        label: target,
        data: data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.1,
        fill: false
      };
    });

    // Create the new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 4.5,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (value === 0) return 'IE';
                if (value === 1) return 'Em';
                if (value === 2) return 'De';
                if (value === 3) return 'Ex';
                if (value === 4) return 'Ed';
                return '';
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10
          }
        }
      }
    });
    
    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [assignmentData]);

  // Convert grade values to numerical form for the chart
  const convertGradeToNumber = (grade) => {
    if (!grade) return 0;
    
    switch(grade) {
      case 'Ed': return 4;
      case 'Ex': return 3;
      case 'De': return 2;
      case 'Em': return 1;
      case 'IE': return 0;
      default: return 0;
    }
  };

  return (
    <div className="chart-wrapper">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
