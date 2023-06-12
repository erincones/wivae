import { Pipe, PipeTransform } from '@angular/core';
import { GUIService } from '../services/gui.service';
import { GUI } from '../enums/gui';

@Pipe({
  name: 'showComponent',
  pure: false,
})
export class ShowComponentPipe implements PipeTransform {
  transform(gui: GUIService, ...components: ReadonlyArray<GUI>): boolean {
    return components.every((component) => gui.show[component]);
  }
}
