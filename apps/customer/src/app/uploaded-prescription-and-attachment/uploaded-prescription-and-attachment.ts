import { Component } from '@angular/core';
import { UploadedPrescription } from '../uploaded-prescription/uploaded-prescription';

@Component({
  standalone: true,
  selector: 'app-uploaded-prescription-and-attachmenst',
  imports: [UploadedPrescription],
  templateUrl: './uploaded-prescription-and-attachment.html',
  styleUrl: './uploaded-prescription-and-attachment.css',
})
export class UploadedPrescriptionAndAttachment {
  isProcessed: any;
  attachments = [
    {
      title: 'Attachments 1',
      subtitle: 'Prescription Files',
      items: [
        {
          name: 'Artemether',
          form: '(Capsule)',
          brand: 'Falcither Forte',
          strength: '80mg/480mg',
          price: '₦7,500.00',
        },
        {
          name: 'Artemether',
          form: '(Capsule)',
          brand: 'Lonart DS',
          strength: '80mg/480mg',
          price: '₦7,500.00',
        },
      ],
    },
    {
      title: 'Attachments 2',
      subtitle: 'Prescription Files',
      items: [
        {
          name: 'Paracetamol',
          form: '(Tablet)',
          brand: 'Emzor',
          strength: '500mg',
          price: '₦3,000.00',
        },
        {
          name: 'Paracetamol',
          form: '(Tablet)',
          brand: 'M&B',
          strength: '500mg',
          price: '₦3,000.00',
        },
      ],
    },
  ];
}
