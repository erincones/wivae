import { AlertType } from '../enums/alert-type';
import { Alert } from './alert';

describe('Alert', () => {
  it('should create an instance', () => {
    expect(new Alert(AlertType.INFORMATION, 'Hi')).toBeTruthy();
  });
});
