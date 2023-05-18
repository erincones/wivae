import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';

@Pipe({
  name: 'summary',
  pure: false,
})
export class SummaryPipe implements PipeTransform {
  transform(engine: Engine | undefined): string[] {
    return engine === undefined
      ? ['Not image open yet']
      : [
          `Effects: ${engine.history.length}`,
          `Zoom: ${(engine.zoom * 100).toFixed(2)}%`,
        ];
  }
}
