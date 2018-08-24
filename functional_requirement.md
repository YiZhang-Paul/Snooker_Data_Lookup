# Overview

[1. Display World Ranking](#1-display-world-ranking)  
&nbsp;&nbsp;&nbsp;&nbsp;[- rankings by year](#11-display-by-year)  
&nbsp;&nbsp;&nbsp;&nbsp;[- show all/part of rankings](#12-display-allpart-of-rankings-per-page)  

[2. Player Wiki](#2-player-wiki)  
&nbsp;&nbsp;&nbsp;&nbsp;[- basic information](#21-player-basic-information)  
&nbsp;&nbsp;&nbsp;&nbsp;[- statistics](#22-player-statistics)  
&nbsp;&nbsp;&nbsp;&nbsp;[- tournament history](#23-player-tournament-history)  
&nbsp;&nbsp;&nbsp;&nbsp;[- graphs](#24-player-graphs)  

# 1. Display World Ranking

> a word ranking table should contain following information for every ranked player:
> * rank
> * player's full name (first and last name)
> * nationality
> * career winnings
> * ranking difference from last year (_**optional**_)

## 1.1 Display by year

### _1.1.1 description_

> users should be allowed to view world rankings base on the year of their choice. Users should be given options to choose a specific year, e.g, through a drop box or text box.

### _1.1.2 request/response flow_

* user chooses a year
* when data for chosen year is available

  * world ranking for specified year appears

* when data for chosen year is unavailable

  * users should be notified and instructed to choose another year

### _1.1.3 requirement details_

> users should be presented with __predefined__ list of all available years to choose from, and the page will display world ranking for chosen year (otherwise always display current year ranking on default); when data is unavailable (e.g. invalid year or failure to retrieve data from server), users should be notified and instructed to retry or choose another year.

## 1.2 Display all/part of rankings per page

### _1.2.1 description_

> users should be given options to customize the total number of players displayed at one time. Users can view the entire world ranking for chosen year or, if they wish to do so, users have the freedom to view arbitrary number of players on a single page.

### _1.2.2 request/response flow_

* user chooses the option to display all players, or user leaves the text box empty and clicks on display button or presses enter

  * all ranked players will be displayed in a single table

* user inputs a number in a text box and clicks on display button or presses enter

  * only specified number of players will be visible on the page
  * user will be given options to navigate to previous/next page to view different group of players

### _1.2.3 requirement details_

> the page will show all ranked players by default when data successfully loaded; users will be given a number input box to specify an arbitrary number of players to show on each page. When doing so, users are also granted ability to navigate to previous/next group of players.
>
> users will be provided with a button to refresh the ranking table to their liking and pressing enter key will have the same effect.
>
> leaving number input box empty or entering a value exceeding total number of ranked players will have the same effect as displaying all ranked players.

# 2. Player Wiki

> users should have the option to look into details of chosen player, such as:
> * player basic information (e.g. name, nationality, date of birth)
> * player statistics (e.g. historical rankings, active/retired status, win ratio)
> * player tournament history (e.g. events/rounds participated, score, opponents)
> * player graphs (e.g. ranking graph, earning graph by year)

## 2.1 Player basic information

### _2.1.1 description_

> provides an overview of player's basic information and optionally some addition information such as links to player's website and twitter accounts.

### _2.1.2 request/response flow_

* user chooses a particular player wiki

  * player detail page appears on default

* user clicks on player website link/bio page link

  * user will be redirected to external urls

### _2.1.3 requirement details_

> users will be provided with links to access wiki page for a given player; upon landing on player wiki page, users will be __automatically__ redirected to basic information page.

## 2.2 Player statistics

### _2.2.1 description_

> presents a collection of player statistics base on past year rankings and tournament performance in a logical order.

### _2.2.2 request/response flow_

* user clicks on player statistics tab after player wiki loads

  * player statistics page appears

### _2.2.3 requirement details_

> statistics such as highest/lowest ranking, win ratio must be calculated from all available past year rankings/match results.

## 2.3 Player tournament history

### _2.3.1 description_

> displays all tournament history grouped by event and tournament seasons for chosen player.

### _2.3.2 request/response flow_

* user clicks on player tournament history tab after player wiki loads

  * player tournament history page shows

* user chooses the option to display history for a given year

  * history for all/chosen event(__participated__) in chosen year will be displayed

* user chooses the option to display history for a given event

  * history for chosen event(__participated__) in all/chosen years will be displayed

### _2.3.3 requirement details_

> tournament history for a player should be grouped by participated events, and under each participated events, match results for every participated year should be listed in an organized way.

## 2.4 Player graphs

### _2.4.1 description_

> display graphs that show historical rankings and earnings of chosen player.

### _2.4.2 request/response flow_

* user clicks on player graphs tab after wiki loads

  * player graphs page appears

### _2.4.3 requirement details_

> ranking/earning graphs will show player's world ranking/earning in every season in the form of a linear graph.
