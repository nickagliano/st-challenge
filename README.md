# st-challenge

## Set-up:
1) Clone the repo: `git clone https://github.com/nickagliano/st-challenge.git`
2) Move into the repository's directory: `cd st-challenge`
3) Download npm dependencies: `npm i` (shorthand for `npm install`)


## Running the project:
There are 6 pre-made sets of projects in the `sets/` folder, numbered 1-6

To calculate the reimbursement amount of all sets, call
`npm start`

To calculate the reimbursement amount of only a specific set, call 
`npm start [num]`, where `[num]` is replaced by a number 1 through 6. For example: `npm start 2`

You can also pass multiple sets in one execution. For example: `npm start 1 3 4`

## Understanding the code

### Project.js
- holds the Project class and all of its class functions
- the Project class holds information about a project
  - **projectNumber**: An identifier, i.e., 'Project 1'
  - **cityCost**: Either 'low' or 'high', denotes what type of city the project takes place in
  - **startDate**
  - **startDate**
  - **listOfDays**: An enumerated list of the days including the start date, end date, and every day in-between (stored as an array)
  
### Set.js
- holds the Set class and all of its class functions
- the Set class stores a list of Project objects, and contains the most important function in the project
- **getDayTypes()**: iterates through and compares each project, finding overlaps, gaps, and marking days as `travel` or `full`

### Utilities.js
- holds the Utilities class and all of its class functions
- used for validating command-line input, summing dollar amounts, and and printing pretty things to the console

## Understanding the algorithm
1) Sort the projects by start date
2) Initialize an object that will hold the days which have been processed (processedDays)
  - The processedDays object has keys that are dates in the form `M/D/YY`, ex: `9/3/15`, and values like `{ cityCost: 'low', dayType: 'full' }`
  - When assigning to this object with a key that *doesn't* exist, that key-value pair will be *inserted*.
  - When assigning to this object with a key that *does* exist, that key-value pair will be *updated*. This "upsert" behavior implements the rule: "days can only be counted *once*".
3) For each project:
  - Iterate through the days encompassed by that project (**NOTE**: the first day of the first project is always a `travel` day)
  - Based on the data in the processedDates object, assign values to the day that is currently being processed. 
    - Any gaps will have surrounding days marked as `travel` days, and if there are days nestled between travel days they will be marked as `full` days.
    - Since the projects are sorted by start date, if a project's start date is assigned as a `travel` day, it cannot be overwritten—we know for certain that day will remain a `travel` day; however, if a project's *end date* is assigned as a `travel` day, that value might get overwritten as a `full` day as new information is processed.
4) Dollar amounts are calculated using the processedDays object and a lookup table, then summed together to get the total reimbursement amount.
    
## Notes on implementation
- It was ambiguous whether the format of the dates in the examples was D/M/YY or M/D/YY since there were no examples with days over 12. It was assumed that it was the system uses M/D/YY, but in a real-world application I would ask the client, and/or recommend that they use a more universal format, like YYYY-MM-DD
- There was no clarification on how to handle overlapping projects if they take place in different cost cities. My implementation will gives precedence to the `high` cost cities, but I would ask the client how they would like to handle that situation.
- There were no examples with a list of projects that have start dates that are out of order, but I made my system able to handle that scenario.
- There were no examples with a project with a date range that is entirely encompassed by another project, but I made my system able to handle that.

## Extensibility
- New sets can be added to the `/sets` folder as long as they follow the same schema
