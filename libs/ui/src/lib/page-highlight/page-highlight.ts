import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-page-highlight',
  imports: [],
  templateUrl: './page-highlight.html',
  styleUrl: './page-highlight.css',
})
export class PageHighlight {
  @Input() primaryDetailTitle: string;
  @Input() primaryDetail: any;
  @Input() secondaryDetailTitle: string;
  @Input() secondaryDetail: string | undefined;
  @Input() isClickable: boolean;
  @Output() viewSecondaryDetail = new EventEmitter();
}
