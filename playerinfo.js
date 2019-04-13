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

// var filterText = "Roger Federer";
//
// function PlayerDetails(players) {
//
//     // let name_stats = [];
//     // let ids_done = {};
//     // // let current_index = 0;
//
//     // data.forEach(function(d) {
//     //     if (d["winner_name"] === filterText) {
//     //
//     //      console.log(d["winner_name"] )
//     //
//     //     }
//     //
//     //     })
//
//     var values = d3.keys(name_stats);
//
//     // var values = d3.keys(players);
//
//     console.log(name_stats[0].Name)
//
//     console.log(d3.values(name_stats).Wins)
//
//
//
//
//
//     var select = d3.select("body")
//         .append("select")
//         .on("change", function() {
//             console.log(this.value);
//         });
//
//     select.append("option")
//         .html("Select Player:");
//
//     var options = select.selectAll(null)
//         .data(values)
//         .enter()
//         .append("option")
//         .text(function(d) { return d; });
//
//     var svg = d3.select("body")
//         .append("svg")
//         .attr("width", 500)
//         .attr("height", 400);
//
//
//
// }
//
// players = d3.csv(dataPath).then(function(data) {winPercentBarChart(data)});
// d3.csv(dataPath).then(function(data) {PlayerDetails(players)});


// simple working example-------------------------
// var svg = dimple.newSvg("body", 800, 600);
// var data = [
//     { "Word":"Hello", "Awesomeness":2000 },
//     { "Word":"World", "Awesomeness":3000 }
// ];
// var chart = new dimple.chart(svg, data);
// chart.addCategoryAxis("x", "Word");
// chart.addMeasureAxis("y", "Awesomeness");
// chart.addSeries(null, dimple.plot.bar);
// chart.draw();



// not working- throws error
var svg2 = dimple.newSvg('#myDiv1', 600,400);
d3.csv('data/atp_matches_2018.csv', function(data) {
    var ChartInstance = new dimple.chart(svg2,data);
    ChartInstance.setBounds(60,30,510,305);
    var x = ChartInstance.addCategoryAxis('x', 'surface');
    // x.addOrderRule('Type');
    var y = ChartInstance.addPctAxis('y', 'Count');
    //y.showbycent = true;
    //var y = ChartInstance.addMeasureAxis('y', 'Count');
    var s = ChartInstance.addSeries(null, dimple.plot.bar);
    ChartInstance.addLegend(60, 10, 510, 20, "right");
    ChartInstance.draw(1000);

});




//working pie chart but not correct proportions
var svg12 = dimple.newSvg("#myDiv2", 590, 400);
d3.csv("data/atp_matches_2018.csv", function (data) {
    var ChartInstance = new dimple.chart(svg12, data);
    ChartInstance.setBounds(20, 20, 460, 360)
    ChartInstance.addMeasureAxis("p", "surface");
    ChartInstance.addSeries("surface", dimple.plot.pie);
    ChartInstance.addLegend(500, 20, 90, 300, "left");
    ChartInstance.draw();
});
