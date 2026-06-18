import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

const ssh = new NodeSSH();
const REMOTE_DIR = 'domains/rfid-attendence-test.goteksuite.com/public_html';



async function runLocalCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function deploy() {
  try {
    console.log('Building project...');
    await runLocalCommand('npm run build');

    console.log('Preparing deployment archive...');
    const deployFolder = path.join(process.cwd(), 'deploy_temp');
    if (fs.existsSync(deployFolder)) fs.rmSync(deployFolder, { recursive: true, force: true });
    fs.mkdirSync(deployFolder);
    
    // Copy necessary files
    await runLocalCommand(`cp -R dist ${deployFolder}/`);
    await runLocalCommand(`cp package.json ${deployFolder}/`);
    await runLocalCommand(`cp package-lock.json ${deployFolder}/`);
    
    // Create production .env
    const envContent = `
DB_HOST=localhost
DB_USER=u856184323_rfid_iot
DB_PASSWORD=Eash@2005
DB_NAME=u856184323_rfid_iot
PORT=3000
`;
    fs.writeFileSync(path.join(deployFolder, '.env'), envContent.trim());

    // Hostinger might need a server.js file at root for Passenger to pick it up
    fs.writeFileSync(path.join(deployFolder, 'server.js'), `require('./dist/server.cjs');`);

    console.log('Zipping deployment files...');
    const zipPath = path.join(process.cwd(), 'deploy.zip');
    if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
    await runLocalCommand(`cd deploy_temp && zip -r ../deploy.zip .`);

    console.log('Connecting to Hostinger via SSH...');
    await ssh.connect({
      host: 'rfid-attendence-test.goteksuite.com',
      username: 'u856184323',
      password: 'Eash@2005',
      port: 65002
    });

    console.log('Uploading archive...');
    await ssh.putFile(zipPath, `${REMOTE_DIR}/deploy.zip`);

    console.log('Extracting on server...');
    await ssh.execCommand(`unzip -o deploy.zip`, { cwd: REMOTE_DIR });
    
    console.log('Installing production dependencies...');
    await ssh.execCommand(`npm install --production`, { cwd: REMOTE_DIR });

    console.log('Restarting application...');
    await ssh.execCommand(`mkdir -p tmp && touch tmp/restart.txt`, { cwd: REMOTE_DIR });
    
    // Cleanup
    fs.rmSync(deployFolder, { recursive: true, force: true });
    fs.rmSync(zipPath);
    ssh.dispose();
    console.log('Deployment complete successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
