import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';

interface InvertMethod {
  name: string;
  method: () => void;
}

@Pipe({
  name: 'invert',
})
export class InvertPipe implements PipeTransform {
  transform(engine: Engine | undefined): ReadonlyArray<Readonly<InvertMethod>> {
    const dummy = () => {};
    const methods: InvertMethod[] = [
      { name: 'Red channel', method: dummy },
      { name: 'Green channel', method: dummy },
      { name: 'Blue channel', method: dummy },
      { name: 'RGB channels', method: dummy },
      { name: 'Lightness channel', method: dummy },
    ];

    if (engine !== undefined) {
      methods[0].method = engine.invertR.bind(engine);
      methods[1].method = engine.invertG.bind(engine);
      methods[2].method = engine.invertB.bind(engine);
      methods[3].method = engine.invertRGB.bind(engine);
      methods[4].method = engine.invertLightness.bind(engine);
    }

    return methods;
  }
}
