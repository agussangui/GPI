<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    
    export let idealBurndown: { date: string; points: number }[] = [];
    export let actualBurndown: { date: string; points: number }[] = [];
    export let dailyCompletedPoints: { date: string; points: number }[] = [];
    export let startDate: string;
    export let endDate: string;
    export let totalPoints: number;
    
    let chartElement: HTMLCanvasElement;
    let chart: Chart;
    
    function createChart() {
        if (!chartElement) return;
        
        const ctx = chartElement.getContext('2d');
        if (!ctx) return;
        
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: idealBurndown.map(item => item.date),
                datasets: [
                    {
                        label: 'Ideal Burndown',
                        data: idealBurndown.map(item => item.points),
                        borderColor: 'rgba(54, 162, 235, 0.8)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: false,
                        type: 'line'
                    },
                    {
                        label: 'Actual Burndown',
                        data: actualBurndown.map(item => item.points),
                        borderColor: 'rgba(255, 99, 132, 0.8)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        type: 'line'
                    },
                    {
                        label: 'Story Points / Day',
                        data: dailyCompletedPoints.map(item => item.points),
                        backgroundColor: 'rgba(255, 205, 0, 0.6)',
                        borderColor: 'rgba(255, 205, 0, 1)',
                        borderWidth: 2,
                        type: 'bar',
                        yAxisID: 'y1',
                        barPercentage: 0.4,
                        categoryPercentage: 0.8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Story Points Remaining'
                        },
                        suggestedMin: 0,
                        suggestedMax: totalPoints
                    },
                    y1: {
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Points Completed Per Day'
                        },
                        suggestedMin: 0,
                        suggestedMax: Math.max(...dailyCompletedPoints.map(item => item.points), 10),
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = Math.round(context.parsed.y * 10) / 10;

                                if (label === "Completed Tasks") {
                                    return `${label}: ${value} points`;
                                } else {
                                    return `${label}: ${value} points`;
                                }
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    $: if (idealBurndown && actualBurndown && dailyCompletedPoints && chartElement && chart) {
        chart.data.labels = idealBurndown.map(item => item.date);
        chart.data.datasets[0].data = idealBurndown.map(item => item.points);
        chart.data.datasets[1].data = actualBurndown.map(item => item.points);
        chart.data.datasets[2].data = dailyCompletedPoints.map(item => item.points);
        
        // Update y1 axis max value based on actual data
        const maxCompletedPoints = Math.max(...dailyCompletedPoints.map(item => item.points), 1);
        if (chart.options && chart.options.scales && chart.options.scales.y1) {
            chart.options.scales.y1.suggestedMax = maxCompletedPoints + (maxCompletedPoints * 0.2);
        }
        
        chart.update();
    }
    
    onMount(() => {
        createChart();
    });
    
    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });
</script>

<h3 class="text-lg font-semibold mb-4">Burndown Chart</h3>
<div class="chart-container" style="position: relative; height: 400px; width: 100%;">
    <canvas bind:this={chartElement}></canvas>
</div>