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

if (args.length < 1) {
    util.printMissingInput();
} else {
    if (util.validateArgs(args)) {
        for (let arg of args) {
            util.printHeader(arg);

            let set = new Set(arg); // build new set by passing the argument to constructor

            // get each day and calculate if it's a travel or full day
            //  and gracefully handle overlapping project days!
            //       a.k.a. do magic
            let days = set.getDayTypes();
        
            // get reimbursements in a dollar amount
            let reimbursements = util.sumReimbursements(days);

            util.printPrettyDays(days);
        
            console.log('\x1b[33m%s\x1b[0m', `\nReimbursement amount for Set #${arg}: $${reimbursements}\n`);
            // util.printDivider();
        }
    }
}