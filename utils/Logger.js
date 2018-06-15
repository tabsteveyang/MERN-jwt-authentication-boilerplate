const fs = require('fs');
const path = require('path');
const date = require('date-and-time');

const dir = path.join(__dirname, '..', 'logs');
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    //writeLog('create a new logs directory.', 'sys');
    console.log('create a new logs directory.');
}else{
    //writeLog('logs directory has been create already.', 'sys');
    console.log('logs directory has been create already.');
}

function writeLog(rawContent, settings) {
    const {type='error', from='server', file=''} = settings;
    const fileDir = path.join(dir, `${from}_${type}.log`);
    let now = new Date();
    now = date.format(now, "YYYY-MM-DD HH:mm:ss Z"); 
    let content = `${now} FROM: ${from}  Msg: ${rawContent} `;
    if(file !== ''){
        content += `[${file}]\n`;
    }else{
        content += "\n";
    }
    fs.writeFile(fileDir, content, {flag: 'a'}, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log(`log update (${now})`);
        }
    });
};

module.exports = { writeLog };
