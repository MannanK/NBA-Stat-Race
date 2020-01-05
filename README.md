# NBA Stat Race

An NBA stats visualizer to plot the route a given stat took over the course of a given season for the selected players, leading up to the "winner" in that stat by season's end.

### Background and Overview

NBA Stat Race (NBASR) is an example of sports data being turned onto its heels to be used in ways that people could not see otherwise in non-visual ways. Throughout the course of an NBA season, players go through ups and downs while trying to be competitive with their fellow players. By the time the season comes to an end, one player has either crowned himself as the king of a stat, or the race to be the best turned out to be a lot closer than expected. But what if you wanted to see how the race played out between specific players, and whether it was always a runaway or one player took over others in the final days of the season? And what if instead of looking at mainstream statistics you wanted to look at a more peculiar stat race? These are the visualizations NBASR provides, so that as a fan, you too can now follow along a player as they try to beat out their colleagues in a stat race.

### Functionality and MVPs

**With NBA Stat Race, users will be able to:**

1. Select the season they wish to see the stat race in
2. Select the stat they want the race to be in
3. Select the players they want to compete in the stat race
4. See a graph which plots out, game by game, the cumulative totals up to that game for the given player

**In addition, this project will include:**

1. A Glossary section/modal that lists out the full forms of stat abbreviations
2. A production README

### Wireframes

This app will consist of a single page with multiple different elements. There will be a drop-down to select a season, a drop-down to select the stat, and on the right side of the page on this row there will be a button to open the glossary modal. On the next row we have an input field to search for and add players. The players who have been added will be shown in a bar to the right of the input field, with the bar updating as players get added. Underneath these elements will be the rendered line graph which will be the center of the entire page. Lastly there is a footer at the bottom, which will contain links to my GitHub, LinkedIn, and any other relevant links.

***Main Page***

![main_wireframe]

[main_wireframe]: https://raw.githubusercontent.com/MannanK/NBA-Stat-Race/master/src/assets/main_wireframe.png

***Glossary Modal***

![modal_wireframe]

[modal_wireframe]: https://raw.githubusercontent.com/MannanK/NBA-Stat-Race/master/src/assets/modal_wireframe.png

### Architecture and Technology

NBA Stat Race is built with:

1. `JavaScript` for retrieving and parsing data from the MySportsFeeds API
2. `D3`, `SVG`, `HTML`, & `CSS` for visualizing the data and making the app interactive/appealing
3. `Webpack` & `Babel` to bundle js files

In addition to the entry file, NBASR will be split up into:

1. `apiParsing.js`: To make HTTP requests to the API and parse back the data
2. `graph.js`: To make and render the graph to the screen

### Implementation Timeline

**Day 1**

Set up the project skeleton, figure out and install all necessary node modules, get Webpack running, get a basic entry file going, make a rough skeleton of the entire main page, start writing out a skeleton for the other two script files

**Day 2**

Figure out completely how to use the MySportsFeeds API and finish as much of `apiParsing.js` as possible, start using D3 to implement the rendering of the chart

**Day 3**

Dedicate this day to learning D3 and writing out as much of `chart.js` as possible, modify parsing of data returned from the API if needed

**Day 4**

Continue working on making the chart look visually appealing, create the Glossary modal, work on bonus features if there's time

**Day 5**

Finish the Glossary modal, make the footer, finish CSS for the app, work on bonus features if there's time

### Bonus Features

1. Ability to see the top 10 leaders league-wide in the selected season and stat
2. Since the API is very robust, the site can be expanded to also include MLB stats
