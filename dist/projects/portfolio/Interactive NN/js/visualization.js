// Visualization Functions for Training Progress

class TrainingVisualization {
    constructor() {
        this.accuracyChart = null;
        this.lossChart = null;
        this.chartColors = {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#f59e0b',
            danger: '#ef4444'
        };
    }

    // Initialize charts
    initializeCharts() {
        this.createAccuracyChart();
        this.createLossChart();
    }

    // Create accuracy chart
    createAccuracyChart() {
        const ctx = document.getElementById('accuracyChart');
        if (!ctx) return;

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        this.accuracyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Validation Accuracy',
                    data: [],
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Training Accuracy',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Accuracy'
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Create loss chart
    createLossChart() {
        const ctx = document.getElementById('lossChart');
        if (!ctx) return;

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        this.lossChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Validation Loss',
                    data: [],
                    borderColor: this.chartColors.danger,
                    backgroundColor: this.chartColors.danger + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Training Loss',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Loss'
                        },
                        min: 0,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Update accuracy chart
    updateAccuracyChart(epoch, accuracy) {
        if (!this.accuracyChart) return;

        this.accuracyChart.data.labels.push(epoch);
        this.accuracyChart.data.datasets[0].data.push(accuracy);
        
        // Keep only last 50 data points for performance
        if (this.accuracyChart.data.labels.length > 50) {
            this.accuracyChart.data.labels.shift();
            this.accuracyChart.data.datasets[0].data.shift();
        }

        this.accuracyChart.update('none');
    }

    // Update loss chart
    updateLossChart(epoch, loss) {
        if (!this.lossChart) return;

        this.lossChart.data.labels.push(epoch);
        this.lossChart.data.datasets[0].data.push(loss);
        
        // Keep only last 50 data points for performance
        if (this.lossChart.data.labels.length > 50) {
            this.lossChart.data.labels.shift();
            this.lossChart.data.datasets[0].data.shift();
        }

        this.lossChart.update('none');
    }

    // Update both charts
    updateCharts(epoch, accuracy, loss) {
        this.updateAccuracyChart(epoch, accuracy);
        this.updateLossChart(epoch, loss);
    }

    // Clear all charts
    clearCharts() {
        if (this.accuracyChart) {
            this.accuracyChart.data.labels = [];
            this.accuracyChart.data.datasets[0].data = [];
            this.accuracyChart.update();
        }

        if (this.lossChart) {
            this.lossChart.data.labels = [];
            this.lossChart.data.datasets[0].data = [];
            this.lossChart.update();
        }
    }

    // Reset charts to initial state
    resetCharts() {
        this.clearCharts();
    }

    // Create a simple bar chart for prediction confidence
    createPredictionChart(predictions) {
        // This could be used to show confidence for all digits
        const ctx = document.createElement('canvas');
        ctx.width = 300;
        ctx.height = 200;

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                datasets: [{
                    label: 'Confidence',
                    data: predictions,
                    backgroundColor: predictions.map((val, index) => {
                        const maxIndex = predictions.indexOf(Math.max(...predictions));
                        return index === maxIndex ? this.chartColors.primary : this.chartColors.primary + '40';
                    }),
                    borderColor: this.chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Prediction Confidence',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        }
                    }
                }
            }
        });

        return chart;
    }

    // Create a visualization of the neural network architecture
    createNetworkVisualization() {
        // This could be implemented to show the network structure
        console.log('Network visualization not yet implemented');
    }

    // Export chart data
    exportChartData() {
        if (!this.accuracyChart || !this.lossChart) {
            return null;
        }

        return {
            accuracy: {
                labels: this.accuracyChart.data.labels,
                data: this.accuracyChart.data.datasets[0].data
            },
            loss: {
                labels: this.lossChart.data.labels,
                data: this.lossChart.data.datasets[0].data
            }
        };
    }

    // Destroy charts and clean up
    destroy() {
        if (this.accuracyChart) {
            this.accuracyChart.destroy();
            this.accuracyChart = null;
        }

        if (this.lossChart) {
            this.lossChart.destroy();
            this.lossChart = null;
        }
    }
}

// Export for use in other modules
window.TrainingVisualization = TrainingVisualization;
