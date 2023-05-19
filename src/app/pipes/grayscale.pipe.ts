import { Pipe, PipeTransform } from '@angular/core';
import { Engine } from '../classes/engine';
import { Grayscale } from '../enums/grayscale';

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
      methods[0].method = () => {
        engine.grayscale(Grayscale.HSL_L);
      };
      methods[1].method = () => {
        engine.grayscale(Grayscale.HSV_V);
      };
      methods[2].method = () => {
        engine.grayscale(Grayscale.CIELAB_L);
      };
      methods[3].method = () => {
        engine.grayscale(Grayscale.REC_601);
      };
      methods[4].method = () => {
        engine.grayscale(Grayscale.REC_709);
      };
      methods[5].method = () => {
        engine.grayscale(Grayscale.REC_2100);
      };
      methods[6].method = () => {
        engine.grayscale(Grayscale.AVERAGE);
      };
      methods[7].method = () => {
        engine.grayscale(Grayscale.RGB_R);
      };
      methods[8].method = () => {
        engine.grayscale(Grayscale.RGB_G);
      };
      methods[9].method = () => {
        engine.grayscale(Grayscale.RGB_B);
      };
    }

    return methods;
  }
}
