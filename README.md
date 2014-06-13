Speed Logger
============

Log network speed to a CSV routinely.

Requires the speedtest-cli Python CLI tool: https://github.com/sivel/speedtest-cli

- Install speedtest-cli (`pip install speedtest-cli` or `easy_install speedtest-cli`)
- Run the app (`node speed.js`)
- Check `log.csv` after a few hours 

## Goals

To determine whether ISPs are actually throttling Internet (or just congested) at certain periods of time. By taking measurements every 10 minutes, we can track trends throughout the day. By comparing various ISPs (and regions) we can detect greater trends across the market as well.

- Please run the script for at least 24 hours (more time means more data, would prefer multiple weekdays + weekends).
- Email the generated CSV file (plus your ISP and the speed you pay for) to eric+speedtest@eamann.com
 
After results are in, I'll compile some numbers and publish a review at http://eamann.com
