import { from, interval, of, timer } from 'rxjs';

export const creationExamples = {
  // Incomplete
  from: {
    label: 'Observable.from([10, 20, 30]).delayWhen(x => timer(x))',
    inputs: [],
    apply: function(inputs, scheduler) {
      return from([10, 20, 30]).delayWhen(x => timer(x, scheduler));
    }
  },

  interval: {
    label: 'Observable.interval(10)',
    inputs: [],
    apply: function(inputs, scheduler) {
      return interval(10, scheduler);
    }
  },

  of: {
    label: 'Observable.of(1)',
    inputs: [],
    apply: function() {
      return of(1);
    }
  },

  timer: {
    label: 'Observable.timer(30, 10)',
    inputs: [],
    apply: function(inputs, scheduler) {
      return timer(30, 10, scheduler);
    }
  },
};
