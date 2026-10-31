import { inject, Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageLayout } from '../models/action.model';

@Injectable({
  providedIn: 'root',
})
export class DisplayLayout {
  private layoutSubject = new BehaviorSubject<PageLayout>(PageLayout.Sidebar);
  public layout$ = this.layoutSubject.asObservable();

  setLayout(value: PageLayout) {
    this.layoutSubject.next(value);
  }
}

export const setLayout = (inputLayout: PageLayout): ResolveFn<void> => {
  return () => {
    inject(DisplayLayout).setLayout(inputLayout);
  };
};
