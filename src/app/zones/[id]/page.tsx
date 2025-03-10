import { notFound } from 'next/navigation'
import ZoneDetail from './ZoneDetails'


// This is a mock function to simulate fetching zone data
// In a real application, you would replace this with an actual API call
async function getZoneData(id: string) {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock data - in a real app, you'd fetch this from an API
  const zoneData = {
    zone_id: id,
    zone_name: `${id.charAt(0).toUpperCase() + id.slice(1)} Zone`,
    zone_leader_id: "1c98573c-6f43-4e06-b5d0-987cddf34adc",
    zone_location: id.charAt(0).toUpperCase() + id.slice(1),
    created_at: "2024-09-02T21:37:37.988Z",
    updated_at: "2024-09-02T21:37:37.988Z",
    leaders: [{
      member_id: "1c98573c-6f43-4e06-b5d0-987cddf34adc",
      user_id: "f877cf00-a52c-48c5-bd69-9ac9c22598ac",
      firstname: "John",
      lastname: "Doe",
      email: `john.doe@${id}.com`,
      gender: "MALE",
      role: "ZONE_LEADER",
      birth_date: "1990-01-01T00:00:00.000Z",
      occupation: "Manager",
      address: `123 Main St, ${id.charAt(0).toUpperCase() + id.slice(1)}`,
    }],
    fellowships: [
      {
        fellowship_id: "ddf8cdca-38dd-45a1-91eb-4b11d4e03c17",
        zone_id: id,
        fellowship_name: `${id.charAt(0).toUpperCase() + id.slice(1)} Fellowship A`,
        fellowship_leader_id: "e36ec3bd-52de-467b-841e-37111ab47fdf",
        created_at: "2024-09-02T21:45:21.377Z",
        updated_at: "2024-09-02T21:45:21.377Z"
      },
      {
        fellowship_id: "f5a8c7b9-e2d4-4f6a-b3c1-9d0e8m7k6j5h",
        zone_id: id,
        fellowship_name: `${id.charAt(0).toUpperCase() + id.slice(1)} Fellowship B`,
        fellowship_leader_id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        created_at: "2024-09-03T10:15:30.000Z",
        updated_at: "2024-09-03T10:15:30.000Z"
      }
    ]
  }

  return zoneData
}

async function ZonePage({ params }: { params: { id: string } }) {
  const zoneData = await getZoneData(params.id)

  if (!zoneData) {
    notFound()
  }

  return <ZoneDetail data={zoneData} />
}

export default (ZonePage);