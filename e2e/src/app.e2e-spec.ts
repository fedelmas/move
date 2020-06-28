import { browser, element, by, ElementFinder, WebElementPromise, WebDriver } from 'protractor';

describe('Move Interface test', () => {

  beforeEach(() => {
    browser.get('http://localhost:8100');
    browser.driver.manage().window().setSize(320, 560);
  });

  describe('start move app', function() {
    it('inicia o app e loga ', function() {
      element(by.css('ion-row:nth-of-type(1)>ion-button')).click();
    });

    it('preenche o destino com a origem GPS', ()=>{
        
    })
  });

});
