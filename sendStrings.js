
const frisby = require('frisby');

async function sendString() {
    frisby.post('http://172.16.3.53:8060/keypress/Select')
    isOk=await sendProcess(('0328').split(""))
    if (isOk="Done") {
        console.log("Done Send")
        return new Promise(resolve => setTimeout(resolve("Ok"), 200))
    }
}
function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}
async function delaySend(item,timeout) {
    await delay(timeout);
    console.log(item,timeout)
    frisby.post(`http://172.16.3.53:8060/keypress/LIT_${item}`)
}
async function sendProcess(array) {
    await delay(5000);
    timeDelay=1000;
    for(const item of array){
        await delaySend(item,timeDelay)
        timeDelay=timeDelay*1.3;
    }
    return "done"
}
//  function testww(array) {
//     for(const item of array){
//         await 
//     }
// }

sendString()


