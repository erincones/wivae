import { Component } from '@angular/core';
import { Effect } from 'src/app/enums/effect';
import { GUI } from 'src/app/enums/gui';
import { Uniform } from 'src/app/enums/uniform';
import { vec3 } from 'src/app/libs/lar';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-grayscale',
  templateUrl: './grayscale.component.html',
})
export class GrayscaleComponent {
  public readonly component: GUI;

  public constructor(
    private _gui: GUIService,
    public editor: EditorService,
  ) {
    this.component = GUI.GRAYSCALE;
  }

  public get disabled(): true | null {
    return this.editor.engine === undefined || null;
  }

  public showManualGrayscale(): void {
    this._gui.toggleComponent(GUI.GRAYSCALE_MANUAL);
    this.editor.engine?.preview(Effect.GRAYSCALE_MANUAL, {
      u_weight: {
        type: Uniform.FLOAT_VEC3,
        value: vec3.new(1 / 3, 1 / 3, 1 / 3),
      },
    });
  }
}
