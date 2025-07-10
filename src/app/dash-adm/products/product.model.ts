export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  // 3D Model specific properties
  modelFormat?: string;
  fileSize?: string;
  dimensions?: string;
  polygonCount?: number;
  textureResolution?: string;
  animationIncluded?: boolean;
} 