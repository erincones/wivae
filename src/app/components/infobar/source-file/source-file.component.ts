import { Component } from '@angular/core';
import { GUI } from 'src/app/enums/gui';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-source-file',
  templateUrl: './source-file.component.html',
})
export class SourceFileComponent {
  public readonly component: GUI;

  public constructor(public editor: EditorService) {
    this.component = GUI.SOURCE_FILE;
  }

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }

  public get file(): File | undefined {
    return this.editor.engine?.file;
  }
}
