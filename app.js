const express = require('express');
const bodyParser = require('body-parser');
const twit = require("twit");
const { text } = require('body-parser');
const fileSystem = require('fs');
// const fastcsv = require('fast-csv');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// API key:
const apiKey = "P44fspIbzIIO8Pjhdu4FyMjqw";

// API key secret:
const apiKeySecret = "ZA9DuINH49qXHiIjY0g72CLP8Rrh8i7hvofiCKTHr8wh6ULcbl";

// Access token
const accessToken = "1290464407147950086-DDkqnzkaBeU1Qwpslv0Ty2ujE97OXR";

// Access token secret
const accessTokenSecret = "MamN2vPn6odd9NnBg7aN9Y1xmCUuxQAomiBc8eDKRL5gN";

const twitterAPI = new twit({
    consumer_key: apiKey,
    consumer_secret: apiKeySecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

const objectToCsv = (jsonFile) => {
    const data = jsonFile.map(row => ({
        date: row.created_at,
        text: row.text,
        hashtags: row.entities.hashtags.map(item => {
            return item['text'];
        }),
        retweetCount: row.retweet_count,
        favoriteCount: row.favorite_count,
        language: row.metadata.iso_language_code,
        location: row.user.location,
        userName: row.user.name,
        userScreenName: row.user.screen_name,
        userDescription: row.user.description,
        followersCount: row.user.followers_count,
        friendsCount: row.user.friends_count,
    }));

    // const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    // const csvWriter = createCsvWriter({
    //     path: 'file.csv',
    //     header: [
    //         {id: 'date', title: 'DATE'},
    //         {id: 'text', title: 'TEXT'},
    //         {id: 'hashtags', title: 'hashtags'},
    //         {id: 'retweetCount', title: 'retweetCount'},
    //         {id: 'favoriteCount', title: 'favoriteCount'},
    //         {id: 'language', title: 'language'},
    //         {id: 'location', title: 'location'},
    //         {id: 'userName', title: 'userName'},
    //         {id: 'userScreenName', title: 'userScreenName'},
    //         {id: 'userDescription', title: 'userDescription'},
    //         {id: 'followersCount', title: 'followersCount'},
    //         {id: 'friendsCount', title: 'friendsCount'},
            
    //     ],
    //     encoding: 'utf8',
    // });
    
    // const records = [
    //     {date: 'Bob',  text: 'French, English'},
    //     {date: 'Mary', text: 'English'}
    // ];

    // csvWriter.writeRecords(data)       // returns a promise
    //     .then(() => {
    //         console.log('...Done');
    //     });

    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

const download = (data) => {
    // const blob = new Blob([data], {type: 'text/csv'});
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.setAttribute('hidden', '');
    // a.setAttribute('href', url);
    // a.setAttribute('download', 'download.csv');
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild();

    // return fileSystem.appendFile('download.csv', data, { encoding: 'utf8' }, function(err) {
    //     console.log('saved');
    // })
    
}

app.post('/', function(req, res) {
    
    twitterAPI.get('search/tweets', {q: "#twice since:2019-04-15", count: 1}, function(err, data, response){
        // const tweets = data;
        const tweets = data.statuses;
        // console.log(tweets.length);
        const csvData = objectToCsv(tweets);
        // const result = download(csvData);
        fileSystem.writeFile('love.csv', '\ufeff' + csvData, {encoding: 'utf16le'}, function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        res.send(csvData);
    })
})

app.listen(3001, function() {
    console.log('I can do it!');
});

