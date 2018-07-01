
Speed Logger
============

Log network speed to a CSV routinely.

Requires the speedtest-cli Python CLI tool: https://github.com/sivel/speedtest-cli

- Install speedtest-cli (`pip install speedtest-cli` or `easy_install speedtest-cli`)
- Install requirement (`npm install`)
- Run the app (`node speed.js`)
- Check `log.csv` after a few hours 

### Web Interface auto update + history
![Web interface](https://i.snag.gy/nd8ERc.jpg)

### Console Graph
![Console graph](https://i.snag.gy/i7gObk.jpg)

## Options
All in the first line of speed.js

```javascript
  interval: 60,                    // Interval of test in second
  logger: true,                    // Save test result
  loggerFileName: 'log.csv',       // Name of file to save history

  enableWebInterface: true,        // Web interface of result
  webInterfacePort: 3131,          // Port of web interface, WARNING you must update indes.html
  webInterfaceListenIp: "0.0.0.0", // IP to start server, WARNING you must update indes.html

  enableCLICharts: true,           // Show graph in CLI
  clearCLIBetweenTest: true,       // Clear screen between test
  consoleLog: false,               // Output logging to console
  
  secureDomains: null,             // Array of strings [ 'www.example.com' ]
  secureAdminEmail: 'youremail@here.com' //The admin for the secure email confirmation
```

## Secure http connection

You can secure the http connection by creating a [letsencrypt](https://letsencrypt.org/) key as explained below. Configure the secureDomains and secureAdminEmail

```sh
 # Install software letsencrypt 
 wget https://dl.eff.org/certbot-auto
 chmod a+x certbot-auto
 # Create dns entry and add _acme-challenge as TXT with key value
 ./certbot-auto certonly --agree-tos --renew-by-default --manual --preferred-challenges=dns -d www.example.com 
 # Copy keys to certs: cp /etc/letsencrypt/* ./certs/ -r
 # To renew key if required
 ./certbot-auto renew
```

 
 

## Goals

To determine whether ISPs are actually throttling Internet (or just congested) at certain periods of time. By taking measurements every 10 minutes, we can track trends throughout the day. By comparing various ISPs (and regions) we can detect greater trends across the market as well.

- Please run the script for at least 24 hours (more time means more data, would prefer multiple weekdays + weekends).
- Email the generated CSV file (plus your ISP and the speed you pay for) to eric+speedtest@eamann.com
 
After results are in, I'll compile some numbers and publish a review at http://eamann.com
