import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { AlertType } from 'src/app/enums/alert-type';
import { vec3 } from 'src/app/libs/lar';
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

  private _moving: boolean;

  public constructor(
    private _cd: ChangeDetectorRef,
    private _host: ElementRef<HTMLDivElement>,
    private _alerts: AlertsService,
    private _editor: EditorService,
  ) {
    this._moving = false;
  }

  @HostListener('window:resize')
  private _resizeViewport(): void {
    const host = this._host.nativeElement;
    const canvas = this._canvas.nativeElement;

    canvas.style.width = `${0}px`;
    canvas.style.height = `${0}px`;
    canvas.width = 0;
    canvas.height = 0;

    const width = host.offsetWidth;
    const height = host.offsetHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    this._editor.resizeViewport(canvas.width, canvas.height);
  }

  @HostListener('window:mousemove', ['$event'])
  private _handleMouseMove(e: MouseEvent): void {
    this.dumb(e);
    if (this._moving) {
      this._editor.translate(vec3.new(e.movementX, -e.movementY, 0));
    }
  }

  @HostListener('window:mouseup', ['$event'])
  private _handleMouseUp(e: MouseEvent): void {
    this.dumb(e);
    if (e.button === 0) this._moving = false;
  }

  public get moving(): boolean {
    return this._moving;
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

  public dumb(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  public handleMouseDown(e: MouseEvent): void {
    this.dumb(e);
    if (e.button === 0) this._moving = true;
  }

  public handleWheel(e: WheelEvent): void {
    this.dumb(e);
    const dim = this._canvas.nativeElement.getBoundingClientRect();
    const target = vec3.new(
      dim.left + dim.width / 2 - e.x,
      e.y - dim.top - dim.height / 2,
      0,
    );

    if (e.deltaY < 0) this._editor.zoomIn(target);
    if (e.deltaY > 0) this._editor.zoomOut(target);
  }
}
