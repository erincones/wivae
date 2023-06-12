import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';
import { Effect } from '../enums/effect';

interface GrayscaleMethod {
  name: string;
  callback: () => void;
}

@Pipe({
  name: 'grayscale',
})
export class GrayscalePipe implements PipeTransform {
  transform(
    engine: Engine | undefined
  ): ReadonlyArray<Readonly<GrayscaleMethod>> {
    const dummy = () => {
      return;
    };
    const methods: GrayscaleMethod[] = [
      { name: 'HSL', callback: dummy },
      { name: 'HSV', callback: dummy },
      { name: 'CIE L*a*b*', callback: dummy },
      { name: 'Rec. 601', callback: dummy },
      { name: 'Rec. 709', callback: dummy },
      { name: 'Rec. 2100', callback: dummy },
      { name: 'Average', callback: dummy },
      { name: 'Red channel', callback: dummy },
      { name: 'Green channel', callback: dummy },
      { name: 'Blue channel', callback: dummy },
    ];

    if (engine !== undefined) {
      const grayscale = (effect: Effect) => () => {
        engine.apply(effect);
      };

      methods[0].callback = grayscale(Effect.GRAYSCALE_HSL_L);
      methods[1].callback = grayscale(Effect.GRAYSCALE_HSV_V);
      methods[2].callback = grayscale(Effect.GRAYSCALE_CIELAB_L);
      methods[3].callback = grayscale(Effect.GRAYSCALE_REC_601);
      methods[4].callback = grayscale(Effect.GRAYSCALE_REC_709);
      methods[5].callback = grayscale(Effect.GRAYSCALE_REC_2100);
      methods[6].callback = grayscale(Effect.GRAYSCALE_AVG);
      methods[7].callback = grayscale(Effect.GRAYSCALE_R);
      methods[8].callback = grayscale(Effect.GRAYSCALE_G);
      methods[9].callback = grayscale(Effect.GRAYSCALE_B);
    }

    return methods;
  }
}
