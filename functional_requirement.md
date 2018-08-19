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

> users should be presented with __predefined__ list of all available years to choose from, and the page will display world ranking for chosen year; when data is unavailable (e.g. invalid year or failure to retrieve data from server), users should be notified and instructed to retry or choose another year.

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

# 2. Show Player Information
