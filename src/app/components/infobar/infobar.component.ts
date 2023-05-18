import { Component } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-infobar',
  templateUrl: './infobar.component.html',
})
export class InfobarComponent {
  public constructor(public editor: EditorService) {}

  public get file(): File | undefined {
    return this.editor.engine?.file;
  }
}
