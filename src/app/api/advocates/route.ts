import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';
// import { advocateData } from "../../../db/seed/advocates";

// Types
interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAtDate: Date | null;
}

export async function GET(request: NextRequest) {
  const tableData = await db.select().from(advocates) as Advocate[];
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get('search');
  if (searchTerm == null || searchTerm == "") return Response.json({ data:tableData });
  const data = tableData.filter((advocate) => {
    const searchableFields = [
      `${advocate.firstName.toLowerCase()} ${advocate.lastName.toLowerCase()}`,
      advocate.city.toLowerCase(),
      advocate.degree.toLowerCase(),
      advocate.yearsOfExperience.toString(),
      ...advocate.specialties.map(s => s.toLowerCase())
    ];
    return searchableFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  return Response.json({ data });
}
