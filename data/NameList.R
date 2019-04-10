library(readr)
three_years <- data.frame(read_csv("three_years.csv"))

names <- data.frame(matrix(ncol=2))
colnames(names) <- c("ID", "Name")

for (i in 1:nrow(three_years)) {
  loser_id <- three_years[i, "loser_id"]
  loser_name <-  three_years[i, "loser_name"]
  winner_id <- three_years[i, "winner_id"]
  winner_name <-  three_years[i, "winner_name"]
    
  if (!(loser_id %in% names$ID)) {
    names <- rbind(names, c(loser_id, loser_name))
  }
  if (!(winner_id %in% names$ID)) {
    names <- rbind(names, c(winner_id, winner_name))
  }
}

write_csv(na.omit(names[order(names$Name),]), "names.csv")
          