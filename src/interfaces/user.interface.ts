export interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserInput {
  id: string;
}