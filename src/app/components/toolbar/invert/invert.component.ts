import { Component } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-invert',
  templateUrl: './invert.component.html',
})
export class InvertComponent {
  public constructor(public editor: EditorService) {}

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }
}
