import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: '[wivae-canvas]',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas')
  private _canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private _editor: EditorService) {}

  ngAfterViewInit(): void {
    this._editor.setup(this._canvas.nativeElement);
  }
}
