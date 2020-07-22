/*
    Code challenge for SimpleThread
    by Nick Agliano 

    Completed 7/22/2020
*/

import Set from './Set.js';
import Utilities from './Utilities.js';

let util = new Utilities();

// get command-line arguments, excluding 'npm' and 'start'
let args = process.argv.slice(2);

// if there's no command line arguments, calculate all sets
if (args.length < 1) {
    args = ['1', '2', '3', '4', '5', '6'];
}

if (util.validateArgs(args)) { // validate the user's arguments
    for (let arg of args) { // iterate
        util.printHeader(arg); // print which set is being processed

        let set = new Set(arg); // build a new Set object by passing the argument to constructor

        // get each day and calculate if it's a travel or full day
        //  and gracefully handle overlapping project days!
        //       a.k.a. do magic
        let days = set.getDayTypes();
    
        let reimbursements = util.sumReimbursements(days); // get reimbursement total in a dollar amount

        util.printPrettyDays(days); // print the processed days in a legible format
    
        console.log('\x1b[33m%s\x1b[0m', `\nReimbursement amount for Set #${arg}: $${reimbursements}\n`);
    }
}
