export interface Product {
  _id?: string;
  name: string;
  reference: string;
  description: string;
  price: number;
  category: string;
  dimensions: {
    height?: number;
    width?: number;
    length?: number;
    radius?: number;
  };
  subCategory: string;
  image: string;
  supplier: string;
  materials: string;
  promotion: boolean;
  sales: number;
  rate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product3D {
  _id?: string;
  prodId: string;
  image3D: string;
  imageCouleurs: string;
  quantity: number;
} 