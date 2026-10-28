import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  DestroyRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgLabelTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import {
  CreateOrderContext,
  createOrderDefaults,
  validDateRange,
} from '../../domain/work-order-rules';
import { WorkOrderDocument, WorkOrderStatus, STATUS_LABELS } from '../../domain/work-order';
import { WorkOrderDataService } from '../../data-access/work-order-data.service';
import { CalendarDateAdapter } from './calendar-date-adapter';
import { CalendarDateParserFormatter } from './calendar-date-parser-formatter';

export type WorkOrderPanelContext =
  | ({ readonly mode: 'create' } & CreateOrderContext)
  | { readonly mode: 'edit'; readonly order: WorkOrderDocument };

@Component({
  selector: 'app-work-order-panel',
  imports: [ReactiveFormsModule, NgSelectComponent, NgLabelTemplateDirective, NgbInputDatepicker],
  providers: [
    { provide: NgbDateAdapter, useClass: CalendarDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CalendarDateParserFormatter },
  ],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderPanel {
  readonly context = input.required<WorkOrderPanelContext>();
  readonly dismissed = output<void>();
  private readonly data = inject(WorkOrderDataService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');
  private readonly destroyRef = inject(DestroyRef);
  readonly closing = signal(false);
  readonly error = signal<string | null>(null);
  readonly statuses = (Object.keys(STATUS_LABELS) as WorkOrderStatus[]).map((value) => ({
    value,
    label: STATUS_LABELS[value],
  }));
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        (control) =>
          typeof control.value === 'string' && control.value.trim() ? null : { required: true },
      ],
    }),
    status: new FormControl<WorkOrderStatus>('open', {
      nonNullable: true,
      validators: Validators.required,
    }),
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, Validators.required),
  });

  constructor() {
    this.form.addValidators(() => {
      const { startDate, endDate } = this.form.getRawValue();
      return startDate && endDate && !validDateRange(startDate, endDate)
        ? { dateRange: true }
        : null;
    });
    effect(() => {
      const context = this.context();
      this.form.reset(context.mode === 'edit' ? context.order.data : createOrderDefaults(context));
      this.error.set(null);
    });
    afterRenderEffect(() => {
      this.context();
      // A new context can arrive before the parent removes a dismissed panel.
      if (!this.dialog().nativeElement.open) {
        this.dialog().nativeElement.showModal();
        this.nameInput().nativeElement.focus();
      }
    });
  }

  submit(): void {
    if (this.closing()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error.set('Please correct the highlighted fields.');
      return;
    }
    const value = this.form.getRawValue();
    if (!value.startDate || !value.endDate) return;
    const context = this.context();
    const changes = { ...value, startDate: value.startDate, endDate: value.endDate };
    const error =
      context.mode === 'edit'
        ? this.data.update(context.order.docId, changes)
        : this.data.create({ ...changes, workCenterId: context.workCenterId });
    this.error.set(error);
    if (!error) this.close();
  }

  close(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const dialog = this.dialog().nativeElement;
    const finish = () => {
      if (this.destroyRef.destroyed) return;
      dialog.close();
      this.dismissed.emit();
      this.closing.set(false);
    };
    if (
      typeof dialog.animate !== 'function' ||
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      finish();
      return;
    }
    const animation = dialog.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' },
    );
    void animation.finished.then(() => {
      animation.cancel();
      finish();
    }, finish);
  }

  outsideClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      this.close();
  }
}
