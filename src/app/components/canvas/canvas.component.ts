import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type';
import { vec2 } from 'src/app/libs/lar';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-canvas',
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private _canvas!: ElementRef<HTMLCanvasElement>;

  private _observer: ResizeObserver;

  private _moving: boolean;

  public constructor(
    private _cd: ChangeDetectorRef,
    private _host: ElementRef<HTMLDivElement>,
    private _gui: GUIService,
    private _editor: EditorService
  ) {
    this._observer = new ResizeObserver(this._resizeViewport.bind(this));
    this._moving = false;
  }

  @HostListener('window:resize')
  private _resizeViewport(): void {
    const host = this._host.nativeElement;
    const canvas = this._canvas.nativeElement;

    canvas.hidden = true;
    const width = host.offsetWidth;
    const height = host.offsetHeight;

    canvas.hidden = false;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    this._editor.engine?.resizeViewport();
  }

  @HostListener('window:mousemove', ['$event'])
  private _handleMouseMove(e: MouseEvent): void {
    this.dumb(e);
    if (this._moving) {
      this._editor.engine?.translate(vec2.new(e.movementX, -e.movementY));
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

  public ngOnInit(): void {
    this._observer.observe(this._host.nativeElement);
  }

  public ngAfterViewInit(): void {
    try {
      this._editor.engine?.setup(this._canvas.nativeElement);
      this._resizeViewport();
    } catch (e) {
      this._gui.pushAlert(
        new Alert(AlertType.ERROR, e instanceof Error ? e.message : String(e))
      );
      this._cd.detectChanges();
    }
  }

  public ngOnDestroy(): void {
    this._observer.unobserve(this._host.nativeElement);
    this._editor.closeImage();
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
    const dim = this._canvas.nativeElement.getBoundingClientRect();
    const target = vec2.new(
      dim.left + dim.width / 2 - e.x,
      e.y - dim.top - dim.height / 2
    );

    if (e.deltaY < 0) this._editor.engine?.zoomIn(target);
    else if (e.deltaY > 0) this._editor.engine?.zoomOut(target);
  }
}
