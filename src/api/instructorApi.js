import { INSTRUCTOR_METADATA } from '../data/mockData';
import { FALLBACK_INSTRUCTORS } from '../data/fallbackInstructors';

const DUMMY_JSON_USERS_URL = 'https://dummyjson.com/users?limit=10';

function enrichInstructor(user) {
  const meta = INSTRUCTOR_METADATA[user.id] || {
    employment_status: 'Freelance',
    department: 'General Studies',
    staff_code: `INS-GEN-${String(user.id).padStart(3, '0')}`,
    base_salary_eligible: false,
  };

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    avatar: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
    company: user.company || { department: meta.department, title: 'Instructor' },
    employment_status: meta.employment_status,
    department: meta.department,
    staff_code: meta.staff_code,
    base_salary_eligible: meta.base_salary_eligible,
  };
}

/**
 * Fetches instructors from DummyJSON REST API with automatic fallback
 * @returns {Promise<{ instructors: Array, source: 'api' | 'fallback', error: string | null }>}
 */
export async function fetchInstructors() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(DUMMY_JSON_USERS_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const users = Array.isArray(data?.users) ? data.users : [];
    
    // Take the first 10 instructors matching our mock schedules
    const mapped = users.slice(0, 10).map(enrichInstructor);

    return {
      instructors: mapped,
      source: 'api',
      error: null,
    };
  } catch (err) {
    console.warn('DummyJSON API unavailable or timed out, activating graceful fallback dataset:', err.message);
    const fallbackMapped = FALLBACK_INSTRUCTORS.map(enrichInstructor);
    return {
      instructors: fallbackMapped,
      source: 'fallback',
      error: err.message,
    };
  }
}
