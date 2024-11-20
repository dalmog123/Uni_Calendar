export interface Course {
  id: string;
  courseNumber: string;
  name: string;
  credits: number;
  professor: string;
  description: string;
  prerequisites?: string[];
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
} 