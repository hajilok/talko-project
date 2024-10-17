import fs from 'fs/promises'
import figlet from 'figlet';
import chalk from 'chalk';
import swapRitzu from './ritzu/swap.js';
import voteRubyScore from './RubyScore/Vote.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Membuat banner dengan figlet
const displayBanner = () => {
    console.log(chalk.cyan(figlet.textSync('Makmum Airdrop', {
      font: 'Slant',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })));
  };
  

const main = async () => {
    displayBanner();
    const wallet = (await fs.readFile('wallet.txt', 'utf-8'))
        .replace(/\r/g, "")
        .split('\n')
        .filter(Boolean);

    while (true) {
        for (let i = 0; i < wallet.length; i++) {
           try {
            const walletAddress = wallet[i];
            const formattedPrivateKey = walletAddress.startsWith('0x') ? walletAddress : '0x' + walletAddress;
            const ritzu = await swapRitzu(formattedPrivateKey);
            const vote = await voteRubyScore(formattedPrivateKey)
            console.log(chalk.bgGreen(`Succesfully Wraped And Unwraped Eth To Weth In Ritzu : https://taikoscan.io/tx/${ritzu}`));
            console.log(chalk.bgGreen(`Succesfully Vote On RubyScore : https://taikoscan.io/tx/${vote}`));
           } catch (error) {
            console.log(`error in rpc`)
           }
        }

        // Delay 1 menit sebelum loop dijalankan kembali
        console.log(chalk.blue('Menunggu 10 menit sebelum Wraped berikutnya...'));
        await delay(600000); // 60000 ms = 1 menit
    }
}

main();
