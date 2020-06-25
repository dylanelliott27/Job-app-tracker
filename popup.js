const changeElem = document.getElementById('updatejoblist');
const joblist = document.getElementById('joblist');
const deletebutton = document.getElementById('deleteall');
const jobCount = document.getElementById('jobcount');
const jobPlural = document.getElementById('jobplural');
const DashboardButton = document.getElementById('overview');
let generatebutton = document.getElementById('generatebutton');

window.onload = () => {
    chrome.storage.sync.get('jobs', items => {
        let jobsObject = JSON.parse(items.jobs);
        let numberOfDays = Object.keys(jobsObject);
        let today = new Date();
        for(i = 0; i < numberOfDays.length; i++){
            if(today.toDateString() == numberOfDays[i].substring(0, 15)){
                updateJobCountTitle(jobsObject[numberOfDays[i]].length);
                for(k = 0; k < jobsObject[numberOfDays[i]].length; k++){
                    renderHtmlForJobs(jobsObject, numberOfDays);
                }
                return;
            }
        }  
        let noJobsFoundParagraph = document.createElement('p');
        noJobsFoundParagraph.innerText = 'no jobs found';
        joblist.appendChild(noJobsFoundParagraph);
    })

}

deletebutton.addEventListener('click', () => {
    chrome.storage.sync.remove('jobs', () => {
        console.log('removed');
    })
})

generatebutton.addEventListener('click', () => {
    chrome.storage.sync.get(['jobs'], res => {
        let jobsAsString = JSON.stringify(res.jobs);
        fetch('http://localhost:8000/test', {method: 'POST', body: jobsAsString})
        .then(res => {
            return res.text();
        })
        .then(text => {
            var a = document.createElement('a');
            var blob = new Blob([text], {'type': 'application/octet-stream'});
            a.href = window.URL.createObjectURL(blob);
            a.download = 'test.txt';
            a.click();
        })
    })
})

DashboardButton.addEventListener('click', () => {
    window.open('./dashboard.html')
})
function updateJobCountTitle(length){
        jobCount.innerText = length;
        if(length > 5){
            jobCount.removeAttribute('style');
            jobCount.setAttribute('style', 'color: #1ebd01')
        }
        if(length === 1){
            jobPlural.innerText = 'job';
        }
        else{
            jobPlural.innerText = 'jobs';
        }
}

function renderHtmlForJobs(jobsObject, numberOfDays){
    let currentJob = jobsObject[numberOfDays[i]][k];
    let jobContainer = document.createElement('div');
    let jobDescriptionContainer = document.createElement('div');
    let jobDescription = document.createElement('p');
    let deleteButton = document.createElement('span');
    let briefCase = document.createElement('span');
    briefCase.classList.add('material-icons');
    briefCase.innerText = 'work_outline';
    briefCase.setAttribute('style', 'color: #ababab' )
    deleteButton.classList.add('material-icons');
    deleteButton.innerText = 'clear';
    jobDescription.innerText = currentJob.title + ' - ' + currentJob.company;
    jobDescriptionContainer.classList.add('descriptioncontainer')
    joblist.appendChild(jobContainer);
    jobContainer.appendChild(jobDescriptionContainer);
    jobDescriptionContainer.appendChild(briefCase);
    jobDescriptionContainer.appendChild(jobDescription);
    jobContainer.classList.add('job');
    jobContainer.appendChild(deleteButton);
}


