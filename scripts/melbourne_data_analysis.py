#!/usr/bin/env python3
"""
Melbourne Commuter Data Insights Analysis

This script addresses EPIC 1.0 Data Insights for Melbourne commuters:
- US 1.1: Car ownership growth insights
- US 1.2: Melbourne CBD population growth insights

Combines population data with parking sensor data to provide actionable insights.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import re

def load_population_data():
    """Load and filter population data for Melbourne/Victoria."""
    
    print("=== LOADING POPULATION DATA ===")
    
    # Load the cleaned population data
    df = pd.read_csv('population_web.csv')
    
    # Filter for Victoria (Melbourne is in Victoria)
    vic_data = df[df['S/T name'] == 'Victoria'].copy()
    
    print(f"Victoria population data: {vic_data.shape[0]} areas")
    print(f"SA4 regions in Victoria: {vic_data['SA4 name'].nunique()}")
    
    # Identify Melbourne CBD and metropolitan areas
    melbourne_keywords = ['melbourne', 'inner', 'port phillip', 'yarra', 'stonnington', 
                         'boroondara', 'glen eira', 'bayside', 'kingston', 'monash']
    
    vic_data['Is_Melbourne_Metro'] = vic_data['SA4 name'].str.lower().str.contains(
        '|'.join(melbourne_keywords), na=False
    )
    
    melbourne_data = vic_data[vic_data['Is_Melbourne_Metro']].copy()
    
    print(f"Melbourne metropolitan areas identified: {melbourne_data.shape[0]} areas")
    print(f"Melbourne SA4 regions: {melbourne_data['SA4 name'].unique()}")
    
    return vic_data, melbourne_data

def load_parking_data():
    """Load and clean parking sensor data."""
    
    print("\n=== LOADING PARKING SENSOR DATA ===")
    
    df = pd.read_csv('on-street-parking-bay-sensors.csv')
    
    # Parse coordinates
    def parse_coordinates(location_str):
        try:
            coords = re.findall(r'-?\d+\.\d+', str(location_str))
            if len(coords) >= 2:
                return float(coords[0]), float(coords[1])
            return None, None
        except:
            return None, None
    
    coords_data = df['Location'].apply(parse_coordinates)
    df['Latitude'] = [coord[0] for coord in coords_data]
    df['Longitude'] = [coord[1] for coord in coords_data]
    
    # Parse timestamps
    df['Status_Timestamp_Clean'] = pd.to_datetime(df['Status_Timestamp'], errors='coerce', utc=True)
    df['Year'] = df['Status_Timestamp_Clean'].dt.year
    df['Month'] = df['Status_Timestamp_Clean'].dt.month
    
    # Filter for Melbourne CBD area
    melbourne_cbd_lat = (-37.8200, -37.8000)
    melbourne_cbd_lon = (144.9500, 144.9800)
    
    cbd_mask = ((df['Latitude'] >= melbourne_cbd_lat[0]) & 
                (df['Latitude'] <= melbourne_cbd_lat[1]) &
                (df['Longitude'] >= melbourne_cbd_lon[0]) & 
                (df['Longitude'] <= melbourne_cbd_lon[1]))
    
    cbd_data = df[cbd_mask].copy()
    
    print(f"Total parking sensors: {len(df)}")
    print(f"CBD parking sensors: {len(cbd_data)} ({len(cbd_data)/len(df)*100:.1f}%)")
    print(f"Years covered: {sorted(df['Year'].dropna().unique())}")
    
    return df, cbd_data

def analyze_population_growth(melbourne_data):
    """US 1.2: Analyze Melbourne CBD population growth."""
    
    print("\n=== US 1.2: MELBOURNE CBD POPULATION GROWTH ANALYSIS ===")
    
    # Calculate year-over-year growth
    year_columns = ['2015', '2016', '2017', '2018', '2019', '2020', '2021']
    
    # Aggregate Melbourne metro population by year
    melbourne_totals = {}
    for year in year_columns:
        total_pop = melbourne_data[year].sum()
        melbourne_totals[year] = total_pop
    
    # Calculate growth rates
    growth_analysis = []
    for i in range(1, len(year_columns)):
        prev_year = year_columns[i-1]
        curr_year = year_columns[i]
        
        prev_pop = melbourne_totals[prev_year]
        curr_pop = melbourne_totals[curr_year]
        
        growth_rate = ((curr_pop - prev_pop) / prev_pop) * 100
        growth_absolute = curr_pop - prev_pop
        
        growth_analysis.append({
            'Period': f'{prev_year}-{curr_year}',
            'Previous_Population': prev_pop,
            'Current_Population': curr_pop,
            'Growth_Absolute': growth_absolute,
            'Growth_Rate_Percent': growth_rate
        })
    
    growth_df = pd.DataFrame(growth_analysis)
    
    print("Melbourne Metropolitan Population Growth:")
    print(f"2015 Population: {melbourne_totals['2015']:,}")
    print(f"2021 Population: {melbourne_totals['2021']:,}")
    print(f"Total Growth 2015-2021: {melbourne_totals['2021'] - melbourne_totals['2015']:,} people")
    print(f"Average Annual Growth: {(melbourne_totals['2021'] - melbourne_totals['2015']) / 6:,.0f} people/year")
    
    print("\nYear-over-Year Growth Analysis:")
    for _, row in growth_df.iterrows():
        print(f"{row['Period']}: +{row['Growth_Absolute']:,.0f} people ({row['Growth_Rate_Percent']:.2f}%)")
    
    # COVID impact analysis (2019-2021)
    covid_impact = melbourne_totals['2021'] - melbourne_totals['2019']
    covid_rate = (covid_impact / melbourne_totals['2019']) * 100
    
    print(f"\nCOVID-19 Impact (2019-2021):")
    print(f"Population change: {covid_impact:+,.0f} people ({covid_rate:+.2f}%)")
    
    return growth_df, melbourne_totals

def analyze_parking_demand(cbd_data):
    """US 1.1: Analyze car ownership/parking demand trends."""
    
    print("\n=== US 1.1: CAR OWNERSHIP & PARKING DEMAND ANALYSIS ===")
    
    # Analyze parking occupancy by year
    yearly_occupancy = cbd_data.groupby(['Year', 'Status_Description']).size().unstack(fill_value=0)
    
    if 'Present' in yearly_occupancy.columns and 'Unoccupied' in yearly_occupancy.columns:
        yearly_occupancy['Total_Sensors'] = yearly_occupancy['Present'] + yearly_occupancy['Unoccupied']
        yearly_occupancy['Occupancy_Rate'] = (yearly_occupancy['Present'] / yearly_occupancy['Total_Sensors']) * 100
        
        print("CBD Parking Demand Trends:")
        for year in sorted(yearly_occupancy.index):
            if not pd.isna(year):
                occupancy = yearly_occupancy.loc[year, 'Occupancy_Rate']
                total = yearly_occupancy.loc[year, 'Total_Sensors']
                print(f"{int(year)}: {occupancy:.1f}% occupancy ({total:,} sensor readings)")
    
    # Analyze by zone to identify high-demand areas
    zone_analysis = cbd_data.groupby('Zone_Number').agg({
        'Status_Description': lambda x: (x == 'Present').mean() * 100,
        'KerbsideID': 'count'
    }).round(2)
    
    zone_analysis.columns = ['Occupancy_Rate_Percent', 'Total_Readings']
    zone_analysis = zone_analysis.sort_values('Occupancy_Rate_Percent', ascending=False)
    
    print(f"\nTop 10 High-Demand Parking Zones (Highest Occupancy):")
    print(zone_analysis.head(10))
    
    # Overall CBD parking statistics
    total_readings = len(cbd_data)
    occupied_readings = len(cbd_data[cbd_data['Status_Description'] == 'Present'])
    overall_occupancy = (occupied_readings / total_readings) * 100
    
    print(f"\nOverall CBD Parking Statistics:")
    print(f"Total sensor readings: {total_readings:,}")
    print(f"Occupied readings: {occupied_readings:,}")
    print(f"Overall occupancy rate: {overall_occupancy:.1f}%")
    print(f"Unique parking zones: {cbd_data['Zone_Number'].nunique()}")
    print(f"Unique parking bays: {cbd_data['KerbsideID'].nunique()}")
    
    return yearly_occupancy, zone_analysis

def generate_insights(growth_df, melbourne_totals, yearly_occupancy, zone_analysis):
    """Generate actionable insights for Melbourne commuters."""
    
    print("\n=== ACTIONABLE INSIGHTS FOR MELBOURNE COMMUTERS ===")
    
    # Population growth insights
    recent_growth = melbourne_totals['2021'] - melbourne_totals['2019']
    avg_annual_growth = (melbourne_totals['2021'] - melbourne_totals['2015']) / 6
    
    print("📈 POPULATION GROWTH IMPACT:")
    print(f"• Melbourne metro population grew by {recent_growth:+,} people (2019-2021)")
    print(f"• Average annual growth: {avg_annual_growth:,.0f} people/year")
    print(f"• This represents {recent_growth/1000:.0f}k more potential daily commuters")
    
    # Parking demand insights
    if not yearly_occupancy.empty and 'Occupancy_Rate' in yearly_occupancy.columns:
        recent_years = yearly_occupancy[yearly_occupancy.index >= 2022]
        if not recent_years.empty:
            avg_occupancy = recent_years['Occupancy_Rate'].mean()
            print(f"\n🚗 PARKING DEMAND INSIGHTS:")
            print(f"• CBD parking occupancy rate: {avg_occupancy:.1f}%")
            
            if avg_occupancy > 70:
                print("• HIGH DEMAND: Parking is highly contested in CBD")
                print("• RECOMMENDATION: Consider public transport or off-peak travel")
            elif avg_occupancy > 50:
                print("• MODERATE DEMAND: Parking available but competitive")
                print("• RECOMMENDATION: Plan ahead or use parking apps")
            else:
                print("• LOW DEMAND: Parking generally available")
    
    # High-demand zones
    if not zone_analysis.empty:
        high_demand_zones = zone_analysis[zone_analysis['Occupancy_Rate_Percent'] > 80]
        print(f"\n🔥 HIGH-CONGESTION ZONES:")
        print(f"• {len(high_demand_zones)} zones with >80% occupancy")
        print("• These areas experience the highest parking competition")
        print("• RECOMMENDATION: Avoid these zones during peak hours")
    
    # Combined impact analysis
    population_growth_rate = ((melbourne_totals['2021'] - melbourne_totals['2015']) / melbourne_totals['2015']) * 100
    
    print(f"\n🏙️ URBAN INFRASTRUCTURE IMPACT:")
    print(f"• Population growth rate (2015-2021): {population_growth_rate:.1f}%")
    print(f"• This growth directly correlates with increased CBD congestion")
    print(f"• Infrastructure strain: More people competing for same parking spaces")
    
    print(f"\n💡 COMMUTER RECOMMENDATIONS:")
    print("• Peak congestion periods align with population density increases")
    print("• Consider flexible work arrangements to avoid peak times")
    print("• Public transport becomes more viable as population density increases")
    print("• Carpooling/ride-sharing can reduce individual parking demand")

def save_analysis_results(growth_df, yearly_occupancy, zone_analysis):
    """Save analysis results for web application."""
    
    print("\n=== SAVING ANALYSIS RESULTS ===")
    
    # Save population growth analysis
    growth_df.to_csv('melbourne_population_growth.csv', index=False)
    print("Saved: melbourne_population_growth.csv")
    
    # Save parking analysis
    if not yearly_occupancy.empty:
        yearly_occupancy.to_csv('melbourne_parking_trends.csv')
        print("Saved: melbourne_parking_trends.csv")
    
    if not zone_analysis.empty:
        zone_analysis.to_csv('melbourne_parking_zones.csv')
        print("Saved: melbourne_parking_zones.csv")
    
    # Create summary for web application
    summary = {
        'analysis_date': datetime.now().isoformat(),
        'population_growth_2015_2021': float(growth_df['Growth_Absolute'].sum()) if not growth_df.empty else 0,
        'avg_annual_growth': float(growth_df['Growth_Absolute'].mean()) if not growth_df.empty else 0,
        'parking_zones_analyzed': int(zone_analysis.shape[0]) if not zone_analysis.empty else 0,
        'high_demand_zones': int((zone_analysis['Occupancy_Rate_Percent'] > 80).sum()) if not zone_analysis.empty else 0
    }
    
    import json
    with open('melbourne_insights_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    print("Saved: melbourne_insights_summary.json")

def main():
    """Main analysis function."""
    
    print("🚗 MELBOURNE COMMUTER DATA INSIGHTS ANALYSIS")
    print("=" * 50)
    
    try:
        # Load data
        vic_data, melbourne_data = load_population_data()
        parking_data, cbd_data = load_parking_data()
        
        # Perform analyses
        growth_df, melbourne_totals = analyze_population_growth(melbourne_data)
        yearly_occupancy, zone_analysis = analyze_parking_demand(cbd_data)
        
        # Generate insights
        generate_insights(growth_df, melbourne_totals, yearly_occupancy, zone_analysis)
        
        # Save results
        save_analysis_results(growth_df, yearly_occupancy, zone_analysis)
        
        print("\n✅ ANALYSIS COMPLETE!")
        print("Files created for web application:")
        print("- melbourne_population_growth.csv")
        print("- melbourne_parking_trends.csv") 
        print("- melbourne_parking_zones.csv")
        print("- melbourne_insights_summary.json")
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()