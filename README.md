# Melbourne Parking Dashboard

🚗 A professional, interactive dashboard for Melbourne parking data analysis

## 🌐 Live Demo
Visit: **https://Only-Bugs.github.io/melbourne-parking-dashboard**

## ✨ Features

- **Real-time Data**: Direct connection to AWS RDS MySQL database
- **Interactive Charts**: Parking rules, time patterns, zone analysis
- **Professional Design**: Modern, responsive UI with Chart.js
- **AWS Integration**: Lambda API backend for secure data access
- **Mobile Friendly**: Works perfectly on all devices

## 🏗 Architecture

```
Frontend (GitHub Pages) → API Gateway → AWS Lambda → RDS MySQL
```

- **Frontend**: Static HTML/CSS/JS hosted on GitHub Pages
- **Backend**: AWS Lambda functions with Python
- **Database**: AWS RDS MySQL with parking restrictions data
- **API**: RESTful endpoints via AWS API Gateway

## 📊 Data Visualizations

1. **Parking Rules Distribution** - Doughnut chart showing rule types (1P, 2P, MP2P, etc.)
2. **Time Restrictions** - Bar chart of restriction start times
3. **Daily Patterns** - Horizontal bar chart of day-based restrictions
4. **Zone Distribution** - Line chart showing parking zones by area

## 🚀 Quick Start

### View the Dashboard
Simply visit the GitHub Pages URL above - no installation required!

### Local Development
```bash
# Clone the repository
git clone https://github.com/Only-Bugs/melbourne-parking-dashboard.git
cd melbourne-parking-dashboard

# Start local server
python -m http.server 8000

# Visit http://localhost:8000
```

## 🔧 API Endpoints

The dashboard connects to these AWS Lambda endpoints:

- `GET /restrictions` - Parking restriction rules
- `GET /stats` - Summary statistics
- `GET /zones` - Zone-based data

## 📱 Screenshots

### Desktop View
Professional dashboard with multiple chart types and real-time statistics.

### Mobile View
Fully responsive design that works perfectly on smartphones and tablets.

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 3.9.1
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Backend**: AWS Lambda (Python 3.9)
- **Database**: AWS RDS MySQL 8.0
- **Hosting**: GitHub Pages
- **API**: AWS API Gateway

## 📈 Data Sources

- Melbourne parking restrictions (5. Cleaned_Restrictions.csv)
- Parking zone segments
- Real-time sensor data
- Population growth statistics

## 🔒 Security

- CORS enabled for GitHub Pages domain
- Database credentials secured in Lambda environment
- No sensitive data exposed to frontend
- API rate limiting via AWS API Gateway

## 🌟 Performance

- **Fast Loading**: Optimized assets and minimal dependencies
- **Responsive**: CSS Grid and Flexbox for all screen sizes
- **Efficient**: Direct database queries with proper indexing
- **Cached**: Static assets served via GitHub Pages CDN

## 📄 License

MIT License - feel free to use this project for your own parking data analysis!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues:
- Check the deployment guide in the repository
- Review AWS Lambda logs for API issues
- Ensure your database connection is properly configured

---

**Built with ❤️ for Melbourne commuters**
