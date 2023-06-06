import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';
import { Effect } from '../enums/effect';

interface GrayscaleMethod {
  name: string;
  method: () => void;
}

@Pipe({
  name: 'grayscale',
})
export class GrayscalePipe implements PipeTransform {
  transform(
    engine: Engine | undefined
  ): ReadonlyArray<Readonly<GrayscaleMethod>> {
    const dummy = () => {};
    const methods: GrayscaleMethod[] = [
      { name: 'HSL', method: dummy },
      { name: 'HSV', method: dummy },
      { name: 'CIE L*a*b*', method: dummy },
      { name: 'Rec. 601', method: dummy },
      { name: 'Rec. 709', method: dummy },
      { name: 'Rec. 2100', method: dummy },
      { name: 'Average', method: dummy },
      { name: 'Red channel', method: dummy },
      { name: 'Green channel', method: dummy },
      { name: 'Blue channel', method: dummy },
    ];

    if (engine !== undefined) {
      const grayscale = (effect: Effect) => () => {
        engine.apply(effect);
      };

      methods[0].method = grayscale(Effect.GRAYSCALE_HSL_L);
      methods[1].method = grayscale(Effect.GRAYSCALE_HSV_V);
      methods[2].method = grayscale(Effect.GRAYSCALE_CIELAB_L);
      methods[3].method = grayscale(Effect.GRAYSCALE_REC_601);
      methods[4].method = grayscale(Effect.GRAYSCALE_REC_709);
      methods[5].method = grayscale(Effect.GRAYSCALE_REC_2100);
      methods[6].method = grayscale(Effect.GRAYSCALE_AVG);
      methods[7].method = grayscale(Effect.GRAYSCALE_R);
      methods[8].method = grayscale(Effect.GRAYSCALE_G);
      methods[9].method = grayscale(Effect.GRAYSCALE_B);
    }

    return methods;
  }
}
