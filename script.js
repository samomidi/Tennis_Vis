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
    panelSvg.parentNode.replaceChild(panelSvg.cloneNode(false), panelSvg);
    if (type === 'WinRates') {
        winPercentBarChartPanel(panel);
    }
    else if (type === 'Template') {
        templateFunction(panel);
    }
    else if (type === 'test1'){
        test1(panel)
    }
}

function makeFilterOptions() {
    // Players
    let playersSelect = d3.select('.visgrid--view-player')
        .select('.visgrid__panel--description')
        .append('select')
        .attr('class', 'select .visgrid__select--player')
        .on('change', function() {onFilterChange(this)});

    d3.csv(playersPath).then(function(data) {
        playersSelect
            .selectAll('option')
            .data(data)
            .enter()
            .append('option')
            .text(function(d) {return d["Name"]});
    });

    // Tournaments
    let tournamentsSelect = d3.select('.visgrid--view-tournament')
        .select('.visgrid__panel--description')
        .append('select')
        .attr('class', 'select .visgrid__select--tournament')
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
        .select('.visgrid__panel--description')
        .append('select')
        .attr('class', 'select .visgrid__select--nationality')
        .on('change', function() {onFilterChange(this)});

    d3.csv(nationalitiesPath).then(function(data) {
        nationalitySelect
            .selectAll('option')
            .data(data).enter()
            .append('option')
            .text(function(d) {return d["Nationality"]});
    });
}

function onFilterChange(selection) {
    if (selection.classList.contains(".visgrid__select--player")) {
        playerFilter = d3.select(selection).property('value');
    }
    else if (selection.classList.contains(".visgrid__select--tournament")) {
        tournamentFilter = d3.select(selection).property('value');
    }
    else if (selection.classList.contains(".visgrid__select--nationality")) {
        nationalityFilter1 = d3.select(selection).property('value');
    }
}

function winPercentBarChartPanel(panel) {
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
                    "Wins": 0,
                    "Losses": 1
                };
                nameStats.push(newPlayer);
                idsDone[d["loser_id"]] = currentIndex;
                currentIndex++;
            }
        });


        console.log(nameStats);

        nameStats.forEach(function(d) {
            d["WinPercent"] = d["Wins"] / (d["Wins"] + d["Losses"]);
        });

        // Making bar chart
        d3.select(panel)
            .select("svg")
            .selectAll("rect")
            .data(nameStats)
            .enter()
            .append("rect")
            .attr("width", function(d) {
                return d["WinPercent"] * 1000;
            })
            .attr("height", 20)
            .attr("x", 50)
            .attr("y", function(d, i) { // i in the index
                return i * 50 + 50;
            })
            .on("mouseenter", function(d, i) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#FF9C00");
                d3.select("svg")
                    .append("text")
                    .attr("class", "tooltip")
                    .attr("x", 50 + 10 + d["WinPercent"]*10)
                    .attr("y", (i * 50 + 50 + 15))
                    .text(d["Name"] + ": " + d["WinPercent"] + "% win rate")
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "gold");
                d3.selectAll(".tooltip")
                    .remove();
            });
    });

}

function surfacesOverTime(panel) {
  d3.csv(dataPath).then(function(data) {
    
  });
}

function templateFunction(panel) {
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


function test1(panel) {
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

/*
function winPercentBarChart(data) {
    let nameStats = [];
    let idsDone = {};
    let currentIndex = 0;

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
                "Wins": 0,
                "Losses": 1
            };
            nameStats.push(newPlayer);
            idsDone[d["loser_id"]] = currentIndex;
            currentIndex++;
        }
    });


    console.log(nameStats);

    nameStats.forEach(function(d) {
        d["WinPercent"] = d["Wins"] / (d["Wins"] + d["Losses"]);
    });

    // Making bar chart
    d3.select("#myDiv")
        .select("svg")
        .selectAll("rect")
        .data(nameStats)
        .enter()
        .append("rect")
        .attr("width", function(d) {
            return d["WinPercent"] * 1000;
        })
        .attr("height", 20)
        .attr("x", 50)
        .attr("y", function(d, i) { // i in the index
            return i * 50 + 50;
        })
        .on("mouseenter", function(d, i) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "#FF9C00");
            d3.select("svg")
                .append("text")
                .attr("class", "tooltip")
                .attr("x", 50 + 10 + d["WinPercent"]*10)
                .attr("y", (i * 50 + 50 + 15))
                .text(d["Name"] + ": " + d["WinPercent"] + "% win rate")
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "gold");
            d3.selectAll(".tooltip")
                .remove();
        });

}
*/


const dataPath = "data/three_years.csv";
const playersPath = "data/names.csv";
const tournamentsPath = "data/tournaments.csv";
const nationalitiesPath = "data/nationalities.csv";

let playerFilter = "";
let tournamentFilter = "";
let nationalityFilter1 = "";
// let nationalityFilter2 = "";
//d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});
