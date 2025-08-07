# Melbourne Commuter Data Insights

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://your-username.github.io/melbourne-commuter-insights/dashboard_with_data.html)
[![Data Source](https://img.shields.io/badge/Data-ABS-green)](https://www.abs.gov.au/)

## 📊 Project Overview

Professional dashboard providing data insights into Melbourne's population growth and its impact on urban infrastructure. This project addresses **EPIC 1.0 Data Insights** for Melbourne commuters, helping them understand key growth trends and their impact on urban congestion.

## 🎯 Features

- **Population Growth Analysis** (2015-2021): Interactive visualization of Melbourne's demographic changes
- **Infrastructure Impact Assessment**: Understanding how population growth affects urban infrastructure
- **COVID-19 Impact Analysis**: Detailed analysis of pandemic effects on population trends
- **Professional Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real Data Insights**: Based on Australian Bureau of Statistics official data

## 🚀 Live Demo

[View Dashboard](https://your-username.github.io/melbourne-commuter-insights/dashboard_with_data.html)

## 📁 Project Structure

```
melbourne-commuter-insights/
├── dashboard_with_data.html          # Main dashboard (open this file)
├── data/
│   ├── melbourne_population_growth.csv    # Population growth analysis
│   ├── melbourne_parking_zones.csv        # Parking demand analysis
│   ├── melbourne_insights_summary.json    # Key metrics summary
│   ├── population_web.csv                 # Web-optimized population data
│   └── on-street-parking-bay-sensors.csv  # Parking sensor data
├── scripts/
│   ├── clean_population_data.py           # Data cleaning utilities
│   └── melbourne_data_analysis.py         # Analysis pipeline
└── docs/
    ├── DATA_CLEANING_STRATEGY.md          # Data processing documentation
    ├── EPIC_1_DATA_INSIGHTS_STRATEGY.md   # Project strategy
    └── GITHUB_PUSH_GUIDE.md               # Deployment guide
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js for interactive charts
- **Data Processing**: Python with Pandas
- **Data Source**: Australian Bureau of Statistics Regional Population 2021
- **Design**: Professional responsive design with CSS Grid

## 📈 Key Insights

- Melbourne metropolitan area grew by **376K people** from 2015-2021
- Average annual growth: **63K new residents** per year
- Peak growth rate: **2.89%** in 2015-2016
- COVID-19 impact: **-1.64%** decline in 2020-2021

## 🚀 Quick Start

### Option 1: View Online
Simply open the [live demo](https://your-username.github.io/melbourne-commuter-insights/dashboard_with_data.html) in your browser.

### Option 2: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/melbourne-commuter-insights.git
   cd melbourne-commuter-insights
   ```

2. Open the dashboard:
   ```bash
   open dashboard_with_data.html
   # or double-click the file in your file explorer
   ```

### Option 3: Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000
# Then visit: http://localhost:8000

# Using Node.js
npx serve
```

## 📊 Data Sources

- **Population Data**: Australian Bureau of Statistics Regional Population 2021
- **Parking Data**: City of Melbourne On-street Parking Bay Sensors
- **Analysis Period**: 2015-2021 (7 years of comprehensive data)
- **Geographic Coverage**: Melbourne Metropolitan Area (Victoria, Australia)

## 🎯 Project Goals

This dashboard addresses the user story:
> "As a Melbourne commuter, I want accessible insights into key growth trends so that I can understand their full impact on urban infrastructure and congestion."

### Benefits:
- **Informed Decision Making**: Data-driven understanding of urban challenges
- **Community Awareness**: Shared responsibility for congestion solutions
- **Trend Understanding**: Clear visualization of population and infrastructure patterns

## 🔧 Development

### Data Processing
```bash
# Clean and process raw data
python3 scripts/clean_population_data.py

# Run comprehensive analysis
python3 scripts/melbourne_data_analysis.py
```

### Customization
The dashboard uses embedded data for optimal performance. To update data:
1. Replace CSV files in the `data/` directory
2. Run the data processing scripts
3. Update the embedded data in `dashboard_with_data.html`

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Australian Bureau of Statistics for providing comprehensive population data
- City of Melbourne for parking sensor data
- Chart.js community for excellent visualization library

## 📞 Contact

Project Link: [https://github.com/your-username/melbourne-commuter-insights](https://github.com/your-username/melbourne-commuter-insights)

---

**Note**: Replace `your-username` with your actual GitHub username before pushing to GitHub.