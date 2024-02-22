//Import Node.js core module
const http = require('http');
const url = require('url');

// Import our static data
const teams = require('./teams.json');
const all_standings = require('./standings.json');

// Array.from - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Set - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// Array.map - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
const years = Array.from(new Set(all_standings.map(s => s.year)));
const leagues = Array.from(new Set(all_standings.map(s => s.league)));
const divisions = Array.from(new Set(all_standings.map(s => s.division)));

//Creates the heading of the page
const heading = (title) => {
    const html = `
        <!doctype html>
            <html>
                <head>
                    <title>${title}</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css">
                </head>
                <body>
                    <a href = "/-">Home</a>
                    <br/>
                    <h1>${title}</h1>
    `;
    return html;
}

//Creates the footing of the page
const footing = () => {
    return `
        </body>
    </html>
    `;
}

//Creates the home page
const home = () => {

    var html = heading("Home") + `<a href = "/teams">Teams</a><p>Standings<p>`;

    //Loops through the arrays for years, leagues, and divisions to create the nested list with links
    for(var i =0; i<years.length;i++)
    {
        html += `<ul><li><a href="/standings/${years[i]}">${years[i]} Season</a>`;
        for(var j = 0; j<leagues.length;j++)
        {
            html+= `<ul><br><li><a href="/standings/${years[i]}/${leagues[j]}">${leagues[j]}</a></li>`
                for(var k = 0; k<divisions.length;k++)
                {
                    html+= `<ul><li><a href = "/standings/${years[i]}/${leagues[j]}/${divisions[k]}">${divisions[k]}</li></ul>`;
                }
            html += `</ul>`;
        }

        html+=`</li></ul>`;
    }

    return html;

    
}

//Creates the teams page
const teams_page = () => {

    //Creates table headings
    var html = heading("Teams") + 
               `<table>
                    <thead>
                        <tr>

                            <td><b>LOGO</td>
                            <td><b>CITY</td>
                            <td><b>NAME</td>
                            <td><b>CODE</td>
                        </tr>
                    </thead>`;

    //Loops through the teams array to create the table
    for(var i = 0; i<teams.length;i++)
    {
        html+= `<tr>
                    <td><img src = "${teams[i].logo}"></td>
                    <td>${teams[i].city}</td>
                    <td>${teams[i].name}</td>
                    <td>${teams[i].code}</td>
                </tr>`;
    
    }             
    html+= `</table>`;
    return html;
}

//Creates the standings pages
const standings = (parts) => {

    //If the length of the parts array is 2, then the user clicked on a year
    if(parts.length ==2)
    {
        var html = heading("Standings - " + parts[1]) + 
                   `<table>
                        <thead>
                            <tr>
                                <td><b>LOGO</td>
                                <td><b>CITY</td>
                                <td><b>NAME</td>
                                <td><b>WINS</td>
                                <td><b>LOSSES</td>
                            </tr>
                        </thead>`;

        //Creates a new array to store the standings for the year
        var new_standings = [];
        for(var j = 0; j<all_standings.length;j++)
        {

            if(all_standings[j].year == parts[1])
            {
                new_standings.push(all_standings[j]);
            }
        }

        //Sorts the new array by wins in descending order
        new_standings.sort(function (a, b) {
            return b.wins - a.wins; 
        });

        //Loops through the new array to create the table
        for(var i = 0; i<new_standings.length;i++)
        {
            for(var j = 0; j<teams.length;j++)
            {
                if(new_standings[i].team == teams[j].code)
                {
                    html+=`<tr> 
                                <td><img src = "${teams[j].logo}"</td>
                                <td>${teams[j].city}</td>
                                <td>${teams[j].name}</td>
                                <td>${new_standings[i].wins}</td>
                                <td>${new_standings[i].losses}</td>
                            </tr>`;
                }
            }
        }
        return html + `</table>`;
    }

    //If the length of the parts array is 3, then the user clicked on a year and a league
    if(parts.length == 3)
    {
        var html = heading("Standings - " + parts[1] + " - " + parts[2]) + 
                   `<table>
                        <thead>
                            <tr>
                                <td><b>LOGO</td>
                                <td><b>CITY</td>
                                <td><b>NAME</td>
                                <td><b>WINS</td>
                                <td><b>LOSSES</td>
                            </tr>
                        </thead>`;

        //Creates a new array to store the standings for the year and league
        var new_standings = [];
        
        for(var j = 0; j<all_standings.length;j++)
        {

            if(all_standings[j].year == parts[1] && all_standings[j].league == parts[2])
            {

                new_standings.push(all_standings[j]);
            }
        }

        //Sorts the new array by wins in descending order
        new_standings.sort(function (a, b) {
            return b.wins - a.wins; 
        });

        //Loops through the new array to create the table
        for(var i = 0; i<new_standings.length;i++)
        {
            for(var j = 0; j<teams.length;j++)
            {
                if(new_standings[i].team == teams[j].code)
                {
                    html+=`<tr> 
                                <td><img src = "${teams[j].logo}"</td>
                                <td>${teams[j].city}</td>
                                <td>${teams[j].name}</td>
                                <td>${new_standings[i].wins}</td>
                                <td>${new_standings[i].losses}</td>
                            </tr>`;
                }
            }
        }
        return html + `</table>`;
    }

    //If the length of the parts array is 4, then the user clicked on a year, a league, and a division
    if(parts.length == 4)
    {
        var html = heading("Standings - " + parts[1] + " - " + parts[2] + " - " + parts[3]) + 
                   `<table>
                        <thead>
                            <tr>
                                <td><b>LOGO</td>
                                <td><b>CITY</td>
                                <td><b>NAME</td>
                                <td><b>WINS</td>
                                <td><b>LOSSES</td>
                            </tr>
                        </thead>`;

        //Creates a new array to store the standings for the year, league, and division
        var new_standings = [];
        
        for(var j = 0; j<all_standings.length;j++)
        {

            if(all_standings[j].year == parts[1] && all_standings[j].league == parts[2] && all_standings[j].division == parts[3])
            {
                new_standings.push(all_standings[j]);
            }
        }

        //Sorts the new array by wins in descending order
        new_standings.sort(function (a, b) {
            return b.wins - a.wins; 
        });

        //Loops through the new array to create the table
        for(var i = 0; i<new_standings.length;i++)
        {
            for(var j = 0; j<teams.length;j++)
            {
                if(new_standings[i].team == teams[j].code)
                {
                    html+=`<tr> 
                                <td><img src = "${teams[j].logo}"</td>
                                <td>${teams[j].city}</td>
                                <td>${teams[j].name}</td>
                                <td>${new_standings[i].wins}</td>
                                <td>${new_standings[i].losses}</td>
                            </tr>`;
                }
            }
        }
        return html + `</table>`;

    }
}

//Analyzes the parts of the URL and returns the correct page
const partsAnalyze = (parts) => {
    if(parts[0] == "-" || parts[0]=="")
    {
        return home();
    }

    if(parts[0] == "teams")
    {
        return teams_page();
    }

    if(parts.length>1)
    {
        return standings(parts);
    }

    return heading("404") + "Page not found"
}

//Serves the page
const serve = (req, res) => {
    //Parses the URL
    const uri = url.parse(req.url).pathname;

    //Splits the uri into an array
    const parts = uri.split('/').splice(1);
    
    //Creates the page
    const html = partsAnalyze(parts) + footing();

    //Sends the page to the client
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}

//Creates a server
http.createServer(serve).listen(3000);