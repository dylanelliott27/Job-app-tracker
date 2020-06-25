const jobContainer = document.getElementById('jobcontainer');
const downloadButton = document.getElementById('download');

downloadButton.addEventListener('click', downloadJobs);

function downloadJobs(){
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
}
chrome.storage.sync.get('jobs', result => {
    let jobs = JSON.parse(result.jobs);
    let dates = Object.keys(jobs);
    console.log(jobs);
    for(i = 0; i < dates.length; i++){
        const jobCard = document.createElement('div');
        jobCard.classList.add('job');

        const calendarIcon = document.createElement('span');
        calendarIcon.classList.add('material-icons');
        calendarIcon.innerText = 'date_range';
        jobCard.appendChild(calendarIcon);

        const jobInfo = document.createElement('p');
        jobInfo.innerText = dates[i].substring(0, 15);

        const downArrow = document.createElement('span');
        downArrow.classList.add('material-icons');
        downArrow.innerText = 'expand_more';


        jobContainer.appendChild(jobCard);
        jobCard.appendChild(jobInfo)
        jobCard.appendChild(downArrow);


        /*-- sub-jobs */

        const subJobContainer = document.createElement('div');




        for( k = 0; k < jobs[dates[i]].length; k++){
            console.log(jobs[dates[i]][k].title)
            console.log(jobs[dates[i]][k].company)
            const subJob = document.createElement('div');
            const subJobInfo = document.createElement('p');
            subJob.classList.add('subjob');
            subJobContainer.classList.add('subjobcontainer');
            subJobContainer.setAttribute('style', 'display: none');
            subJobInfo.innerText = jobs[dates[i]][k].title + ' - ' + jobs[dates[i]][k].company;

            jobContainer.appendChild(subJobContainer);

            subJobContainer.appendChild(subJob);

            subJob.appendChild(subJobInfo);


        }
        jobCard.addEventListener('click', () => {
            console.log('sub')
            if(subJobContainer.hasAttribute('style')){
                subJobContainer.removeAttribute('style');
                downArrow.innerText = 'expand_less';
            }
            else{
                subJobContainer.setAttribute('style', 'display: none');
                downArrow.innerText = 'expand_more';
            }
        })

    }
})

