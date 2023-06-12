import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GUI } from 'src/app/enums/gui';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-grayscale-manual',
  templateUrl: './grayscale-manual.component.html',
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
      Validators.max(1),
    ];

    this._initial = { red: 1 / 3, green: 1 / 3, blue: 1 / 3 };

    this.form = this._fb.group({
      red: new FormControl(this._initial.red, validators),
      green: new FormControl(this._initial.green, validators),
      blue: new FormControl(this._initial.blue, validators),
    });
  }

  public handleSubmit(): void {
    this.form.value;
  }

  public handleCancel(e: Event): void {
    e.preventDefault();
    this.handleClose();
    this._gui.toggleComponent(GUI.GRAYSCALE_MANUAL);
  }

  public handleClose(): void {
    this.form.reset(this._initial);
  }
}
