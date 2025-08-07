#!/usr/bin/env python3
"""
Australian Population Data Cleaning Script

This script cleans the Australian Bureau of Statistics population data
for use in a web application.
"""

import pandas as pd
import numpy as np

def load_and_clean_population_data():
    """Load and clean the population data from Excel file."""
    
    print("=== LOADING POPULATION DATA ===")
    
    # Load data with proper header (skip 6 rows to get to the data)
    df = pd.read_excel('population.xlsx', sheet_name='Table 1', skiprows=6)
    
    # The first row contains the geographic column names
    # Update the unnamed columns with proper names from the first row
    new_columns = []
    for i, col in enumerate(df.columns):
        if str(col).startswith('Unnamed:'):
            # Get the name from the first row
            first_row_val = df.iloc[0, i]
            if pd.notna(first_row_val) and str(first_row_val).strip():
                new_columns.append(str(first_row_val).strip())
            else:
                new_columns.append(col)
        else:
            # Keep year columns and other named columns as they are
            new_columns.append(col)
    
    df.columns = new_columns
    
    # Remove the first row since it was used for column names
    df = df.iloc[1:].reset_index(drop=True)
    
    # Remove the empty row (originally row 1 after header)
    df = df.dropna(how='all')
    
    print(f"Data loaded: {df.shape}")
    print(f"Columns: {list(df.columns)[:10]}...")
    
    return df

def clean_data(df):
    """Clean the population data."""
    
    print("\n=== CLEANING DATA ===")
    
    # Make a copy to avoid warnings
    df = df.copy()
    
    # Remove completely empty rows
    df = df.dropna(how='all')
    
    # Identify year columns (population data)
    year_columns = [col for col in df.columns if isinstance(col, int) and 2000 <= col <= 2025]
    
    # Identify geographic columns
    geo_columns = [col for col in df.columns if isinstance(col, str) and any(x in col.lower() for x in ['code', 'name'])]
    
    print(f"Year columns found: {year_columns}")
    print(f"Geographic columns found: {geo_columns[:8]}...")
    
    # Convert population columns to numeric
    for year in year_columns:
        df[year] = pd.to_numeric(df[year], errors='coerce')
    
    # Clean geographic data
    for col in geo_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace('nan', np.nan)
    
    # Remove rows where all geographic identifiers are null
    if geo_columns:
        df = df.dropna(subset=geo_columns[:4], how='all')  # Keep rows with at least one geo identifier
    
    print(f"Data after cleaning: {df.shape}")
    
    return df, year_columns, geo_columns

def analyze_data_quality(df, year_columns, geo_columns):
    """Analyze data quality issues."""
    
    print("\n=== DATA QUALITY ANALYSIS ===")
    
    # Check for missing values
    print("Missing values by column:")
    missing = df.isnull().sum()
    for col, count in missing[missing > 0].items():
        print(f"  {col}: {count} ({count/len(df)*100:.1f}%)")
    
    # Check population data ranges
    if year_columns:
        print(f"\nPopulation data summary for {year_columns[0]}:")
        pop_data = df[year_columns[0]].dropna()
        print(f"  Min: {pop_data.min()}")
        print(f"  Max: {pop_data.max()}")
        print(f"  Mean: {pop_data.mean():.0f}")
        print(f"  Zero values: {(pop_data == 0).sum()}")
    
    # Check geographic hierarchy
    if len(geo_columns) >= 4:
        print(f"\nGeographic hierarchy check:")
        for col in geo_columns[:4]:
            if col in df.columns:
                unique_count = df[col].nunique()
                print(f"  {col}: {unique_count} unique values")
    
    return df

def save_cleaned_data(df, year_columns):
    """Save cleaned data in multiple formats."""
    
    print("\n=== SAVING CLEANED DATA ===")
    
    # Save full dataset
    df.to_csv('population_cleaned.csv', index=False)
    print("Saved: population_cleaned.csv")
    
    # Save a subset for web application (recent years only)
    if year_columns:
        recent_years = [col for col in year_columns if col >= 2015]
        geo_cols = [col for col in df.columns if isinstance(col, str) and any(x in col.lower() for x in ['code', 'name'])]
        
        # Create web-ready dataset
        web_columns = geo_cols[:6] + recent_years  # First 6 geo columns + recent years
        web_columns = [col for col in web_columns if col in df.columns]
        
        df_web = df[web_columns].copy()
        df_web = df_web.dropna(subset=recent_years, how='all')  # Remove rows with no recent population data
        
        df_web.to_csv('population_web.csv', index=False)
        print(f"Saved: population_web.csv ({df_web.shape[0]} rows, {df_web.shape[1]} columns)")
        
        # Save as JSON for web application
        df_web.to_json('population_web.json', orient='records', indent=2)
        print("Saved: population_web.json")

def main():
    """Main function to run the data cleaning process."""
    
    try:
        # Load data
        df = load_and_clean_population_data()
        
        # Clean data
        df_clean, year_columns, geo_columns = clean_data(df)
        
        # Analyze quality
        df_analyzed = analyze_data_quality(df_clean, year_columns, geo_columns)
        
        # Save cleaned data
        save_cleaned_data(df_analyzed, year_columns)
        
        print("\n=== DATA CLEANING COMPLETE ===")
        print("Files created:")
        print("- population_cleaned.csv (full dataset)")
        print("- population_web.csv (web-ready subset)")
        print("- population_web.json (JSON format)")
        
    except Exception as e:
        print(f"Error during data cleaning: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()