const http = require('http');
const fs = require('fs');

const requestIncoming = (req, res) => {
    if(req.url == '/test'){
        let jobsObject = '';
        req.on('data', buffer => {
            jobsObject += buffer.toString();
        })
        req.on('end', msg => {
            let parsedObject = JSON.parse(jobsObject);
            saveToFile(parsedObject, 'text', res);
        })
    }
}
const server = http.createServer(requestIncoming);

server.listen(8000, () => {
    console.log("running");
});

function saveToFile(object, type, res){
    if(type === 'text'){
        const parsedObject = JSON.parse(object);
        let textFileWrite = fs.createWriteStream('test.txt');
        const dates = Object.keys(parsedObject);
        for(i = 0; i < dates.length; i++){
            let date = dates[i];
            console.log(parsedObject[dates[i]]);
            for(k = 0; k < parsedObject[dates[i]].length; k++){
                let currentJob = parsedObject[dates[i]][k];
                textFileWrite.write(currentJob.title + ' - ' + currentJob.company + ' - ' + currentJob.url + ' applied on: ' + date + '\n');
            }
        }

        textFileWrite.on('finish', () => {
            console.log('done');
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=test.txt"
              });
            fs.createReadStream('./test.txt').pipe(res);
        })
        textFileWrite.end();
    }
}