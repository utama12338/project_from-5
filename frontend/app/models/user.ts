
export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    social: {
      facebook?: string;
      twitter?: string;
      github?: string;
      website?: string;
    };
    isDeleted?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserDraft extends User {
    isDraft: boolean;
  }


  export  const initialFormState = {
    email: '',
    firstName: '',
    lastName: '',
    social: {
      facebook: '',
      twitter: '',
      github: '',
      website: ''
    }
  };