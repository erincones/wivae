import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Effect } from 'src/app/enums/effect';
import { GUI } from 'src/app/enums/gui';
import { Uniform } from 'src/app/enums/uniform';
import { vec3 } from 'src/app/libs/lar';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-grayscale-manual',
  templateUrl: './grayscale-manual.component.html',
  styleUrls: ['./grayscale-manual.component.scss'],
})
export class GrayscaleManualComponent {
  public readonly component: GUI;

  public form: FormGroup<{
    red: FormControl<number | null>;
    green: FormControl<number | null>;
    blue: FormControl<number | null>;
  }>;

  private readonly _initial: {
    red: number;
    green: number;
    blue: number;
  };

  public constructor(
    private _fb: FormBuilder,
    private _gui: GUIService,
    public editor: EditorService
  ) {
    this.component = GUI.GRAYSCALE_MANUAL;
    const validators = [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ];

    this._initial = { red: 100 / 3, green: 100 / 3, blue: 100 / 3 };

    this.form = this._fb.group({
      red: [this._initial.red, validators],
      green: [this._initial.green, validators],
      blue: [this._initial.blue, validators],
    });
  }

  public standarize(): void {
    const value = this.form.value;
    let r = value.red || 0;
    let g = value.green || 0;
    let b = value.blue || 0;

    do {
      const diff = (1 - (r + g + b)) / 3;
      r += diff;
      g += diff;
      b += diff;

      if (r < 0) r = 0;
      else if (r > 1) r = 1;

      if (g < 0) g = 0;
      else if (g > 1) g = 1;

      if (b < 0) b = 0;
      else if (b > 1) b = 1;
    } while (r + g + b !== 100);

    this.form.setValue({ red: r, green: g, blue: b });
    this.handleChange();
  }

  public handleChange(): void {
    if (!this.form.valid) return;

    this.editor.engine?.preview(Effect.GRAYSCALE_MANUAL, {
      u_weight: {
        type: Uniform.FLOAT_VEC3,
        value: vec3.new(
          (this.form.value.red || 0) / 100,
          (this.form.value.green || 0) / 100,
          (this.form.value.blue || 0) / 100
        ),
      },
    });
  }

  public handleSubmit(): void {
    if (!this.form.valid) return;

    this.editor.engine?.acceptPreview();

    this.form.reset(this._initial);
    this._gui.toggleComponent(GUI.GRAYSCALE_MANUAL);
  }

  public handleCancel(e: Event): void {
    e.preventDefault();

    this.editor.engine?.cancelPreview();

    this.form.reset(this._initial);
    this._gui.toggleComponent(GUI.GRAYSCALE_MANUAL);
  }

  public handleClose(): void {
    this.form.reset(this._initial);
  }
}
