import { Component } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'wivae-grayscale',
  templateUrl: './grayscale.component.html',
})
export class GrayscaleComponent {
  public constructor(public editor: EditorService) {}

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }
}
