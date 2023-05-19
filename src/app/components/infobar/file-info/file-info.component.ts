import { Component } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-file-info',
  templateUrl: './file-info.component.html',
})
export class FileInfoComponent {
  public constructor(public editor: EditorService) {}

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }

  public get file(): File | undefined {
    return this.editor.engine?.file;
  }
}
