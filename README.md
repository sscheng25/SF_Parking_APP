# [Parking Visualization APP for San Francisco](https://sscheng25.github.io/SF_Parking_APP/)
Final project for MUSA 611. [Here](https://sscheng25.github.io/SF_Parking_APP/) is the link for the APP!
- Sisun Cheng (sisunc@alumni.upenn.edu)

## Introduction and Motivations
The City and County of San Francisco, is a cultural, commercial, and financial center in the US state of California. Located in Northern California, San Francisco is the fourth most populous city in California, with 873,965 residents as of 2020. For the San Francisco metropolitan area, it is the 12th-largest metropolitan statistical area in the US with about 4.7 million residents, and the fourth-largest by economic output, with a GDP of \$592 billion in 2019.

San Francisco is also a popular tourist destination, which is known for its cool summers, fog, steep rolling hills, eclectic mix of architecture, and landmarks. With such a large population and huge number of visitors, it is extraordinarily difficult to find a parking space in San Francisco, especially in the downtown San Francisco, or near the tourist destinations. Most residents as well as visitors have experienced cruising and cruising on the street to find just a place to accommodate their car. 

To give a better sense of on-street parking demands to the public and guide the drivers to nearest off-street parking sites, I'd like to carry out a web application which contains two main part, an on-street parking dashboard and a off-street parking map with interactive functions.

## Data Source
- [SFMTA Parking Meter Detailed Revenue Transactions](https://data.sfgov.org/Transportation/SFMTA-Parking-Meter-Detailed-Revenue-Transactions/imvp-dq3v/data)
- [Parking Meters](https://data.sfgov.org/Transportation/Parking-Meters/8vzz-qzz9)
- [Analysis Neighborhoods](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h)
- [SFMTA Managed Off-street Parking](https://data.sfgov.org/Transportation/SFMTA-Managed-Off-street-Parking/vqzx-t7c4)

Final geoJSON data used for web application is wrangled through python scripts.

Raw data size: 420,000+ rows, time period: **2022-03-27 to 2022-04-02**.

## Screenshots for the app
![image](https://user-images.githubusercontent.com/76165424/167524605-f8df6aba-d909-4dc0-88e1-9df6cd72e078.png)

(Homepage)

![image](https://user-images.githubusercontent.com/76165424/167524643-67543836-74ef-4484-8699-cf7fbfe809ee.png)

(Find an off-street parking site)

![image](https://user-images.githubusercontent.com/76165424/167524714-37d28c2a-d45b-4a9a-aeed-77c7516c3e92.png)

(On-street parking dashboard)
