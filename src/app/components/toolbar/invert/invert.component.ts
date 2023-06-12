import { Component } from '@angular/core';
import { GUI } from 'src/app/enums/gui';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-invert',
  templateUrl: './invert.component.html',
})
export class InvertComponent {
  public readonly component: GUI;

  public constructor(public editor: EditorService) {
    this.component = GUI.INVERT;
  }

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }
}
