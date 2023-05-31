import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';

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
      methods[0].method = engine.grayscaleHSL.bind(engine);
      methods[1].method = engine.grayscaleHSV.bind(engine);
      methods[2].method = engine.grayscaleCIELAB.bind(engine);
      methods[3].method = engine.grayscaleREC601.bind(engine);
      methods[4].method = engine.grayscaleREC709.bind(engine);
      methods[5].method = engine.grayscaleREC2100.bind(engine);
      methods[6].method = engine.grayscaleAVG.bind(engine);
      methods[7].method = engine.grayscaleR.bind(engine);
      methods[8].method = engine.grayscaleG.bind(engine);
      methods[9].method = engine.grayscaleB.bind(engine);
    }

    return methods;
  }
}
