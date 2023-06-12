import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';
import { Effect } from '../enums/effect';

interface InvertMethod {
  name: string;
  callback: () => void;
}

@Pipe({
  name: 'invert',
})
export class InvertPipe implements PipeTransform {
  transform(engine: Engine | undefined): ReadonlyArray<Readonly<InvertMethod>> {
    const dummy = () => {
      return;
    };
    const methods: InvertMethod[] = [
      { name: 'RGB', callback: dummy },
      { name: 'HSL', callback: dummy },
      { name: 'HSV', callback: dummy },
      { name: 'Hue', callback: dummy },
      { name: 'HSL Light', callback: dummy },
      { name: 'HSV Value', callback: dummy },
      { name: 'Red', callback: dummy },
      { name: 'Green', callback: dummy },
      { name: 'Blue', callback: dummy },
      { name: 'HSL Saturation', callback: dummy },
      { name: 'HSV Saturation', callback: dummy },
    ];

    if (engine !== undefined) {
      const invert = (effect: Effect) => () => {
        engine.apply(effect);
      };

      methods[0].callback = invert(Effect.INVERT_RGB);
      methods[1].callback = invert(Effect.INVERT_HSL);
      methods[2].callback = invert(Effect.INVERT_HSV);
      methods[3].callback = invert(Effect.INVERT_HUE);
      methods[4].callback = invert(Effect.INVERT_HSL_L);
      methods[5].callback = invert(Effect.INVERT_HSV_V);
      methods[6].callback = invert(Effect.INVERT_R);
      methods[7].callback = invert(Effect.INVERT_G);
      methods[8].callback = invert(Effect.INVERT_B);
      methods[9].callback = invert(Effect.INVERT_HSL_S);
      methods[10].callback = invert(Effect.INVERT_HSV_S);
    }

    return methods;
  }
}
