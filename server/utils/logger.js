const fs = require('fs');
const path = require('path');
const moment = require('moment');

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
    if(process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development'){
        return;
    }
    const {type='error', from='server', file=''} = settings;
    const fileDir = path.join(dir, `${from}_${type}.log`);
    const now  = moment().format();
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
