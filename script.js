function openTab(evt, tabName) {
    // Declare all variables
    let i, tabContent, tabLinks;

    // Get all elements with class="tab_content" and hide them
    tabContent = document.getElementsByClassName("visgrid");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tabLinks = document.getElementsByClassName("tabs__tab");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className
            .replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementsByClassName(tabName)[0].style.display = "grid";
    evt.currentTarget.className += " active";
}


function showDropdown(dropdown) {
    dropdown.getElementsByClassName("visgrid__dropdown-content")[0].classList.toggle("visgrid__dropdown--show");
}


// Quit dropdown menu if clicked out of it
window.onclick = function(event) {
    let target = event.target;
    if (!target.matches('.visgrid__dropdown-menu-button')) {
        let drop_downs = document.getElementsByClassName("visgrid__dropdown-content");
        let i;
        for (i = 0; i < drop_downs.length; i++) {
            let openDropdown = drop_downs[i];
            if (openDropdown.classList.contains('visgrid__dropdown--show')) {
                openDropdown.classList.remove('visgrid__dropdown--show');
            }
        }
    }
};


function showVisualisation(type, button) {
    let panel = button.parentElement.parentElement.parentElement;

    // Removing previous visualisation
    let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    panelSvg.style.height = "100%";
    panelSvg.style.width = "100%";
    panelSvg.parentNode.replaceChild(panelSvg.cloneNode(false), panelSvg);

    switch(type) {
        case('WinRates'):
            winPercentBarChartPanel(panel);
            break;
        case('Template'):
            templateFunction(panel);
            break;
        case('SurfacesOverTime'):
            surfacesOverTime(panel);
            break;
        case('Test1'):
            Test1(panel);
            break;
        case('WinNumbers'):
            winNumbersBarChart(panel);
            break;
        case('TourneyNumbers'):
            tourneysAttendedBarChart(panel);
            break;
        case('TourneyMinutes'):
            TourneyMinutes(panel);
            break;
        case('ATPChart'):
            ATPRankPointBarChart(panel);
            break;
        case('PlayerGameTime'):
            PlayerGameTime(panel);
            break;

        // By Player
        case('WinRatesPlayer'):
            winPercentPlayerBarChart(panel);
            break;
        case('WinsPlayer'):
            winsAgainstPlayerBarChart(panel);
            break;
        case('LossesPlayer'):
            lossesAgainstPlayerBarChart(panel);
            break;
        default:
            break;
    }
}


function makeFilterOptions() {
    // Players
    let playersSelect = d3.select('.visgrid--view-player')
        .select('.visgrid__panel--description1')
        .append('select')
        .attr('class', 'select visgrid__select--player')
        .on('change', function() {onFilterChange(this)});

    d3.csv(playersPath).then(function(data) {
        playersSelect
            .selectAll('option')
            .data(data)
            .enter()
            .append('option')
            .text(function(d) {return d["Name"]})
            .attr("value", d => d["ID"])
    });

    let playersSelect2 = d3.select('.visgrid--view-player')
        .select('.visgrid__panel--description2')
        .append('select')
        .attr('class', 'select visgrid__select--player2')
        .on('change', function() {onFilterChange(this)});

    d3.csv(playersPath).then(function(data) {
        playersSelect2
            .selectAll('option')
            .data(data)
            .enter()
            .append('option')
            .text(function(d) {return d["Name"]})
            .attr("value", d => d["ID"]);
    });

    // Tournaments
    let tournamentsSelect = d3.select('.visgrid--view-tournament')
        .select('.visgrid__panel--description')
        .append('select')
        .attr('class', 'select visgrid__select--tournament')
        .on('change', function() {onFilterChange(this)});

    d3.csv(tournamentsPath).then(function(data) {
        tournamentsSelect
            .selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function(d) {return d["Tournament"]});
    });

    // Nationalities
    let nationalitySelect = d3.select('.visgrid--view-nationality')
        .select('.visgrid__panel--description1')
        .append('select')
        .attr('class', 'select visgrid__select--nationality')
        .on('change', function() {onFilterChange(this)});

    d3.csv(nationalitiesPath).then(function(data) {
        nationalitySelect
            .selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function(d) {return d["Nationality"]});
    });

    let nationalitySelect2 = d3.select('.visgrid--view-nationality')
        .select('.visgrid__panel--description2')
        .append('select')
        .attr('class', 'select visgrid__select--nationality2')
        .on('change', function() {onFilterChange(this)});

    d3.csv(nationalitiesPath).then(function(data) {
        nationalitySelect2
            .selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function(d) {return d["Nationality"]});
    });


    let playerSelect1 = document.getElementsByClassName("visgrid__select--player")[0];
    playerSelect1.value = "103819";

    let playerSelect2 = document.getElementsByClassName("visgrid__select--player2")[0];
    playerSelect2.value = "104925";
}


function onFilterChange(selection) {
    if (selection.classList.contains("visgrid__select--player")) {
        playerFilter = d3.select(selection).property('value');
        makePlayerDetails(selection, playerFilter);
    }
    else if (selection.classList.contains("visgrid__select--player2")) {
        playerFilter2 = d3.select(selection).property('value');
        makePlayerDetails(selection, playerFilter2);
    }
    else if (selection.classList.contains("visgrid__select--tournament")) {
        tournamentFilter = d3.select(selection).property('value');
    }
    else if (selection.classList.contains("visgrid__select--nationality")) {
        nationalityFilter1 = d3.select(selection).property('value');
    }
    else if (selection.classList.contains("visgrid__select--nationality2")) {
        nationalityFilter2 = d3.select(selection).property('value');
    }
}

function switchPlayerFilter() {
    let filterLeft = document.getElementsByClassName("visgrid__select--player")[0];
    let filterRight = document.getElementsByClassName("visgrid__select--player2")[0];

    let filterLeftOldVal = filterLeft.value;

    filterLeft.value = filterRight.value;
    filterRight.value = filterLeftOldVal;
    onFilterChange(filterLeft);
    onFilterChange(filterRight);
}

function makePlayerDetails(dropdown, player) {

    let name = dropdown.options[dropdown.selectedIndex].text;

    d3.select(dropdown.parentNode)
        .selectAll("p")
        .remove();

    d3.csv(dataPath).then(function(data) {
        let wins = data.filter(d => d["winner_id"] === player);
        let losses = data.filter(d => d["loser_id"] === player);
        let games = data.filter(d => d["winner_id"] === player | d["loser_id"] === player);

        let winsByOpponent =  d3.nest().key(d => d["winner_id"]).entries(losses);
        let lossesByOpponent = d3.nest().key(d => d["loser_id"]).entries(wins);

        let tournaments = d3.nest().key(d=>d["tourney_id"]).entries(games);

        // Aggregate Opponents
        let idsDone = {};
        let opponents = [];
        let currentIndex = 0;

        winsByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["LostAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst": 0,
                    "LostAgainst": d.values.length
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        lossesByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["WonAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst":  d.values.length,
                    "LostAgainst": 0
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        opponents.forEach(function(d) {
            d["GamesAgainst"] = d["WonAgainst"] + d["LostAgainst"];
            d["WinRateAgainst"] = d["WonAgainst"]/(d["GamesAgainst"]);
        });

        let latestGame = maxBy(games, "tourney_date");
        let latestGameVar = "winner_rank_points";
        if (latestGame["winner_id"] !== player) {
            latestGameVar = "loser_rank_points";
        }


        d3.select(dropdown.parentNode)
            // Name
            .append("p")
            .text(`Name: ${name}`)
            // Most recent ranking
            .append("p")
            .text(`ATP Ranking: ${latestGame[latestGameVar]}`)
            // Win rate
            .append("p")
            .text(`Win Rate: ${(wins.length/(wins.length+losses.length)*100).toFixed(3)}%`)
            // Number of tournaments played
            .append("p")
            .text(`Tournaments attended: ${tournaments.length}`)
            // Number of games played
            .append("p")
            .text(`Number of games played: ${games.length}`)
            // Most played
            .append("p")
            .text(`Most Played: ${maxBy(opponents, "GamesAgainst")["Name"]}, 
            ${maxBy(opponents, "GamesAgainst")["GamesAgainst"]} games`)
            // Best opponent
            .append("p")
            .text(`Best win rate against: ${maxBy(opponents, "WinRateAgainst")["Name"]}, 
            ${maxBy(opponents, "WinRateAgainst")["WinRateAgainst"]*100}%`)
            // Worst opponent
            .append("p")
            .text(`Worst win rate against: ${minBy(opponents, "WinRateAgainst")["Name"]}, 
            ${minBy(opponents, "WinRateAgainst")["WinRateAgainst"]*100}%`)
    })
}

function winPercentPlayerBarChart(panel) {

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        let player = playerFilter;

        let wins = data.filter(d => d["winner_id"] === player);
        let losses = data.filter(d => d["loser_id"] === player);
        let games = data.filter(d => d["winner_id"] === player | d["loser_id"] === player);

        let winsByOpponent =  d3.nest().key(d => d["winner_id"]).entries(losses);
        let lossesByOpponent = d3.nest().key(d => d["loser_id"]).entries(wins);

        // Aggregate Opponents
        let idsDone = {};
        let opponents = [];
        let currentIndex = 0;

        winsByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["LostAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst": 0,
                    "LostAgainst": d.values.length
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        lossesByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["WonAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst":  d.values.length,
                    "LostAgainst": 0
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        opponents.forEach(function(d) {
            d["GamesAgainst"] = d["WonAgainst"] + d["LostAgainst"];
            d["WinPercent"] = d["WonAgainst"]/(d["GamesAgainst"]);
        });


        // Filter and sort
        let nameStats = opponents.filter(d => d["GamesAgainst"] > 0);
        nameStats = nameStats.sort(function(a, b) {return a["WinPercent"] - b["WinPercent"]});

        let neverBeaten = nameStats.filter(d => d["WinPercent"] === 0);
        let haveBeaten = nameStats.filter(d => d["WinPercent"] > 0);

        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height-margin.bottom, margin.top]);


        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(haveBeaten)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["WinPercent"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["WinPercent"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", height*0.92)
                    .text(`${d["Name"]}: ${(d["WinPercent"]*100).toFixed(3)}% win rate against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", (height*0.92)+20)
                    .text(`${d["GamesAgainst"]} matches played against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            })
            .on("click", function(d) {
                let selector = document.getElementsByClassName("visgrid__select--player2")[0];
                selector.value = d["ID"];
                onFilterChange(selector);
            })


        // Then add bars for people he has never beaten
            .exit()
            .data(neverBeaten)
            .enter()
            .append("rect")
            .attr("height", height-margin.bottom-margin.top)
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", margin.top)
            .style("fill", "#4a4634")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#eae4e3");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", height*0.92)
                    .text(`${d["Name"]}: ${(d["WinPercent"]*100).toFixed(3)}% win rate against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", (height*0.92)+20)
                    .text(`${d["GamesAgainst"]} matches played against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#4a4634");
                svg.selectAll(".tooltip")
                    .remove();
            })
            .on("click", function(d) {
                let selector = document.getElementsByClassName("visgrid__select--player2")[0];
                selector.value = d["ID"];
                onFilterChange(selector);
            });


        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text(`${nameIDDict[player]}'s Win Rates against other players`);


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}

function lossesAgainstPlayerBarChart(panel) {

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        let player = playerFilter;

        let wins = data.filter(d => d["winner_id"] === player);
        let losses = data.filter(d => d["loser_id"] === player);
        let games = data.filter(d => d["winner_id"] === player | d["loser_id"] === player);

        let winsByOpponent =  d3.nest().key(d => d["winner_id"]).entries(losses);
        let lossesByOpponent = d3.nest().key(d => d["loser_id"]).entries(wins);

        // Aggregate Opponents
        let idsDone = {};
        let opponents = [];
        let currentIndex = 0;

        winsByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["LostAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst": 0,
                    "LostAgainst": d.values.length
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        lossesByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["WonAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst":  d.values.length,
                    "LostAgainst": 0
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        opponents.forEach(function(d) {
            d["GamesAgainst"] = d["WonAgainst"] + d["LostAgainst"];
            d["WinPercent"] = d["WonAgainst"]/(d["GamesAgainst"]);
        });


        // Filter and sort
        let nameStats = opponents.filter(d => d["LostAgainst"] > 0);
        nameStats = nameStats.sort(function(a, b) {return a["LostAgainst"] - b["LostAgainst"]});


        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d=>d["LostAgainst"])])
            .range([height-margin.bottom, margin.top]);

        let numberEntries = nameStats.length;

        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["LostAgainst"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["LostAgainst"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", height*0.92)
                    .text(`${d["Name"]}: ${d["LostAgainst"]} losses against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", (height*0.92)+20)
                    .text(`${d["GamesAgainst"]} matches played against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            })
            .on("click", function(d) {
                let selector = document.getElementsByClassName("visgrid__select--player2")[0];
                selector.value = d["ID"];
                onFilterChange(selector);
            })

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text(`${nameIDDict[player]}'s numbers of losses against other players`);


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}

function winsAgainstPlayerBarChart(panel) {

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        let player = playerFilter;

        let wins = data.filter(d => d["winner_id"] === player);
        let losses = data.filter(d => d["loser_id"] === player);
        let games = data.filter(d => d["winner_id"] === player | d["loser_id"] === player);

        let winsByOpponent =  d3.nest().key(d => d["winner_id"]).entries(losses);
        let lossesByOpponent = d3.nest().key(d => d["loser_id"]).entries(wins);

        // Aggregate Opponents
        let idsDone = {};
        let opponents = [];
        let currentIndex = 0;

        winsByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["LostAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst": 0,
                    "LostAgainst": d.values.length
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        lossesByOpponent.forEach(function(d) {
            if (d.key in idsDone) {
                let id = idsDone[d.key];
                opponents[id]["WonAgainst"] += d.values.length;
            }
            else {
                let newPlayer = {
                    "ID": d.key,
                    "Name": nameIDDict[d.key],
                    "WonAgainst":  d.values.length,
                    "LostAgainst": 0
                };
                opponents.push(newPlayer);
                idsDone[d.key] = currentIndex;
                currentIndex++;
            }
        });

        opponents.forEach(function(d) {
            d["GamesAgainst"] = d["WonAgainst"] + d["LostAgainst"];
            d["WinPercent"] = d["WonAgainst"]/(d["GamesAgainst"]);
        });


        // Filter and sort
        let nameStats = opponents.filter(d => d["WonAgainst"] > 0);
        nameStats = nameStats.sort(function(a, b) {return b["WonAgainst"] - a["WonAgainst"]});


        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d=>d["WonAgainst"])])
            .range([height-margin.bottom, margin.top]);

        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["WonAgainst"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["WonAgainst"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", height*0.92)
                    .text(`${d["Name"]}: ${d["WonAgainst"]} losses against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/3)
                    .attr("y", (height*0.92)+20)
                    .text(`${d["GamesAgainst"]} matches played against`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            })
            .on("click", function(d) {
                let selector = document.getElementsByClassName("visgrid__select--player2")[0];
                selector.value = d["ID"];
                onFilterChange(selector);
            })

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text(`${nameIDDict[player]}'s number of wins against other players`);


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}


function maxBy(array, value) {
    let currentMax = array[0];
    array.forEach(function(d) {
        if (d[value] > currentMax[value]) {
            currentMax = d;
        }
    });
    return currentMax;
}


function minBy(array, value) {
    let currentMax = array[0];
    array.forEach(function(d) {
        if (d[value] < currentMax[value]) {
            currentMax = d;
        }
    });
    return currentMax;
}


function winPercentBarChartPanel(panel) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function(d) {
            if (d["winner_id"] in idsDone) {
                let id = idsDone[d["winner_id"]];
                nameStats[id]["Wins"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["winner_id"],
                    "Name": d["winner_name"],
                    "Wins": 1,
                    "Losses": 0,
                    "IOC": d["winner_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["winner_id"]] = currentIndex;
                currentIndex++;
            }

            if (d["loser_id"] in idsDone) {
                let id = idsDone[d["loser_id"]];
                nameStats[id]["Losses"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["loser_id"],
                    "Name": d["loser_name"],
                    "Wins": 0,
                    "Losses": 1,
                    "IOC": d["loser_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });

        nameStats.forEach(function(d) {
            d["WinPercent"] = d["Wins"] / (d["Wins"] + d["Losses"]);
        });

        // Filter more than 50 games only
        nameStats = nameStats.filter(d => d["Wins"] + d["Losses"] > 50);
        nameStats = nameStats.sort(function(a, b) {return b["WinPercent"] - a["WinPercent"]});


        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height-margin.bottom, margin.top]);


        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["WinPercent"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["WinPercent"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(`${d["Name"]}: ${(d["WinPercent"]*100).toFixed(3)}% win rate`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text("Nationality: " + d["IOC"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text("Player Win Rates (Only for >50 Professional games)");


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}


function ATPRankPointBarChart(panel) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function(d) {
            if (d["winner_id"] in idsDone) {
                let id = idsDone[d["winner_id"]];
                if (d["tourney_date"] > nameStats[id]["Date"]) {
                    nameStats[id]["Date"] = d["tourney_date"];
                    nameStats[id]["RankPoints"] = parseInt(d["winner_rank_points"]);
                }
            }
            else {
                let newPlayer = {
                    "ID": d["winner_id"],
                    "Name": d["winner_name"],
                    "IOC": d["winner_ioc"],
                    "Date": d["tourney_date"],
                    "RankPoints": parseInt(d["winner_rank_points"])
                };
                nameStats.push(newPlayer);
                idsDone[d["winner_id"]] = currentIndex;
                currentIndex++;
            }

            if (d["loser_id"] in idsDone) {
                let id = idsDone[d["loser_id"]];
                if (d["tourney_date"] > nameStats[id]["Date"]) {
                    nameStats[id]["Date"] = d["tourney_date"];
                    nameStats[id]["RankPoints"] = parseInt(d["loser_rank_points"]);
                }
            }
            else {
                let newPlayer = {
                    "ID": d["loser_id"],
                    "Name": d["loser_name"],
                    "IOC": d["loser_ioc"],
                    "Date": d["tourney_date"],
                    "RankPoints": parseInt(d["loser_rank_points"])
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });

        let minRankPoints = 500;
        // Filter more than x rank points only
        nameStats = nameStats.filter(d => d["RankPoints"]> minRankPoints);
        nameStats = nameStats.sort(function(a, b) {return b["RankPoints"] - a["RankPoints"]});



        let timeParser = d3.timeParse("%Y%m%d");
        let timeFormatter = d3.timeFormat("%a %d %B %Y");

        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([d3.min(nameStats, d=>d["RankPoints"]), d3.max(nameStats, d=>d["RankPoints"])])
            .range([height-margin.bottom, margin.top]);

        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["RankPoints"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["RankPoints"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(d["Name"] + ": " + d["RankPoints"] + " Rank Points")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text(`Date : ${timeFormatter(timeParser(d["Date"]))}`)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+40)
                    .text("Nationality: " + d["IOC"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text(`Player Rank Points (Only for >${minRankPoints})`);


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}


function tourneysAttendedBarChart(panel) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function(d) {
            if (d["winner_id"] in idsDone) {
                let id = idsDone[d["winner_id"]];
                nameStats[id]["Tourneys"].add(d["tourney_id"]);
                nameStats[id]["Tourney_names"].push(d["tourney_name"]);
            }
            else {
                let newPlayer = {
                    "ID": d["winner_id"],
                    "Name": d["winner_name"],
                    "Tourneys": new Set([d["tourney_id"]]),
                    "Tourney_names": [],
                    "IOC": d["winner_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["winner_id"]] = currentIndex;
                currentIndex++;
            }

            if (d["loser_id"] in idsDone) {
                let id = idsDone[d["loser_id"]];
                nameStats[id]["Tourneys"].add(d["tourney_id"]);
                nameStats[id]["Tourney_names"].push(d["tourney_name"]);
            }
            else {
                let newPlayer = {
                    "ID": d["loser_id"],
                    "Name": d["loser_name"],
                    "Tourneys": new Set([d["tourney_id"]]),
                    "Tourney_names": [],
                    "IOC": d["loser_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });

        let min_tournaments = 20;
        // Filter more than min_tournaments only
        console.log(nameStats);

        nameStats = nameStats.filter(d => d["Tourneys"].size > min_tournaments);
        nameStats = nameStats.sort(function(a, b) {return b["Tourneys"].size - a["Tourneys"].size});



        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d => d["Tourneys"].size)])
            .range([height-margin.bottom, margin.top]);

        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["Tourneys"].size))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["Tourneys"].size))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(d["Name"] + ": " + d["Tourneys"].size + " tournaments attended")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text("Nationality: " + d["IOC"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text("Number of tournaments attended (only for >" + min_tournaments + ")");


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}


function winNumbersBarChart(panel) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;
    let margin = {top: 50, right: 50, bottom: 50, left: 50};

    // let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    // panelSvg.style.height = height*100;
    // panelSvg.style.width = width*100;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function(d) {
            if (d["winner_id"] in idsDone) {
                let id = idsDone[d["winner_id"]];
                nameStats[id]["Wins"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["winner_id"],
                    "Name": d["winner_name"],
                    "Wins": 1,
                    "Losses": 0,
                    "IOC": d["winner_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["winner_id"]] = currentIndex;
                currentIndex++;
            }

            if (d["loser_id"] in idsDone) {
                let id = idsDone[d["loser_id"]];
                nameStats[id]["Losses"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["loser_id"],
                    "Name": d["loser_name"],
                    "Wins": 0,
                    "Losses": 1,
                    "IOC": d["loser_ioc"]
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });

        // Filter more than 50 games only
        nameStats = nameStats.filter(d => d["Wins"] + d["Losses"] > 50);
        nameStats = nameStats.sort(function(a, b) {return b["Wins"] - a["Wins"]});


        // Making x-scale and y-scale
        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width-margin.right]);


        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d => d["Wins"])])
            .range([height-margin.bottom, margin.top]);

        let numberEntries = nameStats.length;


        // Making bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", d => height-margin.bottom - y(d["Wins"]))
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("x", d => x(d["ID"]))
            .attr("y", d => y(d["Wins"]))
            .style("fill", "#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(d["Name"] + ": " + d["Wins"] + "% Wins")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text("Nationality: " + d["IOC"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text("Number of matches won (Only for >50 Professional games)");


        // Axis
        let yAxis = g => g
            .attr("transform", `translate(${margin.left-5}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);
    });
}


function surfacesOverTime(panel) {
  d3.csv(dataPath).then(function(data) {

      // Based off https://observablehq.com/@d3/stacked-bar-chart

      let aggregated = d3.nest()
          .key(d => d["tourney_date"].substring(0,6))
          .key(d => d["surface"])
          .rollup(function(d) { return {"length": d.length};
          })
          .entries(data);

      let surfaces = [];

      aggregated.forEach(function(d) {
          let record = {"month": 0, "Clay": 0, "Grass": 0, "Hard": 0, "Carpet": 0, "NA": 0};
          record["month"] = d["key"];
          for (let i =0; i < d["values"].length; i++) {
              let j = d["values"][i];
              record[j["key"]] = j["value"]["length"];
          }
          surfaces.push(record);
      });

      let monthParse = d3.timeParse("%Y%m");
      let scaleDateFormat = d3.timeFormat("%Y\n%m");

      let series = d3.stack().keys(["Clay", "Grass", "Hard", "Carpet", "NA"])(surfaces);

      let svg = d3.select(panel).select('svg');
      let width = panel.offsetWidth;
      let height = panel.offsetHeight;
      let margin = {top: 50, right: 50, bottom: 50, left: 50};


      // Making x-scale, y-scale, and colour-scale
      let x = d3.scaleBand()
          .domain(surfaces.map(d => d["month"]))
          .range([margin.left, width-margin.right]);


      let y = d3.scaleLinear()
          .domain([0, d3.max(series, function(d) {return d3.max(d, function(d) {return d[1]; }); })])
          .range([height-margin.bottom, margin.top]);

      let color = d3.scaleOrdinal()
          .domain(series.map(d => d.key))
          .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
          .unknown("#ccc");


      // Axes and legend
      let xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(x => scaleDateFormat(monthParse(x))))
          .call(g => g.selectAll(".domain").remove());

      let yAxis = g => g
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y).ticks(null, "s"));

      let legend = svg => {
          const g = svg
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
              .attr("transform", `translate(${width - (margin.right/2)},${margin.top/2})`)
              .selectAll("g")
              .data(series.slice().reverse())
              .join("g")
              .attr("transform", (d, i) => `translate(0,${i * 20})`);

          g.append("rect")
              .attr("x", -19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", d => color(d.key));

          g.append("text")
              .attr("x", -24)
              .attr("y", 9.5)
              .attr("dy", "0.35em")
              .text(d => d.key);
      };

      // Actually produce the plot
      svg.append("g")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("fill", d => color(d.key) )
          .selectAll("rect")
          .data(d => d)
          .join("rect")
          .attr("x", (d) => x(d.data["month"]))
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth());

      svg.append("g")
          .call(xAxis)
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");

      svg.append("g")
          .call(yAxis);

      svg.append("g")
          .call(legend);

      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .style("font-family", "sans-serif")
          .text("Surface types over time");
  });
}


function templateFunction(panel) {

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;

    // IF THE VISUALIZATION SCROLLS, REPLACE THE SVG WITH A BIGGER ONE
    let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    panelSvg.style.height = height*100;
    panelSvg.style.width = width*100;


    // Load the data
    d3.csv(dataPath).then(function(data) {

        // Filter it accordingly
        let allFiltered = data.filter(function(d) {
            return(d["winner_name"] === playerFilter | d["loser_name"] === playerFilter)
        });

        // Aggregate as needed
        let aggregated = d3.nest()
            .key(function(d) {return d["tourney_name"];})
            .entries(allFiltered);

        // Then produce the corresponding visualisation in the panel

         d3.select(panel).
             select('svg').
             data(aggregated).
             then(function(d) {});

    });
}


function Test1(panel) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function(d) {
            if (d["winner_id"] in idsDone) {
                let id = idsDone[d["winner_id"]];
                nameStats[id]["Wins"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["winner_id"],
                    "Name": d["winner_name"],
                    "Age":d["winner_age"],
                    "Wins": 1,
                    "Losses": 0
                };
                nameStats.push(newPlayer);
                idsDone[d["winner_id"]] = currentIndex;
                currentIndex++;
            }

            if (d["loser_id"] in idsDone) {
                let id = idsDone[d["loser_id"]];
                nameStats[id]["Losses"]++;
            }
            else {
                let newPlayer = {
                    "ID": d["loser_id"],
                    "Name": d["loser_name"],
                    "Age":d["winner_age"],
                    "Wins": 0,
                    "Losses": 1
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });



        // for (i=0; i <nameStats.length; i++){
        //     console.log(nameStats[i]["Name"])
        // }
        nameStats.forEach(function(d) {
            d["WinPercent"] = d["Wins"] / (d["Wins"] + d["Losses"]);
        });

        console.log(nameStats);


        // Making Histogram of ages
        // const svg = d3.select('svg');
        //
        // const width = +svg.attr('width');
        // const height = +svg.attr('height');
        //
        // const xValue = d => d.Name;
        // const yValue = d => d.WinPercent;
        // const margin = { top: 20, right: 40, bottom: 20, left: 100 };
        // const innerWidth = width - margin.left - margin.right;
        // const innerHeight = height - margin.top - margin.bottom;
        //
        // const xScale = d3.scaleBand()
        //     .domain([nameStats.map(xValue)])
        //     .range([0,innerWidth]);
        //
        // const yScale = d3.scaleLinear()
        //     .domain([0, d3.max(nameStats, yValue)])
        //     .range([0, innerHeight]);


        d3.select(panel)
            .select("svg")
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            // .attr("y", d => yScale(yValue(d)) )
            // .attr("x", 50)
            // .attr("width", d => xScale(xValue(d)))
            // .attr("height", d => yScale(yValue(Math.abs(d))))
            // .attr("y", 50 )
            // .attr("x", 50)
            // .attr("width", 100)
            // .attr("height", 100);
            .attr("width", function(d) {
                return d["WinPercent"] * 1000;
            })
            .attr("height", 20)
            .attr("x", 50)
            .attr("y", function(d, i) { // i in the index
                return i * 50 + 50;
            })

    });

}


function TourneyMinutes(panel) {

    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function (d) {
            if (d["minutes"] !== "NA") {
                if (d["tourney_id"] in idsDone) {
                    let id = idsDone[d["tourney_id"]];
                    // console.log(d["minutes"]);
                    // console.log(parseInt(d.minutes));
                    nameStats[id]["Minutes"] = nameStats[id]["Minutes"] + parseInt(d["minutes"]);
                } else {
                    // console.log(parseInt(d.Minutes));
                    let newTourney = {
                        "ID": d["tourney_id"],
                        "Name": d["tourney_name"],
                        "Minutes": parseInt(d["minutes"])

                    };
                    nameStats.push(newTourney);
                    idsDone[d["tourney_id"]] = currentIndex;
                    currentIndex++;
                }

                if (d["loser_id"] in idsDone) {
                    let id = idsDone[d["loser_id"]];
                    nameStats[id]["Losses"]++;
                }
            }

        });

        nameStats = nameStats.filter(d => d["Minutes"] > 2700);

        nameStats = nameStats.sort(function (a, b) {
            return b["Minutes"] - a["Minutes"]
        });

        console.log(nameStats);

        nameStats.forEach(function (d) {

        })


        // let monthParse = d3.timeParse("%Y%m");
        // let scaleDateFormat = d3.timeFormat("%Y\n%m");


        let svg = d3.select(panel).select('svg');
        let width = panel.offsetWidth;
        let height = panel.offsetHeight;
        let margin = {top: 50, right: 50, bottom: 50, left: 50};

        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width - margin.right]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d => d["Minutes"])])
            .range([height - margin.bottom, margin.top]);

        let numberEntries = nameStats.length;


        // Now making the bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", function (d) {

                return height-margin.bottom - y(d["Minutes"]);
            })
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("y", d =>  y(d["Minutes"]))
            .attr("x", function (d) {
                // console.log(x(d["ID"]));
                return x(d["ID"]);
            })
            .attr("fill","#fcff07")
            .on("mouseenter", function(d, i) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(d["Name"] + ": " + d["Minutes"] + " Minutes")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text("ID: " + d["ID"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text("Length of the tournaments, above 2700 Mins");

        svg
            .enter()
            .transition()
            .duration(500)
            .attr("height", 0)
            .attr("width", 0)
            .attr("y", 0)
            .attr("x", 0);




        // Axis
        yAxis = g => g
            .attr("transform", `translate(${margin.left-1}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);


    });

}


function makeNameDict() {
    d3.csv(playersPath).then(function(data) {
        data.forEach(function(d) {
            nameIDDict[d["ID"]] = d["Name"];
        })
    });
}


function PlayerGameTime(panel) {

    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

    d3.csv(dataPath).then(function(data) {

        // Filling name_dict
        data.forEach(function (d) {
            if (d["minutes"] !== "NA") {
                if (d["winner_id"] in idsDone) {
                    let id = idsDone[d["winner_id"]];
                    // console.log(d["minutes"]);
                    // console.log(parseInt(d.minutes));
                    nameStats[id]["Minutes"] = nameStats[id]["Minutes"] + parseInt(d["minutes"]);
                } else {
                    // console.log(parseInt(d.Minutes));
                    let newTourney = {
                        "ID": d["winner_id"],
                        "Name": d["winner_name"],
                        "Minutes": parseInt(d["minutes"])

                    };
                    nameStats.push(newTourney);
                    idsDone[d["winner_id"]] = currentIndex;
                    currentIndex++;
                }

                // if (d["loser_id"] in idsDone) {
                //     let id = idsDone[d["loser_id"]];
                //     nameStats[id]["Minutes"] = nameStats[id]["Minutes"] + parseInt(d["minutes"]);
                // } else {
                //     let newPlayer = {
                //         "ID": d["winner_id"],
                //         "Name": d["winner_name"],
                //         "Minutes": parseInt(d["minutes"])
                //     };
                //     nameStats.push(newPlayer);
                //     idsDone[d["loser_id"]] = currentIndex;
                //     currentIndex++;
                //
                // }
            }

        });

        console.log(nameStats);

        nameStats = nameStats.filter(d => d["Minutes"] > 2700);

        nameStats = nameStats.sort(function (a, b) {
            return b["Minutes"] - a["Minutes"]
        });

        // console.log(nameStats);
        //
        // nameStats.forEach(function (d) {
        //
        // })
        console.log(nameStats);

        // let monthParse = d3.timeParse("%Y%m");
        // let scaleDateFormat = d3.timeFormat("%Y\n%m");


        let svg = d3.select(panel).select('svg');
        let width = panel.offsetWidth;
        let height = panel.offsetHeight;
        let margin = {top: 50, right: 50, bottom: 50, left: 50};

        let x = d3.scaleBand()
            .domain(nameStats.map(d => d["ID"]))
            .range([margin.left, width - margin.right]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(nameStats, d => d["Minutes"])])
            .range([height - margin.bottom, margin.top]);

        let numberEntries = nameStats.length;

        // Now making the bar chart
        svg
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("height", function (d) {

                return height-margin.bottom - y(d["Minutes"]);
            })
            .attr("width", (width-margin.left-margin.right)/numberEntries)
            .attr("y", d =>  y(d["Minutes"]))
            .attr("x", function (d) {
                // console.log(x(d["ID"]));
                return x(d["ID"]);
            })
            .attr("fill","#fcff07")
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", height/4)
                    .text(d["Name"] + ": " + d["Minutes"] + " Minutes")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
                svg
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", width/4)
                    .attr("y", (height/4)+20)
                    .text("ID: " + d["ID"])
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 14);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#fcff07");
                svg.selectAll(".tooltip")
                    .remove();
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .style("font-family", "sans-serif")
            .text("Length of the tournaments, above 2700 Mins");

        // svg
        //     .enter()
        //     .transition()
        //     .duration(500)
        //     .attr("height", 0)
        //     .attr("width", 0)
        //     .attr("y", 0)
        //     .attr("x", 0);




        // Axis
        yAxis = g => g
            .attr("transform", `translate(${margin.left-1}, 0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));

        svg.append("g").call(yAxis);

        console.log(nameStats);
    });

}

const dataPath = "data/three_years.csv";
const playersPath = "data/names.csv";
const tournamentsPath = "data/tournaments.csv";
const nationalitiesPath = "data/nationalities.csv";

let playerFilter = "103819";
let playerFilter2 = "104925";

let tournamentFilter = "";
let nationalityFilter1 = "";
let nationalityFilter2 = "";

let nameIDDict = {};
//d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});
