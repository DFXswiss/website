import { exit } from "process";
import { readFileSync, writeFileSync } from "fs";

import grapesjs from "grapesjs";
import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsNavbar from "grapesjs-navbar";
import gjsTooltip from "grapesjs-tooltip";
import gjsFlexbox from "grapesjs-blocks-flexbox";
import gjsCustomCode from "grapesjs-custom-code";

export class GrapesJsBuilder {
  async run() {
    const project = JSON.parse(this.readStringFile("src/website.json"));

    const editor = grapesjs.init({
      headless: true,
      plugins: [gjsForms, gjsPresetWebpage, gjsNavbar, gjsTooltip, gjsFlexbox, gjsCustomCode],
    });

    editor.loadProjectData(project);

    const htmlWrapper = this.readStringFile("src/wrapper.html");
    const htmlBody = editor.getHtml();
    const html = htmlWrapper.replace("{{body}}", htmlBody);
    const css = editor.getCss();

    writeFileSync("dist/index.html", html);
    css && writeFileSync("dist/style.css", css);
  }

  private readStringFile(path: string): string {
    return readFileSync(path).toString();
  }
}

new GrapesJsBuilder()
  .run()
  .catch(console.error)
  .finally(() => exit());
