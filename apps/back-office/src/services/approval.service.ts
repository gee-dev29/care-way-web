import { inject, Injectable } from '@angular/core';
import { ApiService, ApprovalType } from '@care-way/api';
import { ApprovalState, AuthService } from '@care-way/shared';
import moment from 'moment';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  api = inject(ApiService);
  auth = inject(AuthService);
  documentId: string;
  approvalType: ApprovalType;
  subscription: Subscription;
  names: Record<string, string> = {};
  approvalSubject = new BehaviorSubject<any | null>(null);
  approval$ = this.approvalSubject.asObservable();
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  queriesSubject = new BehaviorSubject<any[]>([]);
  queries$ = this.queriesSubject.asObservable();
  querySubscription: Subscription;

  load(documentId: string, approvalType: ApprovalType) {
    if (documentId !== this.documentId) {
      this.approvalSubject.next(null);
      this.queriesSubject.next([]);
    }
    this.documentId = documentId;
    this.approvalType = approvalType;
    this.refresh();
  }

  refresh() {
    if (!this.documentId) return;
    this.loadingSubject.next(true);
    this.subscription?.unsubscribe();
    this.subscription = this.loadApproval(this.documentId).subscribe(
      (approval) => {
        this.approvalSubject.next(approval);
        this.loadingSubject.next(false);
      }
    );
    this.refreshQueries();
  }

  refreshQueries() {
    if (!this.documentId) return;
    this.querySubscription?.unsubscribe();
    this.querySubscription = this.api
      .getQueries({ referencedDocumentId: this.documentId })
      .pipe(
        map((response: any) =>
          this.toList(response).map((item) => this.getQuery(item))
        ),
        catchError(() => of([]))
      )
      .subscribe((queries) =>
        this.queriesSubject.next(
          [...queries].sort((a: any, b: any) =>
            moment.utc(b.queryDate || 0).diff(moment.utc(a.queryDate || 0))
          )
        )
      );
  }

  getQuery(item: any) {
    return {
      ...item,
      staffName: item.staffName || item.creatorName,
      queryDate: item.queryDate || item.createdOn,
      response: item.response?.trim() || '',
      responseDate: item.responseDate || '',
    };
  }

  toList(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.queries)) return response.queries;
    return response?.queryId ? [response] : [];
  }

  getApproval() {
    return this.approvalSubject.value;
  }

  loadApproval(documentId: string): Observable<any> {
    return this.api
      .getApprovalByDocumentId({ approvalDocumentId: documentId })
      .pipe(
        switchMap((approval: any) =>
          approval?.approvalId
            ? this.getApprovalDetails(approval)
            : of(this.setApproval({}, null, [], null, []))
        ),
        catchError(() => of(this.setApproval({}, null, [], null, [])))
      );
  }

  getApprovalDetails(approval: any): Observable<any> {
    const approvalId = approval.approvalId;
    return this.api.getApprovalStatus({ approvalId }).pipe(
      switchMap((response: any) =>
        forkJoin({
          history: this.api.getSingleApprovalHistory({ approvalId }).pipe(
            map((response: any) => this.toList(response)),
            catchError(() => of([]))
          ),
          current:
            response?.status === ApprovalState.Active
              ? this.api
                  .getSinglePendingApproval({ approvalId })
                  .pipe(catchError(() => of(null)))
              : of(null),
          upcoming: response?.status
            ? this.api.getApprovalListByApprovalId({ approvalId }).pipe(
                map((response: any) => this.toList(response)),
                catchError(() => of([]))
              )
            : of([]),
        }).pipe(
          switchMap(({ history, current, upcoming }) =>
            this.getApproverNames([
              ...(history ?? []),
              current,
              ...(upcoming ?? []),
            ]).pipe(
              map((names) => {
                const withName = (item: any) =>
                  item && {
                    ...item,
                    name: this.getName(item) || names[item.userId],
                  };
                return this.setApproval(
                  approval,
                  response?.status ?? null,
                  (history ?? []).map(withName),
                  withName(current),
                  (upcoming ?? []).map(withName)
                );
              })
            )
          )
        )
      )
    );
  }

  getName(item: any) {
    return (
      item?.name ||
      item?.approverName ||
      `${item?.firstName ?? ''} ${item?.lastName ?? ''}`.trim()
    );
  }

  getApproverNames(items: any[]): Observable<Record<string, string>> {
    const userIds = [
      ...new Set(
        items
          .filter((item) => item?.userId && !this.getName(item))
          .map((item) => item.userId as string)
      ),
    ];
    const missing = userIds.filter((userId) => !this.names[userId]);
    if (!missing.length) return of(this.names);
    return forkJoin(
      missing.map((userId) =>
        this.api.getUser({ userId }).pipe(catchError(() => of(null)))
      )
    ).pipe(
      map((users) => {
        users.forEach((user: any, i) => {
          const name = this.getName(user);
          if (name) this.names[missing[i]] = name;
        });
        return this.names;
      })
    );
  }

  setApproval(
    approval: any,
    status: ApprovalState | null,
    history: any[],
    current: any,
    upcoming: any[]
  ) {
    const userId = this.auth.getUserId();
    return {
      ...approval,
      status,
      canInitiate: !status || status === ApprovalState.Rejected,
      isCurrentApprover:
        status === ApprovalState.Active &&
        !!current?.userId &&
        current.userId === userId,
      steps: this.getSteps(history, current, upcoming, userId),
    };
  }

  getSteps(history: any[], current: any, upcoming: any[], userId: string) {
    const approved = history.map((item) =>
      this.getStep(item, item.isApproved ? 'approved' : 'rejected', userId, {
        respondedAt: item?.dateOfResponse,
        reason: item.reason?.trim(),
        caption: item.isApproved ? 'Approved' : 'Rejected',
      })
    );
    const pending = current
      ? [
          this.getStep(current, 'current', userId, {
            caption: 'Pending Approval',
          }),
        ]
      : [];
    const next = upcoming.map((item) =>
      this.getStep(item, 'upcoming', userId, { caption: 'Pending Approval' })
    );
    return [...approved, ...pending, ...next];
  }

  getStep(item: any, state: string, userId: string, extra: any) {
    return {
      name: item.name || 'Unknown approver',
      initials: this.getInitials(item.name),
      state,
      slaInHours: Number(item.slaInHours) || null,
      isYou: !!userId && item.userId === userId,
      ...extra,
    };
  }

  getInitials(name: string) {
    const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (parts[0][0] + last).toUpperCase();
  }
}
