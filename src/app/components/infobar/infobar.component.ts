import { Component } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

interface InfoField {
  readonly label: string;
  readonly value: string;
  readonly id: string;
}

@Component({
  selector: 'wivae-infobar',
  templateUrl: './infobar.component.html',
})
export class InfobarComponent {
  public constructor(public editor: EditorService) {}

  public get fileInfo(): InfoField[] {
    const file = this.editor.engine?.file;
    const info = [
      { label: 'Name', value: '', id: 'file-name' },
      { label: 'Type', value: '', id: 'file-type' },
      { label: 'Size', value: '', id: 'file-size' },
      { label: 'Date', value: '', id: 'file-date' },
    ];

    if (file !== undefined) {
      const name = file.name.match(/^(.*)\..*$/);
      const type = file.type.match(/^.*\/(.*)$/);
      const date = new Date(file.lastModified);

      info[0].value = (name as RegExpMatchArray)[1];
      info[1].value = (type as RegExpMatchArray)[1];
      info[2].value = file.size.toLocaleString() + ' bytes';
      info[3].value = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}, ${date.toLocaleTimeString()}`;
    }

    return info;
  }
}
