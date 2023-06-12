import { Component } from '@angular/core';
import { GUI } from 'src/app/enums/gui';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public readonly GUI: typeof GUI;

  public constructor(public gui: GUIService) {
    this.GUI = GUI;
  }
}
