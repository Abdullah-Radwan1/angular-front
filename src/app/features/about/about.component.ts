import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideSparkles,
  LucideShieldCheck,
  LucideLeaf,
  LucideUserCheck,
  LucideTruck,
  LucideHeart,
  LucideRotateCcw,
  LucidePackage,
  LucideHeadphones,
  LucideArrowRight,
  LucideDynamicIcon,
} from '@lucide/angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideSparkles,

    LucideHeart,
    LucideRotateCcw,
    LucidePackage,
    LucideHeadphones,
    LucideArrowRight,
    LucideDynamicIcon,
  ],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  stats = [
    { value: '4+', label: 'Years of Craft' },
    { value: '12K', label: 'Happy Clients' },
    { value: '500+', label: 'Curated Pieces' },
  ];

  values = [
    {
      icon: LucideShieldCheck,
      title: 'Uncompromising Quality',
      text: 'Every stitch held to a standard most brands ignore.',
    },
    {
      icon: LucideLeaf,
      title: 'Conscious Sourcing',
      text: 'Ethical suppliers, sustainable materials — always.',
    },
    {
      icon: LucideUserCheck,
      title: 'Personal Styling',
      text: 'Expert stylists ready to guide every look.',
    },
    {
      icon: LucideTruck,
      title: 'White-Glove Delivery',
      text: 'Signature packaging, tissue-wrapped, wax-sealed.',
    },
  ];

  team = [
    {
      name: 'Layla Hassan',
      role: 'Creative Director',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    },
    {
      name: 'Omar Khalil',
      role: 'Head of Curation',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
      name: 'Nour Farouk',
      role: 'Lead Stylist',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    },
    {
      name: 'Tarek Mansour',
      role: 'Brand & Experience',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
  ];
}
