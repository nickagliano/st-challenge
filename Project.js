import moment from 'moment'; // for date handling

// Project class
class Project {
    constructor(projectNumber, cityCost, startDate, endDate) {
        this.projectNumber = projectNumber;
        this.cityCost = cityCost;
        this.startDate = startDate;
        this.endDate = endDate;
        this.listOfDays = this.buildListOfDays();
    }

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

export default Project;