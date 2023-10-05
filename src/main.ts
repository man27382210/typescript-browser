import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Parser } from './html.js';
import { exit } from 'process';

import gui from 'gui';


const filePath = path.join(__dirname, '../html_folder/simple.html');

const main = (): void => {

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const html = new Parser(data).parse();
    console.log(html);

    const win = gui.Window.create({});
    // Quit when window is closed.
    win.onClose = () => gui.MessageLoop.quit();
    // The size of content view.
    win.setContentSize({width: 400, height: 400});
    // Put the window in the center of screen.
    win.center();
    const contentView = gui.Container.create();
    const edit = gui.TextEdit.create();
    edit.setStyle({flex: 1});
    contentView.addChildView(edit);
    edit.setText(JSON.stringify(html));

    win.setContentView(contentView);

    win.activate();

    if (!process.versions.yode && !process.versions.electron) {
      gui.MessageLoop.run()  // block until gui.MessageLoop.quit() is called
      process.exit(0)
    }

    exit(0);
  });
}

main();
