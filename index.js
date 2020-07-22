/*
    Code challenge for SimpleThread
    by Nick Agliano 

    Completed 7/22/2020
*/

import moment from 'moment'; // for date handling
import fs from 'fs'; // to read JSON objects from local file system

// Project class
class Project {
    constructor(projectNumber, cityCost, startDate, endDate) {
        this.projectNumber = projectNumber;
        this.cityCost = cityCost;
        this.startDate = startDate;
        this.endDate = endDate;
        this.listOfDays = this.buildListOfDays();
    }

    // class functions

    buildListOfDays() {
        let numDays = this.getNumDays();
        let list = [];
        
        for (let i = 0; i <= numDays; i++) {
            list.push(moment(this.startDate, 'M/D/YY').add(i, 'days').format('M/D/YY'));
        }

        if (list.length === 0) {
            return null;
        } else {
            return list;
        }
    }

    alertError() {
        console.log(`*********************************************************************************`);
        console.log(`Warning!!!! Found a project with an end date that is before the start date!`);
        console.log(`Project number: ${this.projectNumber} --- startDate: ${this.startDate} ---- endDate: ${this.endDate}`);
        console.log(`This project will be ignored in calculating the reimbursement amount.`);
        console.log(`*********************************************************************************`);
    }

    getNumDays() {
        let start = moment(this.startDate, 'M/D/YY');
        let end = moment(this.endDate, 'M/D/YY');

        let num = end.diff(start, 'days');

        // if num < 0 that means the end date is before the start date
        if (num < 0) {
            this.alertError(); // print an error to the user
        }

        return num;
    }
}

function sortProjectsByDate(projects) {
    let sorted = projects.sort((a,b) => new moment(a.startDate, 'M/D/YY').format('YYYYMMDD') - new moment(b.startDate, 'M/D/YY').format('YYYYMMDD'));
    return sorted;
}

function buildSet(path) {
    let set = [];
    let rawData = fs.readFileSync(path);
    let obj = JSON.parse(rawData);

    for (let key in obj) {
        let project = obj[key];
        set.push(new Project(key, project.cityCost, project.startDate, project.endDate));
    }

    // Sort Projects by start date (to make calculations easier)
    set = sortProjectsByDate(set);
    
    return set;
}


function getDollarAmount(dayType, cityCost) {
    if (dayType === 'travel') {
        if (cityCost === 'high') {
            return 55;
        } else { // low
            return 45;
        }
    } else { // full
        if (cityCost === 'high') {
            return 75;
        } else { // low
            return 85;
        }
    }
}

function calcReimbursements(days) {
    let total = 0;

    for (let key in days) {
        total += getDollarAmount(days[key].cityCost.dayType, days[key].cityCost);
    }

    return total;
}


function doMagic(projects) {
    let processedDays = {}; // object to hold days and their computed attributes (low or high cost, travel or full day)
    let mostRecentDate = null; // stores the date that was most recently processed — used as a progress marker
    let oldestDate = null; // oldest in terms of when that date occurs/occured, not when it was processed — used as a progress marker

    for (let project of projects) { // iterate through projects
        for (let day of project.listOfDays) { // iterate through dates of a project
           
            // the initial case -- the mostRecentDate variable is only null when processing the *first date* of the set, otherwise it will be a date, like '9/1/15'
            if (mostRecentDate === null) { 
                processedDays[day] = {dayType: 'travel', cityCost: project.cityCost}; // assign attributes to first day
                oldestDate = day; // initialize oldestDate day to the only date that has been process thus far
                mostRecentDate = day; // update mostRecentDate
                continue;
            } 

            // the number of days between the date currently being processed and the date most recently processed
            let diff = moment(day, 'M/D/YY').diff(moment(mostRecentDate, 'M/D/YY'), 'days');

            // utilizes oldest date to verify that a date previously labeled as "travel" doesn't get overwritten to "full"
            let isValidGap = moment(day, 'M/D/YY').isAfter(moment(oldestDate, 'M/D/YY'));
        
            if (diff > 1 && isValidGap) { // it's a gap
                // update mostRecentDate to be a travel day (end of a project segment)
                processedDays[oldestDate].dayType = 'travel';

                // set current date to be a travel day (start of a new project segment)
                processedDays[day] = {dayType: 'travel', cityCost: project.cityCost};

            } else { // it's a full day!
                if (!processedDays[day]) { // it's a brand new full day (that date doesn't exist in the processedDates object)
                    processedDays[day] = {dayType: 'full', cityCost: project.cityCost};
                } else {
                    if (processedDays[day].cityCost === 'low') { // high can overwrite low, but not vice-versa
                        processedDays[day].cityCost = project.cityCost;
                    }
                }
            }


            mostRecentDate = day; // update mostRecentDate

            // update the oldestDate (if the date just processed is after the old oldestDate)
            if (moment(mostRecentDate, 'M/D/YY').isAfter(moment(oldestDate, 'M/D/YY'))) {
                oldestDate = mostRecentDate;
            }

        }
    }

    processedDays[mostRecentDate].dayType = 'travel'; // manually change last day to a travel day

    return processedDays;
}


// grab Projects from JSON (in the /sets/ directory)

let setOne = buildSet('sets/1.json');
let setTwo = buildSet('sets/2.json');
let setThree = buildSet('sets/3.json');
let setFour = buildSet('sets/4.json');
let setFive = buildSet('sets/5.json');


// do magic
let days = doMagic(setFive);

// get reimbursements in a dollar amount
let reimbursements = calcReimbursements(days);

console.log(reimbursements);

