class Utilities {
    validateArgs(args) { // make sure user input is valid, used by index.js
        let validList = ['1', '2', '3', '4', '5', '6']
        for (let arg of args) {
            if (validList.includes(arg)) {
                // pass
            } else {
                console.log(`\nInvalid command-line argument: ${arg}`);
                console.log('Valid arguments include the integers 1, 2, 3, 4, 5, or 6\n\n');
                return false;
            }
        }
        return true;
    }


    // basically a conversion table — for getting dollar amts for different days, 
    //  used by the calcReimbursements() function, (seen below)
    getDollarAmount(dayType, cityCost) { 
        if (dayType === 'travel') {
            if (cityCost === 'high') {
                return 55;
            } else { // low
                return 45;
            }
        } else { // full
            if (cityCost === 'high') {
                return 85;
            } else { // low
                return 75;
            }
        }
    }

    sumReimbursements(days) {
        let total = 0;
    
        for (let key in days) {
            total += this.getDollarAmount(days[key].dayType, days[key].cityCost);
        }
    
        return total;
    }

    printMissingInput() {
        console.log("\nNo command line arguments passed");
        console.log("Please run again and pass one or more command line arguments");
        console.log('Valid arguments include the integers 1, 2, 3, 4, 5, or 6\n\n');
    }

    printPrettyDays(days) {
        console.log('\x1b[36m%s\x1b[0m', `Processed dates:`);
        for (let day in days) {
            console.log(`   ${day} is a ${days[day].dayType} day in a ${days[day].cityCost}-cost city.`);
        }
    }

    printHeader(num) {
        console.log('--------------------------------------------------------------------------------------------------');
        console.log('\x1b[36m%s\x1b[0m', `\nSet #${num}`);
    }

    printDivider() {
        console.log('--------------------------------------------------------------------------------------------------\n');
    }
}

export default Utilities;