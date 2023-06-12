import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { GUI } from 'src/app/enums/gui';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-sidebar-dialog',
  templateUrl: './sidebar-dialog.component.html',
})
export class SidebarDialogComponent {
  public readonly faTimes: IconDefinition;

  @Input()
  public name: string;

  @Input({ required: true })
  public component: GUI;

  @Output()
  public cancel: EventEmitter<void>;

  public constructor(private _gui: GUIService) {
    this.faTimes = faTimes;
    this.name = '';
    this.component = GUI.UNKNOWN;
    this.cancel = new EventEmitter<void>();
  }

  public close(): void {
    this._gui.toggleComponent(this.component);
    this.cancel.emit();
  }
}
