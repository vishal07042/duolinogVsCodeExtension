const vscode = require('vscode');
const path = require('path');
const sound = require('sound-play');

let randomChars = [];
let statusBarItem;

function generateRandomChars() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  randomChars = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]);
  console.log(`New random characters: ${randomChars}`);
  updateStatusBar();
}

function updateStatusBar() {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.show();
  }
  statusBarItem.text = `Press: ${randomChars.join(', ')}`;
}

function isVSCodeActive() {
  return vscode.window.state.focused;
}

function playSound(soundPath) {
  const fullPath = path.join(__dirname, 'assets', soundPath);
  console.log(`Playing sound from: ${fullPath}`);
  sound.play(fullPath).then(() => {
    console.log('The sound played successfully.');
  }).catch((err) => {
    console.error(`Error playing sound: ${err}`);
  });
}

function onKeyPress(key) {
  if (isVSCodeActive()) {
    console.log(`Key pressed: ${key}`);
    if (randomChars.includes(key)) {
      console.log(`Correct key '${key}' pressed`);
      playSound('correct.mp3');
      generateRandomChars();
    } else if (key === 'Backspace' || key === 'Alt') {
      console.log(`${key} key pressed`);
      playSound('incorrect.mp3');
    } else {
      console.log(`Other key '${key}' pressed`);
    }
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "soud" is now active!');

  generateRandomChars();

  const disposable = vscode.commands.registerCommand('soud.startListening', () => {
    vscode.workspace.onDidChangeTextDocument((event) => {
      const changes = event.contentChanges;
      if (changes.length > 0) {
        const key = changes[0].text;
        onKeyPress(key);
      }
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};