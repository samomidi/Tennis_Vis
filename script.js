function openTab(evt, tabName) {
    // Declare all variables
    let i, tabContent, tabLinks;

    // Get all elements with class="tab_content" and hide them
    tabContent = document.getElementsByClassName("vis-screen");
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


function showDropdown(dropdown) {
    console.log(dropdown.getElementsByClassName("dropdown-content"));
    dropdown.getElementsByClassName("dropdown-content")[0].classList.toggle("show");
}

// Quit dropdown menu if clicked out of it
window.onclick = function(event) {
    let target = event.target;
    if (!target.matches('.drop-button')) {
        let drop_downs = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < drop_downs.length; i++) {
            let openDropdown = drop_downs[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

const dataPath = "data/three_years.csv";
d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});