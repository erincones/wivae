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
      { name: 'RGB', method: dummy },
      { name: 'HSL', method: dummy },
      { name: 'HSV', method: dummy },
      { name: 'Hue', method: dummy },
      { name: 'HSL Light', method: dummy },
      { name: 'HSV Value', method: dummy },
      { name: 'Red', method: dummy },
      { name: 'Green', method: dummy },
      { name: 'Blue', method: dummy },
      { name: 'HSL Saturation', method: dummy },
      { name: 'HSV Saturation', method: dummy },
    ];

    if (engine !== undefined) {
      const invert = (effect: Effect) => () => {
        engine.apply(effect);
      };

      methods[0].method = invert(Effect.INVERT_RGB);
      methods[1].method = invert(Effect.INVERT_HSL);
      methods[2].method = invert(Effect.INVERT_HSV);
      methods[3].method = invert(Effect.INVERT_HUE);
      methods[4].method = invert(Effect.INVERT_HSL_L);
      methods[5].method = invert(Effect.INVERT_HSV_V);
      methods[6].method = invert(Effect.INVERT_R);
      methods[7].method = invert(Effect.INVERT_G);
      methods[8].method = invert(Effect.INVERT_B);
      methods[9].method = invert(Effect.INVERT_HSL_S);
      methods[10].method = invert(Effect.INVERT_HSV_S);
    }

    return methods;
  }
}
