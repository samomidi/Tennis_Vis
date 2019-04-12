const dataPath = "data/three_years.csv";

function winPercentBarChart(data) {
    let name_stats = [];
    let ids_done = {};
    let current_index = 0;

    // Filling name_dict
    data.forEach(function (d) {
        if (d["winner_id"] in ids_done) {
            let id = ids_done[d["winner_id"]];
            name_stats[id]["Wins"]++;
        } else {
            let new_player = {
                "ID": d["winner_id"],
                "Name": d["winner_name"],
                "Age":d["winner_age"],
                "Wins": 1,
                "Losses": 0
            };
            name_stats.push(new_player);
            ids_done[d["winner_id"]] = current_index;
            current_index++;
        }

        if (d["loser_id"] in ids_done) {
            let id = ids_done[d["loser_id"]];
            name_stats[id]["Losses"]++;
        } else {
            let new_player = {
                "ID": d["loser_id"],
                "Name": d["loser_name"],
                "Age":d["winner_age"],
                "Wins": 0,
                "Losses": 1
            };
            name_stats.push(new_player);
            ids_done[d["loser_id"]] = current_index;
            current_index++;
        }
    });


    console.log(name_stats);

    name_stats.forEach(function (d) {
        d["WinPercent"] = d["Wins"] / (d["Wins"] + d["Losses"]);
    });
}

var filterText = "Roger Federer";

function PlayerDetails(data) {

    // let name_stats = [];
    // let ids_done = {};
    // // let current_index = 0;

    // data.forEach(function(d) {
    //     if (d["winner_name"] === filterText) {
    //
    //      console.log(d["winner_name"] )
    //
    //     }
    //
    //     })
    var values = d3.keys(data[0]);

    var select = d3.select("body")
        .append("select")
        .on("change", function() {
            console.log(this.value);
        })

    select.append("option")
        .html("Select Player:")

    var options = select.selectAll(null)
        .data(values)
        .enter()
        .append("option")
        .text(function(d) { return d; });


}

d3.csv(dataPath).then(function(data) {PlayerDetails(data)});
d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});

