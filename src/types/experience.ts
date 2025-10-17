export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface ExperienceForm {
  title: string;
  category: string;
  description: string;
  price: string;
  address: string;
  bannerImageUrl: string;
  subImages: string[];
  schedules: Schedule[];
}

export interface Activity extends Omit<ExperienceForm, "subImages"> {
  id: number;
  userId: number;
  subImages: SubImage[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
