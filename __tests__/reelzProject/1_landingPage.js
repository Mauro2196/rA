const frisby = require('frisby');
var net = require('net');
var client = new net.Socket();

beforeAll(async() => {
    await initChannel();
}, 20000);       

describe('Promo Landing Screen - A user have not authenticated in the application, they are directed to the Promo Landing screen, once the application finishes loading', () => {
    test('Verify that the subscribe button have the initial focus', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "btnSubscribe" ,"command": "isInFocus"}}');
        expect(data.isInFocus).toBe(true);
      }, 20000)
    test('Verify text in the Subscribe button', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "btnSubscribe" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("SUBSCRIBE");
    }, 20000)
    test('Verify text in the Preview button', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "btnPreview" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("PREVIEW");
    }, 20000)
    test('Verify text in the hero Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "heroText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("7 DAY FREE TRIAL");
    }, 20000)
    test('Verify text in the main Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "mainText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("Start your subscription today.");
    }, 20000)
    test('Verify text in the secondary Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "secondaryText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("$3.99 / month or\n$39.90 / year (savings of $7.98)");
    }, 20000)
    test('Verify text in the disclaimer Text', async () => {
        expect.assertions(1);
        const data = await getData('{"data":{"id": "disclaimerText" ,"command": "getElementText"}}');
        expect(data.getElementText).toBe("Reelz is available on Roku TV in the U.S., Puerto Rico, Guam and the Virgin Islands");
    }, 20000)

});

describe('Promo Landing Screen - Verify that user is able to navigate and select the buttons on the screen', () => {
    test('Verify that the User click on Right button the focus change to the Preview button in the screen', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Right')
        expect.assertions(1);
        const data = await getData('{"data":{"id": "btnPreview" ,"command": "isInFocus"}}');
        expect(data.isInFocus).toBe(true)
        
      }, 20000)
      test('Verify that the User click on Left button the focus change to the Subscribe button in the screen', async () => {
        frisby.post('http://172.16.3.53:8060/keypress/Left')     
        expect.assertions(1);
        const data = await getData('{"data":{"id": "btnSubscribe" ,"command": "isInFocus"}}');
        expect(data.isInFocus).toBe(true)
        
      }, 20000) 
});


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
            }, 300);   
        });
        client.on('data', function(data) {
            setTimeout(() => {
                resolve(JSON.parse(data));
                client.destroy();
            }, 200);            
        });
    });  
  }

