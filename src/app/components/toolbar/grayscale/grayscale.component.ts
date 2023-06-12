import { Component } from '@angular/core';
import { GUI } from 'src/app/enums/gui';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-grayscale',
  templateUrl: './grayscale.component.html',
})
export class GrayscaleComponent {
  public readonly component: GUI;

  public constructor(public editor: EditorService) {
    this.component = GUI.GRAYSCALE;
  }

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }
}
