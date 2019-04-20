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
        case('test1'):
            test1(panel);
            break;
        default:
            break;
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

    let svg = d3.select(panel).select("svg");
    let height = panel.offsetHeight;
    let width = panel.offsetWidth;

    let panelSvg = panel.getElementsByClassName('visgrid__panel--svg')[0];
    panelSvg.style.height = height*100;
    panelSvg.style.width = width*100;

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

      console.log(surfaces);

      let monthParse = d3.timeParse("%Y%m");

      /*
      let prestack = ["Clay", "Grass", "Hard", "Carpet", "NA"].map(function(surface) {
          return surfaces.map(function(d) {
              return {x: monthParse(d["month"]), y: +d[surface]};
          });
      });
      console.log(prestack);
      */

      // Based off https://observablehq.com/@d3/stacked-bar-chart

      let series = d3.stack().keys(["Clay", "Grass", "Hard", "Carpet", "NA"])(surfaces);
      console.log(series);

      let svg = d3.select(panel).select('svg');
      let width = panel.offsetWidth;
      let height = panel.offsetHeight;
      let margin = {top: 1, right: 1, bottom: 1, left: 1};
      // Making x, y, and colours

      let x = d3.scaleBand()
          .domain(surfaces.map(d => d["month"]))
          .range([0, width]);

      // console.log(width);
      // console.log(x("201602"));

      let y = d3.scaleLinear()
          .domain([0, d3.max(series, function(d) {return d3.max(d, function(d) {return d[1] + d[1]; }); })])
          .range([height, 0]);

      // console.log(d3.max(series, function(d) {return d3.max(d, function(d) {return d[1]; }); }));

      let color = d3.scaleOrdinal()
          .domain(series.map(d => d.key))
          .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
          .unknown("#ccc");

      console.log(color("Clay"));
      console.log(color("Hard"));
      console.log(color("Grass"));

      svg.append("g")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("fill", function(d) { console.log(d.key); console.log(color(d.key)); return color(d.key); } )
          .selectAll("rect")
          .data(d => d)
          .join("rect")
          .attr("x", (d, i) => x(d.data["month"]))
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth());
          // .attr("fill", function(d) { console.log(d.key); console.log(color(d.key)); return color(d.key); });



    //var transposed = d3.layout.stack()([])

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
