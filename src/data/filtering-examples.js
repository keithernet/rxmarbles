import {first, timer} from 'rxjs';
import {
  debounce,
  debounceTime,
  distinct,
  distinctUntilChanged,
  elementAt, exhaustMap,
  filter,
  find,
  findIndex,
  ignoreElements,
  last, pluck,
  sample,
  skip,
  skipUntil,
  skipWhile,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  throttle,
  throttleTime
} from 'rxjs/operators';
import {s} from "@cycle/dom";

/* t = time, c = content */
export const filteringExamples = {
  debounceTime: {
    label: 'debounceTime(10)',
    inputs: [
      [{t:0, c:1}, {t:26, c:2}, {t:34, c:3}, {t:40, c:4}, {t:45, c:5}, {t:79, c:6}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(debounceTime(10, scheduler));
    }
  },

  debounce: {
    label: 'debounce(x => Rx.Observable.timer(10 * x))',
    inputs: [
      [{t:0, c:1}, {t:26, c:2}, {t:34, c:1}, {t:40, c:1}, {t:45, c:2}, {t:79, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(
        debounce(x =>
        timer(Number(x.content) * 10, 1000, scheduler))
      );
    }
  },

  distinct: {
    label: 'distinct',
    inputs: [
      [{t:5, c:1}, {t:20, c:2}, {t:35, c:2}, {t:60, c:1}, {t:70, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(distinct(x => x.content));
    }
  },

  distinctUntilChanged: {
    label: 'distinctUntilChanged',
    inputs: [
      [{t:5, c:1}, {t:20, c:2}, {t:35, c:2}, {t:60, c:1}, {t:70, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(distinctUntilChanged(undefined, x => x.content));
    }
  },

  elementAt: {
    label: 'elementAt(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(elementAt(2));
    }
  },

  exhaustMap: {
    label: 'exhaustMap',
    inputs: [
        [{t:0, c:1}, {t:10, c:2}, {t:15, c:2}, {t:35, c:3}, {t:65, c:4}],
        [{t:5, c:'a'}, {t:25, c:'b'}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(exhaustMap(() => inputs[1].pipe(pluck('content'))));
    }
  },

  filter: {
    label: 'filter(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(filter(x => (x.content > 10)));
    }
  },

  find: {
    label: 'find(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(find(x => (x.content > 10)));
    }
  },

  findIndex: {
    label: 'findIndex(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(findIndex(({ content }) => (content > 10)));
    }
  },

  first: {
    label: 'first',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(first());
    }
  },

  ignoreElements: {
    label: 'ignoreElements',
    inputs: [
      [{t:20, c:'A'}, {t:40, c:'B'}, {t:50, c:'C'}, {t:75, c:'D'}, 90]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(ignoreElements());
    }
  },

  last: {
    label: 'last',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(last());
    }
  },

  sample: {
    label: 'sample',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:40, c:3}, {t:60, c:4}, {t:80, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:33, c:'C'}, {t:70, c:'D'}, 90]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(sample(inputs[1]));
    }
  },

  skip: {
    label: 'skip(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(skip(2));
    }
  },

  skipUntil: {
    label: 'skipUntil',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:45, c:0}, {t:73, c:0}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(skipUntil(inputs[1]));
    }
  },

  skipWhile: {
    label: 'skipWhile(x => x < 5)',
    inputs: [
      [{t:5, c:1}, {t:20, c:3}, {t:35, c:6}, {t:50, c:4}, {t:65, c:7}, {t:80, c:2}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(skipWhile(x => x.content < 5));
    }
  },

  take: {
    label: 'take(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    //TODO: scheduler in take?
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(take(2));
    }
  },

  takeLast: {
    label: 'takeLast(1)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(takeLast(1));
    }
  },

  takeUntil: {
    label: 'takeUntil',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:45, c:0}, {t:73, c:0}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(takeUntil(inputs[1]));
    }
  },

  takeWhile: {
    label: 'takeWhile(x => x < 5)',
    inputs: [
      [{t:5, c:1}, {t:20, c:3}, {t:35, c:6}, {t:50, c:4}, {t:65, c:7}, {t:80, c:2}]
    ],
    apply: function(inputs) {
      return inputs[0].pipe(takeWhile(x => x.content < 5));
    }
  },

  throttle: {
    label: 'throttle(x => Rx.Observable.timer(10 * x))',
    inputs: [
      [{t:0, c:1}, {t:26, c:2}, {t:34, c:1}, {t:40, c:1}, {t:45, c:2}, {t:79, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(throttle(x =>
        timer(Number(x.content) * 10, 1000, scheduler)
      ));
    }
  },

  throttleTime: {
    label: 'throttleTime(25)',
    inputs: [
      [{t:0 ,c:'A'}, {t:8 ,c:'B'}, {t:16 ,c:'C'}, {t:40 ,c:'D'}, {t:55 ,c:'E'}, {t:60 ,c:'F'}, {t:70 ,c:'G'}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pipe(throttleTime(25, scheduler));
    }
  },
}
