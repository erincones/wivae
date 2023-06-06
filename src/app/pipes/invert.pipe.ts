import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';
import { Effect } from '../enums/effect';

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
      const invert = (effect: Effect) => () => {
        engine.apply(effect);
      };

      methods[0].method = invert(Effect.INVERT_R);
      methods[1].method = invert(Effect.INVERT_G);
      methods[2].method = invert(Effect.INVERT_B);
      methods[3].method = invert(Effect.INVERT_RGB);
      methods[4].method = invert(Effect.INVERT_LIGHTNESS);
    }

    return methods;
  }
}
