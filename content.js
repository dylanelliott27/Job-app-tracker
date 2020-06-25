const jobTitle = document.getElementById('vjs-jobtitle');
const config = { attributes: true, childList: true, subtree: true };
let buttonFindAttempts = 0;


chrome.runtime.onMessage.addListener((msg) => {
    if(msg === 'urlchange'){
        console.log("urlchange");
        init();
    }
})

const styleobserver = new MutationObserver((mutation) => {
    for(i = 0; i < mutation.length; i++){
        const applyButtonAttributes = mutation[i].target.attributes[0].textContent;
        if(applyButtonAttributes.includes('indeed-apply-status-not-applied')){
            console.log("not applied");
        }
        if(applyButtonAttributes.includes('indeed-apply-status-applied')){
            styleobserver.disconnect();
            console.log("applied");
            saveJob();
            break;
        }
    }
});

function createNewDay(jobs, today, jobTitle, companyName, jobUrl){
    jobs[today] = [{title: jobTitle, company: companyName, url: jobUrl}]
    chrome.storage.sync.set({jobs : JSON.stringify(jobs)}, () =>{
        console.log('set for a diff day')
    })
}

function checkIfDateAlreadyExists(today, jobs, jobTitle, companyName, jobUrl){
    let obj = JSON.parse(jobs.jobs);
    let daysStored = Object.keys(obj);
    console.log(daysStored);
    for(i = 0; i < daysStored.length; i++){
        if(today.toDateString() == daysStored[i].substring(0, 15)){
            console.log('same day');
            obj[daysStored[i]].push({title: jobTitle, company: companyName, url: jobUrl})
            chrome.storage.sync.set({jobs: JSON.stringify(obj)}, () => {
                console.log('set 24');
            })
           return; 
        }

    }
    createNewDay(obj, today, jobTitle, companyName, jobUrl);
}


function saveJob(){
    const jobTitle = document.getElementById('vjs-jobtitle').innerText;
    const companyName = document.getElementById('vjs-cn').innerText;
    const jobURL = window.location.href;
    let today = new Date();
    chrome.storage.sync.get('jobs', jobs => {
        if(Object.keys(jobs).length == 0){
            let jobObj = {};
            jobObj[today] = [{title: jobTitle, company: companyName, url: jobURL}];
            chrome.storage.sync.set({jobs: JSON.stringify(jobObj)}, () => {
                console.log('set');
            })
            return;
        }
        checkIfDateAlreadyExists(today, jobs, jobTitle, companyName, jobURL);
    })
}

function doubleCheckIfAlreadyApplied(){
    //since the apply button originally renders as a standard apply button, then eventually dynamically gets updated to show if already applied,
    // this function is made to wait a few seconds, check again if the element corresponding to already applied is in the dom, and return
        const alreadyAppliedButton = document.querySelector("#apply-button-container > div.job-footer-button-row > span.indeed-apply-widget.indeed-apply-button-container.js-IndeedApplyWidget.indeed-apply-status-applied");
        if(alreadyAppliedButton){
            return true;
        }
        else{
            return false;
        }

}

function init(){
    const applyb = document.querySelector("#apply-button-container > div.job-footer-button-row > span.indeed-apply-widget.indeed-apply-button-container.js-IndeedApplyWidget.indeed-apply-status-not-applied");
    const alreadyAppliedButton = document.querySelector("#apply-button-container > div.job-footer-button-row > span.indeed-apply-widget.indeed-apply-button-container.js-IndeedApplyWidget.indeed-apply-status-applied");
    const applyOnCompany = document.querySelector("#apply-button-container > div.job-footer-button-row > a");

    if(buttonFindAttempts >= 50){
        console.log("There was over 50 attempts to find the apply button. There is something wrong");
        return;
    }
    if(window.location.href.includes('vjk=') === false){ //if url doesnt contain 'vjk=' it is not a job listing, so return.
        return;
    }
    if(!applyb){
        if(alreadyAppliedButton){
            console.log("already applied");
            return;
        }
        if(applyOnCompany){
            console.log("apply on company")
            return;
        }
        console.log("not found... trying");
        buttonFindAttempts+= 1;
        setTimeout(init, 500);
        return;
    }

    setTimeout(() => {
        if(doubleCheckIfAlreadyApplied()){
            return;
        }
        else{
            console.log("applybutton found");
            buttonFindAttempts = 0;
            styleobserver.observe(applyb, config);
        }
    }, 300)

}

init();


