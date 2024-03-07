export interface CardDetailType {
  id: number;
  name: string | null;
  age: number;
  birthdate: string;
  images: string[];
  magical_person: {
    communication_stry: string;
    education_level: string;
    recived_love: string;
    star_sign: string;
  };
  recent_pik: string[];
  city: string;
  bio: string | null;
  likes_into: string[];
  lookingFor: string;
  like: string[];
  education: {
    college_name: string;
    degree: string;
  };
  hoping: string;
}
