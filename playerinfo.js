const dataPath = "data/three_years.csv";

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

d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});



