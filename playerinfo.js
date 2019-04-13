const dataPath = "data/three_years.csv";

var name_stats = [];
function winPercentBarChart(data) {

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

    return name_stats;
}

var filterText = "Roger Federer";

function PlayerDetails(players) {

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

    var values = d3.keys(name_stats);

    // var values = d3.keys(players);

    console.log(name_stats[0].Name)

    console.log(d3.values(name_stats).Wins)





    var select = d3.select("body")
        .append("select")
        .on("change", function() {
            console.log(this.value);
        });

    select.append("option")
        .html("Select Player:");

    var options = select.selectAll(null)
        .data(values)
        .enter()
        .append("option")
        .text(function(d) { return d; });

    var svg = d3.select("body")
        .append("svg")
        .attr("width", 500)
        .attr("height", 400);


    // var x = d3.scaleBand()
    //     .domain(data.map(function(d) { return d.winner_name; }))
    //     .range([0,500])

    // var y = d3.scaleLinear()
    //     .domain([0,100])
    //     .range([150,0])

    function update() {
        var value = this.value;
        var bars = svg.selectAll("rect")
            .data(data);

        bars.enter().append("rect")
            .attr("x", function(d) { return x(d.winner_name); })
            .attr("width", x.bandwidth())
            .attr("y", 150)
            .attr("height",0)
            .merge(bars)
            .transition()
            .attr("height", function(d) { return 150 - y(d[value] || 0); })
            .attr("y", function(d) { return y(d[value] || 0); });

    }
}

players = d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});
d3.csv(dataPath).then(function(data) {PlayerDetails(players)});


