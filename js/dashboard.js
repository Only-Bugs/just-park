// Melbourne Parking Dashboard - Professional Data Visualization
class MelbourneParkingDashboard {
    constructor() {
        // API配置 - 部署后需要更新为实际的API Gateway URL
        this.apiBaseUrl = 'https://your-api-gateway-url.amazonaws.com/prod';
        this.charts = {};
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Melbourne Parking Dashboard...');
        try {
            await this.loadData();
            this.hideLoading();
            this.showSuccess();
            this.showDashboard();
        } catch (error) {
            console.warn('API unavailable, using sample data:', error);
            this.loadSampleData();
            this.hideLoading();
            this.showError();
            this.showDashboard();
        }
    }

    async loadData() {
        console.log('📡 Attempting to load data from AWS RDS...');
        
        // 尝试从API加载数据
        const [restrictionsData, statsData] = await Promise.all([
            this.fetchData('/restrictions'),
            this.fetchData('/stats')
        ]);

        this.restrictionsData = restrictionsData;
        this.statsData = statsData;

        console.log('✅ Data loaded from AWS RDS successfully');
        this.updateStats();
        this.createCharts();
    }

    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    loadSampleData() {
        console.log('📊 Loading sample data for demonstration...');
        
        // 基于你的实际CSV数据的示例
        this.restrictionsData = [
            {zone_id: 7002, days: 'Sat', start_time: '7:30:00', end_time: '12:30:00', rule: '4P'},
            {zone_id: 7028, days: 'Mon-Fri', start_time: '7:30:00', end_time: '18:30:00', rule: '1P'},
            {zone_id: 7041, days: 'Mon-Fri', start_time: '7:30:00', end_time: '18:30:00', rule: '2P'},
            {zone_id: 7041, days: 'Sat', start_time: '7:30:00', end_time: '12:30:00', rule: '2P'},
            {zone_id: 7030, days: 'Mon-Fri', start_time: '7:30:00', end_time: '18:30:00', rule: '1P'},
            {zone_id: 7141, days: 'Mon-Fri', start_time: '19:00:00', end_time: '22:00:00', rule: 'MP2P'},
            {zone_id: 7145, days: 'Mon-Fri', start_time: '7:30:00', end_time: '18:30:00', rule: 'PP'},
            {zone_id: 7178, days: 'Mon-Sat', start_time: '7:30:00', end_time: '18:30:00', rule: '2P'},
            {zone_id: 7188, days: 'Mon-Sat', start_time: '7:30:00', end_time: '18:30:00', rule: '2P'},
            {zone_id: 7189, days: 'Mon-Fri', start_time: '7:00:00', end_time: '19:00:00', rule: 'MP2P'},
            {zone_id: 7240, days: 'Mon-Fri', start_time: '7:30:00', end_time: '19:30:00', rule: '2P'},
            {zone_id: 7244, days: 'Mon-Fri', start_time: '7:30:00', end_time: '16:00:00', rule: '2P'},
            {zone_id: 7248, days: 'Mon-Fri', start_time: '7:30:00', end_time: '18:30:00', rule: '2P'},
            {zone_id: 7301, days: 'Mon-Sat', start_time: '7:30:00', end_time: '18:30:00', rule: '2P'},
            {zone_id: 7302, days: 'Mon-Sun', start_time: '7:30:00', end_time: '23:00:00', rule: '2P'},
            {zone_id: 7317, days: 'Sat-Sun', start_time: '7:00:00', end_time: '22:00:00', rule: 'MP4P'},
            {zone_id: 7318, days: 'Mon-Fri', start_time: '19:00:00', end_time: '22:00:00', rule: 'MP4P'},
            {zone_id: 7311, days: 'Sat-Sun', start_time: '7:00:00', end_time: '22:00:00', rule: 'MP2P'},
            {zone_id: 7320, days: 'Mon-Fri', start_time: '7:00:00', end_time: '19:00:00', rule: 'MP2P'}
        ];

        this.statsData = {
            totalZones: 259,
            totalRestrictions: 1247,
            lastUpdated: new Date().toLocaleDateString('en-AU')
        };

        this.updateStats();
        this.createCharts();
    }

    updateStats() {
        document.getElementById('totalZones').textContent = this.statsData.totalZones || 'N/A';
        document.getElementById('totalRestrictions').textContent = this.statsData.totalRestrictions || 'N/A';
        document.getElementById('lastUpdated').textContent = this.statsData.lastUpdated || 'N/A';
    }

    createCharts() {
        console.log('📈 Creating data visualizations...');
        this.createRulesChart();
        this.createTimeChart();
        this.createDaysChart();
        this.createZonesChart();
        console.log('✅ All charts created successfully');
    }

    createRulesChart() {
        const ctx = document.getElementById('rulesChart').getContext('2d');
        
        // 统计规则类型
        const ruleCounts = {};
        this.restrictionsData.forEach(item => {
            ruleCounts[item.rule] = (ruleCounts[item.rule] || 0) + 1;
        });

        // 规则说明
        const ruleLabels = Object.keys(ruleCounts).map(rule => {
            const descriptions = {
                '1P': '1P (1 Hour)',
                '2P': '2P (2 Hours)', 
                '4P': '4P (4 Hours)',
                'MP2P': 'MP2P (Meter 2H)',
                'MP4P': 'MP4P (Meter 4H)',
                'PP': 'PP (Permit Only)'
            };
            return descriptions[rule] || rule;
        });

        this.charts.rules = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ruleLabels,
                datasets: [{
                    data: Object.values(ruleCounts),
                    backgroundColor: [
                        '#0891b2', // Teal
                        '#06b6d4', // Light teal
                        '#10b981', // Green
                        '#f59e0b', // Amber
                        '#ef4444', // Red
                        '#8b5cf6', // Purple
                        '#ec4899'  // Pink
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createTimeChart() {
        const ctx = document.getElementById('timeChart').getContext('2d');
        
        // 统计开始时间
        const timeSlots = {};
        this.restrictionsData.forEach(item => {
            const hour = item.start_time.split(':')[0];
            const timeLabel = `${hour}:00`;
            timeSlots[timeLabel] = (timeSlots[timeLabel] || 0) + 1;
        });

        // 按时间排序
        const sortedTimes = Object.keys(timeSlots).sort();
        const sortedCounts = sortedTimes.map(time => timeSlots[time]);

        this.charts.time = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedTimes,
                datasets: [{
                    label: 'Number of Restrictions',
                    data: sortedCounts,
                    backgroundColor: '#0891b2',
                    borderColor: '#0891b2',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Start Time: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} restrictions start at this time`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Restrictions'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Start Time'
                        }
                    }
                }
            }
        });
    }

    createDaysChart() {
        const ctx = document.getElementById('daysChart').getContext('2d');
        
        // 统计天数模式
        const dayPatterns = {};
        this.restrictionsData.forEach(item => {
            dayPatterns[item.days] = (dayPatterns[item.days] || 0) + 1;
        });

        // 按频率排序
        const sortedPatterns = Object.entries(dayPatterns)
            .sort(([,a], [,b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        this.charts.days = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(sortedPatterns),
                datasets: [{
                    label: 'Frequency',
                    data: Object.values(sortedPatterns),
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', // 水平条形图
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.x} zones have restrictions on ${context.label}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Zones'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Day Pattern'
                        }
                    }
                }
            }
        });
    }

    createZonesChart() {
        const ctx = document.getElementById('zonesChart').getContext('2d');
        
        // 统计区域分布
        const zoneRanges = {
            '7000-7099': 0,
            '7100-7199': 0,
            '7200-7299': 0,
            '7300-7399': 0,
            '7400+': 0
        };

        this.restrictionsData.forEach(item => {
            const zoneId = parseInt(item.zone_id);
            if (zoneId < 7100) zoneRanges['7000-7099']++;
            else if (zoneId < 7200) zoneRanges['7100-7199']++;
            else if (zoneId < 7300) zoneRanges['7200-7299']++;
            else if (zoneId < 7400) zoneRanges['7300-7399']++;
            else zoneRanges['7400+']++;
        });

        this.charts.zones = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(zoneRanges),
                datasets: [{
                    label: 'Restrictions per Zone Range',
                    data: Object.values(zoneRanges),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `Zone Range: ${context[0].label}`;
                            },
                            label: function(context) {
                                return `${context.parsed.y} parking restrictions in this zone range`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Restrictions'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Zone ID Range'
                        }
                    }
                }
            }
        });
    }

    hideLoading() {
        document.getElementById('loadingMessage').style.display = 'none';
    }

    showError() {
        document.getElementById('errorMessage').style.display = 'block';
    }

    showSuccess() {
        document.getElementById('successMessage').style.display = 'block';
    }

    showDashboard() {
        document.getElementById('dashboardContent').style.display = 'block';
    }
}

// 初始化dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚗 Melbourne Parking Dashboard - Starting...');
    new MelbourneParkingDashboard();
});