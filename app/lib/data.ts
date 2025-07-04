import { IResponse } from './interfaces/api-response';
import { IUsers } from './interfaces/users';

const API_CONFIG = {
  BASE_URL: 'https://randomuser.me/api/',
  SEED: 'ohinojosa',
  TOTAL_USERS_TO_FETCH: 1000,
};

async function fetchUsersPage(page: number, limit: number): Promise<IUsers[]> {
  const url = `${API_CONFIG.BASE_URL}?results=${limit}&page=${page}&seed=${API_CONFIG.SEED}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }
    const data: IResponse = await response.json();

    return data.results.map((user) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      image_url: user.picture.thumbnail,
      phone: user.phone,
      city: user.location.city,
    }));
  } catch (error) {
    console.error(`Failed to fetch page ${page}:`, error);
    return [];
  }
}

let allCachedUsers: IUsers[] = [];
async function populateAllUsersCache(limit: number): Promise<void> {
  if (allCachedUsers.length === 0) {
    const totalPages = Math.ceil(API_CONFIG.TOTAL_USERS_TO_FETCH / limit);
    const fetchPromises: Promise<IUsers[]>[] = [];

    for (let page = 1; page <= totalPages; page++) {
      fetchPromises.push(fetchUsersPage(page, limit));
    }

    try {
      const pagesResults = await Promise.all(fetchPromises);
      // flatten the array of arrays into a single array
      allCachedUsers = pagesResults.flat();
    } catch (error) {
      console.error('Error populating user cache:', error);
      allCachedUsers = []; // clear cache on error
    }
  }
}

function sortUsers(
  users: IUsers[],
  sortBy: keyof IUsers,
  sortOrder: 'asc' | 'desc'
): IUsers[] {
  return users.slice().sort((a, b) => {
    const aValue = (a[sortBy] ?? '').toString().toLowerCase();
    const bValue = (b[sortBy] ?? '').toString().toLowerCase();

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

export async function fetchFilteredUsers(
  query: string,
  limit: number,
  currentPage: number,
  sortBy?: keyof IUsers,
  sortOrder?: 'asc' | 'desc'
): Promise<{ users: IUsers[]; totalPages: number }> {
  const trimmedQuery = query.trim();

  let usersToProcess: IUsers[] = [];
  let totalUsersCount: number = 0;

  if (trimmedQuery !== '' || sortBy || sortOrder) {
    // if there's a query, ensure the cache is populated first.
    await populateAllUsersCache(limit);
    if (allCachedUsers.length === 0) {
      return { users: [], totalPages: 0 };
    }

    usersToProcess = allCachedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        (user.city ?? '').toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    totalUsersCount = usersToProcess.length;
  } else {
    // if no query, fetch only the current page from the API.
    usersToProcess = await fetchUsersPage(currentPage, limit);
    totalUsersCount = API_CONFIG.TOTAL_USERS_TO_FETCH; // Assuming this is the total for no query
  }

  // apply sorting if parameters are provided.
  if (sortBy && sortOrder) {
    usersToProcess = sortUsers(usersToProcess, sortBy, sortOrder);
  }

  // apply pagination.
  const startIndex = (currentPage - 1) * limit;
  const paginatedUsers = usersToProcess.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(totalUsersCount / limit);

  return {
    users: paginatedUsers,
    totalPages,
  };
}
