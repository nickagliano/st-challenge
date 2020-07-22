/*
    Code challenge for SimpleThread
    by Nick Agliano 

    Completed 7/22/2020
*/

// import statements
import moment from 'moment';

// Set class -- holds 0 or many Projects
class Set {
    constructor(id) {
        this.id = id;
        this.projects = [];
    }

}


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

// helper functions

function sortProjectsByDate(projects) {
    let sorted = projects.sort((a,b) => new moment(a.startDate, 'M/D/YY').format('YYYYMMDD') - new moment(b.startDate, 'M/D/YY').format('YYYYMMDD'));
    return sorted;
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


function doMagic(projects) {
    let days = {};
    let mostRecentDate = null;

    for (let i = 0; i < projects.length; i++) { // iterate through projects
        for (let j = 0; j < projects[i].listOfDays.length; j++) { // iterate through dates of a project
            let currentDate = projects[i].listOfDays[j];

            if (mostRecentDate === null) { // a.k.a. if it's the first date
                days[`${currentDate}`] = {dayType: 'travel', cityCost: projects[i].cityCost}; // assign attributes to first day
            } else {
                let diff = moment(currentDate, 'M/D/YY').diff(moment(mostRecentDate, 'M/D/YY'), 'days');

                if (diff > 1) {
                    // update mostRecentDate to be a travel day (end of a project segment)
                    days[`${mostRecentDate}`].dayType = 'travel';

                    // set current date to be a travel day (start of a new project segment)
                    days[`${currentDate}`] = {dayType: 'travel', cityCost: projects[i].cityCost};
                } else {
                    // it's a full day!
                    if (!days[`${currentDate}`]) {
                        days[`${currentDate}`] = {dayType: 'full', cityCost: projects[i].cityCost};
                    } else {
                        if (days[`${currentDate}`].cityCost === 'low') {
                            days[`${currentDate}`].cityCost = projects[i].cityCost;
                        }
                    }
                }

            }

            mostRecentDate = currentDate; // update mostRecentDate

        }
    }

    days[`${mostRecentDate}`].dayType = 'travel'; // change last day to a travel day

    return days;
}


// grab Projects from JSON (in the /sets/ directory) --- or manually create Projects during testing
let justAProject = new Project('1', 'low', '9/1/15', '9/5/15');
let anotherProject = new Project('2', 'high', '9/1/15', '9/1/15');
let yetAnotherProject = new Project('2', 'high', '9/4/15', '9/5/15');
let lastProject = new Project('2', 'low', '9/4/15', '9/6/15');


// create Sets
let s = new Set('1');

// add Projects to Set
s.projects.push(justAProject);
s.projects.push(anotherProject);
s.projects.push(yetAnotherProject);
s.projects.push(lastProject);

// Sort projects by date (to make calculations easier)
s.projects = sortProjectsByDate(s.projects);

// do magic
let days = doMagic(s.projects);
console.log(days);
