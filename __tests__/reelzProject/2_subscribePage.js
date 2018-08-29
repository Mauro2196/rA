const frisby = require('frisby');
var net = require('net');
var client = new net.Socket();
beforeAll(async() => {
    await initChannel();
    await delay(1000)
    frisby.post('http://172.16.3.53:8060/keypress/Select')
}, 20000);          

describe('Subscribe Screen - As an Anonymous User, I want to subscribe to the application, so that I can access the application content.', () => {
    test('Verify that The subscribe screen matches the proposed design - Verify text in the hero Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "heroText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("CHOOSE YOUR PLAN");
    }, 20000)
    test('Verify that The subscribe screen matches the proposed design - Verify text in the subtitle Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "disclaimerText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("Start your subscription today.");
    }, 20000)
    test('Verify that the initial focus is in Plan 1 - Verify text in the subtitle Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "products" ,"command": "getElementChild","numberChild": "0"}}');
        expect(data.hasFocus).toBe(true);
    }, 20000)

});

describe('Subscribe Screen - Verify that user is able to navigate and select the plans on the screen', () => {
    test('Verify that the User click on Right button the focus change to the Plan 2 in the screen', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Right')
        expect.assertions(1);
        const data = await getData('{"data":{"id": "products" ,"command": "getElementChild","numberChild": "1"}}');
        expect(data.hasFocus).toBe(true);
        
      }, 20000)
      test('Verify that the User click on Left button the focus change to the Plan 1 in the screen', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Left')     
        expect.assertions(1);
        const data = await getData('{"data":{"id": "products" ,"command": "getElementChild","numberChild": "0"}}');
        expect(data.hasFocus).toBe(true);
        
      }, 20000) 
});

describe('Subscribe Screen - Verify "View Terms & Privacy Policy" screen', () => {
    test('Verify that the View Terms & Privacy Policy Scrollable component have the initial focus', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Select')
        expect.assertions(1);
        const data = await getData('{"data":{"id": "termsContent" ,"command": "isInFocus"}}');
        expect(data.isInFocus).toBe(true);
      }, 20000)
      test('Verify that the User click on Right button the focus change to the Agree button in the screen', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Right')
        expect.assertions(1);
        const data = await getData('{"data":{"id": "agreeBt" ,"command": "isInFocus"}}');
        expect(data.isInFocus).toBe(true);  
      }, 20000) 
      test('Velify "Agree" option', async () => {
        expect.assertions(1);
        frisby.post('http://172.16.3.53:8060/keypress/Select')
        const data = await sendString('0328')
        expect(data).toBe("Ok");
        await delay(1000)
        frisby.post('http://172.16.3.53:8060/keypress/Select')
        
    }, 20000) 
    test('Verify the suscces screen is displayed after that the purchase is finished', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "successIcon" ,"command": "isVisible"}}');
        console.log(data)
        expect(data.isVisible).toBe(true);  
      }, 20000) 
      
});

async function sendString(str) {
    isOk=await sendProcess(str.split(""))
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
function initChannel(){
    return new Promise((resolve) => {
        frisby.post('http://172.16.3.53:8060/keypress/Home')
        setTimeout(() => {
            frisby.post('http://172.16.3.53:8060/launch/dev')
        }, 1000);
        setTimeout(() => {
            console.log("Init Testing!!")
            resolve("Ok") 
        }, 6000);
        
    });  
 }

function getData(element) {
    return new Promise((resolve) => {
        client.connect(54321, '172.16.3.53', function() {
            console.log('Connected');
            setTimeout(() => {
                client.write(element);
            }, 250);   
        });
        client.on('data', function(data) {
            setTimeout(() => {
                resolve(JSON.parse(data));
                client.destroy();
            }, 150);            
        });
    });  
  }

