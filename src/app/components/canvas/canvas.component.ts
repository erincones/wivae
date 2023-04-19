import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { AlertType } from 'src/app/enums/alert-type';
import { AlertsService } from 'src/app/services/alerts.service';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: '[wivae-canvas]',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas')
  private _canvas!: ElementRef<HTMLCanvasElement>;

  public constructor(
    private _cd: ChangeDetectorRef,
    private _host: ElementRef<HTMLDivElement>,
    private _alerts: AlertsService,
    private _editor: EditorService,
  ) {}

  @HostListener('window:resize')
  private _resizeViewport(): void {
    const host = this._host.nativeElement;
    const canvas = this._canvas.nativeElement;
    const width = host.offsetWidth;
    const height = host.offsetHeight;

    canvas.style.width = `${0}px`;
    canvas.style.height = `${0}px`;
    canvas.width = 0;
    canvas.height = 0;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    this._editor.resizeViewport(canvas.width, canvas.height);
  }

  public ngAfterViewInit(): void {
    try {
      this._editor.setup(this._canvas.nativeElement);
      this._resizeViewport();
    } catch (e) {
      this._alerts.push(
        AlertType.ERROR,
        e instanceof Error ? e.message : String(e),
      );
      this._cd.detectChanges();
    }
  }
}
