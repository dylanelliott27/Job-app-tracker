chrome.storage.sync.get('jobs', (results) =>{
    console.log(results);
    const keys = Object.keys(JSON.parse(results.jobs));
    for(i = 0; i < keys.length; i++){
        keys[i] = keys[i].substring(0, 15);
    }
    checkForDuplicateEntries(keys)
    checkForValidDates(keys);
})

function checkForDuplicateEntries(keys){
    
    let duplicates = 0;
    for(i = 0; i < keys.length; i++){
        keys[i] = keys[i].substring(0, 15);
    }
    console.log('~~CHECKING FOR DUPLICATE DATES IN JOBS OBJECT~~');
    for(k = 0; k < keys.length; k++){
        for(m = 0; m < keys.length; m++){
            if(k != m){ // avoid checking same index for false duplicate error
                if(keys[k] == keys[m]){
                    console.log(keys[k] + ' -- ' + keys[m] + ' duplicate!');
                    duplicates++;
                }
                else{
                    console.log(keys[k] + ' -- ' + keys[m] + ' not duplicate!');
                }
            }
        }
    }
    console.log('~DUPLICATE TEST OVER: duplicates: ' + duplicates);
}

function checkForValidDates(keys){
    let invalidDates = 0;
    let validDates = 0;
    console.log('~~~TESTING FOR VALID DATES~~~~');
    for(k = 0; k < keys.length; k++){
        let testDate = new Date(keys[k]);
        if(testDate.toString() == 'Invalid Date'){
            console.log(testDate + ' Invalid Date! ');
            invalidDates++;
        }
        else if(testDate.getFullYear() > 2021 || testDate.getFullYear() < 2020){
            console.log(testDate + ' Valid date format, but possibly invalid date...')
            invalidDates++;
        }
        else{
            console.log(testDate + ' Valid date!');
            validDates++;
        }
    }
    console.log('~~~ VALID DATES TEST COMPLETE. Invalid Dates: ' + invalidDates + ' Valid dates: ' + validDates)
}