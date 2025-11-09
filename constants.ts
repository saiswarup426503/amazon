
import { Product, ProductStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'High-Performance Wireless Mouse',
    price: '₹6639',
    description: 'Experience ultimate precision and comfort with this ergonomic wireless mouse. Featuring a long-lasting battery, customizable buttons, and ultra-fast response time, it\'s perfect for both gaming and professional work. Its sleek design fits perfectly in your hand for hours of comfortable use.',
    rating: 4.8,
    reviewSummary: '"The best mouse I\'ve ever owned. The battery life is incredible, and it feels great in my hand. Highly recommend for productivity and gaming." - Verified Purchaser',
    images: ['https://picsum.photos/id/1/800/600', 'https://picsum.photos/id/1074/800/600'],
    affiliateLink: '#',
    status: ProductStatus.PUBLISHED,
    publishDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Mechanical Keyboard with RGB Lighting',
    price: '₹10789',
    description: 'Upgrade your typing experience with this premium mechanical keyboard. Enjoy satisfying tactile feedback with every keystroke, fully customizable RGB backlighting, and a durable aluminum frame. Includes a detachable wrist rest for added comfort.',
    rating: 4.9,
    reviewSummary: '"A dream to type on! The RGB effects are stunning, and the build quality is top-notch. Worth every penny." - Tech Enthusiast',
    images: ['https://picsum.photos/id/2/800/600', 'https://picsum.photos/id/274/800/600'],
    affiliateLink: '#',
    status: ProductStatus.PUBLISHED,
    publishDate: new Date().toISOString(),
  },
  {
    id: '3',
    title: '4K Ultra HD Monitor (Draft)',
    price: '₹29049',
    description: 'Immerse yourself in stunning detail with this 27-inch 4K UHD monitor. With vibrant colors, sharp text, and a bezel-less design, it\'s ideal for content creators, developers, and movie lovers. Features multiple ports for versatile connectivity.',
    rating: 4.7,
    reviewSummary: '"The picture quality is breathtaking. Colors are accurate right out of the box. I can\'t go back to a 1080p screen after this." - Creative Pro',
    images: ['https://picsum.photos/id/3/800/600'],
    affiliateLink: '#',
    status: ProductStatus.DRAFT,
    publishDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
  },
];
