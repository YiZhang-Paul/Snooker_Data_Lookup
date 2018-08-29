# Overview

[1. Display World Ranking](#1-display-world-ranking)  
&nbsp;&nbsp;&nbsp;&nbsp;[- rankings by year](#11-display-by-year)  
&nbsp;&nbsp;&nbsp;&nbsp;[- show all/part of rankings](#12-display-allpart-of-rankings-per-page)  

[2. Player Wiki](#2-player-wiki)  
&nbsp;&nbsp;&nbsp;&nbsp;[- basic information](#21-player-basic-information)  
&nbsp;&nbsp;&nbsp;&nbsp;[- statistics](#22-player-statistics)  
&nbsp;&nbsp;&nbsp;&nbsp;[- tournament history](#23-player-tournament-history)  
&nbsp;&nbsp;&nbsp;&nbsp;[- graphs](#24-player-graphs)  

[3. Player Center](#3-player-center)  
&nbsp;&nbsp;&nbsp;&nbsp;[- players list](#31-list-all-players)  
&nbsp;&nbsp;&nbsp;&nbsp;[- list by year](#32-list-players-by-year)  
&nbsp;&nbsp;&nbsp;&nbsp;[- list by nationality](#33-list-players-by-nationality)  
&nbsp;&nbsp;&nbsp;&nbsp;[- search by name](#34-search-players-by-name)  
&nbsp;&nbsp;&nbsp;&nbsp;[- players statistics](#35-players-statistics)  
&nbsp;&nbsp;&nbsp;&nbsp;[- statistics by year](#36-show-players-statistics-by-year)  

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

# 3. Player Center

> player center should present a list of all professional players available. Users will have the additional options to filter/search players of their interest, including:
> * filter players by year
> * filter players by nationality
> * search players by name
>
> in addition to player list, a statistics page will be available to users as well, which includes:
> * nationality distribution
> * age distribution
> * status distribution (currently active/retired)
> * earnings distribution
>
> users will have additional options to fine tune the statistics results.

## 3.1 List all players

### _3.1.1 description_

> show a list of all players across all available ranking seasons.

### _3.1.2 request/response flow_

* user clicks player center page link or access player center page through browser address bar

  * user will be automatically redirected to all players list

### _3.1.3 requirement details_

> the list should contain all players, retired or not, across all supported ranking seasons. Each list item should contain player's first name and last name, and preferably contains a photo of player as well.
>
> when photo is not available for a player, a default placeholder image should be displayed instead.

## 3.2 List players by year

### _3.2.1 description_

> show list of all players from a selected year.

### _3.2.2 request/response flow_

* user chooses a year from a list of all available years

  * only players in chosen year will be listed

### _3.2.3 requirement details_

> users will be able to view players from a predefined list of years. This functionality can be used in conjunction with list by nationality feature. (e.g. list all Chinese players during 2014/2015 season)

## 3.3 List players by nationality

### _3.3.1 description_

> show list of all players with selected nationality

### _3.3.2 request/response flow_

* user selects nationality from a list of all available nationalities

  * only players with chosen nationality will be listed

### _3.3.3 requirement details_

> users can filter players base on their nationalities. This feature can be used in conjunction with list by year feature. (e.g. list all England players during 2016/2017 season)
>
> nationality list is predefined and only nationalities that will yield results should be listed.

## 3.4 Search players by name

### _3.4.1 description_

> users will be given the freedom to search for interested players base on player names.

### _3.4.2 request/response flow_

* user types a search item in search box and stops typing

    * list of all players whose name match search item will appear automatically

### _3.4.3 requirement details_

> user can type player names in a search box and all possible search results will show up when user stops typing.
>
> the search ignores white spaces and letter casing.

## 3.5 Players statistics

### _3.5.1 description_

> statistics for all players will be displayed in the form of charts (pie chart, doughnut chart, etc.) which compile following information:
> * nationality distribution
> * age distribution
> * status distribution (active/retried)
> * career earning distribution

### _3.5.2 request/response flow_

* user clicks on statistics tab in player center page

  * statistics page for all players will be loaded on default

### _3.5.3 requirement details_

> separate chart for each distribution will be displayed with proper captions/titles. When user hover over the chart, information for corresponding group will be displayed. (e.g. for nationalities - 'China 30%')

## 3.6 Show players statistics by year

### _3.6.1 description_

> users can view statistics for all players from a specific year should they choose to do so.

### _3.6.2 request/response flow_

* user selects a year from a list

  * all charts will be reloaded to reflect statistics for players in selected year

### _3.6.3 requirement details_

> the feature is an extension to show all players statistics feature.
