# StorjMonitor
Node.js script for publishing data from local Storj nodes to Storjstat.com


# Install Instructions

## Windows

The monitor can easily be started by running "storjMonitor.bat", by download the whole project you also download a NodeJS portable client. The only change you need to do is in "storjMonitor.js" and change line 10 (var token = "YOUR-TOKEN-HERE") to be your api token to communicate with Storjstat.com API.

## Linux

1. Clone/Copy this Repo to your local storage. Eg. `git clone https://github.com/calxibe/StorjMonitor.git `
2. Change into the directory. `cd StorjMonitor/`
3. Modify the install Script to executable. `chmod +x storjMonitor-install.sh`
4. Run the Script! `./storjMonitor-install.sh`
5. Enter your API Key from the website into the line 10 in storjMonitor.js (var token = "YOUR-TOKEN-HERE").
6. Execute the Monitor Script. `./storjMonitor.sh` or via seperate screen `screen dmS StorjMonitor ./storjMonitor.sh`
