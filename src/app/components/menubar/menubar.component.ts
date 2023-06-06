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
import { Engine } from 'src/app/classes/engine';
import { AlertType } from 'src/app/enums/alert-type';
import { EditorStatus } from 'src/app/enums/editor-status';
import { Effect } from 'src/app/enums/effect';
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

  public readonly Effect = Effect;

  public constructor(private _editor: EditorService, private _gui: GUIService) {
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

  public get engine(): Engine | undefined {
    return this._editor.engine;
  }

  public get unusable(): boolean {
    return (
      this._editor.status === EditorStatus.UNSUPPORTED ||
      this._editor.status === EditorStatus.ERROR
    );
  }

  public get disabled(): true | null {
    return this._editor.status !== EditorStatus.OPEN || null;
  }

  public handleFile(): void {
    this._editor
      .openImage()
      .then(() => {
        this._gui.clearAlerts();
      })
      .catch((e: string) => {
        this._gui.pushAlert(
          new Alert(AlertType.ERROR, `Cannot open the given file: ${e}`)
        );
      });
  }

  public closeImage(): void {
    this._editor.closeImage();
  }
}
