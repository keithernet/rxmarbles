import { div } from '@cycle/dom';
import {Observable, of} from 'rxjs';
import { apply, flip, identity, length, map as rmap, merge, prop, zip } from 'ramda';

import { Collection } from '../../collection';
import { examples } from '../../data';
import { bgWhite } from '../../styles';
import { merge as mergeStyles, elevation1 } from '../../styles/utils';

import { Timeline } from '../timeline';

import { createOutputStream$ } from './sandbox-output';
import { inputsToTimelines } from './sandbox-input';
import { renderOperatorBox } from './operator-label';
import {
  combineLatest,
  distinctUntilChanged,
  pluck,
  skip,
  map,
  publishReplay,
  switchMap,
  filter,
  startWith,
  debounceTime, withLatestFrom, tap
} from "rxjs/operators";

;


const sandboxStyle = mergeStyles(bgWhite, elevation1, { borderRadius: '2px' });

export function Sandbox({ DOM, store }) {
  const example$ = store.pipe(
    pluck('route'),
    skip(1), // blank first route
    distinctUntilChanged(),
    map(exampleKey => examples[exampleKey]),
    publishReplay(1)).refCount();

  const inputStores$ = example$.pipe(
    switchMap(example =>{
      return store.pipe(pluck('inputs'),
        filter(identity),
        // bug: For some reason inputDataList$ emits old value after
        // route change. Skip it.
        skip(1),
        startWith(inputsToTimelines(example.inputs))
    )}),
    publishReplay(1)).refCount();

  const outputStore$ = createOutputStream$(example$, inputStores$);
  const outputTimelineSources$ = {
    DOM,
    marbles: outputStore$.pipe(pluck('marbles')),
    end: outputStore$.pipe(pluck('end')),
    interactive: of(false),
  };

  const inputTimelines$
    = Collection.gather(Timeline, { DOM }, inputStores$, 'id')
      .pipe(publishReplay(1)).refCount();
  const outputTimeline = Timeline(outputTimelineSources$);

  const inputDOMs$ = Collection.pluck(inputTimelines$, prop('DOM'));
  const inputDataList$ = Collection.pluck(inputTimelines$, prop('data')).pipe(
    filter(length),
    debounceTime(0),
    withLatestFrom(inputStores$, zip),
    map(rmap(apply(flip(merge)))));

  const vtree$ = inputDOMs$.pipe(
    combineLatest(outputTimeline.DOM), combineLatest(example$),
    map(([[inputsDOMs, outputDOM], example]) => {
      return div({style: sandboxStyle}, [
        ...inputsDOMs,
        renderOperatorBox(example.label),
        outputDOM,
      ])
    }));

  return {
    DOM: vtree$,
    data: inputDataList$.pipe(map((inputs) => ({ inputs }))),
  };
}
