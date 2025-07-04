export type IUser = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  phone: string;
  city?: string;
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
};
