import Project from './Project.js';

import moment from 'moment'; // for date handling
import fs from 'fs'; // to read JSON objects from local file system

class Set {
    constructor(arg) {
        this.list = this.buildSet(arg);
    }

    buildSet(arg) {
        let path = `sets/${arg}.json`;
        let set = [];
        let rawData = fs.readFileSync(path);
        let obj = JSON.parse(rawData);
    
        for (let key in obj) {
            let project = obj[key];
            set.push(new Project(key, project.cityCost, project.startDate, project.endDate));
        }
    
        // Sort Projects by start date (to make calculations easier)
        let sorted = set.sort((a,b) => new moment(a.startDate, 'M/D/YY').format('YYYYMMDD') - new moment(b.startDate, 'M/D/YY').format('YYYYMMDD'));
        
        this.printPrettySet(sorted);
        return sorted;
    }

    printPrettySet(list) {
        for (let p of list) {
            console.log(`   ${p.projectNumber}: ${p.cityCost}-cost, from ${p.startDate} to ${p.endDate}`);
        }
    }

    // most import function in this entire project, does the heavy calculations
    getDayTypes() {
        let processedDays = {}; // object to hold days and their computed attributes (low or high cost, travel or full day)
        let mostRecentDate = null; // stores the date that was most recently processed — used as a progress marker
        let oldestDate = null; // oldest in terms of when that date occurs/occured, not when it was processed — used as a progress marker
    
        for (let project of this.list) { // iterate through projects
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
    
        processedDays[oldestDate].dayType = 'travel'; // manually change last day to a travel day
    
        return processedDays;
    }
}

export default Set;