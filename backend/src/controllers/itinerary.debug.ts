import { getUserById, register } from './auth';
import { itineraryGenerate } from './itinerary';

export const main = async () => {
  // src
  const aquaNoodle = 'ChIJrSFUdRy8EmsRy3bdeVGctmw';

  const dougieGrill = 'ChIJu0ghLRu8EmsReD-bnOmFyjE';
  const alley = 'ChIJg-eE2su9EmsRpl2JJFZDqrk';
  const sydneyMuseum = 'ChIJ_1pC8mmuEmsRrvud0Ftcoyg';
  const sydneyOperaHouse = 'ChIJ3S-JXmauEmsRUcIaWtf4MzE';
  const blueMountains = 'ChIJEaGM8gx1EmsRXj9z2s5VnUU';
  const manlyBeach = 'ChIJK8ybIQmrEmsRUHjYur4mf6k';

  const startDate = new Date(2023, 6, 23);
  const endDate = new Date(2023, 6, 25);
  const places = [
    {
      place_id: dougieGrill,
      duration: 3,
    },
    {
      place_id: blueMountains,
      duration: 5,
    },
    {
      place_id: sydneyOperaHouse,
      duration: 3,
    },
    {
      place_id: alley,
      duration: 2,
    },
    {
      place_id: sydneyMuseum,
      duration: 1,
    },
    {
      place_id: manlyBeach,
      duration: 3,
    },
  ];

  const accomodation = {
    place_id: aquaNoodle,
    duration: 3,
  };

  const user = register('ran@email.com', 'password123');
  const plan = { startDate, endDate, accomodation, places, location: 'Sydney' };
  const result = await itineraryGenerate(getUserById(user.userId), plan);
  console.log(JSON.stringify(plan));
  console.log(JSON.stringify(result, null, 2));
};

main();
