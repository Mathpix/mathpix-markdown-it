const sre = require('speech-rule-engine');
/**
 * Note that in asynchronous operation mode for these methods to work correctly, 
 * it is necessary to ensure that the Engine is ready for processing. 
 * In other words, you need to wait for the setup promise to resolve.
 * */

export const loadSreAsync = (options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const optionsEngine = Object.assign({}, {domain: 'mathspeak'}, options);
      sre.setupEngine(optionsEngine);
      
      sre.engineReady()
        .then(() => {
          resolve(sre);
        })
        .catch(err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  })
};
