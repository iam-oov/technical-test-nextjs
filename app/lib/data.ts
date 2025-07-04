import { IResponse } from './interfaces/api-response';
import { IUsers } from './interfaces/users';

const API_BASE_URL = 'https://randomuser.me/api/';
const SEED = 'ohinojosa';
const TOTAL_USERS_TO_FETCH = 1000;

async function fetchUsersPage(page: number, limit: number): Promise<IUsers[]> {
  const url = `${API_BASE_URL}?results=${limit}&page=${page}&seed=${SEED}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }
    const data: IResponse = await response.json();

    const users: IUsers[] = data.results.map((user) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      image_url: user.picture.thumbnail,
      phone: user.phone,
      city: user.location.city,
    }));

    return users;
  } catch (error) {
    console.error(`Error al obtener la página ${page}:`, error);
    return [];
  }
}

let allCachedUsers: IUsers[] = []; // simulate a cache
export async function fetchFilteredUsers(
  query: string,
  limit: number,
  currentPage: number
): Promise<{ users: IUsers[]; totalPages: number }> {
  const trimmedQuery = query.trim();

  if (trimmedQuery !== '') {
    // if the query is not empty, we will filter the cached users
    if (allCachedUsers.length === 0) {
      const totalPages = Math.ceil(TOTAL_USERS_TO_FETCH / limit);

      const fetchPromises = [];
      for (let page = 1; page <= totalPages; page++) {
        fetchPromises.push(fetchUsersPage(page, limit));
      }

      try {
        const pagesResults = await Promise.all(fetchPromises);
        pagesResults.forEach((pageUsers) => {
          allCachedUsers = allCachedUsers.concat(pageUsers);
        });
      } catch (error) {
        return { users: [], totalPages: 0 };
      }
    }

    // filter the cached users based on the query
    const users = allCachedUsers.filter((user) =>
      user.name.toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    return {
      users: users.slice(limit * (currentPage - 1), limit * currentPage),
      totalPages: Math.ceil(users.length / limit),
    };
  } else {
    const users = await fetchUsersPage(currentPage, limit);
    const totalPages = Math.ceil(TOTAL_USERS_TO_FETCH / limit);
    return {
      users,
      totalPages,
    };
  }
}
