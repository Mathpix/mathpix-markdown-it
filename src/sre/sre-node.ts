const sre = require('speech-rule-engine');

sre.setupEngine({
  domain: 'mathspeak'
});

export const getSRE = () => {
  return new Promise(async (resolve, reject) => {
    sre.engineReady()
      .then(res => {
        resolve(sre)
      })
      .catch(err => {
        reject(err);
      });
  })
};
