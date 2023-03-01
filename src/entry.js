const { exec } = require('child_process');

exec('npm run push && npm run prod', (error) => {
  if (error) {
    console.error(`Error: ${error}`);
  }
});