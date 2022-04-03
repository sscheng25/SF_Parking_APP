# On-street Parking Visualization APP for San Francisco
Final project for MUSA 611.

## Motivation
The City and County of San Francisco, is a cultural, commercial, and financial center in the US state of California. Located in Northern California, San Francisco is the fourth most populous city in California, with 873,965 residents as of 2020. For the San Francisco metropolitan area, it is the 12th-largest metropolitan statistical area in the US with about 4.7 million residents, and the fourth-largest by economic output, with a GDP of \$592 billion in 2019.

San Francisco is also a popular tourist destination, which is known for its cool summers, fog, steep rolling hills, eclectic mix of architecture, and landmarks, including the Golden Gate Bridge, cable cars, the former Alcatraz Federal Penitentiary, Fisherman's Wharf, and its Chinatown district. With so many famous resorts, San Francisco attracts over 26.5 million visitors in 2019.

With such a large population and huge number of visitors, it is extraordinarily difficult to find a parking space in San Francisco, especially in the downtown San Francisco, or near the tourist destinations. Most residents as well as visitors have experienced cruising and cruising on the street to find just a place to accommodate their car. On-street parking hot spots cluster in the northeastern section of San Francisco, including Financial District, China Town, Fisherman's Wharf, etc., where many commercial hot spots also gather here.

To give a better sense of parking demands to both the planning authorities and the public, I'd like to carry out a web application for on-street parking visualizations by each neighborhood.

## Data Source
- [SFMTA Parking Meter Detailed Revenue Transactions](https://data.sfgov.org/Transportation/SFMTA-Parking-Meter-Detailed-Revenue-Transactions/imvp-dq3v/data)
- [Parking Meters](https://data.sfgov.org/Transportation/Parking-Meters/8vzz-qzz9)
- [Analysis Neighborhoods](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h)

Final geoJSON data used for web application are wrangled through python scripts.

Raw data size: 420,000+ rows, time period: **2022-03-27 to 2022-04-02**.

## Proposed Functions
- Interactive map of parking meters.
- Interactive map of parking records by hour by neighborhood.
- Interactive line chart of parking numbers by time.
