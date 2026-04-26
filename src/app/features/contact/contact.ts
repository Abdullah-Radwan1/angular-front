import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPhone,
  heroEnvelope,
  heroPaperAirplane,
  heroUser,
  heroChatBubbleLeftRight,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [
    provideIcons({ heroPhone, heroEnvelope, heroPaperAirplane, heroUser, heroChatBubbleLeftRight }),
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  sectionTitle = 'Contact';
  sectionHeading = "Let's Work Together";
  sectionDescription =
    "Have a project in mind or want to collaborate? Fill out the form and I'll get back to you as soon as possible.";

  phone = '+20 100 000 0000';
  email = 'hello@example.com';

  name = '';
  senderEmail = '';
  message = '';
  submitted = signal(false);

  onSubmit() {
    if (!this.name || !this.senderEmail || !this.message) return;
    // TODO: hook up to EmailJS / Formspree / backend
    this.submitted.set(true);
  }

  reset() {
    this.name = '';
    this.senderEmail = '';
    this.message = '';
    this.submitted.set(false);
  }
}
