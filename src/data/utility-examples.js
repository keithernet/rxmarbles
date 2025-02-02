import {Observable} from 'rxjs';

import {prop} from 'ramda';
import {delay, delayWhen, map} from "rxjs/operators";

/* t = time, c = content */
export const utilityExamples = {
  delay: {
    label: 'delay(20)',
    inputs: [
      [{t: 10, c: '1'}, {t: 20, c: '2'}, {t: 70, c: '1'}]
    ],
    apply: (inputs, scheduler) =>
      inputs[0].pipe(map(prop('content')).pipe(delay(20, scheduler))),
  },

  delayWhen: {
    label: 'delayWhen(x => Observable.timer(20 * x))',
    inputs: [
      [{t: 0, c: 1}, {t: 10, c: 2}, {t: 20, c: 1}]
    ],
    apply: function(inputs, scheduler){
      return inputs[0].pipe(
        delayWhen(({content}) => Observable.timer(Number(content) * 20, 1000, scheduler)
        ));
    }
  },
};
