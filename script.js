function openTab(evt, tabName) {
    // Declare all variables
    let i, tab_content, tab_links;

    // Get all elements with class="tab_content" and hide them
    tab_content = document.getElementsByClassName("vis-screen");
    for (i = 0; i < tab_content.length; i++) {
        tab_content[i].style.display = "none";
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tab_links = document.getElementsByClassName("tab-link");
    for (i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "grid";
    evt.currentTarget.className += " active";
}


function winPercentBarChart(data) {
    let name_stats = [];
    let ids_done = {};
    let current_index = 0;

    // Filling name_dict
    data.forEach(function(d) {
        if (d["winner_id"] in ids_done) {
            let id = ids_done[d["winner_id"]];
            name_stats[id]["Wins"]++;
        }
        else {
            let new_player = {
                "ID":d["winner_id"],
                "Name":d["winner_name"],
                "Wins":1,
                "Losses":0
            };
            name_stats.push(new_player);
            ids_done[d["winner_id"]] = current_index;
            current_index++;
        }

        if (d["loser_id"] in ids_done) {
            let id = ids_done[d["loser_id"]];
            name_stats[id]["Losses"]++;
        }
        else {
            let new_player = {
                "ID":d["loser_id"],
                "Name":d["loser_name"],
                "Wins":0,
                "Losses":1
            };
            name_stats.push(new_player);
            ids_done[d["loser_id"]] = current_index;
            current_index++;
        }
    });


    console.log(name_stats);

    name_stats.forEach(function(d) {
        d["WinPercent"] = d["Wins"]/(d["Wins"]+d["Losses"]);
    });

    // Making bar chart
    d3.select("#myDiv")
        .select("svg")
        .selectAll("rect")
        .data(name_stats)
        .enter()
        .append("rect")
        .attr("width", function(d) {
            return d["WinPercent"] * 1000;
        })
        .attr("height", 20)
        .attr("x", 50)
        .attr("y", function(d, i) { // i in the index
            return i*50 + 50;
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
                .attr("y", (i*50 + 50 + 15))
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
    if (!event.target.matches('.drop-button')) {
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
