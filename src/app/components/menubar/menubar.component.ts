import { Component } from '@angular/core';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  IconDefinition,
  fa1,
  faCircle,
  faDownload,
  faExpand,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faReply,
  faRightLeft,
  faRotateLeft,
  faRotateRight,
  faShare,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type';
import { ViewerStatus } from 'src/app/enums/viewer-status';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-menubar',
  templateUrl: './menubar.component.html',
})
export class MenubarComponent {
  public readonly fa1: IconDefinition;
  public readonly faCircle: IconDefinition;
  public readonly faDownload: IconDefinition;
  public readonly faExpand: IconDefinition;
  public readonly faUpload: IconDefinition;
  public readonly faMagnifyingGlassMinus: IconDefinition;
  public readonly faMagnifyingGlassPlus: IconDefinition;
  public readonly faReply: IconDefinition;
  public readonly faRightLeft: IconDefinition;
  public readonly faRotateLeft: IconDefinition;
  public readonly faRotateRight: IconDefinition;
  public readonly faShare: IconDefinition;
  public readonly faSquare: IconDefinition;
  public readonly faTrash: IconDefinition;

  public constructor(private _gui: GUIService, public editor: EditorService) {
    this.fa1 = fa1;
    this.faCircle = faCircle;
    this.faDownload = faDownload;
    this.faExpand = faExpand;
    this.faMagnifyingGlassMinus = faMagnifyingGlassMinus;
    this.faMagnifyingGlassPlus = faMagnifyingGlassPlus;
    this.faReply = faReply;
    this.faRightLeft = faRightLeft;
    this.faRotateLeft = faRotateLeft;
    this.faRotateRight = faRotateRight;
    this.faShare = faShare;
    this.faUpload = faUpload;
    this.faSquare = faSquare;
    this.faTrash = faTrash;
  }

  public get unusable(): boolean {
    return (
      this.editor.status === ViewerStatus.UNSUPPORTED ||
      this.editor.status === ViewerStatus.ERROR
    );
  }

  public get notOpen(): true | null {
    return this.editor.status !== ViewerStatus.OPEN || null;
  }

  public handleFile(): void {
    this.editor
      .uploadFile()
      .then(() => {
        this._gui.clearAlerts();
      })
      .catch((e: string) => {
        this._gui.pushAlert(
          new Alert(AlertType.ERROR, `Cannot open the given file: ${e}`)
        );
      });
  }
}
