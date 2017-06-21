/**
 * CalcTwitterRatio
 *
 * Author:  Ali Mousavi (ali.mousavi@gmail.com)
 * Updated: 2017-06-21
 *
 * Calculates the followers/following ratio and tweets/days ratio for a list of
 * users and saves the data on a csv file.
 *
 * Input: input.txt file containing each user to check on a different line.
 *
 * Output:
 *     output.csv: the csv file with the calculated data.
 *
 * How To Use:
 * 1. make a ".env" file with your keys and secret tokens from twitter:
 *     CONSUMER_KEY=
 *     CONSUMER_SECRET=
 *     ACCESS_TOKEN_KEY=
 *     ACCESS_TOKEN_SECRET=
 *
 * 2. place the input.txt file in the same folder of the sctipt and run:
 *     npm install
 *     npm start
 */

var Twitter = require('twitter');
var fs = require('fs');
var moment = require('moment')

// load the environment variables
require('dotenv').config();

// Configure the twitter client
var tClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// initial input file if its the first time you are running the script.
// It should be a txt file with users on each line.
var input = "./input.txt";

// path of the csv file
var output = "./output.csv"

/**
 * parses a text input file for finding usernames
 * @param  {string}   txtFile path of input file
 * @param  {Function} cb      callback function will be called with the object
 */
function parseInput(txtFile, cb) {
    var obj = {};
    fs.readFile(input, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        data.split('\n').forEach(function(user) {
            // ignore empty lines
            if (user) {
                obj[user] = [];
            }
        });

        // call the callback function when done.
        cb (obj);
    });
}

/**
 * saves the object information in the output csv file
 * @param  {object} obj       the object file.
 * @param  {string} firstLine the first line of the csv file.
 */
function saveCsv(obj, firstLine) {
    var csv = firstLine + "\n";
    Object.keys(obj).forEach(function(key) {
        csv += key;
        obj[key].forEach(function(count) {
            csv += "," + count;
        });
        csv += "\n";
    });
    fs.writeFile(output, csv, "utf8", function(err) {
        if (err) {
            throw err;
        }
    })
}

/**
 * calculate days in between two dates
 * @param  {Date Object} date1 start date
 * @param  {Date Object} date2 finish date
 */
function diffDays(date1, date2) {
    var startDate = moment(date1);
    var FinishDate = moment(date2);

    return FinishDate.diff(startDate, "days");
}

/**
 * fetch the required information from twitter and save the info to csvFile.
 * @param  {Object} obj the object containing usernames.
 */
function fetchUsersData(obj) {
    var userList = Object.keys(obj);

    /**
     * recursive function to get information of all the users in the userList
     * @param  {Number} index index of the user in the list
     */
    function fetchEachUser(index) {
        // fetch info while there is still users in the list.
        if (index < userList.length) {
            var userName = userList[index];

            console.log("Fetching info: " + (index + 1) + "/" + userList.length);

            tClient.get('users/show', {"screen_name": userName}, function(err, res) {
                if (err) {
                    console.error(JSON.stringify(err));
                }

                // following count
                obj[userName].push(res.friends_count);
                console.log("Found Following: " + userName + " - " + res.friends_count);

                // followers count
                obj[userName].push(res.followers_count);
                console.log("Found Followers: " + userName + " - " + res.followers_count);

                // tweets count
                obj[userName].push(res.statuses_count);
                console.log("tweets: " + userName + " - " + res.statuses_count);

                // days from creating the account
                var daysCreated = diffDays(new Date(res.created_at), new Date());
                obj[userName].push(daysCreated);
                console.log("Days Active:" + userName + " - " + daysCreated);

                // followers/following ratio
                obj[userName].push(res.followers_count / res.friends_count);

                // tweets/days ratio
                obj[userName].push(res.statuses_count / today.diff(cdate, "days"));

                // call the function with the next user index.
                fetchEachUser(index + 1);
            });
        } else {
            // save the data
            var titles = "username,following,followers,tweets,activeDays,follower/following,tweets/days";
            saveCsv(obj, titles);
        }
    }

    fetchEachUser(0);
}

parseInput(input, fetchUsersData);
